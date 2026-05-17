/* Lave-Auto Ultranet — React app (single file) */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* -------------------------------- helpers ------------------------------- */

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useScrolled(threshold = 8) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return s;
}

function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.05)`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

/* Imagery — neutral car/detailing keywords, no recognizable branding */
const HERO_IMG = "assets/hero.jpg";
const ABOUT_IMG = "assets/about.jpg";

const GALLERY = [
  { before: "assets/g1-before.jpg", after: "assets/g1-after.jpg", ratio: "4/3" },
  { before: "assets/g2-before.jpg", after: "assets/g2-after.jpg", ratio: "1/1" },
  { before: "assets/g3-before.jpg", after: "assets/g3-after.jpg", ratio: "3/4" },
  { before: "assets/g4-before.jpg", after: "assets/g4-after.jpg", ratio: "4/3" },
  { before: "assets/g5-before.jpg", after: "assets/g5-after.jpg", ratio: "4/3" },
];

/* -------------------------------- icons --------------------------------- */
const Icon = {
  Spray: () => (
    <svg className="svc-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="20" width="18" height="26" rx="2" />
      <path d="M20 26h18" />
      <path d="M28 20v-6h6" />
      <path d="M34 14h8M34 17h6M34 11h7" />
      <path d="M44 9l4-2M44 12l5 1M44 15l4 3" />
    </svg>
  ),
  Seat: () => (
    <svg className="svc-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 14c0-2 2-4 4-4h6c2 0 4 2 4 4v18" />
      <path d="M14 32c0-2 2-4 4-4h14c2 0 4 2 4 4v8H14z" />
      <path d="M14 40v6M36 40v6" />
      <path d="M38 26l8-4M38 30l9 0" />
    </svg>
  ),
  Buff: () => (
    <svg className="svc-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="30" r="12" />
      <circle cx="28" cy="30" r="5" />
      <path d="M28 18V8" />
      <path d="M22 10h12" />
      <path d="M16 44l-4 4M40 44l4 4" />
    </svg>
  ),
  Shield: () => (
    <svg className="svc-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 8l16 6v14c0 10-8 18-16 20-8-2-16-10-16-20V14z" />
      <path d="M22 28l4 4 10-10" />
    </svg>
  ),
  Arrow: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
    </svg>
  ),
  FB: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.87v-6.98H8v-2.9h2.5V9.8c0-2.47 1.47-3.84 3.72-3.84 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.62.76-1.62 1.55v1.87h2.76l-.44 2.9h-2.32v6.98A10 10 0 0022 12z"/></svg>
  ),
  Insta: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>
  ),
  Pin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
};

const SERVICE_ICONS = [Icon.Spray, Icon.Seat, Icon.Buff, Icon.Shield];

/* -------------------------------- Nav ----------------------------------- */
function Nav({ t, lang, setLang, onBook }) {
  const scrolled = useScrolled(8);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")} aria-label="Primary">
      <a href="#top" className="nav-logo">
        <span className="wm">Lave-Auto Ultranet<small>SAINT-JÉRÔME · QC</small></span>
      </a>
      <div className="nav-links">
        <a href="#services" className="desktop-only">{t.nav.services}</a>
        <a href="#gallery" className="desktop-only">{t.nav.gallery}</a>
        <a href="#reviews" className="desktop-only">{t.nav.reviews}</a>
        <a href="#about" className="desktop-only">{t.nav.about}</a>
        <a href="#contact" className="desktop-only">{t.nav.contact}</a>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button onClick={() => setLang("fr")} className={lang === "fr" ? "active" : ""} aria-pressed={lang === "fr"}>FR</button>
          <button onClick={() => setLang("en")} className={lang === "en" ? "active" : ""} aria-pressed={lang === "en"}>EN</button>
        </div>
        <button className="btn btn-lime btn-sm" onClick={onBook}>{t.nav.book} <Icon.Arrow /></button>
      </div>
    </nav>
  );
}

/* -------------------------------- Hero ---------------------------------- */
function Hero({ t, onBook }) {
  const bg = useParallax();
  return (
    <header className="hero" id="top">
      <div ref={bg} className="hero-bg" style={{ backgroundImage: `url(${HERO_IMG})` }} aria-hidden="true" />
      <div className="hero-marquee" aria-hidden="true">
        <span className="track">DETAIL · POLISH · CERAMIC · PROTECT · DETAIL · POLISH · CERAMIC · PROTECT ·&nbsp;</span>
        <span className="track">DETAIL · POLISH · CERAMIC · PROTECT · DETAIL · POLISH · CERAMIC · PROTECT ·&nbsp;</span>
      </div>
      <div className="hero-inner">
        <span className="label">{t.hero.eyebrow}</span>
        <h1 className="display">
          <span className="line"><span>{t.hero.title_a}</span></span>
          <span className="line"><span>{t.hero.title_b}</span></span>
          <span className="line"><span className="accent">{t.hero.title_c}</span></span>
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-ctas">
          <a href="#services" className="btn btn-lime btn-lg">{t.hero.cta1} <Icon.Arrow /></a>
          <a href="tel:+14505302907" className="btn btn-ghost btn-lg"><Icon.Phone /> {t.hero.cta2}</a>
        </div>
      </div>
      <div className="hero-meta">
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="num">4,3 / 5</span>
        </div>
        <div className="city">Avis Google vérifiés</div>
      </div>
      <div className="hero-scroll">
        <span>{t.hero.scroll}</span>
        <span className="bar"></span>
      </div>
    </header>
  );
}

/* -------------------------------- Services ------------------------------ */
function Services({ t }) {
  const ref = useReveal();
  return (
    <section id="services" data-screen-label="03 Services">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <span className="label">{t.services.eyebrow}</span>
          <div>
            <h2 className="display">{t.services.title}</h2>
            <p className="lede">{t.services.lede}</p>
          </div>
        </div>
        <div className="services-grid">
          {t.services.items.map((s, i) => {
            const I = SERVICE_ICONS[i];
            return (
              <article className="svc-card" key={i}>
                <span className="svc-num">0{i + 1}</span>
                <I />
                <span className="svc-tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-foot">
                  <span className="price">{s.price}</span>
                  <span className="arrow"><Icon.Arrow /></span>
                </div>
              </article>
            );
          })}
        </div>
        <p className="svc-disclaimer">// {t.services.disclaimer}</p>
      </div>
    </section>
  );
}

/* -------------------------------- Gallery ------------------------------- */
function CompareCard({ item, t }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = (clientX) => {
    const el = wrapRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };
  const onDown = (e) => { dragging.current = true; update(e.clientX ?? e.touches?.[0]?.clientX); };
  const onMove = (e) => { if (!dragging.current) return; update(e.clientX ?? e.touches?.[0]?.clientX); };
  const onUp = () => { dragging.current = false; };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <figure className="g-card" ref={wrapRef} onMouseDown={onDown} onTouchStart={onDown}
      style={{ aspectRatio: item.ratio }} aria-label="Before / after comparison">
      <div className="imgs" style={{ height: "100%" }}>
        <img src={item.before} alt="" loading="lazy" draggable={false} onDragStart={(e) => e.preventDefault()} />
        <div className="after-wrap" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <img src={item.after} alt="" loading="lazy" draggable={false} onDragStart={(e) => e.preventDefault()} />
        </div>
        <span className="tag before">{t.gallery.tag_before}</span>
        <span className="tag after">{t.gallery.tag_after}</span>
        <div className="handle" style={{ left: `${pos}%` }} aria-hidden="true" />
      </div>
    </figure>
  );
}

function Gallery({ t }) {
  const ref = useReveal();
  return (
    <section id="gallery" data-screen-label="04 Gallery">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <span className="label">{t.gallery.eyebrow}</span>
          <div>
            <h2 className="display">{t.gallery.title}</h2>
            <p className="lede">{t.gallery.lede}</p>
          </div>
        </div>
        <div className="gallery">
          {GALLERY.map((g, i) => <CompareCard key={i} item={g} t={t} />)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Reviews ------------------------------- */
function Reviews({ t }) {
  const ref = useReveal();
  return (
    <section id="reviews" data-screen-label="05 Reviews">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <span className="label">{t.reviews.eyebrow}</span>
          <div>
            <h2 className="display">{t.reviews.title}</h2>
          </div>
        </div>
        <div className="review-grid">
          {t.reviews.quotes.map((q, i) => (
            <article className="review-card" key={i}>
              <div className="stars">★★★★★</div>
              <blockquote>“{q.text}”</blockquote>
              <div className="author">
                <div className="avatar">{q.author.charAt(0)}</div>
                <div>
                  <div className="author-name">{q.author}</div>
                  <div className="author-role">{q.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="review-stats">
          <div className="stat"><div className="v">392</div><div className="l">{t.reviews.stat_reviews}</div></div>
          <div className="stat"><div className="v lime">4,3 ★</div><div className="l">{t.reviews.stat_rating}</div></div>
          <div className="stat"><div className="v">QC</div><div className="l">{t.reviews.stat_city}</div></div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- About --------------------------------- */
function About({ t }) {
  const ref = useReveal();
  return (
    <section id="about" data-screen-label="06 About">
      <div className="wrap reveal" ref={ref}>
        <div className="about-grid">
          <div>
            <span className="label">{t.about.eyebrow}</span>
            <h2 className="display">{t.about.title}</h2>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <div className="about-stats">
              {t.about.stats.map((s, i) => (
                <div key={i}>
                  <div className="v">{s.v}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-photo" style={{ backgroundImage: `url(${ABOUT_IMG})` }}>
            <span className="caption">{t.about.caption}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Location ------------------------------ */
function Location({ t }) {
  const ref = useReveal();
  const mapsQ = "307+Rue+Scott,+Saint-J%C3%A9r%C3%B4me,+QC+J7Z+1H3";
  return (
    <section id="contact" data-screen-label="07 Location">
      <div className="wrap reveal" ref={ref}>
        <div className="section-head">
          <span className="label">{t.location.eyebrow}</span>
          <div>
            <h2 className="display">{t.location.title}</h2>
          </div>
        </div>
        <div className="loc-grid">
          <div className="loc-map">
            <iframe
              title="Google Map — 307 Rue Scott, Saint-Jérôme"
              src={`https://www.google.com/maps?q=${mapsQ}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="loc-info">
            <div className="info-card">
              <div className="label">{t.location.address_label}</div>
              <div className="v">{t.location.address}</div>
              <a className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} href={`https://www.google.com/maps?q=${mapsQ}`} target="_blank" rel="noreferrer">
                <Icon.Pin /> {t.location.directions}
              </a>
            </div>
            <div className="info-card">
              <div className="label">{t.location.phone_label}</div>
              <a className="v" href="tel:+14505302907">(450) 530-2907</a>
            </div>
            <div className="info-card">
              <div className="label">{t.location.email_label}</div>
              <a className="v" href="mailto:ultranetlaveauto@gmail.com">ultranetlaveauto@gmail.com</a>
            </div>
            <div className="info-card hours-card">
              <div className="label">{t.location.hours_label}</div>
              <table>
                <tbody>
                  {t.location.hours.map((h, i) => (
                    <tr key={i}><td>{h.d}</td><td>{h.h}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="note">// {t.location.hours_note}</div>
            </div>
            <div className="info-card">
              <div className="label">{t.location.social_label}</div>
              <div className="loc-socials">
                <a href="https://www.facebook.com/LaveautoUltranet" aria-label="Facebook" target="_blank" rel="noreferrer"><Icon.FB /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CTA ----------------------------------- */
function FinalCTA({ t }) {
  const ref = useReveal();
  return (
    <section className="cta-band" data-screen-label="08 CTA">
      <div className="wrap reveal" ref={ref}>
        <h2>{t.cta.title} <span className="accent">{t.cta.title_accent}</span></h2>
        <p className="sub">{t.cta.sub}</p>
        <div className="actions">
          <a href="tel:+14505302907" className="btn btn-lime btn-lg"><Icon.Phone /> {t.cta.call}</a>
          <a href="mailto:ultranetlaveauto@gmail.com" className="btn btn-ghost btn-lg"><Icon.Mail /> {t.cta.email}</a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Footer -------------------------------- */
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img src="assets/logo.jpg" alt="Lave-Auto Ultranet" className="footer-logo" />
            <p style={{ color: "var(--fg-muted)", fontSize: 13, maxWidth: 38 + "ch", marginTop: 4 }}>{t.footer.tag}</p>
          </div>
          <div>
            <h4>{t.nav.services}</h4>
            <ul>{t.services.items.map((s, i) => <li key={i}><a href="#services">{s.title}</a></li>)}</ul>
          </div>
          <div>
            <h4>{t.nav.contact}</h4>
            <ul>
              <li><a href="tel:+14505302907">(450) 530-2907</a></li>
              <li><a href="mailto:ultranetlaveauto@gmail.com">ultranetlaveauto@gmail.com</a></li>
              <li><a href="#contact">307 Rue Scott, Saint-Jérôme</a></li>
            </ul>
          </div>
          <div>
            <h4>Suivez · Follow</h4>
            <ul>
              <li><a href="https://www.facebook.com/LaveautoUltranet" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://www.google.com/maps" target="_blank" rel="noreferrer">Google Maps</a></li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} Lave-Auto Ultranet · {t.footer.rights}</span>
          <span>307 Rue Scott · Saint-Jérôme, QC</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------- Booking modal ------------------------- */
function Booking({ open, onClose, t, lang }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", service: t.services.items[0].title, date: "", note: "" });
  useEffect(() => { if (open) setStep(0); }, [open]);
  useEffect(() => { setForm((f) => ({ ...f, service: t.services.items[0].title })); }, [lang]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const labels = lang === "fr"
    ? { title: "Réserver un rendez-vous", sub: "Laissez-nous vos coordonnées — on vous rappelle dans la journée.", name: "Nom", phone: "Téléphone", service: "Service souhaité", date: "Date préférée", note: "Notes", submit: "Envoyer la demande", cancel: "Annuler", thanks: "Demande envoyée !", thanksSub: "Nous vous rappelons rapidement au numéro indiqué." }
    : { title: "Book an appointment", sub: "Drop your details — we'll call you back the same day.", name: "Name", phone: "Phone", service: "Service", date: "Preferred date", note: "Notes", submit: "Send request", cancel: "Cancel", thanks: "Request sent!", thanksSub: "We'll call you back at the number provided." };

  return (
    <div className={"modal-veil" + (open ? " open" : "")} onClick={onClose} role="dialog" aria-modal="true" aria-hidden={!open}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <button className="close-x" onClick={onClose} aria-label="Close">×</button>
        {step === 0 ? (
          <form onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
            <h3>{labels.title}</h3>
            <p className="sub">{labels.sub}</p>
            <label>{labels.name}</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Tremblay" />
            <label>{labels.phone}</label>
            <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(450) 555-0000" />
            <label>{labels.service}</label>
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
              {t.services.items.map((s) => <option key={s.title}>{s.title}</option>)}
            </select>
            <label>{labels.date}</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <label>{labels.note}</label>
            <textarea rows="3" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>{labels.cancel}</button>
              <button type="submit" className="btn btn-lime btn-sm">{labels.submit} <Icon.Arrow /></button>
            </div>
          </form>
        ) : (
          <div className="modal-success">
            <div className="check">✓</div>
            <h3>{labels.thanks}</h3>
            <p className="sub">{labels.thanksSub}</p>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button className="btn btn-lime btn-sm" onClick={onClose}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- App ----------------------------------- */
function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("ultranet:lang") || "fr"; } catch { return "fr"; }
  });
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("ultranet:lang", lang); } catch {}
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = window.I18N[lang];

  return (
    <React.Fragment>
      <div className="grain" />
      <Nav t={t} lang={lang} setLang={setLang} onBook={() => setBookOpen(true)} />
      <Hero t={t} onBook={() => setBookOpen(true)} />
      <Services t={t} />
      <Gallery t={t} />
      <Reviews t={t} />
      <About t={t} />
      <Location t={t} />
      <FinalCTA t={t} />
      <Footer t={t} />
      <Booking open={bookOpen} onClose={() => setBookOpen(false)} t={t} lang={lang} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
