export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading perfumes">
      <div className="sk sk-line" style={{ width: "min(280px,60%)", height: 34, margin: "36px auto 24px" }} />
      <div className="toolbar">
        <div className="sk sk-line" style={{ width: 130, height: 22 }} />
        <div className="sk sk-line" style={{ width: 150, height: 22, marginLeft: "auto" }} />
        <div className="sk sk-line" style={{ width: 70, height: 22 }} />
      </div>
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="sk sk-thumb" />
            <div className="meta">
              <div className="sk sk-line" style={{ width: "35%", height: 10 }} />
              <div className="sk sk-line" style={{ width: "80%", height: 16, marginTop: 6 }} />
              <div className="sk sk-line" style={{ width: "30%", height: 14, marginTop: 6 }} />
            </div>
            <div className="sk sk-btn" />
          </div>
        ))}
      </div>
    </div>
  );
}
