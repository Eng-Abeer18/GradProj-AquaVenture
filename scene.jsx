/* Underwater scene + sequential mission scripting */

function Bubbles({ count = 14 }) {
  const bubbles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const size = 3 + Math.random() * 14;
      arr.push({
        id: i, size,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
      });
    }
    return arr;
  }, [count]);
  return (
    <div className="particles">
      {bubbles.map(b => (
        <span key={b.id} className="bubble" style={{
          width: b.size, height: b.size,
          left: `${b.left}%`, bottom: `-${b.size}px`,
          animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`,
        }} />
      ))}
    </div>
  );
}

function Particles() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.15, vy: -0.05 - Math.random() * 0.15,
      a: 0.3 + Math.random() * 0.5,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -10) { d.y = canvas.height + 10; d.x = Math.random() * canvas.width; }
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 230, 240, ${d.a})`;
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(120,200,230,0.7)";
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles" />;
}

/* === Sequential School ===
   Primary UUV navigates the full mission path including obstacle avoidance.
   Phases 3-5: it dips down around the rock, then rises and finds the crack.
*/
function SequentialSchool({ phase, inspecting }) {
  const heroEntered = phase >= 1;

  /* when inspecting all three gather at top; otherwise follow mission path */
  const primaryLeft = inspecting ? "14%"
    : phase >= 6 ? "52%"
    : phase >= 5 ? "50%"
    : phase >= 4 ? "38%"
    : phase >= 3 ? "20%"
    : "12%";

  const primaryTop = inspecting ? "30%"
    : phase >= 6 ? "46%"
    : phase >= 5 ? "40%"
    : phase >= 4 ? "33%"
    : phase >= 3 ? "44%"
    : "38%";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
      {/* primary UUV */}
      <div style={{
        position: "absolute",
        left: primaryLeft,
        top: primaryTop,
        opacity: heroEntered ? 1 : 0,
        transition: heroEntered
          ? "opacity 1.4s ease, left 2.8s cubic-bezier(.4,.7,.3,1), top 2.8s cubic-bezier(.4,.7,.3,1), transform 4.5s cubic-bezier(.2,.7,.25,1)"
          : "opacity 1.4s ease, transform 4.5s cubic-bezier(.2,.7,.25,1)",
        transform: heroEntered ? "translateX(0)" : "translateX(-380px)",
      }}>
        <AnimatedFish size={160}/>
      </div>

      {/* secondary UUV — moves to top-center when inspecting */}
      <div style={{
        position: "absolute",
        left: inspecting ? "42%" : undefined,
        right: inspecting ? undefined : "14%",
        top: inspecting ? "19%" : "22%",
        opacity: heroEntered ? (inspecting ? 1 : 0.72) : 0,
        transition: "opacity 1.6s ease 0.4s, left 2.8s cubic-bezier(.4,.7,.3,1), top 2.8s cubic-bezier(.4,.7,.3,1), transform 5s cubic-bezier(.25,.7,.3,1) 0.4s",
        transform: heroEntered ? "translateX(0)" : "translateX(280px)",
        filter: inspecting ? "none" : "blur(0.5px)",
      }}>
        <AnimatedFish size={160} flip={!inspecting}/>
      </div>

      {/* collaborator UUV — moves to top-right when inspecting */}
      <div style={{
        position: "absolute",
        left: inspecting ? "73%" : "90%",
        top: inspecting ? "30%" : "18%",
        opacity: inspecting ? 0.95 : 0,
        transition: "left 3.5s cubic-bezier(.4,.7,.3,1), top 3.5s cubic-bezier(.4,.7,.3,1), opacity 0.8s ease",
      }}>
        <AnimatedFish size={160} flip/>
      </div>

      {/* three-fish data-sharing waves when all gathered at top */}
      {inspecting && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3, pointerEvents: "none" }}>
          <defs>
            <filter id="waveGlow" x="-50%" y="-400%" width="200%" height="900%">
              <feGaussianBlur stdDeviation="0.6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Wave 1: Primary mouth (≈25,35) → Secondary mouth (≈42,27) — angle ≈-25° */}
          <g transform="translate(25,35) rotate(-25)" filter="url(#waveGlow)">
            <path d="M0 0 Q2.2,-2.6 4.4,0 Q6.6,2.6 8.8,0 Q11,-2.6 13.2,0 Q15.4,2.6 17.6,0 Q19.8,-2.6 22,0"
              stroke="rgba(95,240,232,0.16)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke"/>
            <path d="M0 0 Q2.2,-2.6 4.4,0 Q6.6,2.6 8.8,0 Q11,-2.6 13.2,0 Q15.4,2.6 17.6,0 Q19.8,-2.6 22,0"
              stroke="rgba(95,240,232,0.20)" strokeWidth="4.5" fill="none" vectorEffect="non-scaling-stroke"/>
            <path d="M0 0 Q2.2,-2.6 4.4,0 Q6.6,2.6 8.8,0 Q11,-2.6 13.2,0 Q15.4,2.6 17.6,0 Q19.8,-2.6 22,0"
              stroke="#5ff0e8" strokeWidth="1.7" fill="none" vectorEffect="non-scaling-stroke"
              strokeDasharray="6 16" opacity="0.95">
              <animate attributeName="stroke-dashoffset" from="22" to="-22" dur="1.0s" repeatCount="indefinite"/>
            </path>
            <path d="M0 0 Q2.2,-2.6 4.4,0 Q6.6,2.6 8.8,0 Q11,-2.6 13.2,0 Q15.4,2.6 17.6,0 Q19.8,-2.6 22,0"
              stroke="#5ff0e8" strokeWidth="1.0" fill="none" vectorEffect="non-scaling-stroke"
              strokeDasharray="5 17" opacity="0.4">
              <animate attributeName="stroke-dashoffset" from="22" to="-22" dur="1.0s" begin="-0.5s" repeatCount="indefinite"/>
            </path>
          </g>

          {/* Wave 2: Secondary mouth (≈53,27) → Collaborator mouth (≈66,35) — angle ≈+30° */}
          <g transform="translate(65,27) rotate(30)" filter="url(#waveGlow)">
            <path d="M0 0 Q2,-2.6 4,0 Q6,2.6 8,0 Q10,-2.6 12,0 Q14,2.6 16,0"
              stroke="rgba(95,240,232,0.16)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke"/>
            <path d="M0 0 Q2,-2.6 4,0 Q6,2.6 8,0 Q10,-2.6 12,0 Q14,2.6 16,0"
              stroke="rgba(95,240,232,0.20)" strokeWidth="4.5" fill="none" vectorEffect="non-scaling-stroke"/>
            <path d="M0 0 Q2,-2.6 4,0 Q6,2.6 8,0 Q10,-2.6 12,0 Q14,2.6 16,0"
              stroke="#5ff0e8" strokeWidth="1.7" fill="none" vectorEffect="non-scaling-stroke"
              strokeDasharray="6 16" opacity="0.95">
              <animate attributeName="stroke-dashoffset" from="22" to="-22" dur="1.1s" repeatCount="indefinite"/>
            </path>
            <path d="M0 0 Q2,-2.6 4,0 Q6,2.6 8,0 Q10,-2.6 12,0 Q14,2.6 16,0"
              stroke="#5ff0e8" strokeWidth="1.0" fill="none" vectorEffect="non-scaling-stroke"
              strokeDasharray="5 17" opacity="0.4">
              <animate attributeName="stroke-dashoffset" from="22" to="-22" dur="1.1s" begin="-0.55s" repeatCount="indefinite"/>
            </path>
          </g>
        </svg>
      )}
    </div>
  );
}

/* === Obstacle Avoidance Overlay ===
   Phases 3-5: obstacle appears, UUV arcs around it, path clears.
   Always rendered; opacity-controlled for smooth fade-in/out.
*/
function ObstacleAvoidanceLayer({ phase }) {
  const visible = phase >= 3 && phase < 6;
  const avoiding = phase >= 4;
  const cleared  = phase >= 5;

  /* arc goes UP over the background rock (rock base ≈ y 47–70) */
  const avoidPath = "M 25 50 C 28 50 29 39 38 37 C 47 35 56 43 62 48";
  const rockOutline = "M 29 54 C 32 47 44 46 52 52 C 56 57 56 67 51 71 C 47 75 30 74 26 67 C 23 61 25 58 29 54";

  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
      opacity: visible ? 1 : 0,
      transition: "opacity 1.4s ease",
    }}>

      {/* Vignette to deepen the seabed feel during obstacle phases */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(1,6,14,0.28) 0%, transparent 45%, rgba(1,6,14,0.45) 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── SVG: detection outline + warning icon + paths ─────────── */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <filter id="obsGlow" x="-40%" y="-220%" width="180%" height="540%">
            <feGaussianBlur stdDeviation="0.9" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Rock detection ellipse — clean closed shape around the rock */}
        {!cleared && (
          <React.Fragment>
            {/* outer glow halo */}
            <ellipse cx="41" cy="61" rx="10" ry="12"
              stroke={avoiding ? "rgba(220,80,40,0.08)" : "rgba(220,80,40,0.22)"}
              strokeWidth="5" fill="none"
              vectorEffect="non-scaling-stroke" filter="url(#obsGlow)"/>
            {/* crisp dashed ellipse */}
            <ellipse cx="41" cy="61" rx="10" ry="12"
              stroke={avoiding ? "rgba(220,80,40,0.28)" : "rgba(220,80,40,0.70)"}
              strokeWidth="0.7" fill="rgba(220,80,40,0.03)"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={avoiding ? "0" : "2.5 2"}>
              {!avoiding && (
                <animate attributeName="stroke-dashoffset" from="0" to="9" dur="1.4s" repeatCount="indefinite"/>
              )}
            </ellipse>
          </React.Fragment>
        )}

        {/* Small warning icon — appears above the rock before avoidance */}
        {!avoiding && (
          <g transform="translate(41, 40)" filter="url(#obsGlow)">
            <path d="M0 -2.6 L2.0 1.5 L-2.0 1.5 Z"
              stroke="#e06040" strokeWidth="0.45" strokeLinejoin="round"
              fill="rgba(220,80,40,0.14)"/>
            <text x="0" y="1.2" textAnchor="middle"
              fill="#e06040" fontSize="2.2" fontWeight="700" fontFamily="monospace">!</text>
          </g>
        )}

        {/* Avoidance path — arcs UP over the background rock */}
        {avoiding && (
          <React.Fragment>
            <path d={avoidPath}
              stroke="rgba(45,212,212,0.09)" strokeWidth="6" fill="none"
              vectorEffect="non-scaling-stroke" filter="url(#obsGlow)"/>
            <path d={avoidPath}
              stroke={cleared ? "rgba(70,214,138,0.52)" : "rgba(95,240,232,0.68)"}
              strokeWidth="1.2" fill="none"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={cleared ? "0" : "4 2"}>
              {!cleared && (
                <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.75s" repeatCount="indefinite"/>
              )}
            </path>
            {!cleared && (
              <circle r="1.6" fill="#5ff0e8" filter="url(#obsGlow)">
                <animateMotion dur="3.2s" repeatCount="indefinite" path={avoidPath} calcMode="linear"/>
              </circle>
            )}
          </React.Fragment>
        )}

        {/* Cleared checkmark near the rock */}
        {cleared && (
          <g transform="translate(40, 43)" filter="url(#obsGlow)">
            <path d="M-3.5 0 L-0.8 3.8 L4.5 -4"
              stroke="#46d68a" strokeWidth="1.2" fill="none" strokeLinecap="round">
              <animate attributeName="opacity" values="1;0.45;1" dur="2.2s" repeatCount="indefinite"/>
            </path>
          </g>
        )}
      </svg>

      {/* ── HUD status label ───────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: "7%", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 4,
        padding: "4px 13px",
        background: "rgba(3, 10, 20, 0.92)",
        border: `1px solid ${cleared ? "rgba(70,214,138,0.4)" : avoiding ? "rgba(95,240,232,0.32)" : "rgba(220,80,40,0.42)"}`,
        borderRadius: 2,
        backdropFilter: "blur(7px)",
        animation: "popIn 0.4s ease",
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase",
          color: cleared ? "#46d68a" : avoiding ? "#5ff0e8" : "#e06040",
          fontWeight: 600, fontFamily: "JetBrains Mono, monospace",
        }}>
          {cleared ? "✓ Path Cleared" : avoiding ? "◇ Avoiding Obstacle" : "⚠ Obstacle Detected"}
        </span>
      </div>
    </div>
  );
}

window.Bubbles = Bubbles;
window.Particles = Particles;
window.SequentialSchool = SequentialSchool;
window.ObstacleAvoidanceLayer = ObstacleAvoidanceLayer;
