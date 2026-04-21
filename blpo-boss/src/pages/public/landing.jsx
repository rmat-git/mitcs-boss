import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import logoImg from '../../assets/logo.png';
import useAuthStore from '../../store/auth';

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Business Types", href: "#business-types" },
  { label: "Track Application", href: "#track" },
];

const STEPS = [
  {
    number: "01",
    title: "Register & Apply",
    desc: "Provide a valid email address and upload required documents (DTI, SEC, or CDA registration, Owner's ID, and Lease Contract if rented).",
  },
  {
    number: "02",
    title: "BPLO Review & Clearances",
    desc: "Your application is simultaneously routed to all required departments — BFP, Zoning, CHO, OBO, BENRO, and more — for concurrent approval.",
  },
  {
    number: "03",
    title: "Assessment & Payment",
    desc: "Receive your billing statement and pay online via GCash, PayMaya, DBP Visa, or Landbank — or settle over the counter at the Treasury Office.",
  },
  {
    number: "04",
    title: "Receive Your Permit",
    desc: "Your digital Mayor's Permit is emailed automatically with an embedded QR code for authenticity verification. Pick up a hard copy at BPLO if preferred.",
  },
];

const BUSINESS_TYPES = [
  { label: "Sole Proprietorship", icon: "👤", desc: "Requires DTI registration and a valid Owner's ID" },
  { label: "Corporation / OPC", icon: "🏢", desc: "Requires SEC registration and a Board Resolution or Secretary's Certificate" },
  { label: "Cooperative", icon: "🌐", desc: "Requires CDA registration and a valid Owner's ID" },
  { label: "Franchise Business", icon: "🏪", desc: "Requires a written Franchise Agreement in addition to standard documents" },
];

const AGENCIES = ["BPLO", "BFP", "Zoning", "City Health", "OBO", "BENRO", "Barangay", "City Administrator", "Tourism Office", "City Agriculture"];

function useInView(threshold = 0.15) {
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ── Auth ──────────────────────────────────────────────────────
  const { isAuthenticated, user, logout } = useAuthStore();

  // user.name is preferred; fall back to email prefix while fetchUser() is in flight,
  // then "My Account" if token was cleared (should not normally happen).
  const displayName = user?.name
    ?? user?.email?.split('@')[0]
    ?? 'My Account';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      transition: "all 0.3s ease",
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={logoImg}
            alt="Bacolod City eBOSS Logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e07620", letterSpacing: "-0.3px", lineHeight: 1 }}>eBOSS</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", lineHeight: 1.2 }}>BACOLOD CITY</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#ff9c43"}
              onMouseLeave={e => e.target.style.color = "#374151"}
            >{l.label}</a>
          ))}
        </div>

        {/* CTA — switches based on auth state */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isAuthenticated ? (

            /* ── Logged-in: rounded avatar pill ── */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 12px 6px 6px",
                  border: `1.5px solid ${dropdownOpen ? "#ff9c43" : "#ffd9a8"}`,
                  borderRadius: 999,
                  background: "white",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#ff9c43"}
                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = "#ffd9a8"; }}
              >
                {/* Face icon circle */}
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#ff9c43",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.8" stroke="white" strokeWidth="1.4" />
                    <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9s5.5 2.015 5.5 4.5"
                      stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Display name */}
                <span style={{
                  fontSize: 13, fontWeight: 600, color: "#374151",
                  maxWidth: 130, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {displayName}
                </span>

                {/* Chevron */}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  minWidth: 190,
                  overflow: "hidden",
                  zIndex: 200,
                }}>
                  {/* Signed-in-as header */}
                  <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Signed in as
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: "#1a1208",
                      marginTop: 3, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {user?.email ?? displayName}
                    </div>
                  </div>

                  {/* Nav items */}
                  {[
                    { label: "My Applications", href: "/dashboard" },
                    { label: "Account Settings", href: "/settings" },
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "block", padding: "10px 16px",
                        fontSize: 13, color: "#374151", textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Log out */}
                  <div style={{ borderTop: "1px solid #f1f5f9" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 16px", fontSize: 13,
                        color: "#ef4444", background: "none",
                        border: "none", cursor: "pointer",
                        transition: "background 0.15s", fontFamily: "inherit",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          ) : (

            /* ── Logged-out: Login + Register buttons ── */
            <>
              <Link to="/login" style={{
                fontSize: 13, fontWeight: 600, color: "#ff9c43",
                textDecoration: "none", padding: "8px 16px",
                border: "1.5px solid #ff9c43", borderRadius: 6,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = "#ff9c43"; e.target.style.color = "white"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#ff9c43"; }}
              >Log In</Link>
              <Link to="/register" style={{
                fontSize: 13, fontWeight: 600, color: "white",
                textDecoration: "none", padding: "8px 16px",
                background: "#ff9c43", borderRadius: 6,
                border: "1.5px solid #ff9c43",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.target.style.background = "#e07620"}
                onMouseLeave={e => e.target.style.background = "#ff9c43"}
              >Register</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

function Hero() {
  const [ref, visible] = useInView(0.1);

  return (
    <section ref={ref} style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f7ff 100%)",
      position: "relative", overflow: "hidden", paddingTop: 68,
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(26,79,139,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,79,139,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Accent blob */}
      <div style={{
        position: "absolute", top: "10%", right: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,79,139,0.07) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", width: "100%", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          {/* Left: copy */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fff3e6", border: "1px solid #ffd9a8",
              borderRadius: 20, padding: "5px 12px", marginBottom: 24,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.5s ease",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff9c43" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#ff9c43", letterSpacing: "0.03em" }}>EBIS 4.0 — Bacolod City BOSS Portal</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 800,
              color: "#1a1208", lineHeight: 1.15, letterSpacing: "-1px",
              marginBottom: 20,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.55s ease 0.08s",
            }}>
              Your Mayor's Permit,<br />
              <span style={{ color: "#ff9c43" }}>Done Online.</span>
            </h1>

            <p style={{
              fontSize: 17, color: "#475569", lineHeight: 1.7,
              maxWidth: 480, marginBottom: 36,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.55s ease 0.15s",
            }}>
              Apply for your Mayor's Permit, upload required documents, pay fees online, and track simultaneous departmental clearances — all without visiting Bacolod City Hall.
            </p>

            {/* Three primary CTAs */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 12,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.55s ease 0.22s",
            }}>
              <Link to="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#ff9c43", color: "white",
                padding: "13px 24px", borderRadius: 8,
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 14px rgba(26,79,139,0.3)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e07620"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(26,79,139,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#ff9c43"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,79,139,0.3)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                Start Application
              </Link>
              <a href="#track" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "white", color: "#ff9c43",
                padding: "13px 24px", borderRadius: 8,
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                border: "1.5px solid #ffd9a8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff9c43"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffd9a8"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="#ff9c43" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="#ff9c43" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Track Application
              </a>
              <a href="#how-it-works" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "#475569",
                padding: "13px 20px", borderRadius: 8,
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#ff9c43"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}
              >
                How it works →
              </a>
            </div>

            {/* Trust stats */}
            <div style={{
              display: "flex", gap: 32, marginTop: 48,
              paddingTop: 32, borderTop: "1px solid #e2e8f0",
              opacity: visible ? 1 : 0, transition: "all 0.55s ease 0.35s",
            }}>
              {[["4 Phases", "End-to-end permit pipeline"], ["11+", "Concurrent dept. clearances"], ["100%", "QR-verified digital permits"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ff9c43", letterSpacing: "-0.5px" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(24px)",
            transition: "all 0.6s ease 0.2s",
          }}>
            <div style={{
              background: "white", borderRadius: 16,
              boxShadow: "0 20px 60px rgba(15,28,53,0.12), 0 4px 16px rgba(15,28,53,0.06)",
              overflow: "hidden", border: "1px solid #e8eef5",
            }}>
              {/* Card header */}
              <div style={{ background: "#e07620", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", pointerEvents: "none" }}>
                  EBIS 4.0 — Application Status
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Reference No.</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1208", fontFamily: "monospace" }}>BOSS-2025-04891</div>
                  </div>
                  <div style={{
                    background: "#dcfce7", color: "#166534", fontSize: 12, fontWeight: 600,
                    padding: "4px 12px", borderRadius: 20, border: "1px solid #bbf7d0"
                  }}>Approved</div>
                </div>

                {/* Progress steps */}
                {["Application Submitted", "Dept. Clearances Approved", "Payment Confirmed", "Permit Issued"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 3 ? 8 : 0 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: "#ff9c43",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1208" }}>{step}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {["Apr 18", "Apr 19", "Apr 19", "Apr 20"][i]}
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: 20, padding: 14, background: "#f0f7ff",
                  borderRadius: 8, border: "1px solid #ffd9a8"
                }}>
                  <div style={{ fontSize: 12, color: "#ff9c43", fontWeight: 600, marginBottom: 4 }}>✓ Mayor's Permit Ready for Download</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Mayor's Permit No. MP-2025-00491 has been issued. Scan the QR code to verify.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function AgencyStrip() {
  return (
    <div style={{
      background: "#e07620", padding: "14px 2rem",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", letterSpacing: "0.1em", textTransform: "uppercase" }}>Clearing departments</span>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {AGENCIES.map(a => (
            <span key={a} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const [ref, visible] = useInView();
  return (
    <section id="how-it-works" ref={ref} style={{ padding: "96px 2rem", background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9c43", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Process</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#1a1208", letterSpacing: "-0.5px" }}>
            From registration to permit in 4 steps
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
            Compliant with government joint memorandum circulars — all departmental clearances processed simultaneously.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, position: "relative" }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{
              padding: "32px 28px",
              background: i % 2 === 0 ? "#fafbff" : "white",
              borderRadius: 12,
              border: "1px solid #e8eef5",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.5s ease ${i * 0.1}s`,
              position: "relative",
            }}>
              <div style={{
                fontSize: 36, fontWeight: 900, color: "#fff3e6",
                letterSpacing: "-2px", marginBottom: 16, lineHeight: 1,
                fontFamily: "Georgia, serif",
              }}>{step.number}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1208", marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{step.desc}</div>
              {i < 3 && (
                <div style={{
                  position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)",
                  color: "#ffd9a8", fontSize: 20, zIndex: 1,
                }}>›</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessTypes() {
  const [ref, visible] = useInView();
  return (
    <section id="business-types" ref={ref} style={{ padding: "96px 2rem", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.55s ease",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9c43", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Coverage</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#1a1208", letterSpacing: "-0.5px", marginBottom: 16 }}>
              All business structures,<br />one portal.
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
              Whether you're a DTI-registered sole proprietor, an SEC-registered corporation, or a CDA-registered cooperative, EBIS 4.0 dynamically loads the exact document requirements for your business structure.
            </p>
            <Link to="/requirements" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 600, color: "#ff9c43", textDecoration: "none",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "12px"}
              onMouseLeave={e => e.currentTarget.style.gap = "8px"}
            >
              View document requirements →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {BUSINESS_TYPES.map((bt, i) => (
              <div key={bt.label} style={{
                background: "white", borderRadius: 12, padding: "20px",
                border: "1px solid #e8eef5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${0.1 + i * 0.08}s`,
                cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff9c43"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,79,139,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8eef5"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>{bt.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1208", marginBottom: 4 }}>{bt.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{bt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrackSection() {
  const [ref, visible] = useInView();
  const [refNo, setRefNo] = useState("");
  const navigate = useNavigate();

  return (
    <section id="track" ref={ref} style={{ padding: "96px 2rem", background: "white" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.55s ease",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9c43", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Status Tracker</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#1a1208", letterSpacing: "-0.5px", marginBottom: 12 }}>
            Track your application
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 40 }}>
            Enter your Application Number and Business Account Number to view real-time progress across all four processing phases.
          </p>

          <div style={{
            display: "flex", gap: 0,
            border: "1.5px solid #ffd9a8",
            borderRadius: 10, overflow: "hidden",
            boxShadow: "0 4px 20px rgba(26,79,139,0.08)",
            background: "white",
          }}>
            <input
              type="text"
              placeholder="e.g. APP-2025-04891"
              value={refNo}
              onChange={e => setRefNo(e.target.value)}
              style={{
                flex: 1, padding: "16px 20px",
                fontSize: 15, border: "none", outline: "none",
                background: "transparent", color: "#1a1208",
                fontFamily: "monospace",
              }}
            />
            <button
              onClick={() => refNo && navigate(`/track?ref=${refNo}`)}
              style={{
                padding: "16px 28px",
                background: "#ff9c43", color: "white",
                border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 700,
                transition: "background 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#e07620"}
              onMouseLeave={e => e.currentTarget.style.background = "#ff9c43"}
            >
              Track →
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
            Your Application Number and Business Account Number were sent to your email after submission.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#1a0f00", color: "rgba(255,255,255,0.5)", padding: "48px 2rem 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 6V14M7 8L13 8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>EBIS 4.0 — BOSS Portal</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280, color: "rgba(255,255,255,0.35)" }}>
              Electronic Business Integrated System 4.0 — Developed by the Management Information Technology and Computer Services Department, Bacolod City.
            </p>
          </div>

          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            {[
              { heading: "Services", links: ["New Application", "Renew Permit", "Track Application", "Pay Fees Online"] },
              { heading: "Departments", links: ["BPLO", "Bureau of Fire Protection", "City Health Office", "Zoning Division"] },
              { heading: "Support", links: ["Help Center", "Privacy Policy", "Terms of Use", "Contact BPLO"] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.heading}</div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
                    >{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12 }}>© 2025 EBIS 4.0 — Bacolod City Government. All rights reserved.</span>
          <span style={{ fontSize: 12 }}>Data Privacy Act (RA 10173) Compliant · JMC Standards</span>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  // Re-hydrate user object on every mount (token is persisted, user is not)
  const { fetchUser, token } = useAuthStore();
  useEffect(() => {
    if (token) fetchUser();
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar />
      <Hero />
      <AgencyStrip />
      <HowItWorks />
      <BusinessTypes />
      <TrackSection />
      <Footer />
    </div>
  );
}