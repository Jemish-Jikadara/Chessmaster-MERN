import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      {/* Saare About page styles yahan hain - koi external CSS ki zaroorat nahi */}
      <style>{`
        .a-hero { position: relative; overflow: hidden; padding: 110px 0 70px; }
        .a-hero::before { content: ''; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%); top: -140px; right: -140px; pointer-events: none; }
        .a-hero::after { content: ''; position: absolute; width: 420px; height: 420px; background: radial-gradient(circle, rgba(122,149,105,0.13) 0%, transparent 70%); bottom: -40px; left: 2%; pointer-events: none; }
        .a-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: center; position: relative; z-index: 1; }
        @media (max-width: 940px) { .a-grid { grid-template-columns: 1fr; } }
        
        .tech-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 26px; }
        
        .panel { background: var(--cm-bg-2); border: 1px solid var(--cm-line); border-radius: 20px; padding: 26px; }
        .panel-title { font-family: var(--cm-serif); font-size: 17px; font-weight: 600; color: var(--cm-ink); margin-bottom: 18px; }
        .feature-list { display: flex; flex-direction: column; gap: 10px; }
        .feature-item { display: flex; align-items: flex-start; gap: 12px; padding: 13px 15px; background: rgba(243,234,217,0.02); border: 1px solid rgba(243,234,217,0.08); border-radius: 12px; transition: border-color .2s, background .2s; }
        .feature-item:hover { border-color: rgba(201,162,39,0.3); background: rgba(201,162,39,0.04); }
        .fi-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .fi-content h4 { font-family: var(--cm-serif); font-size: 13.5px; font-weight: 600; color: var(--cm-ink); margin-bottom: 2px; }
        .fi-content p { font-size: 12px; color: var(--cm-ink-dim); line-height: 1.5; }
        
        .stats-wrap { border-top: 1px solid var(--cm-line); border-bottom: 1px solid var(--cm-line); background: var(--cm-bg-2); }
        .stats-inner { padding: 56px 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        @media (max-width: 768px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { text-align: center; padding: 22px 14px; background: rgba(243,234,217,0.02); border: 1px solid rgba(243,234,217,0.08); border-radius: 14px; }
        .stat-num { font-family: var(--cm-serif); font-size: 2.1rem; font-weight: 700; margin-bottom: 4px; color: var(--cm-brass-lt); }
        .stat-label { font-size: 11px; color: var(--cm-ink-faint); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--cm-mono); }
        
        .phil-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 56px; margin-top: 36px; }
        @media (max-width: 900px) { .phil-grid { grid-template-columns: 1fr; } }
        .phil-list { display: flex; flex-direction: column; gap: 20px; }
        .phil-row { display: flex; gap: 14px; align-items: flex-start; }
        .phil-mark { font-family: var(--cm-mono); font-size: 12px; color: var(--cm-brass-lt); padding-top: 3px; }
        .phil-row p { font-size: 14px; color: var(--cm-ink-dim); line-height: 1.7; }
        .phil-row strong { color: var(--cm-ink); font-family: var(--cm-serif); font-weight: 600; }
        
        .tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 36px; }
        @media (max-width: 768px) { .tech-grid { grid-template-columns: 1fr; } }
        .tc-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .tc-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
        .tc-label { font-size: 10px; color: var(--cm-ink-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; font-family: var(--cm-mono); }
        .tc-name { font-family: var(--cm-serif); font-size: 15px; font-weight: 600; color: var(--cm-ink); }
        .tc-desc { font-size: 12px; color: var(--cm-ink-dim); line-height: 1.6; }
        
        /* ====== CTA Section Fix ====== */
        .about-cta-wrap { padding: 90px 0; text-align: center; position: relative; overflow: hidden; }
        .about-cta-wrap::before { content: ''; position: absolute; width: 640px; height: 320px; background: radial-gradient(ellipse, rgba(201,162,39,0.12) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .about-cta-inner { position: relative; z-index: 1; max-width: 520px; margin: 0 auto; }
        .about-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 26px; }
      `}</style>

      <main>
        {/* ====== HERO ====== */}
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

        {/* ====== STATS ====== */}
        <div className="stats-wrap">
          <div className="cm2-wrap stats-inner">
            <div className="stat-card"><div className="stat-num">32</div><div className="stat-label">AI Bots</div></div>
            <div className="stat-card"><div className="stat-num">6</div><div className="stat-label">Board Themes</div></div>
            <div className="stat-card"><div className="stat-num">3</div><div className="stat-label">Time Controls</div></div>
            <div className="stat-card"><div className="stat-num">100%</div><div className="stat-label">Free</div></div>
          </div>
        </div>

        {/* ====== PHILOSOPHY ====== */}
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

        {/* ====== TECH STACK ====== */}
        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow"><span className="sq"></span>Tech stack</span>
            <h2 className="cm2-h2">Built with modern web tech</h2>
            <p className="cm2-sub">A React single-page app on the frontend,
              real chess logic, and a live socket connection where it matters.</p>

            <div className="tech-grid">
              {techStack.map((t, i) => (
                <div key={i} className="cm2-card">
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

        {/* ====== CTA (Niche ka part - yeh fix ho gaya) ====== */}
        <div className="about-cta-wrap">
          <div className="about-cta-inner">
            <h2 className="cm2-h1" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
              Ready to make<br /><span className="cm2-accent">your first move?</span>
            </h2>
            <p className="cm2-sub" style={{ margin: '0 auto' }}>
              Free to play, forever. Create an account and jump straight to the
              board.
            </p>
            <div className="about-cta-btns">
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