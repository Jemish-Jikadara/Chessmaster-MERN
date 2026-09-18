import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageStyles = `
.h-page{
  --h-bg:#0f1411;
  --h-panel:#1b241d;
  --h-panel-2:#222d24;
  --h-line:rgba(255,255,255,0.09);
  --h-text:#f5f7f1;
  --h-muted:#aeb7aa;
  --h-soft:#d7ded0;
  --h-green:#81b64c;
  --h-green-2:#95c95e;
  --h-dark-green:#5d8b32;
  --h-gold:#f0c15b;
  --h-orange:#e58b42;
  background:
    linear-gradient(180deg,rgba(129,182,76,0.08),transparent 360px),
    radial-gradient(circle at 15% 8%,rgba(129,182,76,0.18),transparent 34%),
    radial-gradient(circle at 85% 12%,rgba(240,193,91,0.1),transparent 32%),
    var(--h-bg);
  color:var(--h-text);
  overflow:hidden;
}

.h-page *{ box-sizing:border-box; }

.cm2-wrap{
  width:min(1180px,calc(100% - 40px));
  margin:0 auto;
}

.cm2-divider{
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);
}

.cm2-section{
  padding:76px 0;
}

.cm2-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:var(--h-green-2);
  font-size:12px;
  line-height:1;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.14em;
  margin-bottom:18px;
}

.cm2-eyebrow .sq{
  width:9px;
  height:9px;
  border-radius:2px;
  background:var(--h-green);
  box-shadow:0 0 0 5px rgba(129,182,76,.12);
}

.cm2-h1{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2.7rem,6.2vw,5.7rem);
  line-height:.94;
  letter-spacing:0;
  font-weight:900;
}

.cm2-accent{
  color:var(--h-green-2);
}

.cm2-h2{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2rem,4vw,3.4rem);
  line-height:1.02;
  letter-spacing:0;
  font-weight:900;
}

.cm2-sub{
  max-width:620px;
  margin:22px 0 0;
  color:var(--h-muted);
  font-size:17px;
  line-height:1.72;
}

/* Tech pills */
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
  padding:0 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:850;
  text-transform:uppercase;
  letter-spacing:.08em;
  border:1px solid rgba(255,255,255,.12);
}

.cm2-pill-brass{
  color:#10180e;
  background:linear-gradient(180deg,#f0c15b,#d9a946);
  border-color:rgba(240,193,91,.35);
}

.cm2-pill-sage{
  color:#f4f7ef;
  background:rgba(129,182,76,.18);
  border-color:rgba(129,182,76,.35);
}

.cm2-pill-rust{
  color:#f4f7ef;
  background:rgba(229,139,66,.18);
  border-color:rgba(229,139,66,.35);
}

/* Hero */
.a-hero{
  position:relative;
  padding:88px 0 72px;
}

.a-hero::before{
  content:'';
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size:58px 58px;
  mask-image:linear-gradient(to bottom,#000,transparent 78%);
  pointer-events:none;
}

.a-grid{
  display:grid;
  grid-template-columns:minmax(0,1.05fr) minmax(320px,0.95fr);
  gap:56px;
  align-items:center;
  position:relative;
  z-index:1;
}

/* Panel */
.panel{
  position:relative;
  height:100%;
  padding:22px;
  border-radius:12px;
  background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 20px 44px rgba(0,0,0,.18);
  transition:transform .2s ease, border-color .2s ease, background .2s ease;
}

.panel:hover{
  transform:translateY(-4px);
  border-color:rgba(129,182,76,.34);
  background:linear-gradient(180deg,rgba(255,255,255,.095),rgba(255,255,255,.048));
}

.panel-title{
  margin:0 0 16px;
  color:var(--h-text);
  font-size:17px;
  font-weight:850;
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
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  transition:border-color .2s, background .2s;
}

.feature-item:hover{
  border-color:rgba(129,182,76,.34);
  background:rgba(129,182,76,.08);
}

.fi-icon{
  width:32px;
  height:32px;
  border-radius:9px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:15px;
  flex-shrink:0;
}

.fi-content h4{
  margin:0 0 2px;
  color:var(--h-text);
  font-size:13.5px;
  font-weight:850;
}

.fi-content p{
  margin:0;
  color:var(--h-muted);
  font-size:12px;
  line-height:1.5;
}

/* Stats */
.stats-wrap{
  border-top:1px solid var(--h-line);
  border-bottom:1px solid var(--h-line);
  background:rgba(255,255,255,.02);
}

.stats-inner{
  padding:56px 0;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:18px;
}

.stat-card{
  text-align:center;
  padding:22px 14px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:14px;
}

.stat-num{
  color:#ffffff;
  font-size:2.1rem;
  line-height:1;
  font-weight:900;
  margin-bottom:4px;
}

.stat-label{
  color:var(--h-muted);
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0.1em;
  font-weight:800;
}

/* Philosophy */
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
  gap:14px;
  align-items:flex-start;
}

.phil-mark{
  color:var(--h-green-2);
  font-size:12px;
  font-weight:850;
  padding-top:3px;
}

.phil-row p{
  margin:0;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.7;
}

.phil-row strong{
  color:var(--h-text);
  font-weight:850;
}

/* Tech stack */
.tech-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
  margin-top:34px;
}

.tc-head{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:12px;
}

.tc-icon{
  width:38px;
  height:38px;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:17px;
}

.tc-label{
  font-size:10px;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:0.1em;
  margin-bottom:2px;
  font-weight:800;
}

.tc-name{
  color:var(--h-text);
  font-size:15px;
  font-weight:850;
}

.tc-desc{
  margin:0;
  color:var(--h-muted);
  font-size:12px;
  line-height:1.6;
}

/* CTA */
.about-cta-wrap{
  position:relative;
  padding:90px 0 100px;
  text-align:center;
}

.about-cta-wrap::before{
  content:'';
  position:absolute;
  left:50%;
  top:50%;
  width:min(760px,90vw);
  height:360px;
  transform:translate(-50%,-50%);
  background:radial-gradient(ellipse,rgba(129,182,76,.18),transparent 68%);
  pointer-events:none;
}

.about-cta-inner{
  position:relative;
  z-index:1;
  width:min(680px,calc(100% - 40px));
  margin:0 auto;
}

.cta-btns{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:30px;
}

.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  min-height:48px;
  padding:0 20px;
  border-radius:8px;
  font-size:15px;
  font-weight:850;
  text-decoration:none;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
}

.cm2-btn:hover{
  transform:translateY(-2px);
}

.cm2-btn-primary{
  color:#10180e;
  background:linear-gradient(180deg,#9bd761,#7fb64a);
  box-shadow:0 16px 30px rgba(129,182,76,.25), inset 0 1px rgba(255,255,255,.45);
}

.cm2-btn-primary:hover{
  background:linear-gradient(180deg,#a8e372,#82bd4a);
  box-shadow:0 20px 38px rgba(129,182,76,.32), inset 0 1px rgba(255,255,255,.55);
}

.cm2-btn-secondary{
  color:#f4f7ef;
  background:rgba(255,255,255,.075);
  border-color:rgba(255,255,255,.13);
}

.cm2-btn-secondary:hover{
  background:rgba(255,255,255,.11);
  border-color:rgba(255,255,255,.2);
}

/* Responsive */
@media (max-width:960px){
  .a-hero{ padding:64px 0 58px; }
  .a-grid{
    grid-template-columns:1fr;
    gap:38px;
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
}

@media (max-width:820px){
  .stats-inner{
    grid-template-columns:repeat(2,1fr);
  }
  .phil-grid,
  .tech-grid{
    grid-template-columns:1fr;
  }
}

@media (max-width:560px){
  .cm2-wrap{
    width:min(100% - 24px,1180px);
  }
  .a-hero{
    padding:46px 0 44px;
  }
  .cm2-h1{
    font-size:clamp(2.35rem,13vw,3.7rem);
  }
  .cm2-sub{
    font-size:15px;
    line-height:1.65;
  }
  .cm2-section{
    padding:56px 0;
  }
  .panel,
  .cm2-card{
    padding:20px;
  }
  .about-cta-wrap{
    padding:68px 0 76px;
  }
}
`;

const About = () => {
  const { user } = useAuth();

  const features = [
    { icon: '♟', bg: 'rgba(201,162,39,0.15)', title: 'Interactive Board', desc: 'Click or drag pieces, legal move hints, check highlights.' },
    { icon: '🤖', bg: 'rgba(122,149,105,0.15)', title: '32 AI Bots (Stockfish)', desc: 'Rated 100–3200, powered by the world\'s strongest engine.' },
    { icon: '🌐', bg: 'rgba(181,84,31,0.16)', title: 'Online Multiplayer', desc: 'Live games over Socket.IO, no page refresh required.' },
    { icon: '🧑‍🤝‍🧑', bg: 'rgba(201,162,39,0.15)', title: 'Friends & Challenges', desc: 'Search players, send requests, challenge from your list.' },
    { icon: '⏱', bg: 'rgba(122,149,105,0.15)', title: 'Time Controls', desc: 'Rapid, Blitz, Bullet — full clock logic with increment.' },
    { icon: '🎨', bg: 'rgba(181,84,31,0.16)', title: 'Board Themes', desc: '6 themes saved per user — Classic to Walnut.' },
    { icon: '🏆', bg: 'rgba(201,162,39,0.15)', title: 'Leaderboard & Ratings', desc: 'Every game saved to MongoDB with wins, losses, draws.' },
  ];

  const techStack = [
    { icon: '🟢', bg: 'rgba(201,162,39,0.15)', label: 'Runtime', name: 'Node.js', desc: 'Server-side JavaScript runtime powering the entire backend.' },
    { icon: '⚡', bg: 'rgba(122,149,105,0.15)', label: 'Framework', name: 'Express.js', desc: 'Handles routing, middleware, sessions, and API endpoints.' },
    { icon: '🍃', bg: 'rgba(181,84,31,0.16)', label: 'Database', name: 'MongoDB', desc: 'Stores users, games, ratings, and settings with Mongoose.' },
    { icon: '⚛️', bg: 'rgba(201,162,39,0.15)', label: 'Frontend', name: 'React', desc: 'A component-based single-page app that talks to the backend over a JSON API.' },
    { icon: '🔌', bg: 'rgba(122,149,105,0.15)', label: 'Realtime', name: 'Socket.IO', desc: 'Powers online multiplayer rooms and live move syncing.' },
    { icon: '🤖', bg: 'rgba(181,84,31,0.16)', label: 'AI Engine', name: 'Stockfish', desc: 'World\'s strongest chess engine, run client-side via a Web Worker.' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        {/* HERO */}
        <section className="a-hero">
          <div className="cm2-wrap a-grid">
            <div>
              <span className="cm2-eyebrow"><span className="sq"></span>About ChessMaster</span>
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
                    <div className="fi-icon" style={{ background: f.bg }}>{f.icon}</div>
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
            <div className="stat-card"><div className="stat-num">6</div><div className="stat-label">Board Themes</div></div>
            <div className="stat-card"><div className="stat-num">3</div><div className="stat-label">Time Controls</div></div>
            <div className="stat-card"><div className="stat-num">100%</div><div className="stat-label">Free</div></div>
          </div>
        </div>

        {/* PHILOSOPHY */}
        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow"><span className="sq"></span>Why it's built this way</span>
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
            <span className="cm2-eyebrow"><span className="sq"></span>Tech stack</span>
            <h2 className="cm2-h2">Built with modern web tech</h2>
            <p className="cm2-sub">
              A React single-page app on the frontend,
              real chess logic, and a live socket connection where it matters.
            </p>

            <div className="tech-grid">
              {techStack.map((t, i) => (
                <div key={i} className="cm2-card" style={{
                  position:'relative',
                  height:'100%',
                  padding:'22px',
                  borderRadius:'12px',
                  background:'linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.04))',
                  border:'1px solid rgba(255,255,255,.1)',
                  boxShadow:'0 20px 44px rgba(0,0,0,.18)',
                  transition:'transform .2s ease, border-color .2s ease, background .2s ease'
                }}>
                  <div className="tc-head">
                    <div className="tc-icon" style={{ background: t.bg }}>{t.icon}</div>
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
            <span className="cm2-eyebrow" style={{ margin: '0 auto 16px' }}>
              <span className="sq"></span>Ready to play
            </span>
            <h2 className="cm2-h1" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
              Ready to make<br /><span className="cm2-accent">your first move?</span>
            </h2>
            <p className="cm2-sub" style={{ margin: '0 auto' }}>
              Free to play, forever. Create an account and jump straight to the
              board.
            </p>
            <div className="cta-btns">
              <Link to={user ? '/play' : '/register'} className="cm2-btn cm2-btn-primary">
                ♟ {user ? 'Play Now' : 'Get Started Free'}
              </Link>
              <Link to="/" className="cm2-btn cm2-btn-secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;