import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from '../../assets/logo.png';

// ─── Architecture Summary Data ────────────────────────────────────────────────

const PROCESS_PHASES = [
  {
    num: "01",
    label: "Application",
    desc: "Register & submit documents",
    color: "#ff9c43",
  },
  {
    num: "02",
    label: "Dept. Review",
    desc: "11 offices clear simultaneously",
    color: "#3b82f6",
  },
  {
    num: "03",
    label: "Assessment",
    desc: "Billing generated & paid",
    color: "#10b981",
  },
  {
    num: "04",
    label: "Issuance",
    desc: "Mayor's Permit released",
    color: "#8b5cf6",
  },
];

const CLEARANCES = [
  { dept: "Barangay (BRGY)", abbr: "BRGY", icon: "🏘️", desc: "Local community clearance from the barangay where the business is located." },
  { dept: "Bureau of Fire Protection", abbr: "BFP", icon: "🔥", desc: "Fire safety inspection and certification of the business premises." },
  { dept: "Zoning Division", abbr: "ZONING", icon: "🗺️", desc: "Confirms the business type is permitted in its declared zone/location." },
  { dept: "City Health Office", abbr: "CHO", icon: "🏥", desc: "Health and sanitation clearance, especially for food/health-related businesses." },
  { dept: "Office of the Building Official", abbr: "OBO", icon: "🏗️", desc: "Structural safety and occupancy permit verification for the business premises." },
  { dept: "City Environment & Natural Resources Office", abbr: "CENRO", icon: "🌿", desc: "Environmental compliance clearance." },
  { dept: "BTTMD", abbr: "BTTMD", icon: "📐", desc: "Business technical and trade management compliance." },
  { dept: "City Administrator", abbr: "CA", icon: "🏛️", desc: "Administrative-level review and endorsement." },
  { dept: "City Veterinarian", abbr: "VET", icon: "🐾", desc: "Required for businesses involving animals or animal products." },
  { dept: "City Agriculture", abbr: "AGRI", icon: "🌾", desc: "Required for businesses involved in agricultural activities." },
  { dept: "Tourism Office", abbr: "TOURISM", icon: "✈️", desc: "Required for tourism-related establishments." },
];

// ─── Business Types & Requirements ───────────────────────────────────────────

const BUSINESS_TYPES = [
  { key: "sole", label: "Sole Proprietorship", icon: "👤", agency: "DTI", agencyUrl: "https://bnrs.dti.gov.ph", agencyFull: "Department of Trade and Industry" },
  { key: "corp", label: "Corporation", icon: "🏢", agency: "SEC", agencyUrl: "https://www.sec.gov.ph", agencyFull: "Securities and Exchange Commission" },
  { key: "coop", label: "Cooperative", icon: "🌐", agency: "CDA", agencyUrl: "https://www.cda.gov.ph", agencyFull: "Cooperative Development Authority" },
];

const REQUIREMENTS = {
  sole: {
    required: [
      {
        doc: "DTI Certificate of Business Name Registration",
        from: "Department of Trade and Industry (DTI)",
        fromUrl: "https://bnrs.dti.gov.ph",
        category: "Entity Proof",
        categoryColor: "#3b82f6",
        note: "Validates business name and sole proprietor ownership. Must match the name used on the application.",
        steps: "Register at DTI's Business Name Registration System (BNRS) online or at the nearest DTI office.",
      },
      {
        doc: "Digital Copy of Owner's Valid Government ID",
        from: "Any Government Agency (SSS, PhilHealth, GSIS, LTO, DFA, etc.)",
        category: "Identity Proof",
        categoryColor: "#10b981",
        note: "Mandatory for all applicants. Must be a clear, legible scan or photo of any Philippine government-issued ID.",
        steps: "Prepare a scanned copy of any valid ID: Passport, Driver's License, SSS/UMID, PhilSys, Voter's ID, etc.",
      },
    ],
    conditional: [
      {
        condition: "If the business place is rented",
        doc: "Lease Contract / Contract of Lease",
        from: "Landlord / Property Owner",
        category: "Location Proof",
        categoryColor: "#f59e0b",
        note: "Required to verify the declared business address. Must show the business address, rental period, and signature of both parties.",
      },
      {
        condition: "If the business is a franchise (CC or Business-type)",
        doc: "Written Franchise Agreement",
        from: "Franchisor",
        category: "Franchise Proof",
        categoryColor: "#8b5cf6",
        note: "Required for all CC-type and business-type franchise arrangements. Must include the scope, territory, and duration of the franchise.",
      },
    ],
  },
  corp: {
    required: [
      {
        doc: "SEC Certificate of Incorporation / Registration",
        from: "Securities and Exchange Commission (SEC)",
        fromUrl: "https://www.sec.gov.ph",
        category: "Entity Proof",
        categoryColor: "#3b82f6",
        note: "Confirms the corporation's legal existence and status. Must be current and include the Articles of Incorporation.",
        steps: "File for incorporation at the SEC main office or through the SEC company registration system online.",
      },
      {
        doc: "Board Resolution or Secretary's Certificate",
        from: "Corporation / Board of Directors",
        category: "Authorization Proof",
        categoryColor: "#ef4444",
        note: "SPA (Special Power of Attorney) or equivalent authorization with ID, specifically proving the signatory's authority to transact on behalf of the corporation. Must be notarized.",
        steps: "Have the Board of Directors pass a resolution designating the authorized signatory, then have the Corporate Secretary certify it.",
      },
      {
        doc: "Digital Copy of Authorized Representative's Valid Government ID",
        from: "Any Government Agency",
        category: "Identity Proof",
        categoryColor: "#10b981",
        note: "Mandatory digital copy of the authorized signatory's government-issued ID.",
        steps: "Prepare a scanned copy of any valid government ID of the person named in the Board Resolution.",
      },
    ],
    conditional: [
      {
        condition: "If the business place is rented",
        doc: "Lease Contract / Contract of Lease",
        from: "Landlord / Property Owner",
        category: "Location Proof",
        categoryColor: "#f59e0b",
        note: "Required to verify the declared business address. Must show the business address, rental period, and signatures of both parties.",
      },
      {
        condition: "If the business is a franchise (CC or Business-type)",
        doc: "Written Franchise Agreement",
        from: "Franchisor",
        category: "Franchise Proof",
        categoryColor: "#8b5cf6",
        note: "Required for all CC-type and business-type franchise arrangements. Must include scope, territory, and duration.",
      },
    ],
  },
  coop: {
    required: [
      {
        doc: "CDA Certificate of Registration",
        from: "Cooperative Development Authority (CDA)",
        fromUrl: "https://www.cda.gov.ph",
        category: "Entity Proof",
        categoryColor: "#3b82f6",
        note: "Valid CDA registration confirming the cooperative's legal status and authority to operate. Must be current.",
        steps: "Register the cooperative with the CDA regional office or through the CDA online system.",
      },
      {
        doc: "Digital Copy of Authorized Representative's Valid Government ID",
        from: "Any Government Agency",
        category: "Identity Proof",
        categoryColor: "#10b981",
        note: "Mandatory digital copy of the authorized signatory's government-issued ID.",
        steps: "Prepare a scanned copy of a valid government ID of the cooperative's authorized representative.",
      },
    ],
    conditional: [
      {
        condition: "If the business place is rented",
        doc: "Lease Contract / Contract of Lease",
        from: "Landlord / Property Owner",
        category: "Location Proof",
        categoryColor: "#f59e0b",
        note: "Required to verify the declared business address. Must be signed by both the cooperative representative and the landlord.",
      },
    ],
  },
};

const UNIVERSAL_NOTE =
  "All uploaded documents must be clear, legible scans or photos. Accepted formats: PDF, JPG, PNG. Maximum 10 MB per file.";

// ─── useInView hook ───────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.97)",
      borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
      backdropFilter: "blur(8px)",
      padding: "0 2rem",
      transition: "border-color 0.2s",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <img 
          src={logoImg} 
          alt="eBOSS Logo" 
          style={{ 
            width: 36, 
            height: 36, 
            objectFit: "contain" 
          }} 
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e07620", letterSpacing: "-0.3px", lineHeight: 1 }}>eBOSS</div>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", lineHeight: 1.2 }}>BACOLOD CITY</div>
        </div>
      </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { label: "Home", to: "/" },
            { label: "How It Works", to: "/#how-it-works" },
            { label: "Track Application", to: "/track" },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{ fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#374151"}
            >{l.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" style={{
            fontSize: 13, fontWeight: 600, color: "#ff9c43",
            textDecoration: "none", padding: "8px 16px",
            border: "1.5px solid #ff9c43", borderRadius: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ff9c43"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff9c43"; }}
          >Log In</Link>
          <Link to="/register" style={{
            fontSize: 13, fontWeight: 600, color: "white",
            textDecoration: "none", padding: "8px 16px",
            background: "#ff9c43", borderRadius: 6, border: "1.5px solid #ff9c43",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#e07b1a"}
            onMouseLeave={e => e.currentTarget.style.background = "#ff9c43"}
          >Register</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Process Phase Strip ──────────────────────────────────────────────────────

function ProcessStrip() {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{
      background: "white",
      borderBottom: "1px solid #e8eef5",
      padding: "24px 2rem",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#94a3b8",
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 16, textAlign: "center",
        }}>
          EBIS 4.0 — Business Permit Application Flow (RA 11032 Compliant)
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {PROCESS_PHASES.map((p, i) => (
            <div key={p.num} style={{ flex: 1, display: "flex", alignItems: "center", gap: 0 }}>
              <div style={{
                flex: 1,
                padding: "14px 16px",
                borderRadius: 10,
                background: i === 0 ? "#fff5eb" : "#f8fafc",
                border: `1.5px solid ${i === 0 ? "#ffd4a3" : "#e8eef5"}`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `all 0.4s ease ${i * 0.07}s`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: p.color,
                    background: `${p.color}18`,
                    borderRadius: 4, padding: "1px 6px",
                  }}>PHASE {p.num}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1c35" }}>{p.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{p.desc}</div>
              </div>
              {i < PROCESS_PHASES.length - 1 && (
                <div style={{ padding: "0 6px", color: "#cbd5e1", fontSize: 16, flexShrink: 0 }}>›</div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, fontSize: 12, color: "#94a3b8", textAlign: "center",
          opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.3s",
        }}>
          You are here: <span style={{ color: "#ff9c43", fontWeight: 600 }}>Phase 1 — Preparing your documents before submitting your application.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocCard({ doc, from, fromUrl, category, categoryColor, note, steps, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: "white",
      border: "1px solid #e8eef5",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      animation: `fadeUp 0.35s ease ${index * 0.07}s both`,
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
    >
      {/* Top color bar */}
      <div style={{ height: 3, background: categoryColor, borderRadius: "14px 14px 0 0" }} />

      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {/* Number badge */}
          <div style={{
            minWidth: 34, height: 34, borderRadius: 9,
            background: `${categoryColor}15`,
            border: `1.5px solid ${categoryColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: categoryColor,
            marginTop: 1, flexShrink: 0,
          }}>
            {index + 1}
          </div>

          <div style={{ flex: 1 }}>
            {/* Category tag */}
            <div style={{ marginBottom: 5 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: categoryColor,
                background: `${categoryColor}15`,
                border: `1px solid ${categoryColor}40`,
                borderRadius: 4, padding: "2px 8px", letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {category}
              </span>
            </div>

            {/* Document name */}
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f1c35", marginBottom: 7, lineHeight: 1.3 }}>
              {doc}
            </div>

            {/* Source */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: note ? 8 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Obtain from:</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#ff9c43",
                  background: "#fff5eb", border: "1px solid #ffd4a3",
                  borderRadius: 5, padding: "2px 9px",
                }}>
                  {from}
                </span>
              </div>
              {fromUrl && (
                <a href={fromUrl} target="_blank" rel="noreferrer" style={{
                  fontSize: 11, color: "#3b82f6", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 3,
                }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  Official Website ↗
                </a>
              )}
            </div>

            {note && (
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: steps ? 8 : 0 }}>
                {note}
              </div>
            )}

            {steps && (
              <button onClick={() => setExpanded(!expanded)} style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 12, fontWeight: 600, color: "#3b82f6",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, fontFamily: "inherit",
              }}>
                <span>{expanded ? "▲" : "▼"}</span>
                {expanded ? "Hide" : "How to get this"}
              </button>
            )}

            {steps && expanded && (
              <div style={{
                marginTop: 10, padding: "12px 14px",
                background: "#f0f7ff", border: "1px solid #bfdbfe",
                borderRadius: 8, fontSize: 12, color: "#1e40af", lineHeight: 1.6,
              }}>
                <span style={{ fontWeight: 700 }}>Steps: </span>{steps}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Conditional Card ─────────────────────────────────────────────────────────

function ConditionalCard({ condition, doc, from, category, categoryColor, note, index }) {
  return (
    <div style={{
      background: "#fffbf5",
      border: "1.5px dashed #ffd4a3",
      borderRadius: 14,
      padding: "18px 22px",
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      animation: `fadeUp 0.35s ease ${index * 0.07}s both`,
    }}>
      <div style={{
        minWidth: 34, height: 34, borderRadius: 9,
        background: "#fff5eb",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, marginTop: 1, flexShrink: 0,
      }}>
        ⚠️
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          display: "inline-block",
          fontSize: 10, fontWeight: 700, color: "#e07b1a",
          background: "#fff5eb", border: "1px solid #ffd4a3",
          borderRadius: 4, padding: "2px 9px",
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 5,
        }}>
          {condition}
        </div>

        {category && (
          <div style={{ marginBottom: 5 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: categoryColor,
              background: `${categoryColor}15`,
              border: `1px solid ${categoryColor}40`,
              borderRadius: 4, padding: "2px 8px", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {category}
            </span>
          </div>
        )}

        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f1c35", marginBottom: 6, lineHeight: 1.3 }}>
          {doc}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: note ? 7 : 0 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Obtain from:</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#e07b1a",
            background: "#fff5eb", border: "1px solid #ffd4a3",
            borderRadius: 5, padding: "2px 9px",
          }}>
            {from}
          </span>
        </div>
        {note && (
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Clearance Card ───────────────────────────────────────────────────────────

function ClearanceCard({ dept, abbr, icon, desc, index }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #e8eef5",
      borderRadius: 12,
      padding: "14px 18px",
      display: "flex", gap: 12, alignItems: "flex-start",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      animation: `fadeUp 0.3s ease ${index * 0.045}s both`,
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: "#eff6ff", border: "1.5px solid #bfdbfe",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1c35" }}>{dept}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#3b82f6",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 4, padding: "1px 6px", letterSpacing: "0.06em",
          }}>{abbr}</span>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: "#f0fdf4", border: "1.5px solid #86efac",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#16a34a", flexShrink: 0, marginTop: 2,
      }}>
        ✓
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentRequirements() {
  const [activeTab, setActiveTab] = useState("sole");
  const [showClearances, setShowClearances] = useState(false);
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useInView(0.05);
  const [reqRef, reqVisible] = useInView(0.05);
  const [clearRef, clearVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  const current = REQUIREMENTS[activeTab];
  const activeType = BUSINESS_TYPES.find(t => t.key === activeTab);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0, background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        paddingTop: 68 + 56,
        paddingBottom: 40,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        background: "linear-gradient(160deg, #fff8f2 0%, #fafbff 60%, #f0f7ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,156,67,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,156,67,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "#94a3b8", marginBottom: 18,
            opacity: heroVisible ? 1 : 0, transition: "all 0.4s ease",
          }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}
            >Home</Link>
            <span>›</span>
            <span style={{ color: "#ff9c43", fontWeight: 600 }}>Document Requirements</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#0f1c35", letterSpacing: "-0.5px", marginBottom: 14, lineHeight: 1.2,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.5s ease 0.1s",
          }}>
            Document Requirements & Permits
          </h1>

          <p style={{
            fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 28px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.5s ease 0.15s",
          }}>
            Select your business type to see the exact documents you need to prepare — plus which government offices will review and clear your application.
          </p>

          <div style={{
            background: "white", border: "1px solid #e8eef5",
            borderRadius: 10, padding: "13px 20px",
            fontSize: 13, color: "#64748b", lineHeight: 1.6,
            display: "inline-flex", alignItems: "flex-start", gap: 10,
            maxWidth: 560,
            opacity: heroVisible ? 1 : 0, transition: "all 0.5s ease 0.2s",
          }}>
            <span style={{ fontSize: 16, marginTop: 1 }}>📎</span>
            {UNIVERSAL_NOTE}
          </div>
        </div>
      </section>

      {/* ── Process Strip ── */}
      <ProcessStrip />

      {/* ── Main Content ── */}
      <section ref={reqRef} style={{ maxWidth: 900, margin: "0 auto", padding: "48px 2rem 0" }}>

        {/* Section header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ff9c43", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Phase 1 of 4
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1c35", letterSpacing: "-0.3px", margin: 0, lineHeight: 1.2 }}>
            Your Application Documents
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.6 }}>
            Prepare and upload these before you begin. Documents vary by business structure — select yours below.
          </p>
        </div>

        {/* Tab buttons */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28,
          background: "white", border: "1px solid #e8eef5",
          borderRadius: 14, padding: 7,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {BUSINESS_TYPES.map(t => {
            const isActive = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                flex: 1, minWidth: 140,
                padding: "12px 16px",
                border: "none", borderRadius: 10,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? "white" : "#374151",
                background: isActive
                  ? "linear-gradient(135deg, #ff9c43 0%, #e07b1a 100%)"
                  : "transparent",
                boxShadow: isActive ? "0 4px 12px rgba(255,156,67,0.3)" : "none",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#fff5eb"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Agency info banner */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10, marginBottom: 28,
          padding: "14px 18px",
          background: "white", border: "1px solid #e8eef5",
          borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "#fff5eb", border: "1.5px solid #ffd4a3",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              {activeType.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1c35" }}>{activeType.label}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Registered with:{" "}
                <a href={activeType.agencyUrl} target="_blank" rel="noreferrer" style={{ color: "#ff9c43", fontWeight: 700, textDecoration: "none" }}>
                  {activeType.agencyFull} ({activeType.agency}) ↗
                </a>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#0f1c35",
              background: "#f1f5f9", borderRadius: 6, padding: "5px 12px",
            }}>
              {current.required.length} Required
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#e07b1a",
              background: "#fff5eb", borderRadius: 6, padding: "5px 12px",
            }}>
              {current.conditional.length} Conditional
            </span>
          </div>
        </div>

        {/* Required docs */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#374151",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ff9c43" }} />
            Required Documents — Must submit all
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {current.required.map((item, i) => (
              <DocCard key={i} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Conditional docs */}
        {current.conditional.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "#374151",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: "#ffd4a3", border: "1.5px solid #e07b1a",
              }} />
              Conditional Documents
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                — only if the condition applies to you
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {current.conditional.map((item, i) => (
                <ConditionalCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Phase 2: Departmental Clearances ── */}
      <section ref={clearRef} style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem 56px" }}>
        <div style={{
          background: "white",
          border: "1px solid #e8eef5",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          opacity: clearVisible ? 1 : 0,
          transform: clearVisible ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.5s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "22px 28px",
            borderBottom: "1px solid #e8eef5",
            background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                Phase 2 of 4 — Handled automatically by EBIS 4.0
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f1c35", margin: 0, letterSpacing: "-0.2px" }}>
                Departmental Clearances
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0", lineHeight: 1.5 }}>
                After you submit, EBIS 4.0 routes your application to <strong>all 11 offices simultaneously</strong>. You don't visit them — they review online. Your permit only advances once all required offices approve.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: "#16a34a",
                background: "#f0fdf4", border: "1px solid #86efac",
                borderRadius: 6, padding: "5px 12px",
              }}>
                ✓ No physical visits required
              </span>
            </div>
          </div>

          {/* Clearances grid with toggle */}
          <div style={{ padding: "22px 28px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}>
              {(showClearances ? CLEARANCES : CLEARANCES.slice(0, 6)).map((c, i) => (
                <ClearanceCard key={c.abbr} {...c} index={i} />
              ))}
            </div>

            {!showClearances && (
              <button onClick={() => setShowClearances(true)} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, color: "#3b82f6",
                background: "#eff6ff", border: "1.5px solid #bfdbfe",
                borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
              >
                + Show {CLEARANCES.length - 6} more offices (City Vet, Agriculture, Tourism)
              </button>
            )}
            {showClearances && (
              <button onClick={() => setShowClearances(false)} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, color: "#64748b",
                background: "#f1f5f9", border: "1.5px solid #e2e8f0",
                borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}>
                ▲ Collapse
              </button>
            )}
          </div>

          {/* Note banner */}
          <div style={{
            margin: "0 28px 22px",
            padding: "12px 16px",
            background: "#fff7ed", border: "1px solid #fed7aa",
            borderRadius: 10, fontSize: 12, color: "#9a3412", lineHeight: 1.6,
          }}>
            <strong>⏱ Processing Time:</strong> Under RA 11032 (Ease of Doing Business Act), simple transactions must be processed within <strong>3 working days</strong>, complex ones within <strong>7 working days</strong>. EBIS 4.0 tracks each department's status in real time.
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem 96px" }}>
        <div ref={ctaRef} style={{
          background: "linear-gradient(135deg, #ff9c43 0%, #e07b1a 100%)",
          borderRadius: 20,
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(255,156,67,0.25)",
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.55s ease",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Ready to start?
          </div>
          <h2 style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800,
            color: "white", letterSpacing: "-0.3px", marginBottom: 10, lineHeight: 1.25,
          }}>
            Apply for your Mayor's Permit online
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 30, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 30px" }}>
            Prepare the documents above and complete your Business Permit application — no physical trip to City Hall required for the initial submission.
          </p>
          <button onClick={() => navigate("/apply")} style={{
            padding: "14px 36px",
            background: "white", color: "#e07b1a",
            border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
          >
            + Start Application
          </button>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
            You'll be asked to log in or register when you proceed.
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1a0f00", color: "rgba(255,255,255,0.4)", padding: "28px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12 }}>© 2025 eBOSS ePortal — Bacolod City Government. Republic of the Philippines.</span>
          <span style={{ fontSize: 12 }}>Data Privacy Act (RA 10173) Compliant · DICT ICT Standards · RA 11032</span>
        </div>
      </footer>
    </div>
  );
}