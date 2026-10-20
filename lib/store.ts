import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { defaultConfig } from "./pricing";
import type { Config, Order, OrderStatus } from "./types";

// Postgres (Neon) when DATABASE_URL is set; local JSON file otherwise (dev only).
const url = process.env.DATABASE_URL;
const sql = url ? neon(url) : null;

let ready: Promise<unknown> | null = null;
function init() {
  if (!sql) return Promise.resolve();
  ready ??= (async () => {
    await sql`create table if not exists config (id int primary key, data jsonb not null)`;
    await sql`create table if not exists orders (id text primary key, created_at timestamptz not null default now(), data jsonb not null)`;
  })();
  return ready;
}

const file = path.join(process.cwd(), ".data", "store.json");
type FileDb = { config: Config; orders: Order[] };
async function readFile(): Promise<FileDb> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return { config: defaultConfig, orders: [] };
  }
}
async function writeFile(db: FileDb) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(db, null, 1));
}

export async function getConfig(): Promise<Config> {
  if (!sql) return { ...defaultConfig, ...(await readFile()).config };
  await init();
  const rows = await sql`select data from config where id = 1`;
  return { ...defaultConfig, ...(rows[0]?.data as Partial<Config> | undefined) };
}

export async function saveConfig(c: Config) {
  if (!sql) {
    const db = await readFile();
    return writeFile({ ...db, config: c });
  }
  await init();
  await sql`insert into config (id, data) values (1, ${JSON.stringify(c)}::jsonb)
            on conflict (id) do update set data = excluded.data`;
}

export async function createOrder(o: Order) {
  if (!sql) {
    const db = await readFile();
    return writeFile({ ...db, orders: [o, ...db.orders] });
  }
  await init();
  await sql`insert into orders (id, created_at, data) values (${o.id}, ${o.createdAt}, ${JSON.stringify(o)}::jsonb)`;
}

export async function listOrders(): Promise<Order[]> {
  if (!sql) return (await readFile()).orders;
  await init();
  const rows = await sql`select data from orders order by created_at desc limit 500`;
  return rows.map((r) => r.data as Order);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!sql) return (await readFile()).orders.find((o) => o.id === id) ?? null;
  await init();
  const rows = await sql`select data from orders where id = ${id}`;
  return (rows[0]?.data as Order) ?? null;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!sql) {
    const db = await readFile();
    return writeFile({ ...db, orders: db.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
  }
  await init();
  await sql`update orders set data = jsonb_set(data, '{status}', ${JSON.stringify(status)}::jsonb) where id = ${id}`;
}
