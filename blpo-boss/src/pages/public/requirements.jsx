import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  { key: "sole", label: "Sole Proprietorship", icon: "👤", agency: "DTI" },
  { key: "corp", label: "Corporation / OPC",   icon: "🏢", agency: "SEC" },
  { key: "partnership", label: "Partnership",  icon: "🤝", agency: "SEC" },
  { key: "coop", label: "Cooperative",         icon: "🌐", agency: "CDA" },
];

const REQUIREMENTS = {
  sole: {
    required: [
      {
        doc: "DTI Certificate of Business Name Registration",
        from: "DTI",
        fromUrl: "https://bnrs.dti.gov.ph",
        note: "Must be valid and match applicant name exactly.",
      },
      {
        doc: "Owner's Valid Government-Issued ID",
        from: "Any government agency",
        note: "Passport, PhilSys, UMID, Driver's License, PRC ID, Voter's ID accepted.",
      },
      {
        doc: "Community Tax Certificate (Cedula)",
        from: "Barangay / City Hall",
        note: "Current year's cedula required.",
      },
      {
        doc: "Barangay Business Clearance",
        from: "Barangay Hall",
        note: "Must be obtained from the barangay where the business is located.",
      },
    ],
    conditional: [
      {
        condition: "If business place is rented",
        doc: "Lease Contract",
        from: "Private / Landlord",
        note: "Must cover the current year. Notarized copy preferred.",
      },
      {
        condition: "If franchise-type business",
        doc: "Written Franchise Agreement",
        from: "Franchisor",
        note: "Required for CC and business-type franchise operations.",
      },
    ],
  },
  corp: {
    required: [
      {
        doc: "SEC Certificate of Incorporation",
        from: "SEC",
        fromUrl: "https://www.sec.gov.ph",
        note: "Includes Articles of Incorporation and By-Laws.",
      },
      {
        doc: "Board Resolution or Secretary's Certificate",
        from: "Corporation / Board",
        note: "Must explicitly authorize the signatory to transact on behalf of the corporation.",
      },
      {
        doc: "Special Power of Attorney (SPA) with ID of Authorized Representative",
        from: "Corporation / Board",
        note: "Required if authorized representative is not an officer on record.",
      },
      {
        doc: "Owner's / Representative's Valid Government-Issued ID",
        from: "Any government agency",
        note: "ID of the authorized signatory.",
      },
      {
        doc: "Barangay Business Clearance",
        from: "Barangay Hall",
        note: "Must be obtained from the barangay where the business is located.",
      },
    ],
    conditional: [
      {
        condition: "If business place is rented",
        doc: "Lease Contract",
        from: "Private / Landlord",
        note: "Must cover the current year. Notarized copy preferred.",
      },
      {
        condition: "If franchise-type business",
        doc: "Written Franchise Agreement",
        from: "Franchisor",
        note: "Required for CC and business-type franchise operations.",
      },
    ],
  },
  partnership: {
    required: [
      {
        doc: "SEC Certificate of Partnership Registration",
        from: "SEC",
        fromUrl: "https://www.sec.gov.ph",
        note: "Includes Articles of Partnership.",
      },
      {
        doc: "Board / Partner Resolution authorizing the signatory",
        from: "Partnership",
        note: "Signed by all partners or a majority as specified in the Articles.",
      },
      {
        doc: "Owner's / Representative's Valid Government-Issued ID",
        from: "Any government agency",
        note: "ID of the authorized signatory.",
      },
      {
        doc: "Barangay Business Clearance",
        from: "Barangay Hall",
        note: "Must be obtained from the barangay where the business is located.",
      },
    ],
    conditional: [
      {
        condition: "If business place is rented",
        doc: "Lease Contract",
        from: "Private / Landlord",
        note: "Must cover the current year. Notarized copy preferred.",
      },
      {
        condition: "If franchise-type business",
        doc: "Written Franchise Agreement",
        from: "Franchisor",
        note: "Required for CC and business-type franchise operations.",
      },
    ],
  },
  coop: {
    required: [
      {
        doc: "CDA Certificate of Registration",
        from: "CDA",
        fromUrl: "https://www.cda.gov.ph",
        note: "Cooperative Development Authority registration certificate.",
      },
      {
        doc: "Board Resolution authorizing the signatory",
        from: "Cooperative Board",
        note: "Must be signed by the Board of Directors.",
      },
      {
        doc: "Representative's Valid Government-Issued ID",
        from: "Any government agency",
        note: "ID of the authorized signatory / officer.",
      },
      {
        doc: "Barangay Business Clearance",
        from: "Barangay Hall",
        note: "Must be obtained from the barangay where the business is located.",
      },
    ],
    conditional: [
      {
        condition: "If business place is rented",
        doc: "Lease Contract",
        from: "Private / Landlord",
        note: "Must cover the current year. Notarized copy preferred.",
      },
    ],
  },
};

// ─── Shared note ─────────────────────────────────────────────────────────────

const UNIVERSAL_NOTE =
  "All uploaded documents must be clear, legible scans or photos. Accepted formats: PDF, JPG, PNG. Maximum 10MB per file.";

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
      background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.97)",
      borderBottom: "1px solid #e5e7eb",
      backdropFilter: "blur(8px)",
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #ff9c43 0%, #e07b1a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 6V14M7 8L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f1c35", letterSpacing: "-0.3px", lineHeight: 1 }}>eBOSS</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", lineHeight: 1.2 }}>ePORTAL</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { label: "Home", to: "/" },
            { label: "How It Works", to: "/#how-it-works" },
            { label: "Track Application", to: "/track" },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{
              fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500,
            }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#374151"}
            >{l.label}</Link>
          ))}
        </div>

        {/* CTAs */}
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
            background: "#ff9c43", borderRadius: 6,
            border: "1.5px solid #ff9c43",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#e07b1a"}
            onMouseLeave={e => e.currentTarget.style.background = "#ff9c43"}
          >Register</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Document card ────────────────────────────────────────────────────────────

function DocCard({ doc, from, fromUrl, note, index }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #e8eef5",
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      animation: `fadeUp 0.35s ease ${index * 0.06}s both`,
    }}>
      {/* Number badge */}
      <div style={{
        minWidth: 32, height: 32, borderRadius: 8,
        background: "#fff5eb",
        border: "1.5px solid #ffd4a3",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#ff9c43",
        marginTop: 2,
      }}>
        {index + 1}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f1c35", marginBottom: 4 }}>
          {doc}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: note ? 6 : 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#ff9c43",
            background: "#fff5eb", border: "1px solid #ffd4a3",
            borderRadius: 4, padding: "2px 8px", letterSpacing: "0.04em",
          }}>
            {from}
          </span>
          {fromUrl && (
            <a href={fromUrl} target="_blank" rel="noreferrer" style={{
              fontSize: 11, color: "#94a3b8", textDecoration: "none",
            }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}
            >
              Official site ↗
            </a>
          )}
        </div>
        {note && (
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Conditional card ─────────────────────────────────────────────────────────

function ConditionalCard({ condition, doc, from, note, index }) {
  return (
    <div style={{
      background: "#fffbf5",
      border: "1px dashed #ffd4a3",
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      animation: `fadeUp 0.35s ease ${index * 0.06}s both`,
    }}>
      {/* Conditional icon */}
      <div style={{
        minWidth: 32, height: 32, borderRadius: 8,
        background: "#fff5eb",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, marginTop: 2,
      }}>
        ⚠️
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#e07b1a",
          letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
        }}>
          {condition}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f1c35", marginBottom: 4 }}>
          {doc}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: note ? 6 : 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#e07b1a",
            background: "#fff5eb", border: "1px solid #ffd4a3",
            borderRadius: 4, padding: "2px 8px",
          }}>
            {from}
          </span>
        </div>
        {note && (
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocumentRequirements() {
  const [activeTab, setActiveTab] = useState("sole");
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useInView(0.05);
  const [ctaRef, ctaVisible] = useInView(0.1);

  const current = REQUIREMENTS[activeTab];
  const activeType = BUSINESS_TYPES.find(t => t.key === activeTab);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0, background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

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
        paddingTop: 68 + 64,
        paddingBottom: 48,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        background: "linear-gradient(160deg, #fff8f2 0%, #fafbff 60%, #f0f7ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* grid bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,156,67,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,156,67,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "#94a3b8", marginBottom: 20,
            opacity: heroVisible ? 1 : 0, transition: "all 0.4s ease",
          }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}
            >Home</Link>
            <span>›</span>
            <span style={{ color: "#ff9c43", fontWeight: 600 }}>Document Requirements</span>
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#fff5eb", border: "1px solid #ffd4a3",
            borderRadius: 20, padding: "5px 14px", marginBottom: 20,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.45s ease 0.05s",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff9c43", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#e07b1a" }}>EBIS 4.0 — Based on RA 11032</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#0f1c35", letterSpacing: "-0.5px", marginBottom: 16, lineHeight: 1.2,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.5s ease 0.1s",
          }}>
            Document Requirements
          </h1>

          <p style={{
            fontSize: 17, color: "#64748b", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 32px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.5s ease 0.15s",
          }}>
            Select your business type below to see the exact documents you'll need to prepare before starting your application.
          </p>

          {/* Universal note */}
          <div style={{
            background: "white", border: "1px solid #e8eef5",
            borderRadius: 10, padding: "14px 20px",
            fontSize: 13, color: "#64748b", lineHeight: 1.6,
            display: "flex", alignItems: "flex-start", gap: 10,
            maxWidth: 560, margin: "0 auto",
            opacity: heroVisible ? 1 : 0, transition: "all 0.5s ease 0.2s",
          }}>
            <span style={{ fontSize: 16, marginTop: 1 }}>📎</span>
            {UNIVERSAL_NOTE}
          </div>
        </div>
      </section>

      {/* ── Tabs + Content ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 2rem 96px" }}>

        {/* Tab buttons */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap",
          marginBottom: 40,
          background: "white",
          border: "1px solid #e8eef5",
          borderRadius: 14,
          padding: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {BUSINESS_TYPES.map(t => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  flex: 1, minWidth: 140,
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
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

        {/* Agency badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#e07b1a",
            background: "#fff5eb", border: "1px solid #ffd4a3",
            borderRadius: 6, padding: "4px 12px",
          }}>
            Registered with: {activeType.agency}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            {current.required.length} required · {current.conditional.length} conditional
          </div>
        </div>

        {/* Required docs */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#374151",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: "#ff9c43",
            }} />
            Required Documents
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
              marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: "#ffd4a3", border: "1.5px solid #e07b1a",
              }} />
              Conditional Documents
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                — only required in specific cases
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {current.conditional.map((item, i) => (
                <ConditionalCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
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
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Ready to start?
          </div>
          <h2 style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800,
            color: "white", letterSpacing: "-0.3px", marginBottom: 12, lineHeight: 1.25,
          }}>
            Start your application online
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.6 }}>
            Prepare the documents above and start your Mayor's Permit application in minutes — no physical visit to City Hall required.
          </p>
          <button
            onClick={() => navigate("/apply")}
            style={{
              padding: "14px 36px",
              background: "white",
              color: "#e07b1a",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
          >
            + Start Application
          </button>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
            You'll be asked to log in or register when you proceed.
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0a1628", color: "rgba(255,255,255,0.4)", padding: "32px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12 }}>© 2025 eBOSS ePortal. Republic of the Philippines.</span>
          <span style={{ fontSize: 12 }}>Data Privacy Act (RA 10173) Compliant · DICT ICT Standards</span>
        </div>
      </footer>
    </div>
  );
}