export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading perfumes">
      <section className="hero">
        <div className="sk sk-line" style={{ width: 180, margin: "0 auto" }} />
        <div className="sk sk-line" style={{ width: "min(420px,80%)", height: 44, margin: "16px auto 8px" }} />
        <div className="sk sk-line" style={{ width: "min(300px,60%)", height: 44, margin: "0 auto" }} />
        <div className="sk sk-search" />
      </section>
      <div className="filterbar" style={{ position: "static" }}>
        <div className="tabs">
          {[60, 80, 80, 80].map((w, i) => <div key={i} className="sk sk-chip" style={{ width: w }} />)}
        </div>
        <div className="tabs" style={{ marginTop: 8 }}>
          {[90, 120, 80, 110, 90, 100, 120].map((w, i) => <div key={i} className="sk sk-chip" style={{ width: w, height: 28 }} />)}
        </div>
      </div>
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="sk sk-thumb" />
            <div className="meta">
              <div className="sk sk-line" style={{ width: "40%", height: 10 }} />
              <div className="sk sk-line" style={{ width: "75%", height: 18, marginTop: 8 }} />
              <div className="sk sk-line" style={{ width: "30%", height: 10, marginTop: 8 }} />
            </div>
            <div className="cardfoot">
              <div className="sk sk-line" style={{ width: 70, height: 20 }} />
              <div className="sk sk-chip" style={{ width: 64, height: 34 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
