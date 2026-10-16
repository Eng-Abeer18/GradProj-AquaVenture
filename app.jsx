/* Sequential mission orchestrator + dashboard */

const { useState, useEffect, useRef } = React;

const DETECTIONS = [
  { id: "p1", type: "pipeline", time: "10:24 AM", title: "Pipeline detected",        confidence: 95, lat: "34.52N", lon: "45.31E", x: 30, y: 35, blurb: "Subsea pipeline segment identified along route. YOLO confidence 95%. Data shared across all units." },
  { id: "o1", type: "obstacle", time: "10:26 AM", title: "Obstacle detected",        confidence: 89, lat: "34.52N", lon: "45.31E", x: 50, y: 50, blurb: "Rock formation blocking mission path. AI path replanning initiated. Avoidance maneuver engaged." },
  { id: "c1", type: "crack",    time: "10:32 AM", title: "Crack detected",           confidence: 92, lat: "34.52N", lon: "45.31E", x: 65, y: 60, blurb: "Surface crack on seafloor structure. Severity: moderate. school converging for joint inspection." },
  { id: "d1", type: "data",     time: "10:35 AM", title: "Data shared — All units",  confidence: 0,  lat: "—",      lon: "—",      x: 78, y: 48, blurb: "Detection data shared across the school and relayed to the surface buoy." },
];
window.DETECTIONS = DETECTIONS;

/* ===== Intro Screen ===== */
function Intro({ onEnter, onMore }) {
  return (
    <div className="intro hero-scene fade-enter">
      <div className="god-rays"></div>
      <Particles />
      <Bubbles count={20} />
      <div className="scan"></div>

      <div style={{ position: "absolute", left: "60%", top: "55%", opacity: 0.28, filter: "blur(2px)", animation: "bob 7s ease-in-out infinite" }}>
        <FishUUV size={160} flip/>
      </div>
      <div style={{ position: "absolute", left: "8%", top: "20%", opacity: 0.2, filter: "blur(3px)", animation: "bob 9s ease-in-out infinite 1s" }}>
        <FishUUV size={160}/>
      </div>

      {/* Logo — top-right brand mark */}
      <div style={{ position: "absolute", top: 24, right: 32, zIndex: 5, opacity: 0, animation: "fadeUp 0.8s 0.1s ease forwards" }}>
        <Icon.Logo size={52}/>
      </div>

      <div className="intro-content">
        <h1 className="intro-title">
          Are you ready for the
          <strong className="glow-text">Aquaventure?</strong>
        </h1>
        <p className="intro-sub">
          Step into the deep — pilot a school of bio-inspired autonomous units<br/>as they explore, detect, and protect what lies beneath the surface.
        </p>
        <div className="intro-actions">
          <button className="btn btn-primary" onClick={onEnter}>Yes, I'm Ready</button>
          <button className="btn" onClick={onMore}>Tell Me More</button>
        </div>
        <div className="intro-stats">
          <div><div className="intro-stat-num mono">40<span style={{ fontSize: 14, color: "var(--text-3)", marginLeft: 4 }}>m</span></div><div className="intro-stat-label">Operating Depth</div></div>
          <div><div className="intro-stat-num mono">04</div><div className="intro-stat-label">School Units</div></div>
          <div><div className="intro-stat-num mono" style={{ fontSize: 18 }}>AI-Powered</div><div className="intro-stat-label">AI Detection + AI Communication</div></div>
          <div><div className="intro-stat-num mono">90<span style={{ fontSize: 14, color: "var(--text-3)" }}>%</span></div><div className="intro-stat-label">Uplink Reliability</div></div>
        </div>
      </div>
    </div>
  );
}

/* ===== Sidebar ===== */
function Sidebar({ active, onNav }) {
  const items = [
    { id: "mission",       label: "Mission",        icon: <Icon.Mission/> },
    { id: "School",         label: "School",          icon: <Icon.School/> },
    { id: "map",           label: "Map",            icon: <Icon.Map/> },
    { id: "detections",    label: "Detections",     icon: <Icon.Detect/> },
    { id: "communication", label: "Communication",  icon: <Icon.Comm/> },
    { id: "dashboard",     label: "Dashboard",      icon: <Icon.Dash/> },
    { id: "system",        label: "System Status",  icon: <Icon.Sys/> },
    { id: "hardware",      label: "Hardware",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="5" width="14" height="14" rx="1"/><path d="M9 5V3M12 5V3M15 5V3M9 19v2M12 19v2M15 19v2M5 9H3M5 12H3M5 15H3M19 9h2M19 12h2M19 15h2"/></svg> },
    { id: "about",         label: "About Us",       icon: <Icon.Info/> },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo"><Icon.Logo size={28}/><span className="brand-name">AQUAVENTURE</span></div>
        <div className="brand-tag">Explore · Detect · Connect</div>
      </div>
      <nav className="nav">
        {items.map(it => (
          <div key={it.id} className={"nav-item " + (active === it.id ? "active" : "")} onClick={() => onNav(it.id)}>
            <span className="nav-icon">{it.icon}</span>{it.label}
          </div>
        ))}
        <div style={{ height: 1, background: "rgba(64,196,220,0.08)", margin: "10px 4px" }}></div>
        <div className={"nav-item " + (active === "challenges" ? "active" : "")} onClick={() => onNav("challenges")}>
          <span className="nav-icon"><Icon.Challenge/></span>Challenges
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="status-pill"><span className="status-dot"></span>System Online</div>
        <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>All Systems Nominal</div>
      </div>
    </aside>
  );
}

/* ===== Mission Banner ===== */
function MissionBanner({ phase }) {
  const messages = [
    { label: "Initializing",       text: "Entering deep water — all units deploying.",                      color: "#5d7886" },
    { label: "School Active",       text: "All units exploring together. Seafloor sweep underway.",          color: "#5ff0e8" },
    { label: "Detection",          text: "Pipeline detected — data shared instantly across the school.",    color: "#5ff0e8" },
    { label: "Obstacle Detected",  text: "Rock formation blocking path. AI path replanning initiated.",     color: "#f0a93c" },
    { label: "Avoiding Obstacle",  text: "New route calculated. UUV navigating around obstacle.",           color: "#f0a93c" },
    { label: "Path Cleared",       text: "Obstacle cleared. Resuming mission on new course.",               color: "#46d68a" },
    { label: "Anomaly",            text: "Crack detected — school converging for joint inspection.",         color: "#f0a93c" },
    { label: "School Inspecting",   text: "All units sharing sensor data. Anomaly confirmed.",              color: "#f0a93c" },
    { label: "Uplink",             text: "Shared data relayed — UUV → Surface Buoy → Ground Station.",    color: "#a98cf0" },
    { label: "Mission Complete",   text: "All targets verified. Data delivered to control center.",         color: "#46d68a" },
  ];
  const m = messages[phase] || messages[0];
  return (
    <div key={phase} style={{
      position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)",
      zIndex: 4, display: "flex", alignItems: "center", gap: 14,
      padding: "8px 18px",
      border: `1px solid ${m.color}55`,
      background: "rgba(6, 16, 28, 0.85)",
      backdropFilter: "blur(8px)",
      borderRadius: 999,
      boxShadow: `0 0 18px ${m.color}33`,
      animation: "fadeUp 0.6s ease",
      whiteSpace: "nowrap",
    }}>
      <span className="status-dot" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }}></span>
      <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: m.color, fontWeight: 600 }}>{m.label}</span>
      <span style={{ fontSize: 11, color: "var(--text-2)" }}>{m.text}</span>
    </div>
  );
}

/* ===== Map Panel (mission-phase-aware) ===== */
function MapPanel({ phase, activeId, onSelect }) {
  const visibleDetections = DETECTIONS.filter(d =>
    (d.id === "p1" && phase >= 2) ||
    (d.id === "o1" && phase >= 3) ||
    (d.id === "c1" && phase >= 6) ||
    (d.id === "d1" && phase >= 8)
  );
  return (
    <div className="panel" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="panel-header">
        <span>3D Seafloor Map</span>
        <div className="compass mono">+</div>
      </div>
      <div className="map-canvas" style={{ flex: 1, minHeight: 280 }}>
        <div className="map-grid"></div>
        <div className="map-grid-glow"></div>
        {phase >= 1 && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            {/* soft glow halo under the path */}
            <path d="M 30 35 Q 45 50 65 60 T 85 80"
              stroke="rgba(45,212,212,0.12)" strokeWidth="5" fill="none"
              vectorEffect="non-scaling-stroke"/>
            {/* solid route line */}
            <path d="M 30 35 Q 45 50 65 60 T 85 80"
              stroke="rgba(45,212,212,0.5)" strokeWidth="1.5" fill="none"
              vectorEffect="non-scaling-stroke"/>
            {/* traveling glow dot */}
            <circle r="1.8" fill="#5ff0e8"
              style={{ filter: "drop-shadow(0 0 3px rgba(95,240,232,0.95))" }}>
              <animateMotion dur="5s" repeatCount="indefinite"
                path="M 30 35 Q 45 50 65 60 T 85 80" calcMode="linear"/>
            </circle>
          </svg>
        )}
        {phase >= 1 && (
          <div style={{ position: "absolute", left: "30%", top: "35%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: "#46d68a", boxShadow: "0 0 12px #46d68a" }}></div>
        )}
        {visibleDetections.map(d => {
          const color = d.type === "pipeline" ? "#5ff0e8" : (d.type === "crack" || d.type === "obstacle") ? "#f0a93c" : "#a98cf0";
          const isActive = activeId === d.id;
          return (
            <div key={d.id} className="map-marker" style={{ left: `${d.x}%`, top: `${d.y}%`, color, animation: "fadeUp 0.6s ease" }} onClick={() => onSelect(d.id)}>
              {d.type === "crack" ? (
                <svg width="26" height="26" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                  <path d="M12 2 L22 20 L2 20 Z" fill={isActive ? color : "rgba(240,169,60,0.2)"} stroke={color} strokeWidth="1.4"/>
                  <text x="12" y="17" textAnchor="middle" fill="#0a1018" fontSize="11" fontWeight="700" fontFamily="monospace">!</text>
                </svg>
              ) : d.type === "obstacle" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                  <path d="M12 2 L22 12 L12 22 L2 12 Z" fill={isActive ? color : "rgba(240,169,60,0.2)"} stroke={color} strokeWidth="1.4"/>
                  <text x="12" y="17" textAnchor="middle" fill="#0a1018" fontSize="10" fontWeight="700" fontFamily="monospace">!</text>
                </svg>
              ) : d.type === "pipeline" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                  <circle cx="12" cy="12" r="8" fill={isActive ? color : "rgba(95,240,232,0.2)"} stroke={color} strokeWidth="1.4"/>
                  <circle cx="12" cy="12" r="3" fill="#0a1018"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                  <circle cx="12" cy="12" r="6" fill={color} opacity="0.9"/>
                </svg>
              )}
              <span className="map-marker-pulse"></span>
            </div>
          );
        })}
        {phase >= 1 && (
          <div style={{ position: "absolute", left: "55%", top: "55%", transform: "translate(-50%,-50%)" }}>
            <MiniFish size={36} opacity={0.9}/>
          </div>
        )}
        <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          <button className="zoom-btn">+</button>
          <button className="zoom-btn">−</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Sequential Alerts ===== */
function SequentialAlerts({ phase, activeId, onSelect, onViewMap }) {
  const alerts = [];
  if (phase >= 2) alerts.push(DETECTIONS[0]);
  if (phase >= 3) alerts.push(DETECTIONS[1]);
  if (phase >= 6) alerts.push(DETECTIONS[2]);
  if (phase >= 8) alerts.push(DETECTIONS[3]);

  const latest = alerts[alerts.length - 1] || null;
  const [displayed, setDisplayed] = useState(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!latest) { setDisplayed(null); setExiting(false); return; }
    if (displayed && displayed.id === latest.id) return;
    if (displayed) {
      setExiting(true);
      const t = setTimeout(() => { setExiting(false); setDisplayed(latest); }, 320);
      return () => clearTimeout(t);
    } else {
      setDisplayed(latest);
    }
  }, [latest ? latest.id : null]);

  if (!displayed) {
    return (
      <div className="panel" style={{ padding: "30px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Awaiting Detections</div>
        <div style={{ fontSize: 11, color: "var(--text-3)" }}>school scanning environment...</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 4 }}>
          {[0,1,2].map(i => <span key={i} className="status-dot" style={{ background: "var(--teal)", animationDelay: `${i*0.2}s` }}></span>)}
        </div>
      </div>
    );
  }

  const d = displayed;
  const cls = "alert alert-" + d.type;
  return (
    <div>
      <div key={d.id}
        className={cls + (activeId === d.id ? " glow-border" : "")}
        onClick={() => onSelect(d.id)}
        style={{ animation: exiting ? "logExit 0.3s ease forwards" : "fadeUp 0.6s ease" }}>
        <div className="alert-thumb" style={{ background: "linear-gradient(135deg,#2a1a3a,#14081e)", overflow: "hidden" }}>
          {d.type === "pipeline" && <img src="uploads/photo_2.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.9 }} alt=""/>}
          {d.type === "crack"    && <img src="uploads/photo_1.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.9 }} alt=""/>}
          {d.type === "data"     && <MiniFish size={56} />}
          {d.type === "obstacle" && (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1a0e08,#0f0805)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="rgba(240,169,60,0.28)" stroke="#f0a93c" strokeWidth="1.4"/>
                <text x="12" y="17" textAnchor="middle" fill="#f0a93c" fontSize="10" fontWeight="700" fontFamily="monospace">!</text>
              </svg>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="alert-time mono">{d.time}</div>
          <div className="alert-title">{d.title}</div>
          {d.confidence > 0
            ? <div className="alert-meta">Confidence: <span style={{ color: "var(--text-1)" }}>{d.confidence}%</span></div>
            : <div className="alert-meta">Data transmitted to surface buoy</div>}
          {d.lat !== "—" && (
            <div className="alert-row">
              <span className="coords">📍 {d.lat}, {d.lon}</span>
              <span className="view-link" style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); onViewMap ? onViewMap(d.id) : onSelect(d.id); }}>
                VIEW ON MAP →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Mission Log ===== */
function MissionLog({ phase }) {
  const all = [
    { t: "10:20 AM", c: "#46d68a", text: "School deployed",                        at: 1 },
    { t: "10:24 AM", c: "#5ff0e8", text: "Pipeline detected",                      at: 2 },
    { t: "10:26 AM", c: "#f0a93c", text: "Obstacle detected — path blocked",       at: 3 },
    { t: "10:27 AM", c: "#f0a93c", text: "AI path replanning initiated",            at: 4 },
    { t: "10:28 AM", c: "#46d68a", text: "Path cleared — mission resumed",          at: 5 },
    { t: "10:32 AM", c: "#f0a93c", text: "Crack detected",                         at: 6 },
    { t: "10:33 AM", c: "#a98cf0", text: "School data merged and confirmed",        at: 7 },
    { t: "10:34 AM", c: "#46d68a", text: "Data received by surface buoy",           at: 8 },
    { t: "10:35 AM", c: "#46d68a", text: "Buoy relays data wirelessly",             at: 8 },
    { t: "10:36 AM", c: "#46d68a", text: "Data received at ground station",         at: 9 },
  ];
  const visible = all.filter(e => phase >= e.at);
  const latest = visible[visible.length - 1] || null;

  const [displayed, setDisplayed] = useState(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!latest) { setDisplayed(null); setExiting(false); return; }
    if (displayed && displayed.text === latest.text) return;
    if (displayed) {
      setExiting(true);
      const t = setTimeout(() => { setExiting(false); setDisplayed(latest); }, 320);
      return () => clearTimeout(t);
    } else {
      setDisplayed(latest);
    }
  }, [latest ? latest.text : null]);

  return (
    <div className="panel">
      <div className="panel-header"><span>Mission Log</span></div>
      <div style={{ minHeight: 46, overflow: "hidden" }}>
        {!displayed ? (
          <div style={{ padding: 16, fontSize: 11, color: "var(--text-3)", textAlign: "center" }}>No events yet.</div>
        ) : (
          <div className="log-row" key={displayed.text}
            style={{ animation: exiting ? "logExit 0.3s ease forwards" : "fadeUp 0.45s ease" }}>
            <span className="log-time">{displayed.t}</span>
            <span className="log-dot" style={{ background: displayed.c, boxShadow: `0 0 6px ${displayed.c}` }}></span>
            <span className="log-text">{displayed.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Communication Flow Overlay ===== */
function CommFlowOverlay({ active, onDone }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active) { setStage(0); return; }
    const ids = [];
    [1, 2, 3].forEach((s, i) => ids.push(setTimeout(() => setStage(s), 900 * (i + 1))));
    ids.push(setTimeout(() => onDone && onDone(), 4000));
    return () => ids.forEach(clearTimeout);
  }, [active]);
  if (!active) return null;
  const nodes = [
    { label: "UUV",            Comp: ({on}) => <MiniFish size={36} opacity={on ? 1 : 0.5}/> },
    { label: "Surface Buoy",   Comp: ({on}) => <Buoy size={32} active={on}/> },
    { label: "Ground Station", Comp: ({on}) => <GroundStation size={32} active={on}/> },
  ];
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(2, 8, 18, 0.86)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.5s ease",
      padding: "0 16px",
    }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: 480 }}>
        <div className="tracking" style={{ fontSize: 11, color: "var(--purple)", marginBottom: 18 }}>Establishing Uplink</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {nodes.map((n, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div className={"flow-icon " + (stage > i ? "active" : "")} style={{ width: 56, height: 56 }}>
                  <n.Comp on={stage > i}/>
                </div>
                <span className="flow-label" style={{ fontSize: 9, color: stage > i ? "var(--teal-bright)" : "var(--text-3)" }}>{n.label}</span>
              </div>
              {i < nodes.length - 1 && (
                <svg width="52" height="16" style={{ flexShrink: 0, marginBottom: 16 }}>
                  <line x1="0" y1="8" x2="52" y2="8" stroke={stage > i ? "#5ff0e8" : "#3a4a5c"} strokeWidth="1.2" strokeDasharray="3 3"/>
                  {stage > i && (
                    <circle r="3" cy="8" className="pulse-dot">
                      <animate attributeName="cx" from="0" to="52" dur="0.8s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  <path d="M48 4 L52 8 L48 12" stroke={stage > i ? "#5ff0e8" : "#3a4a5c"} strokeWidth="1.2" fill="none"/>
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 28, fontSize: 11, color: "var(--text-2)", letterSpacing: "0.04em" }}>
          {stage === 0 && "Encoding payload..."}
          {stage === 1 && "Acoustic signal → surface buoy"}
          {stage === 2 && "RF relay → ground station"}
          {stage === 3 && "✓ Data delivered to control center"}
        </div>
      </div>
    </div>
  );
}

/* ===== Mission Flow Bar ===== */
function MissionFlowBar({ phase }) {
  const steps = [
    { label: "Detect Pipeline",  active: phase >= 2 },
    { label: "Avoid Obstacle",   active: phase >= 3 },
    { label: "Detect Crack",     active: phase >= 6 },
    { label: "Share Data",       active: phase >= 7 },
    { label: "Ground Station",   active: phase >= 9 },
  ];
  return (
    <div className="mission-flow-bar">
      <span style={{ fontSize: 8, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--text-3)", marginRight: 14, flexShrink: 0 }}>Flow</span>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: s.active ? "var(--teal-bright)" : "rgba(64,196,220,0.2)",
              boxShadow: s.active ? "0 0 7px var(--teal)" : "none",
              transition: "all 0.6s ease",
            }}/>
            <span style={{
              fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
              color: s.active ? "var(--teal-bright)" : "var(--text-3)",
              fontWeight: s.active ? 600 : 400,
              transition: "color 0.6s ease",
            }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, minWidth: 20, height: 1, margin: "0 8px",
              background: steps[i + 1].active ? "rgba(45,212,212,0.45)" : "rgba(64,196,220,0.1)",
              transition: "background 0.6s ease",
            }}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ===== Main Mission Stage ===== */
function MissionStage() {
  const [phase, setPhase] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [showComm, setShowComm] = useState(false);

  useEffect(() => {
    const schedule = [
      { at: 1500,  fn: () => setPhase(1) },
      { at: 5500,  fn: () => { setPhase(2); setActiveId("p1"); } },
      { at: 9000,  fn: () => { setPhase(3); setActiveId("o1"); } },
      { at: 12500, fn: () => setPhase(4) },
      { at: 16000, fn: () => { setPhase(5); setActiveId(null); } },
      { at: 19500, fn: () => { setPhase(6); setActiveId("c1"); } },
      { at: 23000, fn: () => setPhase(7) },
      { at: 28000, fn: () => { setPhase(8); setShowComm(true); } },
      { at: 33000, fn: () => { setPhase(9); setShowComm(false); } },
    ];
    const ids = schedule.map(s => setTimeout(s.fn, s.at));
    return () => ids.forEach(clearTimeout);
  }, []);

  const inspecting = phase >= 7;
  const popup = activeId ? DETECTIONS.find(d => d.id === activeId) : null;

  const scrollToInlineMap = (id) => {
    setActiveId(id);
    setTimeout(() => {
      const el = document.getElementById("mission-map-inline");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  return (
    <div>
      <MissionFlowBar phase={phase}/>
      <div className="mission-grid" style={{ padding: 14, position: "relative" }}>
      {/* Left — main scene */}
      <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(64,196,220,0.14)", minWidth: 0, minHeight: 500 }}>
        <div className="hero-scene"></div>
        {/* aqu2 — permanent underwater environment background, blends over the CSS gradient */}
        <img src="uploads/aqu3.jpg" alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 55%",
          opacity: phase >= 1 ? 0.58 : 0,
          mixBlendMode: "screen",
          transition: "opacity 2.5s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}/>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: phase === 0 ? 1 : 0, transition: "opacity 2s ease", zIndex: 3, pointerEvents: "none" }}></div>
        <div className="god-rays" style={{ opacity: phase >= 1 ? 0.5 : 0.15, transition: "opacity 2s ease" }}></div>
        <Particles/>
        <Bubbles count={16}/>
        <SequentialSchool phase={phase} inspecting={inspecting}/>
        <ObstacleAvoidanceLayer phase={phase}/>
        <div className="scan"></div>
        <MissionBanner phase={phase}/>
        <div style={{ position: "absolute", bottom: 22, left: 28, zIndex: 4 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.32em", color: "var(--text-3)", textTransform: "uppercase" }}>Depth</div>
          <div className="display mono" style={{ fontSize: 30, fontWeight: 600, color: "var(--text-1)" }}>40 <span style={{ fontSize: 14, color: "var(--text-3)" }}>m</span></div>
        </div>
        {popup && phase >= 2 && !showComm && popup.type !== "obstacle" && (
          <div className="detail-popup" style={{ top: 80, right: 24, zIndex: 5 }}>
            <button
              onClick={() => setActiveId(null)}
              style={{ position: "absolute", top: 6, right: 7, background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 15, lineHeight: 1, padding: "2px 5px", opacity: 0.65 }}
              title="Dismiss"
            >×</button>
            <div className="alert-time mono" style={{ marginBottom: 4 }}>{popup.time} · {popup.lat}, {popup.lon}</div>
            <div className="alert-title" style={{ color: popup.type === "pipeline" ? "var(--teal-bright)" : (popup.type === "crack" || popup.type === "obstacle") ? "var(--amber)" : "var(--purple)" }}>{popup.title}</div>
            <div style={{ color: "var(--text-2)", marginTop: 6, lineHeight: 1.5 }}>{popup.blurb}</div>
            {popup.type === "crack" && phase >= 7 && (
              <div style={{ marginTop: 10, padding: 8, background: "rgba(240,169,60,0.08)", border: "1px solid rgba(240,169,60,0.3)", borderRadius: 3, fontSize: 10, color: "var(--amber)" }}>
                ↳ All units converging — joint inspection active
              </div>
            )}
          </div>
        )}
        {phase >= 9 && (
          <div style={{ position: "absolute", bottom: 80, right: 24, zIndex: 5, padding: 14, background: "rgba(6,16,28,0.92)", border: "1px solid var(--green)", borderRadius: 4, animation: "fadeUp 0.6s ease" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--green)", fontWeight: 600 }}>✓ Mission Complete</div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6 }}>Two anomalies catalogued. Data delivered.</div>
          </div>
        )}
        <CommFlowOverlay active={showComm}/>
      </div>

      {/* Right — alerts + log + map stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <SequentialAlerts phase={phase} activeId={activeId} onSelect={setActiveId} onViewMap={scrollToInlineMap}/>
        <MissionLog phase={phase}/>
        <div id="mission-map-inline" style={{ flex: 1, minHeight: 160 }}>
          <MapPanel phase={phase} activeId={activeId} onSelect={setActiveId}/>
        </div>
      </div>
    </div>{/* end mission-grid */}
    </div>
  );
}

/* ===== Lightweight section components ===== */

function SchoolSection() {
  const units = [
    { id: "UUV-01", role: "Active", color: "var(--teal-bright)" },
    { id: "UUV-02", role: "Active", color: "var(--teal-bright)" },
    { id: "UUV-03", role: "Active", color: "var(--teal-bright)" },
  ];
  return (
    <section id="sec-School" style={{ padding: "32px 14px 0" }}>
      <div className="panel" style={{ padding: 24 }}>
        <div className="panel-header" style={{ marginBottom: 18 }}><span>School Intelligence</span></div>
        <p style={{ color: "var(--text-2)", maxWidth: 640, lineHeight: 1.7, marginBottom: 24, fontSize: 13 }}>
          Three identical bio-inspired units explore together as a unified school. All units share the same role — any unit that detects an object instantly broadcasts the data to the rest of the school and to the surface.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, maxWidth: 560 }}>
          {units.map((u, i) => (
            <div key={i} className="panel" style={{ padding: "16px 12px", textAlign: "center" }}>
              <div className="status-dot" style={{ margin: "0 auto 10px", background: u.color, boxShadow: `0 0 10px ${u.color}` }}></div>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", color: u.color, fontWeight: 700, marginBottom: 4 }}>{u.id}</div>
              <div style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{u.role}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: "14px 0 0", borderTop: "1px solid rgba(64,196,220,0.08)", display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[["Bio-Inspired Shape","Reduces drag and improves maneuverability"],["Collaborative AI","Units share detection results in real time"],["Acoustic Communication","Reliable short-range underwater communication"]].map(([title, text], i) => (
            <div key={i} style={{ flex: "1 1 180px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 6, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapStandaloneSection() {
  const [activeId, setActiveId] = useState(null);
  return (
    <section id="sec-map" style={{ padding: "32px 14px 0" }}>
      <div style={{ height: 460 }}>
        <MapPanel phase={6} activeId={activeId} onSelect={setActiveId}/>
      </div>
    </section>
  );
}

function DetectionsSection() {
  const [activeId, setActiveId] = useState(null);
  return (
    <section id="sec-detections" style={{ padding: "32px 14px 0" }}>
      <div className="panel">
        <div className="panel-header"><span>All Detections</span></div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {DETECTIONS.map(d => {
            const cls = "alert alert-" + d.type;
            return (
              <div key={d.id} className={cls + (activeId === d.id ? " glow-border" : "")} onClick={() => setActiveId(d.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="alert-time mono">{d.time}</div>
                  <div className="alert-title">{d.title}</div>
                  {d.confidence > 0 && <div className="alert-meta">Confidence: <span style={{ color: "var(--text-1)" }}>{d.confidence}%</span></div>}
                  <div style={{ color: "var(--text-2)", fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>{d.blurb}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== Acoustic Modem SVG Illustration ===== */
function AcousticModemIllustration({ color }) {
  const c = color;
  return (
    <svg viewBox="0 0 100 150" width="90" height="135" fill="none">
      <rect x="28" y="42" width="44" height="74" rx="7" fill="rgba(2,10,20,0.95)" stroke={c} strokeWidth="0.85"/>
      <ellipse cx="50" cy="42" rx="22" ry="6.5" fill="rgba(8,22,38,0.95)" stroke={c} strokeWidth="0.85"/>
      <ellipse cx="50" cy="116" rx="22" ry="6.5" fill="rgba(8,22,38,0.95)" stroke={c} strokeWidth="0.85"/>
      <ellipse cx="50" cy="58" rx="22" ry="6.5" stroke={c} strokeWidth="0.4" opacity="0.28" fill="none"/>
      <ellipse cx="50" cy="76" rx="22" ry="6.5" stroke={c} strokeWidth="0.4" opacity="0.28" fill="none"/>
      <ellipse cx="50" cy="94" rx="22" ry="6.5" stroke={c} strokeWidth="0.4" opacity="0.28" fill="none"/>
      <rect x="41" y="46" width="18" height="2.5" rx="1" fill={c} opacity="0.55"/>
      <text x="50" y="72" textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" opacity="0.48" letterSpacing="2">ACO</text>
      <text x="50" y="81" textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" opacity="0.48" letterSpacing="2">MDM</text>
      <ellipse cx="50" cy="42" rx="16" ry="4.5" fill="rgba(3,14,26,0.97)" stroke={c} strokeWidth="1"/>
      <ellipse cx="50" cy="42" rx="8" ry="2.5" fill="rgba(8,22,36,0.95)" stroke={c} strokeWidth="0.7"/>
      <ellipse cx="50" cy="42" rx="3" ry="1.2" fill={c} opacity="0.85"/>
      <ellipse cx="50" cy="42" rx="3" ry="1.2" stroke={c} strokeWidth="0.7" fill="none">
        <animate attributeName="rx" values="3;23" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="1.2;8" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="42;22" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="50" cy="42" rx="3" ry="1.2" stroke={c} strokeWidth="0.7" fill="none">
        <animate attributeName="rx" values="3;23" dur="1.8s" begin="-0.9s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="1.2;8" dur="1.8s" begin="-0.9s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="42;22" dur="1.8s" begin="-0.9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0" dur="1.8s" begin="-0.9s" repeatCount="indefinite"/>
      </ellipse>
      <rect x="39" y="116" width="22" height="7" rx="2" fill="rgba(4,14,24,0.9)" stroke={c} strokeWidth="0.6" opacity="0.8"/>
      <rect x="43" y="120" width="4" height="4" rx="0.5" fill={c} opacity="0.65"/>
      <rect x="53" y="120" width="4" height="4" rx="0.5" fill={c} opacity="0.65"/>
    </svg>
  );
}

/* ===== Surface Buoy SVG Illustration ===== */
function SurfaceBuoyIllustration({ color }) {
  const c = color;
  return (
    <svg viewBox="0 0 100 160" width="90" height="144" fill="none">
      <line x1="50" y1="22" x2="50" y2="74" stroke={c} strokeWidth="1.2"/>
      <circle cx="50" cy="20" r="4" fill="rgba(8,14,30,0.95)" stroke={c} strokeWidth="0.8"/>
      <circle cx="50" cy="20" r="2" fill={c} opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.1s" repeatCount="indefinite"/>
      </circle>
      <line x1="38" y1="38" x2="62" y2="38" stroke={c} strokeWidth="0.9" opacity="0.7"/>
      <path d="M50,20 m-13,0 a13,13 0 0,1 26,0" stroke={c} strokeWidth="0.7" fill="none">
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M50,20 m-21,0 a21,21 0 0,1 42,0" stroke={c} strokeWidth="0.55" fill="none">
        <animate attributeName="opacity" values="0.45;0;0.45" dur="2s" begin="-0.65s" repeatCount="indefinite"/>
      </path>
      <path d="M50,20 m-30,0 a30,30 0 0,1 60,0" stroke={c} strokeWidth="0.4" fill="none">
        <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" begin="-1.3s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="50" cy="74" rx="18" ry="5" fill="rgba(8,18,35,0.95)" stroke={c} strokeWidth="0.8"/>
      <rect x="32" y="74" width="36" height="38" rx="5" fill="rgba(3,10,22,0.95)" stroke={c} strokeWidth="0.8"/>
      <rect x="68" y="80" width="14" height="10" rx="1" fill="rgba(8,18,38,0.9)" stroke={c} strokeWidth="0.6"/>
      <line x1="68" y1="85" x2="82" y2="85" stroke={c} strokeWidth="0.4" opacity="0.45"/>
      <line x1="75" y1="80" x2="75" y2="90" stroke={c} strokeWidth="0.4" opacity="0.45"/>
      <line x1="66" y1="85" x2="68" y2="85" stroke={c} strokeWidth="0.7"/>
      <ellipse cx="50" cy="112" rx="18" ry="5" fill="rgba(8,18,35,0.95)" stroke={c} strokeWidth="0.8"/>
      <line x1="12" y1="118" x2="88" y2="118" stroke={c} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.28"/>
      <text x="50" y="91" textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" opacity="0.52" letterSpacing="1">BUOY</text>
      <text x="50" y="99" textAnchor="middle" fill={c} fontSize="4.5" fontFamily="monospace" opacity="0.38" letterSpacing="1">GW-01</text>
      <path d="M 30 112 Q 28 130 38 136 Q 50 142 62 136 Q 72 130 70 112" fill="rgba(3,10,22,0.95)" stroke={c} strokeWidth="0.8"/>
      <circle cx="37" cy="127" r="1.2" fill={c} opacity="0.38"/>
      <circle cx="50" cy="133" r="1.2" fill={c} opacity="0.38"/>
      <circle cx="63" cy="127" r="1.2" fill={c} opacity="0.38"/>
    </svg>
  );
}

/* ===== Communication Device Viewer ===== */
function CommDeviceViewer({ device }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);
  const lastMouseXRef = useRef(null);
  const momentumFrameRef = useRef(null);
  const MAX_X = 18;

  const startMomentum = React.useCallback(() => {
    cancelAnimationFrame(momentumFrameRef.current);
    const tick = () => {
      velocityRef.current *= 0.93;
      if (Math.abs(velocityRef.current) < 0.05) return;
      setRotation(prev => ({ ...prev, y: prev.y + velocityRef.current }));
      momentumFrameRef.current = requestAnimationFrame(tick);
    };
    momentumFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (lastMouseXRef.current !== null) velocityRef.current = (e.clientX - lastMouseXRef.current) * 0.45;
      lastMouseXRef.current = e.clientX;
      setRotation({
        x: Math.max(-MAX_X, Math.min(MAX_X, rotRef.current.x + dy * 0.15)),
        y: rotRef.current.y + dx * 0.55,
      });
    };
    const onUp = () => { setIsDragging(false); lastMouseXRef.current = null; startMomentum(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging, startMomentum]);

  useEffect(() => {
    let frame; let angle = 0;
    const spin = () => { angle += 1.0; setRotation(prev => ({ ...prev, y: angle })); if (angle < 360) frame = requestAnimationFrame(spin); };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  const startDrag = (e) => {
    cancelAnimationFrame(momentumFrameRef.current);
    velocityRef.current = 0; lastMouseXRef.current = e.clientX;
    setIsDragging(true); dragStart.current = { x: e.clientX, y: e.clientY }; rotRef.current = { ...rotation };
  };
  const handleWheel = (e) => { e.preventDefault(); setZoom(z => Math.min(2.2, Math.max(0.5, z - e.deltaY * 0.0007))); };
  const reset = () => { cancelAnimationFrame(momentumFrameRef.current); velocityRef.current = 0; setRotation({ x: 0, y: 0 }); setZoom(1); };

  const yRad = (rotation.y * Math.PI) / 180;
  const { color, rgb, id } = device;

  return (
    <div style={{ flex: "1 1 260px", minWidth: 240, display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: 3 }}>{device.subtitle}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>{device.title}</div>
      </div>
      <div
        style={{
          width: "100%", maxWidth: 320, height: 220,
          cursor: isDragging ? "grabbing" : "grab", userSelect: "none", position: "relative",
          background: `radial-gradient(ellipse at 50% 55%, rgba(${rgb},0.07) 0%, transparent 72%)`,
          borderRadius: 8, border: `1px solid rgba(${rgb},0.20)`,
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}
        onMouseDown={startDrag} onWheel={handleWheel}
      >
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(64,196,220,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(64,196,220,0.022) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}/>
        <div style={{
          position: "absolute", left: 0, right: 0, top: "60%", height: 1, pointerEvents: "none",
          background: `linear-gradient(90deg,transparent,rgba(${rgb},0.10) 20%,rgba(${rgb},0.10) 80%,transparent)`,
        }}/>
        <div style={{
          transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
          willChange: "transform",
          filter: `drop-shadow(${Math.sin(yRad) * 10}px ${(-rotation.x / MAX_X) * 4 + 5}px 14px rgba(${rgb},0.35)) drop-shadow(0 3px 10px rgba(0,0,0,0.6))`,
          transition: isDragging ? "filter 0.08s ease" : "filter 0.2s ease",
        }}>
          {id === 0
            ? <AcousticModemIllustration color={color}/>
            : <img src="uploads/aqu88.jpg" alt="Surface Buoy" draggable={false}
                style={{ height: 170, objectFit: "contain", display: "block", pointerEvents: "none", borderRadius: 4 }}/>
          }
        </div>
        <div style={{ position: "absolute", top: 9, left: 11, fontSize: 8, letterSpacing: "0.10em", color: `rgba(${rgb},0.55)`, fontFamily: "var(--font-mono)", lineHeight: 1.7, pointerEvents: "none" }}>
          <div>YAW {((Math.round(rotation.y) % 360) + 360) % 360}°</div>
          <div>PTC {rotation.x >= 0 ? "+" : ""}{Math.round(rotation.x)}°</div>
        </div>
        <div style={{ position: "absolute", bottom: 9, right: 11, fontSize: 8, letterSpacing: "0.14em", color: `rgba(${rgb},0.32)`, fontFamily: "var(--font-mono)", pointerEvents: "none" }}>
          DRAG 360° · SCROLL
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button className="btn" style={{ padding: "4px 11px", fontSize: 9, letterSpacing: "0.1em" }} onClick={reset}>↺ Reset</button>
        <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setZoom(z => Math.min(2.2, z + 0.18))}>+</button>
        <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setZoom(z => Math.max(0.5, z - 0.18))}>−</button>
        <span style={{ fontSize: 8, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginLeft: 4 }}>{Math.round(zoom * 100)}%</span>
      </div>
      <p style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.72, margin: "2px 0 8px", maxWidth: 300 }}>{device.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {device.tags.map((tag, i) => (
          <span key={i} style={{
            fontSize: 8, letterSpacing: "0.14em", padding: "3px 9px",
            background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.22)`,
            borderRadius: 2, color, fontFamily: "var(--font-mono)",
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ===== Communication Section ===== */
function CommSection() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStage(s => (s + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);

  const nodes = [
    { label: "UUV",            icon: (on) => <MiniFish size={36} opacity={on ? 1 : 0.5}/> },
    { label: "Surface Buoy",   icon: (on) => <Buoy size={32} active={on}/> },
    { label: "Ground Station", icon: (on) => <GroundStation size={32} active={on}/> },
  ];

  const steps = [
    { num: "01", title: "UUV Detects & Sends", desc: "The UUV detects pipeline anomalies and encodes the sensor payload for acoustic transmission." },
    { num: "02", title: "Acoustic Link to Buoy", desc: "The custom acoustic modem transmits data through water to the surface buoy, overcoming subsea propagation challenges." },
    { num: "03", title: "Buoy Relays to Ground Station", desc: "The surface buoy gateway receives acoustic signals and relays them wirelessly to the ground control station." },
  ];

  const devices = [
    {
      id: 0, title: "Custom Acoustic Modem", subtitle: "Underwater Acoustic Link",
      color: "#5ff0e8", rgb: "95,240,232",
      description: "Enables reliable underwater acoustic data transmission between the UUV and the surface buoy. Custom-built for AquaVenture's operating depths and frequencies.",
      tags: ["Acoustic Link", "Custom Built", "Underwater Signal", "Data Relay"],
    },
    {
      id: 1, title: "Surface Buoy Gateway", subtitle: "Floating Data Bridge",
      color: "#a98cf0", rgb: "169,140,240",
      description: "Receives underwater acoustic data from UUVs and forwards it wirelessly to the ground station. Acts as the critical bridge between subsea and surface communication networks.",
      tags: ["Surface Gateway", "Data Receiver", "Wireless Relay", "Ground Station Link"],
    },
  ];

  return (
    <section id="sec-communication" style={{ padding: "32px 14px 0" }}>
      <div className="panel" style={{ padding: 24 }}>
        <div className="panel-header" style={{ marginBottom: 24 }}><span>Communication Flow</span></div>

        {/* 3-Node animated flow: UUV → Surface Buoy → Ground Station */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", padding: "8px 0 20px" }}>
          {nodes.map((n, i) => (
            <React.Fragment key={i}>
              <div className="flow-node">
                <div className={"flow-icon " + (stage > i ? "active" : "")} style={{ width: 60, height: 60 }}>
                  {n.icon(stage > i)}
                </div>
                <span className="flow-label" style={{ color: stage > i ? "var(--teal-bright)" : "var(--text-3)" }}>{n.label}</span>
              </div>
              {i < nodes.length - 1 && (
                <svg width="52" height="20" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="10" x2="52" y2="10" stroke={stage > i ? "#5ff0e8" : "#3a4a5c"} strokeWidth="1.5" strokeDasharray="4 4"/>
                  {stage > i && (
                    <circle r="3" cy="10" className="pulse-dot">
                      <animate attributeName="cx" from="0" to="52" dur="0.8s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  <path d="M47 6 L52 10 L47 14" stroke={stage > i ? "#5ff0e8" : "#3a4a5c"} strokeWidth="1.5" fill="none"/>
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step descriptions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: "12px 14px", background: "rgba(64,196,220,0.03)", border: "1px solid rgba(64,196,220,0.10)", borderRadius: 6 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.24em", color: "var(--teal)", marginBottom: 5, fontFamily: "var(--font-mono)" }}>{s.num}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--teal-bright)", marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Device viewers */}
        <div style={{ borderTop: "1px solid rgba(64,196,220,0.10)", paddingTop: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 4 }}>Communication Hardware</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--teal-bright)" }}>Interactive Device Viewers</div>
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {devices.map(device => (
            <CommDeviceViewer key={device.id} device={device}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const metrics = [
    { label: "Operating Depth",   value: "40 m",  color: "var(--teal-bright)" },
    { label: "Temperature",       value: "13.6 °C", color: "var(--cyan)" },
    { label: "Battery",           value: "78%",    color: "var(--green)" },
    { label: "Signal Strength",   value: "Strong", color: "var(--green)" },
    { label: "Mission Progress",  value: "68%",    color: "var(--amber)" },
    { label: "Uplink Reliability",value: "99.2%",  color: "var(--teal-bright)" },
  ];
  return (
    <section id="sec-dashboard" style={{ padding: "32px 14px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} className="panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 10 }}>{m.label}</div>
            <div className="display mono" style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SystemSection() {
  const systems = [
    { name: "Navigation System",    status: "Operational",  ok: true },
    { name: "Vision AI (YOLOv8)",   status: "Operational",  ok: true },
    { name: "Acoustic Communication",       status: "Operational",  ok: true },
    { name: "Buoy Wi-Fi Link",        status: "Operational",  ok: true },
    { name: "Battery Management",   status: "78% — Normal", ok: true },
    { name: "Depth Sensors",        status: "Operational",  ok: true },
    { name: "Temperature Sensors",  status: "Operational",  ok: true },
    { name: "SLAM (3D Mapping)",    status: "Operational",  ok: true },
  ];
  return (
    <section id="sec-system" style={{ padding: "32px 14px 0" }}>
      <div className="panel">
        <div className="panel-header"><span>System Status</span><span style={{ color: "var(--green)", fontSize: 10 }}>● All Nominal</span></div>
        <div>
          {systems.map((s, i) => (
            <div className="log-row" key={i}>
              <span className="log-dot" style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }}></span>
              <span style={{ flex: 1, color: "var(--text-1)", fontSize: 12 }}>{s.name}</span>
              <span style={{ color: "var(--green)", fontSize: 11, fontFamily: "var(--font-mono)" }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Hardware Section ===== */
function HardwareSection() {
  const [layersRevealed, setLayersRevealed] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);
  const lastMouseXRef = useRef(null);
  const momentumFrameRef = useRef(null);
  const MAX_X = 12;

  /* momentum decay loop — runs after drag ends */
  const startMomentum = React.useCallback(() => {
    cancelAnimationFrame(momentumFrameRef.current);
    const tick = () => {
      velocityRef.current *= 0.93;
      if (Math.abs(velocityRef.current) < 0.05) return;
      setRotation(prev => ({ ...prev, y: prev.y + velocityRef.current }));
      momentumFrameRef.current = requestAnimationFrame(tick);
    };
    momentumFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      /* track instantaneous velocity for momentum */
      if (lastMouseXRef.current !== null) {
        velocityRef.current = (e.clientX - lastMouseXRef.current) * 0.45;
      }
      lastMouseXRef.current = e.clientX;
      setRotation({
        x: Math.max(-MAX_X, Math.min(MAX_X, rotRef.current.x + dy * 0.12)),
        y: rotRef.current.y + dx * 0.55,
      });
    };
    const onUp = () => {
      setIsDragging(false);
      lastMouseXRef.current = null;
      startMomentum();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging, startMomentum]);

  /* auto-spin on mount to show off the 3D effect */
  useEffect(() => {
    let frame;
    let angle = 0;
    const spin = () => {
      angle += 1.2;
      setRotation(prev => ({ ...prev, y: angle }));
      if (angle < 360) frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  const startDrag = (e) => {
    cancelAnimationFrame(momentumFrameRef.current);
    velocityRef.current = 0;
    lastMouseXRef.current = e.clientX;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotRef.current = { ...rotation };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(2.2, Math.max(0.5, z - e.deltaY * 0.0007)));
  };

  const reset = () => {
    cancelAnimationFrame(momentumFrameRef.current);
    velocityRef.current = 0;
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const layers = [
    {
      id: 0, label: "01", title: "Internal Hardware Layout", subtitle: "Electronics & Propulsion",
      color: "#5ff0e8", rgb: "45,212,212", image: "uploads/aqu5.jpg",
      components: ["Jetson Nano", "Pixhawk 6C", "Thrusters", "Camera", "Lights", "Battery", "Sensors", "Acoustic Modem"],
      description: "The internal architecture combines a Jetson Nano for onboard AI inference with a Pixhawk 6C autopilot for precision dive control. Four T200 thrusters deliver full 6-DOF maneuverability. A stereo camera feeds real-time YOLO detection while depth, temperature, and IMU sensors drive the navigation stack.",
    },
    {
      id: 1, label: "02", title: "Waterproof Housing", subtitle: "Pressure-Sealed Enclosure",
      color: "#a98cf0", rgb: "169,140,240", image: "uploads/aqu6.jpg",
      components: ["Pressure resistance", "Waterproof sealing", "Component protection"],
      description: "A transparent acrylic cylinder with dual O-ring sealed end caps, rated to 40 m depth. Custom bulkhead penetrators route power and signals through the endcap without compromising the seal. The clear material allows visual inspection of internals without disassembly.",
    },
    {
      id: 2, label: "03", title: "Final Bio-Inspired Design", subtitle: "Streamlined Exterior",
      color: "#46d68a", rgb: "70,214,138", image: "uploads/aqu7.jpg",
      components: ["Streamlined body", "Tail fin", "Reduced drag", "Improved movement"],
      description: "The exterior mimics fish hydrodynamics — a tapered forebody and swept tail fin substantially reduce drag versus cylindrical AUV forms. The bio-inspired profile improves efficiency at low speeds and maintains stability in mild currents without active trim adjustments.",
    },
  ];

  const currentLayer = activeLayer !== null ? layers[activeLayer] : null;
  const viewerSrc   = currentLayer ? currentLayer.image : "uploads/AQUA11.webp";
  const viewerRgb   = currentLayer ? currentLayer.rgb   : "45,212,212";
  const viewerColor = currentLayer ? currentLayer.color : "#5ff0e8";
  /* shadow shifts with rotation to sell the depth illusion (works for full 360°) */
  const yRad = (rotation.y * Math.PI) / 180;
  const shadowX = Math.sin(yRad) * 10;
  const shadowY = (-rotation.x / MAX_X) * 4 + 5;

  return (
    <section id="sec-hardware" style={{ padding: "32px 14px 0" }}>
      <div className="panel" style={{ padding: 24, overflow: "hidden" }}>
        <div className="panel-header" style={{ marginBottom: 24 }}>
          <span>Hardware Architecture</span>
          <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Bio-Inspired UUV</span>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 28 }}>

          {/* Interactive Viewer */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: viewerColor, marginBottom: 2, transition: "color 0.4s ease" }}>
              {currentLayer ? `Layer ${currentLayer.label} — ${currentLayer.subtitle}` : "Interactive Viewer — Drag to Tilt"}
            </div>
            <div
              style={{
                width: 340, height: 224,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none", position: "relative",
                background: `radial-gradient(ellipse at 50% 55%, rgba(${viewerRgb},0.07) 0%, transparent 72%)`,
                borderRadius: 8, border: `1px solid rgba(${viewerRgb},0.18)`,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                transition: "border-color 0.4s ease, background 0.5s ease",
              }}
              onMouseDown={startDrag}
              onWheel={handleWheel}
            >
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(64,196,220,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(64,196,220,0.025) 1px,transparent 1px)",
                backgroundSize: "30px 30px",
              }}/>
              <div style={{
                position: "absolute", left: 0, right: 0, top: "60%", height: 1, pointerEvents: "none",
                background: `linear-gradient(90deg,transparent,rgba(${viewerRgb},0.10) 20%,rgba(${viewerRgb},0.10) 80%,transparent)`,
              }}/>
              {/* 2.5D tilt — perspective() inside transform, angles hard-clamped, no skew */}
              <div
                key={viewerSrc}
                style={{
                  transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                  transition: isDragging ? "filter 0.08s ease" : "filter 0.2s ease",
                  willChange: "transform",
                  filter: `drop-shadow(${shadowX}px ${shadowY}px 16px rgba(${viewerRgb},0.28)) drop-shadow(0 3px 10px rgba(0,0,0,0.6))`,
                  animation: "fadeUp 0.35s ease",
                }}
              >
                <img
                  src={viewerSrc}
                  alt={currentLayer ? currentLayer.title : "AquaVenture UUV"}
                  draggable={false}
                  style={{ width: 280, objectFit: "contain", display: "block", pointerEvents: "none" }}
                />
              </div>
              <div style={{ position: "absolute", top: 9, left: 11, fontSize: 8, letterSpacing: "0.10em", color: `rgba(${viewerRgb},0.55)`, fontFamily: "var(--font-mono)", lineHeight: 1.7, pointerEvents: "none" }}>
                <div>YAW {((Math.round(rotation.y) % 360) + 360) % 360}°</div>
                <div>PTC {rotation.x >= 0 ? "+" : ""}{Math.round(rotation.x)}°</div>
              </div>
              {currentLayer && (
                <div style={{ position: "absolute", top: 9, right: 11, fontSize: 8, padding: "2px 7px", background: `rgba(${viewerRgb},0.12)`, border: `1px solid rgba(${viewerRgb},0.30)`, borderRadius: 2, color: viewerColor, letterSpacing: "0.12em", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>
                  LAYER {currentLayer.label}
                </div>
              )}
              <div style={{ position: "absolute", bottom: 9, right: 11, fontSize: 8, letterSpacing: "0.14em", color: "rgba(64,196,220,0.32)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>
                DRAG 360° · SCROLL TO ZOOM
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button className="btn" style={{ padding: "4px 11px", fontSize: 9, letterSpacing: "0.1em" }} onClick={reset}>↺ Reset</button>
              <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setZoom(z => Math.min(2.2, z + 0.18))}>+</button>
              <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setZoom(z => Math.max(0.5, z - 0.18))}>−</button>
              <span style={{ fontSize: 8, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginLeft: 4 }}>{Math.round(zoom * 100)}%</span>
              {currentLayer && (
                <button className="btn" style={{ padding: "4px 10px", fontSize: 8, letterSpacing: "0.08em" }}
                  onClick={() => { setActiveLayer(null); reset(); }}>← UUV</button>
              )}
            </div>
          </div>

          {/* UUV Info + Explore Button */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--teal-bright)", letterSpacing: "0.08em", marginBottom: 8 }}>AquaVenture UUV</div>
            <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.78, maxWidth: 400, marginBottom: 20 }}>
              Bio-inspired autonomous underwater vehicle with a fish-shaped hydrodynamic body. Designed for cooperative seafloor inspection and real-time anomaly detection at depths up to 40 m.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22, maxWidth: 300 }}>
              {[["Length","42 cm"],["Depth Rating","40 m"],["Thrusters","4 × T200"],["AI Core","Jetson Nano"]].map(([k,v]) => (
                <div key={k} style={{ padding: "8px 12px", background: "rgba(64,196,220,0.04)", border: "1px solid rgba(64,196,220,0.1)", borderRadius: 4 }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--teal-bright)", fontFamily: "var(--font-mono)" }}>{v}</div>
                </div>
              ))}
            </div>
            {!layersRevealed ? (
              <button className="btn btn-primary" style={{ padding: "10px 22px", fontSize: 11, letterSpacing: "0.06em" }}
                onClick={() => setLayersRevealed(true)}>
                Explore Hardware Layers →
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="status-dot" style={{ background: "var(--teal)", boxShadow: "0 0 8px var(--teal)" }}/>
                <span style={{ fontSize: 10, color: "var(--teal)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Layers Revealed</span>
              </div>
            )}
          </div>
        </div>

        {/* Hardware Layer Cards */}
        {layersRevealed && (
          <div style={{ borderTop: "1px solid rgba(64,196,220,0.1)", paddingTop: 24, animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>
              Hardware Layers — Click to Explore
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
              {layers.map((layer, i) => {
                const isActive = activeLayer === i;
                return (
                  <div key={layer.id}
                    onClick={() => { setActiveLayer(isActive ? null : i); reset(); }}
                    style={{
                      background: isActive
                        ? `linear-gradient(145deg,rgba(${layer.rgb},0.09) 0%,rgba(3,10,22,0.7) 100%)`
                        : "rgba(6,16,30,0.55)",
                      border: `1px solid ${isActive ? layer.color + "50" : "rgba(64,196,220,0.10)"}`,
                      borderRadius: 7, padding: "16px 18px", cursor: "pointer",
                      transition: "border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease",
                      boxShadow: isActive ? `0 0 28px rgba(${layer.rgb},0.11),inset 0 0 20px rgba(${layer.rgb},0.04)` : "none",
                      animation: `fadeUp 0.5s ease ${i * 0.13}s both`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 13 }}>
                      <div style={{
                        width: 62, height: 46, borderRadius: 4, flexShrink: 0, overflow: "hidden",
                        border: `1px solid ${isActive ? layer.color + "55" : layer.color + "28"}`,
                        background: "rgba(3,9,18,0.9)", transition: "border-color 0.35s ease",
                      }}>
                        <img src={layer.image} alt={layer.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                            filter: isActive ? "brightness(1.0) saturate(1.0)" : "brightness(0.6) saturate(0.6)",
                            transition: "filter 0.35s ease" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: layer.color + "99", fontFamily: "var(--font-mono)", marginBottom: 3 }}>LAYER {layer.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? "var(--text-1)" : "var(--text-2)", lineHeight: 1.3, transition: "color 0.3s ease" }}>{layer.title}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{layer.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {layer.components.map(c => (
                        <span key={c} style={{
                          fontSize: 8, padding: "2px 7px",
                          background: `rgba(${layer.rgb},0.10)`, border: `1px solid rgba(${layer.rgb},0.24)`,
                          borderRadius: 2, color: layer.color, letterSpacing: "0.06em", fontFamily: "var(--font-mono)",
                        }}>{c}</span>
                      ))}
                    </div>
                    {isActive && (
                      <div style={{
                        fontSize: 11, color: "var(--text-2)", lineHeight: 1.7,
                        borderTop: `1px solid rgba(${layer.rgb},0.18)`, paddingTop: 12, marginBottom: 6,
                        animation: "fadeUp 0.3s ease",
                      }}>
                        {layer.description}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                      <div style={{ fontSize: 8, color: isActive ? layer.color : "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase", transition: "color 0.3s ease" }}>
                        {isActive ? "▴ Collapse" : "▾ Show Details"}
                      </div>
                      {isActive && (
                        <div style={{ fontSize: 8, color: `rgba(${layer.rgb},0.55)`, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>↑ Active in viewer</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="sec-about" style={{ padding: "32px 14px 0" }}>
      <div className="panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <Icon.Logo size={40}/>
          <div>
            <div className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.14em", color: "var(--teal-bright)" }}>AQUAVENTURE</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.06em" }}>Smart Exploration. Safer Oceans.</div>
          </div>
        </div>
        <p style={{ color: "var(--text-2)", maxWidth: 680, lineHeight: 1.8, marginBottom: 16, fontSize: 13 }}>
          AquaVenture is a Saudi-made autonomous underwater vehicle system, designed to explore, monitor, and protect the seafloor, in alignment with Saudi Arabia's Vision 2030. Our bio-inspired vehicles work collaboratively to detect anomalies, map underwater structures, and relay critical data to the surface in real time.
        </p>
        <p style={{ color: "var(--text-2)", maxWidth: 680, lineHeight: 1.8, marginBottom: 28, fontSize: 13 }}>
          Developed by a multidisciplinary student group, AquaVenture combines cutting-edge AI vision, collaborative swarm intelligence, and a reliable multi-hop communication chain — enabling seamless data transmission from the ocean floor to a ground station.
        </p>
        <div style={{ borderTop: "1px solid rgba(64,196,220,0.12)", paddingTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <a href="mailto:Aquaventure2026@gmail.com"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(64,196,220,0.3)", background: "rgba(8,20,34,0.85)", flexShrink: 0, transition: "border-color 0.2s, box-shadow 0.2s", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--teal-bright)"; e.currentTarget.style.boxShadow="0 0 10px var(--teal-glow)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(64,196,220,0.3)"; e.currentTarget.style.boxShadow="none"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal-bright)" strokeWidth="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
            </svg>
          </a>
          <a href="https://x.com/aquaventureuuvs?s=11" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(64,196,220,0.3)", background: "rgba(8,20,34,0.85)", marginLeft: 6, flexShrink: 0, transition: "border-color 0.2s, box-shadow 0.2s", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--teal-bright)"; e.currentTarget.style.boxShadow="0 0 10px var(--teal-glow)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(64,196,220,0.3)"; e.currentTarget.style.boxShadow="none"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--teal-bright)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@aquaventureuuvs" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(64,196,220,0.3)", background: "rgba(8,20,34,0.85)", flexShrink: 0, transition: "border-color 0.2s, box-shadow 0.2s", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--teal-bright)"; e.currentTarget.style.boxShadow="0 0 10px var(--teal-glow)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(64,196,220,0.3)"; e.currentTarget.style.boxShadow="none"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--teal-bright)">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.13 8.13 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===== App ===== */
function App() {
  const [page, setPage]       = useState("intro");
  const [active, setActive]   = useState("mission");
  const [missionKey, setMissionKey] = useState(0);
  const contentRef = useRef(null);

  const scrollToSection = (id) => {
    setActive(id);
    setTimeout(() => {
      const el = document.getElementById("sec-" + id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const enterMission = () => setPage("main");

  const tellMore = () => {
    setPage("main");
    setTimeout(() => scrollToSection("about"), 100);
  };

  if (page === "intro") {
    return <Intro onEnter={enterMission} onMore={tellMore}/>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }} className="fade-enter">
      <Sidebar active={active} onNav={scrollToSection}/>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <div className="topbar">
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", flexShrink: 0 }}>Live Mission</span>
          <button className="btn" style={{ padding: "6px 14px", fontSize: 10, flexShrink: 0 }} onClick={() => { setMissionKey(k => k + 1); scrollToSection("mission"); }}>↻ Replay Mission</button>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", flexShrink: 0 }}>
            <span>UTC 10:35:42</span>
            <span style={{ color: "var(--teal)" }}>● LIVE</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <section id="sec-mission" style={{ paddingTop: 14 }}>
            <MissionStage key={missionKey}/>
            <div style={{ padding: "14px 14px 0" }}><InfoCards/></div>
          </section>

          <SchoolSection/>
          <MapStandaloneSection/>
          <DetectionsSection/>
          <CommSection/>
          <DashboardSection/>
          <SystemSection/>
          <HardwareSection/>
          <AboutSection/>

          <section id="sec-challenges" style={{ padding: "32px 0 0" }}>
            <ChallengesPage/>
          </section>

          <div style={{ height: 48 }}/>
        </div>

        {/* Bottom bar */}
        <div className="bottombar">
          <div className="metric"><span className="metric-icon"><Icon.Depth/></span><div><span className="metric-label">Depth</span><span className="metric-value mono">40 m</span></div></div>
          <div className="metric"><span className="metric-icon"><Icon.Temp/></span><div><span className="metric-label">Temperature</span><span className="metric-value mono">13.6 °C</span></div></div>
          <div className="metric"><span className="battery"><span className="battery-fill" style={{ width: "78%" }}></span></span><div><span className="metric-label">Battery</span><span className="metric-value mono">78%</span></div></div>
          <div className="metric"><span className="bars"><span/><span/><span/><span/></span><div><span className="metric-label">Signal</span><span className="metric-value">Strong</span></div></div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
            <span className="metric-label" style={{ flexShrink: 0 }}>Progress</span>
            <div className="progress-track"><div className="progress-fill" style={{ width: "68%" }}></div></div>
            <span className="metric-value mono" style={{ color: "var(--teal-bright)" }}>68%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 16, borderLeft: "1px solid rgba(64,196,220,0.1)" }}>
            <Icon.Logo size={18}/>
            <span className="display" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "var(--teal-bright)" }}>AQUAVENTURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
