import { useState, useEffect, useCallback, useMemo, memo } from "react";

const NAV_LINKS = ["Home", "About", "Projects", "Contact"];

const PROJECTS = [
  {
    title: "Collaboration Engine",
    desc: "A webapp which is used to network with peers based on their field of expertise and knowledge.",
    tags: ["Python", "Streamlit", "SQLite"],
    color: "#e8c4b8",
  },
  {
    title: "Speaker Diarization",
    desc: "A speaker diarization webapp used to identify the speaker and their language from an audio mp3/wav.",
    tags: ["Streamlit", "Python", "Docker"],
    color: "#d8c7b0",
  },
  {
    title: "Blood Detection",
    desc: "This very site! Designed from scratch with React, smooth scroll navigation and responsive layout.",
    tags: ["React", "CSS", "Python"],
    color: "#c9b8a6",
  },
];

const SKILLS = {
  Languages: [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "C",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  ],
  "Frameworks & Libraries": [
    { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  ],
  Databases: [
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "MySQL",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ],
  Tools: [
    { name: "Git",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "REST APIs", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  ],
};

const SOCIALS = [
  { alt: "LinkedIn",      href: "https://www.linkedin.com/in/anishrajai",        src: "/assets/LinkedIn_icon.svg.png" },
  { alt: "GitHub",        href: "https://github.com/anishrajai",                 src: "https://cdn.simpleicons.org/github" },
  { alt: "LeetCode",      href: "https://leetcode.com/anishrajai",               src: "https://cdn.simpleicons.org/leetcode" },
  { alt: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/user/YOUR_USERNAME", src: "https://cdn.simpleicons.org/geeksforgeeks" },
];

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
];

// ─── Inject global responsive + reset styles once ───────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    * { transition: none !important; animation: none !important; }
  }
  body { background: #fdf6f0; }

  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
  .mobile-menu { display: none; }

  .about-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .contact-grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .hero-grid   { display: flex; align-items: center; justify-content: center; gap: 6vw; max-width: 1100px; margin: 0 auto; width: 100%; }
  .hero-avatar { flex-shrink: 0; }

  @media (max-width: 900px) {
    .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .hero-grid   { flex-direction: column-reverse; gap: 2rem; padding: 2rem 0; }
    .hero-avatar { width: 200px !important; height: 200px !important; margin-right: 0 !important; }
    .hero-text   { text-align: center; }
    .hero-text .hero-btns  { justify-content: center; }
    .hero-text .hero-socials { justify-content: center; }
  }

  @media (max-width: 640px) {
    .nav-links  { display: none; }
    .hamburger  { display: block; }
    .mobile-menu.open {
      display: flex; flex-direction: column; gap: 0;
      position: fixed; top: 64px; left: 0; right: 0;
      background: rgba(253,246,240,0.98);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #f0d6c8;
      z-index: 99;
    }
    .mobile-menu.open button {
      padding: 16px 2rem; border-bottom: 1px solid #f0d6c8;
    }
    .section-pad { padding-left: 6vw !important; padding-right: 6vw !important; }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .skill-pill {
    display: flex; align-items: center; gap: 8px;
    background: #fdf6f0; border: 1.5px solid #f0bba8;
    border-radius: 50px; padding: 7px 16px;
    font-size: 13px; font-weight: 500; color: #6b4c3b;
    cursor: default; transition: border-color 0.25s, box-shadow 0.25s, color 0.25s, transform 0.25s;
    will-change: transform;
  }
  .skill-pill:hover {
    border-color: #c97b63;
    box-shadow: 0 0 10px rgba(201,123,99,0.35), 0 0 20px rgba(201,123,99,0.15);
    color: #c97b63;
    transform: translateY(-2px);
  }

  .project-card {
    background: #fff; border-radius: 20px; padding: 28px;
    border: 1.5px solid #f0d6c8;
    transition: transform 0.2s;
    will-change: transform;
  }
  .project-card:hover { transform: translateY(-4px); }

  .form-input:focus {
    outline: none;
    border-color: #c97b63;
    box-shadow: 0 0 0 3px rgba(201,123,99,0.15);
  }

  .primary-btn,
  .secondary-btn {
    transition: all 0.3s ease;
    will-change: transform;
  }
  .primary-btn:hover {
    background: white !important;
    color: #c97b63 !important;
    border: 2px solid #c97b63 !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(201,123,99,0.2);
  }
  .secondary-btn:hover {
    background: #c97b63 !important;
    color: white !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(201,123,99,0.2);
  }
`;

function injectGlobalStyles() {
  if (document.getElementById("portfolio-global-css")) return;
  const style = document.createElement("style");
  style.id = "portfolio-global-css";
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionTitle = memo(function SectionTitle({ label }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: "#c97b63", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </p>
      <div style={{ width: "48px", height: "3px", background: "#c97b63", borderRadius: "2px" }} />
    </div>
  );
});

const QuoteFooter = memo(function QuoteFooter() {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <p style={{ fontSize: "22px", color: "#c97b63", marginBottom: "6px", lineHeight: 1 }}>❝</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#2a1a14", lineHeight: 1.7, marginBottom: "8px", fontStyle: "italic" }}>
        {quote.text}
      </p>
      <p style={{ fontSize: "12px", color: "#a07060", letterSpacing: "1px", textTransform: "uppercase" }}>
        — {quote.author}
      </p>
    </div>
  );
});

const ProjectCard = memo(function ProjectCard({ p }) {
  return (
    <div className="project-card">
      <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: p.color, marginBottom: "20px" }} />
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "10px", color: "#2a1a14" }}>{p.title}</h3>
      <p style={{ color: "#6b4c3b", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>{p.desc}</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {p.tags.map((t) => (
          <span key={t} style={{ fontSize: "12px", background: "#fdf6f0", color: "#c97b63", border: "1px solid #f0bba8", borderRadius: "50px", padding: "4px 12px", fontWeight: 500 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <a style={{ fontSize: "13px", color: "#c97b63", fontWeight: 600, textDecoration: "none" }}>Live Demo →</a>
        <a href="https://github.com/AnishRajAI/University_Projects_SEC" target="_blank" style={{ fontSize: "13px", color: "#6b4c3b", fontWeight: 500, textDecoration: "none"}}>GitHub</a>
      </div>
    </div>
  );
});

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive]     = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent]         = useState(false);

  useEffect(() => { injectGlobalStyles(); }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = useCallback((id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ID_TO_NAV = { home: "Home", about: "About", projects: "Projects", contact: "Contact" };
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
        }
        if (best) setActive(ID_TO_NAV[best.target.id]);
      },
      { threshold: 0.45, rootMargin: "-15% 0px -15% 0px" }
    );
    const ids = ["home", "about", "projects", "contact"];
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const handleFormChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  }, []);

  const navBtnStyle = useCallback((link) => ({
    background: "none", border: "none", cursor: "pointer",
    fontSize: "15px", fontWeight: active === link ? 600 : 400,
    color: active === link ? "#c97b63" : "#6b4c3b",
    borderBottom: active === link ? "2px solid #c97b63" : "2px solid transparent",
    paddingBottom: "2px", transition: "all 0.2s",
    whiteSpace: "nowrap",
  }), [active]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fdf6f0", minHeight: "100vh", color: "#2a1a14" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(253,246,240,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0d6c8",
        padding: "0 2rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
      }}>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <button key={link} onClick={() => scrollTo(link)} style={navBtnStyle(link)}>{link}</button>
          ))}
        </div>
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c97b63" strokeWidth="2" strokeLinecap="round">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} role="navigation" aria-label="Mobile navigation">
        {NAV_LINKS.map((link) => (
          <button key={link} onClick={() => scrollTo(link)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "16px", fontWeight: active === link ? 600 : 400,
            color: active === link ? "#c97b63" : "#6b4c3b",
            textAlign: "left", width: "100%",
          }}>{link}</button>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: "100vh", padding: "0 8vw", paddingTop: "64px", display: "flex", alignItems: "center" }} className="section-pad">
        <div className="hero-grid">
          <div className="hero-text" style={{ maxWidth: "520px" }}>
            <p style={{ fontSize: "13px", color: "#c97b63", fontWeight: 600, marginBottom: "12px", letterSpacing: "3px", textTransform: "uppercase" }}>
              Welcome to my portfolio
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 6vw, 4.8rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "20px", color: "#2a1a14" }}>
              Hello, I'm<br />
              <span style={{ color: "#c97b63" }}>Anish Raj P</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#6b4c3b", lineHeight: 1.7, maxWidth: "480px", marginBottom: "24px" }}>
              A passionate full-stack developer building beautiful, functional web experiences. Based in Chennai, India.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
              <button
                className="primary-btn"
                onClick={() => scrollTo("Projects")}
                style={{ background: "#c97b63", color: "#fff", border: "2px solid #c97b63", borderRadius: "50px", padding: "14px 32px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
              >
                View Projects
              </button>
              <button
                className="secondary-btn"
                onClick={() => scrollTo("Contact")}
                style={{ background: "transparent", color: "#c97b63", border: "2px solid #c97b63", borderRadius: "50px", padding: "14px 32px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
              >
                Contact Me
              </button>
            </div>
            <div className="hero-socials" style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.alt}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noreferrer"
                  aria-label={s.alt}
                  style={{ display: "inline-block", transition: "transform 0.2s, opacity 0.2s", opacity: 0.85 }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "0.85"; }}
                >
                  <img src={s.src} alt={s.alt} width="26" height="26" loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>

          <div className="hero-avatar" style={{
            width: "clamp(220px, 28vw, 380px)", height: "clamp(220px, 28vw, 380px)",
            borderRadius: "50%", border: "3px solid #e8a896",
            overflow: "hidden", flexShrink: 0, marginRight: "6vw",
            contain: "layout paint",
          }}>
            <img
              src="/assets/Avatar.jpeg"
              alt="Anish Raj P profile photo"
              loading="eager"
              decoding="async"
              width="380"
              height="380"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "80px 8vw" }} className="section-pad">
        <SectionTitle label="About Me" />
        <div className="about-grid">

          {/* Left column */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", marginBottom: "16px", color: "#2a1a14" }}>
              A developer who loves combining engineering and user experience
            </h3>
            
            

            {/* Education */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#c97b63", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
                Education
              </p>
              <div style={{ background: "#fff", border: "1.5px solid #f0d6c8", borderRadius: "16px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#ffd6e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>
                  🎓
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#2a1a14", margin: "0 0 2px" }}>
                    Saveetha Engineering College
                  </p>
                  <p style={{ fontSize: "13px", color: "#6b4c3b", margin: "0 0 8px" }}>
                    B.Tech — Artificial Intelligence and Data Science
                  </p>
                  <span style={{ fontSize: "12px", background: "#fdf6f0", color: "#c97b63", border: "1px solid #f0bba8", borderRadius: "50px", padding: "3px 10px", fontWeight: 500 }}>
                    CGPA: 8.04
                  </span>
                </div>
              </div>
            </div>

            <a
  href="/assets/Anish_Raj_P_Resume_Updated.pdf"
  download="Anish_Raj_Resume.pdf"
  className="primary-btn"
  style={{
    display: "inline-block",
    background: "#c97b63",
    color: "#fff",
    textDecoration: "none",
    border: "2px solid #c97b63",
    borderRadius: "50px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: 600
  }}
>
  Hire Me
</a>
          </div>

          {/* Right column — Skills */}
          <div>
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#c97b63", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
                  {category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {items.map((skill) => (
                    <span key={skill.name} className="skill-pill">
                      <img src={skill.icon} alt="" width="16" height="16" loading="lazy" decoding="async" style={{ display: "block" }} />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "80px 8vw" }} className="section-pad">
        <SectionTitle label="Projects" />
        <div className="projects-grid">
          {PROJECTS.map((p) => <ProjectCard key={p.title} p={p} />)}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "80px 8vw", background: "#fff8f5" }} className="section-pad">
        <SectionTitle label="Contact" />
        <div className="contact-grid">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", marginBottom: "16px", color: "#2a1a14" }}>
              Let's work together
            </h3>
            <p style={{ color: "#6b4c3b", lineHeight: 1.8, marginBottom: "24px" }}>
              Have a project in mind or just want to chat? I'd love to hear from you. Drop me a message and I'll get back within 24 hours.
            </p>
            {[
              { icon: "📧", label: "anishrajcareers@gmail.com" },
              { icon: "📍", label: "Chennai, Tamil Nadu, India" },
              { icon: "💼", label: "Open to work" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ color: "#6b4c3b", fontSize: "15px" }}>{item.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { id: "name",  label: "Your Name", type: "text" },
              { id: "email", label: "Email",     type: "email" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#c97b63", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  value={formData[f.id]}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                  style={{ width: "100%", padding: "12px 16px", fontSize: "15px", border: "1.5px solid #f0bba8", borderRadius: "12px", background: "#fff", color: "#2a1a14", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s" }}
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#c97b63", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Message
              </label>
              <textarea
                id="message"
                rows={10}
                value={formData.message}
                onChange={handleFormChange}
                required
                className="form-input"
                style={{ width: "100%", padding: "12px 16px", fontSize: "15px", border: "1.5px solid #f0bba8", borderRadius: "12px", background: "#fff", color: "#2a1a14", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s" }}
              />
            </div>
            <button
  type="submit"
  className="primary-btn"
  style={{
    background: sent ? "#7bbf7b" : "#c97b63",
    color: "#fff",
    border: "2px solid #c97b63",
    borderRadius: "50px",
    padding: "14px 32px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "background 0.3s"
  }}
>Send Message</button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "20px 2rem", borderTop: "1px solid #f0d6c8", color: "#a07060", fontSize: "14px" }}>
        <QuoteFooter />
        <p style={{ fontSize: "13px", marginTop: "20px" }}></p>
      </footer>
    </div>
  );
}
