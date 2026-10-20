import { promises as fs } from "fs";
import path from "path";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultConfig } from "./pricing";
import type { Config, Order, OrderStatus } from "./types";

// Firestore on Firebase App Hosting (credentials are automatic there, or set USE_FIRESTORE=1 with
// GOOGLE_APPLICATION_CREDENTIALS locally); a local JSON file otherwise (dev only).
const useFirestore = !!(process.env.FIREBASE_CONFIG || process.env.USE_FIRESTORE);
function db() {
  if (!getApps().length) initializeApp();
  const f = getFirestore();
  try { f.settings({ ignoreUndefinedProperties: true }); } catch {} // throws if already configured
  return f;
}
const configDoc = () => db().collection("config").doc("main");
const orders = () => db().collection("orders");

const file = path.join(process.cwd(), ".data", "store.json");
type FileDb = { config: Config; orders: Order[] };
async function readFile(): Promise<FileDb> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return { config: defaultConfig, orders: [] };
  }
}
async function writeFile(d: FileDb) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(d, null, 1));
}

export async function getConfig(): Promise<Config> {
  if (!useFirestore) return { ...defaultConfig, ...(await readFile()).config };
  const snap = await configDoc().get();
  return { ...defaultConfig, ...(snap.data() as Partial<Config> | undefined) };
}

export async function saveConfig(c: Config) {
  if (!useFirestore) {
    const d = await readFile();
    return writeFile({ ...d, config: c });
  }
  await configDoc().set(c); // full replace so removed overrides disappear
}

export async function createOrder(o: Order) {
  if (!useFirestore) {
    const d = await readFile();
    return writeFile({ ...d, orders: [o, ...d.orders] });
  }
  await orders().doc(o.id).create(o);
}

export async function listOrders(): Promise<Order[]> {
  if (!useFirestore) return (await readFile()).orders;
  const snap = await orders().orderBy("createdAt", "desc").limit(500).get();
  return snap.docs.map((d) => d.data() as Order);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!useFirestore) return (await readFile()).orders.find((o) => o.id === id) ?? null;
  const snap = await orders().doc(id).get();
  return (snap.data() as Order) ?? null;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!useFirestore) {
    const d = await readFile();
    return writeFile({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
  }
  await orders().doc(id).update({ status });
}
