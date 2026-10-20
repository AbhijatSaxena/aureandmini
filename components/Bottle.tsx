// Brand-based thumbnail: a miniature bottle tinted with the brand's palette and monogram.
const PALETTE: Record<string, [string, string, string]> = {
  // [glass, cap, label text]
  "Chanel": ["#1c1c1c", "#c9a24b", "#f4efe6"],
  "Chanel – Les Exclusifs": ["#e9e2d3", "#1c1c1c", "#1c1c1c"],
  "Dior": ["#e8d9c4", "#b8975a", "#2b2b2b"],
  "Tom Ford": ["#6b4423", "#1c1c1c", "#f4efe6"],
  "Yves Saint Laurent": ["#111111", "#c9a24b", "#f4efe6"],
  "Gucci": ["#2f5d3a", "#c9a24b", "#f4efe6"],
  "Versace": ["#c9a24b", "#1c1c1c", "#1c1c1c"],
  "Bvlgari": ["#1f3a5f", "#c0c0c0", "#f4efe6"],
  "Acqua di Parma": ["#f2c230", "#1c1c1c", "#1c1c1c"],
  "Armani Privé": ["#2b3a4a", "#c0c0c0", "#f4efe6"],
  "Armani": ["#3a4a5a", "#c0c0c0", "#f4efe6"],
  "PARFUMS de MARLY": ["#7b1e3a", "#c9a24b", "#f4efe6"],
  "INITIO": ["#0f0f0f", "#c9a24b", "#f4efe6"],
  "Maison Margiela Replica": ["#f5f1e8", "#d8d2c4", "#2b2b2b"],
  "Maison Francis Kurkdjian": ["#d9c7a3", "#1c1c1c", "#1c1c1c"],
  "Jo Malone": ["#efe6d2", "#1c1c1c", "#1c1c1c"],
  "Dolce & Gabbana": ["#b7a06a", "#1c1c1c", "#1c1c1c"],
  "Burberry": ["#c8a96a", "#7a1f1f", "#2b2b2b"],
  "Hugo Boss": ["#1c1c1c", "#c0c0c0", "#f4efe6"],
  "Montblanc": ["#1c1c1c", "#f4efe6", "#f4efe6"],
  "Prada": ["#bcd3d0", "#1c1c1c", "#1c1c1c"],
  "Givenchy": ["#222222", "#c0c0c0", "#f4efe6"],
  "Lancôme": ["#f1d4d8", "#c9a24b", "#5a2a33"],
  "Miu Miu": ["#f0c9d4", "#c0c0c0", "#4a2030"],
};

function hashHue(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 360;
}

function monogram(brand: string) {
  const words = brand.replace(/[–&.]/g, " ").split(/\s+/).filter(Boolean);
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]).toUpperCase();
}

export default function Bottle({ brand, name, size }: { brand: string; name?: string; size?: number }) {
  const [glass, cap, ink] =
    PALETTE[brand] ?? [`hsl(${hashHue(brand)} 28% 62%)`, "#2b2b2b", "#faf7f0"];
  const id = "g" + hashHue(brand + (name ?? ""));
  return (
    <svg viewBox="0 0 120 150" role="img" aria-label={`${brand}${name ? " " + name : ""} miniature`} className="bottle">
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="140" rx="34" ry="5" fill="#000" opacity=".12" />
      <rect x="49" y="8" width="22" height="24" rx="3" fill={cap} />
      <rect x="53" y="32" width="14" height="9" fill={cap} opacity=".7" />
      <rect x="26" y="40" width="68" height="96" rx="10" fill={glass} />
      <rect x="26" y="40" width="68" height="96" rx="10" fill={`url(#${id})`} />
      <rect x="38" y="68" width="44" height="46" rx="3" fill="#faf7f0" opacity=".92" />
      <text x="60" y="89" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fill={ink === "#f4efe6" ? "#2b2b2b" : ink} fontWeight="700">
        {monogram(brand)}
      </text>
      <line x1="46" y1="95" x2="74" y2="95" stroke="#2b2b2b" strokeOpacity=".35" />
      {size ? (
        <text x="60" y="106" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="8" fill="#2b2b2b" opacity=".7">
          {size} ml
        </text>
      ) : null}
    </svg>
  );
}
