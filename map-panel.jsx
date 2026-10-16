/* Map + Dashboard panels */

const DETECTIONS = [
  { id: "p1", type: "pipeline", time: "10:24 AM", title: "Pipeline detected", confidence: 95, lat: "34.52N", lon: "45.31E", x: 30, y: 35, blurb: "Subsea pipeline segment identified along route. YOLO confidence 95%." },
  { id: "c1", type: "crack", time: "10:28 AM", title: "Crack detected", confidence: 92, lat: "34.52N", lon: "45.31E", x: 65, y: 60, blurb: "Surface crack on seafloor structure. Severity: moderate. Inspection unit dispatched." },
  { id: "d1", type: "data",  time: "10:31 AM", title: "Data shared — UUV-02", confidence: 0, lat: "—", lon: "—", x: 78, y: 48, blurb: "Inspection data relayed to UUV-02 for verification pass." },
];

function MapPanel({ activeId, onSelect, phase }) {
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef(null);
  const panStart = React.useRef({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx * 0.65, y: panStart.current.y + dy * 0.65 });
      const rect = containerRef.current && containerRef.current.getBoundingClientRect();
      if (rect) {
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: -cy * 5, y: cx * 5 });
      }
    };
    const onUp = () => { setIsDragging(false); setTilt({ x: 0, y: 0 }); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(2.8, Math.max(0.5, z - e.deltaY * 0.0008)));
  };
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); setTilt({ x: 0, y: 0 }); };

  const ROUTE = "M 14 40 C 26 47 42 53 56 57 C 68 61 78 62 88 67";

  return (
    <div className="panel" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div className="panel-header" style={{ flexShrink: 0 }}>
        <span>3D Seafloor Map</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(70,214,138,0.75)", fontFamily: "var(--font-mono)" }}>LIVE</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#46d68a", boxShadow: "0 0 6px #46d68a", animation: "pulse 2s infinite" }}/>
        </div>
      </div>

      {/* Viewport */}
      <div
        ref={containerRef}
        style={{
          flex: 1, position: "relative", overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          background: "#03000e",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onWheel={handleWheel}
      >
        {/* Perspective wrapper */}
        <div style={{ position: "absolute", inset: 0, perspective: "500px", perspectiveOrigin: "50% 35%" }}>

          {/* 3D world */}
          <div style={{
            position: "absolute", inset: "-18%",
            transform: `rotateX(${30 + tilt.x}deg) rotateY(${tilt.y}deg) scale(${zoom}) translate(${pan.x / zoom}px,${pan.y / zoom}px)`,
            transformOrigin: "50% 50%",
            transition: isDragging ? "none" : "transform 0.5s cubic-bezier(.2,.8,.3,1)",
            willChange: "transform",
          }}>

            {/* ── Bathymetric terrain — contour relief (NOAA-style 3D) ── */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>

              {/* Deep ocean floor */}
              <rect width="100" height="100" fill="#06001a"/>
              <ellipse cx="52" cy="56" rx="58" ry="40" fill="#0a0028" opacity="0.6"/>

              {/* Seamount peaks — 12 contour fill rings, each inner ring shifted up
                  (rotateX perspective turns y-offset into apparent height) */}
              {[
                { cx:22, cy:37, rx:23, ry:15 },
                { cx:68, cy:24, rx:16, ry:11 },
                { cx:46, cy:61, rx:18, ry:12 },
                { cx:82, cy:65, rx:14, ry:9  },
              ].flatMap((pk, pi) =>
                ["#0c0038","#160060","#1e0099","#0838bb",
                 "#0066cc","#009ab9","#00bbaa","#22dd66",
                 "#aaee00","#ffee00","#ff8800","#ff2200"]
                .map((color, li, arr) => {
                  const t = li / (arr.length - 1);
                  const s = 1 - t * 0.93;
                  return (
                    <ellipse key={`pk${pi}l${li}`}
                      cx={pk.cx} cy={pk.cy - li * 0.44}
                      rx={pk.rx * s} ry={pk.ry * s}
                      fill={color} opacity={0.92}
                    />
                  );
                })
              )}

              {/* Contour outline rings — white-ish lines between bands */}
              {[
                { cx:22, cy:37, rx:23, ry:15 },
                { cx:68, cy:24, rx:16, ry:11 },
                { cx:46, cy:61, rx:18, ry:12 },
                { cx:82, cy:65, rx:14, ry:9  },
              ].flatMap((pk, pi) =>
                [1, 0.82, 0.64, 0.47, 0.30, 0.15].map((s, li) => (
                  <ellipse key={`cl${pi}l${li}`}
                    cx={pk.cx} cy={pk.cy - li * 0.97}
                    rx={pk.rx * s} ry={pk.ry * s}
                    fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3"
                    vectorEffect="non-scaling-stroke"
                  />
                ))
              )}

              {/* Wire mesh */}
              {[10,20,30,40,50,60,70,80,90].map(y => (
                <line key={"h"+y} x1="0" y1={y} x2="100" y2={y}
                  stroke="rgba(150,190,255,0.11)" strokeWidth="0.22" vectorEffect="non-scaling-stroke"/>
              ))}
              {[10,20,30,40,50,60,70,80,90].map(x => (
                <line key={"v"+x} x1={x} y1="0" x2={x} y2="100"
                  stroke="rgba(150,190,255,0.11)" strokeWidth="0.22" vectorEffect="non-scaling-stroke"/>
              ))}

              {/* Route ambient glow */}
              <ellipse cx="50" cy="54" rx="40" ry="8" fill="rgba(45,212,212,0.03)"/>
            </svg>

            {/* ── Route & nodes ── */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
              <defs>
                <filter id="rfGlow" x="-40%" y="-400%" width="180%" height="900%">
                  <feGaussianBlur stdDeviation="0.9" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="rnGlow" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="1.6" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Ground shadow */}
              <path d={ROUTE} stroke="rgba(0,0,0,0.55)" strokeWidth="5" fill="none"
                vectorEffect="non-scaling-stroke" transform="translate(0,4)" opacity="0.5"/>
              {/* Outer glow */}
              <path d={ROUTE} stroke="rgba(45,212,212,0.06)" strokeWidth="12" fill="none" vectorEffect="non-scaling-stroke"/>
              <path d={ROUTE} stroke="rgba(95,240,232,0.20)" strokeWidth="4.5" fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Core */}
              <path d={ROUTE} stroke="#5ff0e8" strokeWidth="1.3" fill="none"
                vectorEffect="non-scaling-stroke" filter="url(#rfGlow)"/>
              {/* Traveling dot */}
              <circle r="2.4" fill="#5ff0e8" filter="url(#rfGlow)">
                <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear" path={ROUTE}/>
              </circle>
              {/* Start node */}
              <circle cx="14" cy="40" r="5" fill="rgba(70,214,138,0.10)" stroke="#46d68a" strokeWidth="0.9" filter="url(#rnGlow)"/>
              <circle cx="14" cy="40" r="2" fill="#46d68a"/>
              <circle cx="14" cy="40" r="8" stroke="rgba(70,214,138,0.10)" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Zone rings */}
              <circle cx="38" cy="53" r="5.5" stroke="rgba(95,240,232,0.20)" strokeWidth="0.55" fill="none" vectorEffect="non-scaling-stroke"/>
              <circle cx="38" cy="53" r="9" stroke="rgba(95,240,232,0.08)" strokeWidth="0.45" fill="none" vectorEffect="non-scaling-stroke"/>
              <circle cx="62" cy="59" r="5.5" stroke="rgba(240,169,60,0.22)" strokeWidth="0.55" fill="none" vectorEffect="non-scaling-stroke"/>
              <circle cx="62" cy="59" r="9" stroke="rgba(240,169,60,0.08)" strokeWidth="0.45" fill="none" vectorEffect="non-scaling-stroke"/>
            </svg>

            {/* ── Markers ── */}
            {DETECTIONS.map(d => {
              const color = d.type === "pipeline" ? "#5ff0e8" : d.type === "crack" ? "#f0a93c" : "#a98cf0";
              const isActive = activeId === d.id;
              return (
                <div key={d.id} style={{
                  position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
                  transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 8,
                  filter: `drop-shadow(0 0 ${isActive ? 9 : 4}px ${color})`,
                }} onClick={(e) => { e.stopPropagation(); onSelect(d.id); }}>
                  {d.type === "pipeline" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="7" fill={isActive ? color : "rgba(95,240,232,0.15)"} stroke={color} strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="2.5" fill={isActive ? "#0a1018" : color}/>
                    </svg>
                  )}
                  {d.type === "crack" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3 L21 20 L3 20 Z" fill={isActive ? color : "rgba(240,169,60,0.15)"} stroke={color} strokeWidth="1.5"/>
                      <text x="12" y="17" textAnchor="middle" fill={isActive ? "#0a1018" : color} fontSize="9" fontWeight="700" fontFamily="monospace">!</text>
                    </svg>
                  )}
                  {d.type === "data" && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="6" fill={color} opacity="0.88"/>
                    </svg>
                  )}
                </div>
              );
            })}

            {/* ── UUV ── */}
            <div style={{ position: "absolute", left: "54%", top: "57%", transform: "translate(-50%,-50%)", zIndex: 10 }}>
              <MiniFish size={32} opacity={0.94}/>
            </div>

          </div>
        </div>

        {/* Depth fog vignette */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4,
          background: "linear-gradient(180deg,rgba(1,12,22,0.52) 0%,transparent 22%,transparent 70%,rgba(1,10,20,0.62) 100%)" }}/>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4,
          background: "radial-gradient(ellipse at 50% 50%,transparent 48%,rgba(1,8,18,0.55) 100%)" }}/>

        {/* Scanline texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5,
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(1,15,30,0.06) 3px,rgba(1,15,30,0.06) 4px)" }}/>

        {/* HUD coords */}
        <div style={{ position: "absolute", bottom: 10, left: 12, zIndex: 10, pointerEvents: "none",
          fontSize: 8, letterSpacing: "0.13em", color: "rgba(95,240,232,0.36)", fontFamily: "var(--font-mono)", lineHeight: 1.8 }}>
          <div>34.52°N · 45.31°E</div>
          <div>DEPTH · 40m</div>
        </div>

        {/* Depth color scale legend */}
        <div style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0, fontSize: 6, color: "rgba(200,220,255,0.55)", fontFamily: "var(--font-mono)", lineHeight: 2.1 }}>
            {["-2000","-3000","-4000","-5000","-5500"].map(d => <div key={d}>{d}</div>)}
          </div>
          <div style={{ width: 7, height: 80, borderRadius: 2, border: "0.5px solid rgba(255,255,255,0.15)",
            background: "linear-gradient(to bottom,#ff1a00,#ff8800,#ffee00,#00ddcc,#4400cc,#1a0055)" }}/>
        </div>

        {/* Compass N */}
        <div style={{ position: "absolute", top: 10, right: 42, zIndex: 10, pointerEvents: "none",
          fontSize: 9, letterSpacing: "0.18em", color: "rgba(95,240,232,0.42)", fontFamily: "var(--font-mono)" }}>N</div>

        {/* Reset */}
        <div style={{ position: "absolute", top: 8, left: 12, zIndex: 10 }}
          onMouseDown={(e) => e.stopPropagation()}>
          <button className="zoom-btn" style={{ fontSize: 8, letterSpacing: "0.1em", padding: "3px 8px", width: "auto" }}
            onClick={resetView}>↺</button>
        </div>

        {/* Zoom buttons */}
        <div style={{ position: "absolute", right: 12, bottom: 12, zIndex: 10, display: "flex", flexDirection: "column", gap: 4 }}
          onMouseDown={(e) => e.stopPropagation()}>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(2.8, z + 0.22))}>+</button>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.5, z - 0.22))}>−</button>
        </div>
      </div>
    </div>
  );
}

function Alerts({ activeId, onSelect, communicating }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {DETECTIONS.map(d => {
        const cls = "alert alert-" + d.type;
        return (
          <div key={d.id} className={cls + (activeId === d.id ? " glow-border" : "")} onClick={() => onSelect(d.id)}>
            <div className="alert-thumb" style={{ background: "linear-gradient(135deg,#2a1a3a,#14081e)", overflow: "hidden" }}>
              {d.type === "pipeline" && <img src="uploads/photo_2.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.9 }} alt=""/>}
              {d.type === "crack"    && <img src="uploads/photo_1.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.9 }} alt=""/>}
              {d.type === "data" && <MiniFish size={56} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="alert-time mono">{d.time}</div>
              <div className="alert-title">{d.title}</div>
              {d.confidence > 0 ? (
                <div className="alert-meta">Confidence: <span style={{ color: "var(--text-1)" }}>{d.confidence}%</span></div>
              ) : (
                <div className="alert-meta">Data transmitted to surface buoy</div>
              )}
              {d.lat !== "—" && (
                <div className="alert-row">
                  <span className="coords">📍 {d.lat}, {d.lon}</span>
                  <span className="view-link">VIEW ON MAP →</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MissionLog() {
  const entries = [
    { t: "10:20 AM", c: "#46d68a", text: "School deployed" },
    { t: "10:24 AM", c: "#5ff0e8", text: "Pipeline detected" },
    { t: "10:28 AM", c: "#f0a93c", text: "Crack detected" },
    { t: "10:31 AM", c: "#a98cf0", text: "Data shared with UUV-02" },
    { t: "10:33 AM", c: "#46d68a", text: "Data received by surface buoy" },
    { t: "10:34 AM", c: "#46d68a", text: "Data transmitted to ground station" },
  ];
  return (
    <div className="panel">
      <div className="panel-header">
        <span>Mission Log</span>
        <span style={{ color: "var(--text-3)", cursor: "pointer", fontSize: 12 }}>×</span>
      </div>
      <div>
        {entries.map((e, i) => (
          <div className="log-row" key={i}>
            <span className="log-time">{e.t}</span>
            <span className="log-dot" style={{ background: e.c, boxShadow: `0 0 6px ${e.c}` }}></span>
            <span className="log-text">{e.text}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(64,196,220,0.08)", textAlign: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--teal)", cursor: "pointer", fontWeight: 600 }}>View Full Log</span>
      </div>
    </div>
  );
}

window.MapPanel = MapPanel;
window.Alerts = Alerts;
window.MissionLog = MissionLog;
window.DETECTIONS = DETECTIONS;
