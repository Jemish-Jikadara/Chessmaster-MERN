import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.h-page{
  position:relative;
  background:#050510;
  color:#e8f4ff;
  font-family:'Inter', system-ui, sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}

/* Animated grid backdrop */
.h-page::before{
  content:'';
  position:fixed;
  inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  pointer-events:none;
  z-index:0;
  animation:h-grid 24s linear infinite;
}

.h-page::after{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
    radial-gradient(800px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%);
  pointer-events:none;
  z-index:0;
}

@keyframes h-grid{
  0%{ background-position:0 0, 0 0; }
  100%{ background-position:52px 52px, 52px 52px; }
}

.h-page > *{ position:relative; z-index:1; }
.h-page *{ box-sizing:border-box; }

.cm2-wrap{
  width:min(1240px, calc(100% - 40px));
  margin:0 auto;
}

.cm2-divider{
  height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,229,255,.35), rgba(255,45,149,.25), transparent);
  box-shadow:0 0 12px rgba(0,229,255,.25);
}

.cm2-section{
  padding:100px 0;
}

/* =========================================================
   EYEBROW
   ========================================================= */
.cm2-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:10px;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  line-height:1;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:18px;
}

.cm2-eyebrow::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.cm2-eyebrow::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

/* =========================================================
   HEADINGS
   ========================================================= */
.cm2-h1{
  margin:0;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(2.4rem, 5.4vw, 4.6rem);
  line-height:.98;
  letter-spacing:-0.015em;
  font-weight:800;
  text-transform:uppercase;
}

.cm2-h1 .cm2-accent{
  background:linear-gradient(90deg, #00e5ff, #a8f8ff, #ff2d95);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  filter:drop-shadow(0 0 24px rgba(0,229,255,.35));
}

.cm2-h2{
  margin:0;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.8rem, 3.6vw, 3rem);
  line-height:1.05;
  letter-spacing:-0.005em;
  font-weight:800;
  text-transform:uppercase;
}

.cm2-h2 .cm2-accent{
  background:linear-gradient(90deg, #00e5ff, #ff2d95);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  filter:drop-shadow(0 0 20px rgba(0,229,255,.35));
}

.cm2-sub{
  max-width:620px;
  margin:22px 0 0;
  color:#b8c6dd;
  font-size:16px;
  line-height:1.75;
}

/* =========================================================
   TECH PILLS
   ========================================================= */
.tech-pills{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:26px;
}

.cm2-pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:32px;
  padding:0 14px;
  border-radius:4px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11.5px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.14em;
  border:1px solid transparent;
  transition:box-shadow .18s ease, transform .18s ease;
}

.cm2-pill:hover{
  transform:translateY(-2px);
}

.cm2-pill-brass{
  color:#050510;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  border-color:rgba(0,229,255,.5);
  box-shadow:0 0 16px rgba(0,229,255,.4);
}

.cm2-pill-sage{
  color:#a8f8ff;
  background:rgba(0,229,255,.08);
  border-color:rgba(0,229,255,.35);
  box-shadow:inset 0 0 10px rgba(0,229,255,.12);
}

.cm2-pill-rust{
  color:#ff6bb0;
  background:rgba(255,45,149,.08);
  border-color:rgba(255,45,149,.35);
  box-shadow:inset 0 0 10px rgba(255,45,149,.12);
}

/* =========================================================
   HERO
   ========================================================= */
.a-hero{
  position:relative;
  padding:100px 0 80px;
}

.a-grid{
  display:grid;
  grid-template-columns:minmax(0,1.05fr) minmax(320px,0.95fr);
  gap:56px;
  align-items:center;
  position:relative;
  z-index:1;
}

/* =========================================================
   PANEL (HUD card)
   ========================================================= */
.panel{
  position:relative;
  height:100%;
  padding:26px;
  border-radius:8px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.04)),
    #08081a;
  border:1px solid rgba(0,229,255,.3);
  box-shadow:
    0 0 40px rgba(0,229,255,.15),
    0 0 90px rgba(255,45,149,.08),
    inset 0 0 40px rgba(0,229,255,.04);
  transition:transform .22s ease, border-color .22s ease, box-shadow .22s ease;
  overflow:hidden;
}

.panel::before,
.panel::after{
  content:'';
  position:absolute;
  width:18px;
  height:18px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.7));
  pointer-events:none;
}
.panel::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.panel::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.panel:hover{
  transform:translateY(-4px);
  border-color:rgba(0,229,255,.6);
  box-shadow:
    0 0 50px rgba(0,229,255,.28),
    0 0 100px rgba(255,45,149,.12),
    inset 0 0 50px rgba(0,229,255,.06);
}

.panel-title{
  margin:0 0 18px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:14px;
  font-weight:800;
  letter-spacing:.06em;
  text-transform:uppercase;
}

.feature-list{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.feature-item{
  display:flex;
  align-items:flex-start;
  gap:12px;
  padding:13px 15px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.14);
  border-radius:6px;
  transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
}

.feature-item:hover{
  border-color:rgba(0,229,255,.5);
  background:rgba(0,229,255,.08);
  box-shadow:0 0 20px rgba(0,229,255,.15);
}

.fi-icon{
  width:32px;
  height:32px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:15px;
  flex-shrink:0;
  border:1px solid rgba(0,229,255,.22);
  background:rgba(0,229,255,.06) !important;
}

.fi-content h4{
  margin:0 0 3px;
  color:#fff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
}

.fi-content p{
  margin:0;
  color:#7d8ba8;
  font-size:12.5px;
  line-height:1.55;
}

/* =========================================================
   STATS
   ========================================================= */
.stats-wrap{
  border-top:1px solid rgba(0,229,255,.14);
  border-bottom:1px solid rgba(0,229,255,.14);
  background:rgba(0,229,255,.02);
}

.stats-inner{
  padding:60px 0;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:0;
}

.stat-card{
  text-align:center;
  padding:22px 14px;
  border-right:1px solid rgba(0,229,255,.14);
  transition:background .22s ease;
}
.stat-card:last-child{ border-right:0; }
.stat-card:hover{ background:rgba(0,229,255,.05); }

.stat-num{
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:2.4rem;
  line-height:1;
  font-weight:800;
  margin-bottom:8px;
  text-shadow:0 0 14px rgba(0,229,255,.45);
}

.stat-label{
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:.16em;
  font-weight:600;
}

/* =========================================================
   PHILOSOPHY
   ========================================================= */
.phil-grid{
  display:grid;
  grid-template-columns:0.9fr 1.1fr;
  gap:56px;
  margin-top:36px;
}

.phil-list{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.phil-row{
  display:flex;
  gap:16px;
  align-items:flex-start;
  padding:16px 18px;
  border-radius:6px;
  background:rgba(0,229,255,.025);
  border:1px solid rgba(0,229,255,.14);
  transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
}

.phil-row:hover{
  border-color:rgba(0,229,255,.45);
  background:rgba(0,229,255,.06);
  box-shadow:0 0 22px rgba(0,229,255,.15);
}

.phil-mark{
  color:#00e5ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:13px;
  font-weight:900;
  padding-top:2px;
  text-shadow:0 0 12px rgba(0,229,255,.65);
  min-width:28px;
}

.phil-row p{
  margin:0;
  color:#b8c6dd;
  font-size:13.5px;
  line-height:1.7;
}

.phil-row strong{
  color:#fff;
  font-weight:800;
  font-family:'Chakra Petch', system-ui, sans-serif;
  letter-spacing:.04em;
}

/* =========================================================
   TECH STACK
   ========================================================= */
.tech-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
  margin-top:40px;
}

.tc-card{
  position:relative;
  height:100%;
  padding:24px 22px;
  border-radius:8px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
    #0a0a1e;
  border:1px solid rgba(0,229,255,.22);
  transition:transform .22s ease, border-color .22s ease, box-shadow .22s ease;
  overflow:hidden;
}

.tc-card::before{
  content:'';
  position:absolute;
  top:0; left:0; right:0;
  height:2px;
  background:linear-gradient(90deg, #00e5ff, #ff2d95);
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .3s ease;
}
.tc-card:hover::before{ transform:scaleX(1); }

.tc-card:hover{
  transform:translateY(-5px);
  border-color:rgba(0,229,255,.55);
  box-shadow:
    0 0 30px rgba(0,229,255,.28),
    0 0 60px rgba(139,92,246,.15),
    0 20px 40px rgba(0,0,0,.5);
}

.tc-head{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}

.tc-icon{
  width:42px;
  height:42px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:18px;
  border:1px solid rgba(0,229,255,.28);
  background:rgba(0,229,255,.08) !important;
  box-shadow:inset 0 0 16px rgba(0,229,255,.12);
}

.tc-label{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10px;
  color:#00e5ff;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:3px;
  font-weight:700;
}

.tc-name{
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:14px;
  font-weight:800;
  letter-spacing:.02em;
  text-transform:uppercase;
}

.tc-desc{
  margin:0;
  color:#7d8ba8;
  font-size:12.5px;
  line-height:1.65;
}

/* =========================================================
   CTA
   ========================================================= */
.about-cta-wrap{
  position:relative;
  padding:110px 0 120px;
  text-align:center;
}

.about-cta-inner{
  position:relative;
  z-index:1;
  width:min(720px, calc(100% - 40px));
  margin:0 auto;
  padding:60px 44px;
  border-radius:8px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.05)),
    #08081a;
  border:1px solid rgba(0,229,255,.35);
  box-shadow:
    0 0 60px rgba(0,229,255,.18),
    0 0 120px rgba(255,45,149,.1),
    inset 0 0 60px rgba(0,229,255,.06);
}

.about-cta-inner::before,
.about-cta-inner::after{
  content:'';
  position:absolute;
  width:28px; height:28px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 10px rgba(0,229,255,.8));
  pointer-events:none;
}
.about-cta-inner::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.about-cta-inner::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.cta-btns{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:34px;
}

/* =========================================================
   BUTTONS (mirrors Home)
   ========================================================= */
.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:48px;
  padding:0 24px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  border:1px solid transparent;
  cursor:pointer;
  position:relative;
  transition:transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease;
  overflow:hidden;
}

.cm2-btn:hover{ transform:translateY(-2px); }

.cm2-btn-primary{
  color:#050510;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  box-shadow:
    0 0 20px rgba(0,229,255,.55),
    0 0 44px rgba(0,229,255,.25),
    inset 0 0 10px rgba(255,255,255,.4);
}
.cm2-btn-primary:hover{
  box-shadow:
    0 0 30px rgba(0,229,255,.8),
    0 0 60px rgba(0,229,255,.4),
    inset 0 0 12px rgba(255,255,255,.55);
}

.cm2-btn-primary::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transform:translateX(-100%);
  transition:transform .5s ease;
}
.cm2-btn-primary:hover::after{ transform:translateX(100%); }

.cm2-btn-secondary{
  color:#00e5ff;
  background:rgba(0,229,255,.05);
  border-color:rgba(0,229,255,.35);
  box-shadow:inset 0 0 12px rgba(0,229,255,.12);
}
.cm2-btn-secondary:hover{
  background:rgba(0,229,255,.12);
  border-color:#00e5ff;
  color:#a8f8ff;
  box-shadow:
    inset 0 0 20px rgba(0,229,255,.2),
    0 0 22px rgba(0,229,255,.35);
}

/* Corner brackets */
.cm2-corners{ position:relative; }
.cm2-corners::before,
.cm2-corners::after{
  content:'';
  position:absolute;
  width:8px; height:8px;
  border:1px solid currentColor;
  opacity:0.55;
  pointer-events:none;
}
.cm2-corners::before{
  top:3px; left:3px;
  border-right:0; border-bottom:0;
}
.cm2-corners::after{
  bottom:3px; right:3px;
  border-left:0; border-top:0;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:1000px){
  .a-hero{ padding:72px 0 60px; }
  .a-grid{
    grid-template-columns:1fr;
    gap:44px;
    text-align:center;
  }
  .tech-pills,
  .cta-btns{
    justify-content:center;
  }
  .cm2-sub{
    margin-left:auto;
    margin-right:auto;
  }
  .phil-grid{
    grid-template-columns:1fr;
    gap:32px;
  }
}

@media (max-width:820px){
  .stats-inner{
    grid-template-columns:repeat(2,1fr);
  }
  .stat-card:nth-child(2){ border-right:0; }
  .stat-card:nth-child(1),
  .stat-card:nth-child(2){ border-bottom:1px solid rgba(0,229,255,.14); }
  .tech-grid{
    grid-template-columns:1fr;
  }
  .cm2-h1{ font-size:clamp(1.9rem, 8vw, 2.9rem); }
}

@media (max-width:560px){
  .cm2-wrap{ width:calc(100% - 24px); }
  .a-hero{ padding:52px 0 44px; }
  .cm2-section{ padding:64px 0; }
  .panel{ padding:20px; }
  .about-cta-inner{ padding:44px 22px; }
  .about-cta-wrap{ padding:80px 0 88px; }
  .phil-row{ padding:14px 16px; }
}
`;

const About = () => {
  const { user } = useAuth();

  const features = [
    { icon: '♟', title: 'Interactive Board', desc: 'Click or drag pieces, legal move hints, check highlights.' },
    { icon: '⬢', title: '32 AI Bots (Stockfish)', desc: 'Rated 100–3200, powered by the world\'s strongest engine.' },
    { icon: '◈', title: 'Online Multiplayer', desc: 'Live games over Socket.IO, no page refresh required.' },
    { icon: '⟐', title: 'Friends & Challenges', desc: 'Search players, send requests, challenge from your list.' },
    { icon: '⏱', title: 'Time Controls', desc: 'Rapid, Blitz, Bullet — full clock logic with increment.' },
    { icon: '◐', title: 'Board Themes', desc: '6 themes saved per user — Classic to Walnut.' },
    { icon: '▲', title: 'Leaderboard & Ratings', desc: 'Every game saved to MongoDB with wins, losses, draws.' },
  ];

  const techStack = [
    { icon: '⬢', label: 'Runtime', name: 'Node.js', desc: 'Server-side JavaScript runtime powering the entire backend.' },
    { icon: '⚡', label: 'Framework', name: 'Express.js', desc: 'Handles routing, middleware, sessions, and API endpoints.' },
    { icon: '◈', label: 'Database', name: 'MongoDB', desc: 'Stores users, games, ratings, and settings with Mongoose.' },
    { icon: '⚛', label: 'Frontend', name: 'React', desc: 'A component-based single-page app that talks to the backend over a JSON API.' },
    { icon: '⟐', label: 'Realtime', name: 'Socket.IO', desc: 'Powers online multiplayer rooms and live move syncing.' },
    { icon: '♞', label: 'AI Engine', name: 'Stockfish', desc: 'World\'s strongest chess engine, run client-side via a Web Worker.' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        {/* HERO */}
        <section className="a-hero">
          <div className="cm2-wrap a-grid">
            <div>
              <span className="cm2-eyebrow">About ChessMaster</span>
              <h1 className="cm2-h1">
                A full-stack chessboard,<br />
                <span className="cm2-accent">built by hand.</span>
              </h1>
              <p className="cm2-sub" style={{ maxWidth: 'none' }}>
                No chess.com API, no drag-and-drop library, no framework doing
                the hard part for us. ChessMaster is a React frontend talking
                to an Express + MongoDB API over sockets and JSON — real move
                validation and a real AI opponent, written from scratch.
              </p>
              <div className="tech-pills">
                <span className="cm2-pill cm2-pill-brass">Node.js</span>
                <span className="cm2-pill cm2-pill-sage">Express</span>
                <span className="cm2-pill cm2-pill-rust">MongoDB</span>
                <span className="cm2-pill cm2-pill-brass">React</span>
                <span className="cm2-pill cm2-pill-sage">Socket.IO</span>
                <span className="cm2-pill cm2-pill-rust">Stockfish</span>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">What's inside</div>
              <div className="feature-list">
                {features.map((f, i) => (
                  <div key={i} className="feature-item">
                    <div className="fi-icon">{f.icon}</div>
                    <div className="fi-content">
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="cm2-wrap"><div className="cm2-divider"></div></div>

        {/* STATS */}
        <div className="stats-wrap">
          <div className="cm2-wrap stats-inner">
            <div className="stat-card"><div className="stat-num">32</div><div className="stat-label">AI Bots</div></div>
            <div className="stat-card"><div className="stat-num">06</div><div className="stat-label">Board Themes</div></div>
            <div className="stat-card"><div className="stat-num">03</div><div className="stat-label">Time Controls</div></div>
            <div className="stat-card"><div className="stat-num">FREE</div><div className="stat-label">Forever</div></div>
          </div>
        </div>

        {/* PHILOSOPHY */}
        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow">Why it's built this way</span>
            <h2 className="cm2-h2">Every piece has a reason to be there</h2>
            <div className="phil-grid">
              <p className="cm2-sub" style={{ maxWidth: 'none' }}>
                Chess sites are usually one of two things: a bloated SaaS
                product, or a bare board demo with no accounts and no memory.
                ChessMaster sits in between — small enough to read in an
                afternoon, complete enough to actually play on.
              </p>
              <div className="phil-list">
                <div className="phil-row">
                  <span className="phil-mark">01</span>
                  <p><strong>Sessions, not tokens.</strong> Login uses signed,
                    MongoDB-backed sessions — your game state survives a
                    refresh without any client-side auth logic.</p>
                </div>
                <div className="phil-row">
                  <span className="phil-mark">02</span>
                  <p><strong>Rooms, not polling.</strong> Online games run on
                    Socket.IO rooms — moves push to your opponent the instant
                    you make them, no refresh, no delay.</p>
                </div>
                <div className="phil-row">
                  <span className="phil-mark">03</span>
                  <p><strong>A real engine, not a script.</strong> Bots aren't
                    scripted "AI" — they're Stockfish running in a Web Worker,
                    tuned across 32 rating bands.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="cm2-wrap"><div className="cm2-divider"></div></div>

        {/* TECH STACK */}
        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow">Tech stack</span>
            <h2 className="cm2-h2">Built with modern web tech</h2>
            <p className="cm2-sub">
              A React single-page app on the frontend,
              real chess logic, and a live socket connection where it matters.
            </p>

            <div className="tech-grid">
              {techStack.map((t, i) => (
                <div key={i} className="tc-card">
                  <div className="tc-head">
                    <div className="tc-icon">{t.icon}</div>
                    <div>
                      <div className="tc-label">{t.label}</div>
                      <div className="tc-name">{t.name}</div>
                    </div>
                  </div>
                  <p className="tc-desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="about-cta-wrap">
          <div className="about-cta-inner">
            <span className="cm2-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
              Ready to play
            </span>
            <h2 className="cm2-h1" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
              Ready to make<br /><span className="cm2-accent">your first move?</span>
            </h2>
            <p className="cm2-sub" style={{ margin: '18px auto 0' }}>
              Free to play, forever. Create an account and jump straight to the
              board.
            </p>
            <div className="cta-btns">
              <Link
                to={user ? '/play' : '/register'}
                className="cm2-btn cm2-btn-primary cm2-corners"
              >
                ▶ {user ? 'Play Now' : 'Get Started Free'}
              </Link>
              <Link to="/" className="cm2-btn cm2-btn-secondary cm2-corners">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;