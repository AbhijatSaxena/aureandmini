"""Download bottle thumbnails for ids in scripts/fragrantica-ids.json (id -> Fragrantica perfume id).
Writes public/products/<id>.jpg and data/images.json."""
import json, os, urllib.request, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ids = json.load(open(f"{ROOT}/scripts/fragrantica-ids.json"))
os.makedirs(f"{ROOT}/public/products", exist_ok=True)
cache = {}  # fragrantica id -> bytes
def fetch(fid):
    r = urllib.request.urlopen(urllib.request.Request(f"https://fimgs.net/mdimg/perfume/375x500.{fid}.jpg", headers={"User-Agent": "Mozilla/5.0"}), timeout=30)
    d = r.read()
    if len(d) < 3000: raise ValueError("tiny")
    return d
out, bad = {}, []
with cf.ThreadPoolExecutor(6) as ex:
    futs = {ex.submit(fetch, f): f for f in set(ids.values())}
    for fu in cf.as_completed(futs):
        try: cache[futs[fu]] = fu.result()
        except Exception as e: print("FAIL", futs[fu], e)
for pid, fid in ids.items():
    if fid in cache:
        open(f"{ROOT}/public/products/{pid}.jpg", "wb").write(cache[fid]); out[pid] = f"/products/{pid}.jpg"
    else: bad.append(pid)
json.dump(out, open(f"{ROOT}/data/images.json", "w"), indent=1)
print(len(out), "images; failed:", bad)
