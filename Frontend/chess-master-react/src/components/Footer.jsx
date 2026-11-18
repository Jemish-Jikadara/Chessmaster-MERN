import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  {
    title: 'Play',
    links: [
      { to: '/play', label: 'Local Duel' },
      { to: '/play', label: 'Bot Arena' },
      { to: '/online', label: 'Online PvP' },
      { to: '/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/friends', label: 'Friends' },
      { to: '/profile', label: 'Profile' },
      { to: '/leaderboard', label: 'Rankings' },
      { to: '/register', label: 'Register' },
    ],
  },
  {
    title: 'Info',
    links: [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Sign In' },
      { to: '/about', label: 'about' }
    ],
  },
];

const Footer = () => {
  return (
    <>
      <footer className="cf-footer">
        <div className="cf-wrap">
          {/* Status bar */}
          <div className="cf-status-bar">
            <span className="cf-dot" />
            All Systems Nominal
          </div>

          {/* Main grid */}
          <div className="cf-footer-grid">
            <div>
              <Link to="/" className="cf-logo">
                <span className="cf-logo-mark">♞</span>
                ChessMaster
              </Link>
              <p className="cf-footer-brand">
                A modern chess combat platform for players at every level.
                Free forever, built for real games.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="cf-footer-col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="cf-footer-bottom">
            <span>© {new Date().getFullYear()} ChessMaster // All Rights Reserved</span>
            <div className="cf-socials">
              <a href="#" className="cf-social" aria-label="Twitter">𝕏</a>
              <a href="#" className="cf-social" aria-label="Discord">◆</a>
              <a href="#" className="cf-social" aria-label="GitHub">⌘</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        .cf-wrap{
          width:min(1240px, calc(100% - 40px));
          margin:0 auto;
        }

        /* =========================================================
           FOOTER
           ========================================================= */
        .cf-footer{
          border-top:1px solid rgba(0,229,255,0.14);
          background:rgba(3,3,10,0.9);
          padding:64px 0 24px;
          position:relative;
          font-family:'Inter', system-ui, sans-serif;
        }

        /* Neon top hairline */
        .cf-footer::before{
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:1px;
          background:linear-gradient(90deg,
            transparent,
            rgba(0,229,255,0.5),
            rgba(255,45,149,0.4),
            transparent);
          pointer-events:none;
        }

        /* =========================================================
           STATUS BAR
           ========================================================= */
        .cf-status-bar{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          padding:10px 16px;
          margin-bottom:44px;
          border:1px solid rgba(182,255,60,0.28);
          border-radius:4px;
          background:rgba(182,255,60,0.05);
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:10.5px;
          font-weight:700;
          letter-spacing:0.24em;
          text-transform:uppercase;
          color:#b6ff3c;
          width:max-content;
          margin-left:auto;
          margin-right:auto;
          box-shadow:inset 0 0 14px rgba(182,255,60,0.1);
        }

        .cf-dot{
          width:8px; height:8px;
          border-radius:50%;
          background:#b6ff3c;
          box-shadow:0 0 10px #b6ff3c;
          animation:cf-blink 1.4s ease-in-out infinite;
        }

        @keyframes cf-blink{
          0%,100%{ opacity:1; }
          50%{ opacity:0.3; }
        }

        /* =========================================================
           GRID
           ========================================================= */
        .cf-footer-grid{
          display:grid;
          grid-template-columns:1.4fr 1fr 1fr 1fr;
          gap:40px;
          margin-bottom:48px;
        }

        /* =========================================================
           LOGO
           ========================================================= */
        .cf-logo{
          display:inline-flex;
          align-items:center;
          gap:11px;
          color:#e8f4ff;
          text-decoration:none;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:800;
          font-size:17px;
          letter-spacing:0.06em;
          text-transform:uppercase;
          white-space:nowrap;
        }

        .cf-logo-mark{
          width:36px;
          height:36px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          border-radius:8px;
          color:#050510;
          background:linear-gradient(135deg, #00e5ff, #8b5cf6);
          font-size:18px;
          font-weight:900;
          position:relative;
          box-shadow:
            0 0 18px rgba(0,229,255,0.55),
            0 0 32px rgba(139,92,246,0.35),
            inset 0 0 10px rgba(255,255,255,0.35);
        }

        .cf-logo-mark::after{
          content:'';
          position:absolute;
          inset:-3px;
          border-radius:10px;
          border:1px solid rgba(0,229,255,0.35);
          pointer-events:none;
        }

        .cf-footer-brand{
          max-width:300px;
          color:#7d8ba8;
          font-size:13.5px;
          line-height:1.75;
          margin-top:16px;
        }

        /* =========================================================
           COLUMNS
           ========================================================= */
        .cf-footer-col h4{
          margin:0 0 18px;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:11px;
          font-weight:700;
          letter-spacing:0.24em;
          text-transform:uppercase;
          color:#00e5ff;
        }

        .cf-footer-col ul{
          list-style:none;
          margin:0; padding:0;
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .cf-footer-col a{
          color:#b8c6dd;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:13px;
          text-decoration:none;
          letter-spacing:0.06em;
          transition:color .18s ease, text-shadow .18s ease, padding-left .18s ease;
        }

        .cf-footer-col a:hover{
          color:#00e5ff;
          text-shadow:0 0 10px rgba(0,229,255,0.6);
          padding-left:4px;
        }

        /* =========================================================
           BOTTOM BAR
           ========================================================= */
        .cf-footer-bottom{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
          padding-top:26px;
          border-top:1px solid rgba(0,229,255,0.14);
          color:#5a6684;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:11.5px;
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        /* =========================================================
           SOCIALS
           ========================================================= */
        .cf-socials{
          display:flex;
          gap:10px;
        }

        .cf-social{
          width:38px;
          height:38px;
          border-radius:6px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(0,229,255,0.04);
          border:1px solid rgba(0,229,255,0.22);
          color:#00e5ff;
          text-decoration:none;
          transition:background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
        }

        .cf-social:hover{
          background:rgba(0,229,255,0.14);
          color:#a8f8ff;
          transform:translateY(-3px);
          box-shadow:0 0 20px rgba(0,229,255,0.4);
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:820px){
          .cf-footer-grid{
            grid-template-columns:1fr 1fr;
            gap:32px;
          }
        }

        @media (max-width:560px){
          .cf-wrap{ width:calc(100% - 24px); }
          .cf-footer{ padding:48px 0 20px; }
          .cf-footer-grid{
            grid-template-columns:1fr;
            gap:28px;
          }
          .cf-footer-bottom{
            justify-content:center;
            text-align:center;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;