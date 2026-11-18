import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const initials = user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <nav className="cn-nav">
        <div className="cn-wrap cn-nav-inner">
          <Link to="/" className="cn-logo">
            <span className="cn-logo-mark">♞</span>
            ChessMaster
          </Link>

          <ul className="cn-nav-links">
            <li><Link to="/play">Play</Link></li>
            <li><Link to="/online">Online</Link></li>
            <li><Link to="/leaderboard">Rankings</Link></li>
            <li><Link to="/friends">Friends</Link></li>
          </ul>

          <div className="cn-nav-actions">
            {user ? (
              <Link to="/profile" className="cn-avatar" title={user.username}>
                {initials}
              </Link>
            ) : (
              <>
                <Link to="/login" className="cn-btn cn-btn-sm cn-btn-outline cn-corners">
                  Sign In
                </Link>
                <Link to="/register" className="cn-btn cn-btn-sm cn-btn-cyber cn-corners">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        /* ---------- Layout wrapper (shared with Home) ---------- */
        .cn-wrap{
          width:min(1240px, calc(100% - 40px));
          margin:0 auto;
        }

        /* =========================================================
           NAV
           ========================================================= */
        .cn-nav{
          position:sticky;
          top:0;
          z-index:50;
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          background:rgba(5,5,16,0.78);
          border-bottom:1px solid rgba(0,229,255,0.14);
          font-family:'Inter', system-ui, sans-serif;
        }

        .cn-nav-inner{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          padding:14px 0;
        }

        .cn-logo{
          display:inline-flex;
          align-items:center;
          gap:11px;
          color:#e8f4ff;
          text-decoration:none;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:800;
          font-size:19px;
          letter-spacing:0.06em;
          text-transform:uppercase;
        }

        .cn-logo-mark{
          width:36px;
          height:36px;
          border-radius:8px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          position:relative;
          background:linear-gradient(135deg, #00e5ff, #8b5cf6);
          color:#050510;
          font-size:18px;
          font-weight:900;
          box-shadow:
            0 0 18px rgba(0,229,255,0.55),
            0 0 32px rgba(139,92,246,0.35),
            inset 0 0 10px rgba(255,255,255,0.35);
        }

        .cn-logo-mark::after{
          content:'';
          position:absolute;
          inset:-3px;
          border-radius:10px;
          border:1px solid rgba(0,229,255,0.35);
          pointer-events:none;
        }

        .cn-nav-links{
          display:flex;
          align-items:center;
          gap:26px;
          list-style:none;
          margin:0;
          padding:0;
        }

        .cn-nav-links a{
          color:#b8c6dd;
          text-decoration:none;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:13px;
          font-weight:600;
          letter-spacing:0.14em;
          text-transform:uppercase;
          position:relative;
          padding:4px 0;
          transition:color .18s ease, text-shadow .18s ease;
        }

        .cn-nav-links a::before{
          content:'>';
          position:absolute;
          left:-14px;
          opacity:0;
          color:#00e5ff;
          transition:opacity .18s ease;
        }

        .cn-nav-links a:hover{
          color:#00e5ff;
          text-shadow:0 0 12px rgba(0,229,255,0.7);
        }

        .cn-nav-links a:hover::before{
          opacity:1;
        }

        .cn-nav-actions{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .cn-avatar{
          width:38px;
          height:38px;
          border-radius:8px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg, #00e5ff, #8b5cf6);
          color:#050510;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:800;
          font-size:14px;
          border:1px solid rgba(0,229,255,0.5);
          box-shadow:
            0 0 16px rgba(0,229,255,0.5),
            inset 0 0 10px rgba(255,255,255,0.35);
          text-decoration:none;
          transition:transform .18s ease, box-shadow .22s ease;
        }

        .cn-avatar:hover{
          transform:translateY(-2px);
          box-shadow:
            0 0 26px rgba(0,229,255,0.9),
            inset 0 0 12px rgba(255,255,255,0.5);
        }

        /* =========================================================
           BUTTONS (mirrors Home)
           ========================================================= */
        .cn-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          min-height:46px;
          padding:0 22px;
          border-radius:6px;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:13px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
          text-decoration:none;
          border:1px solid transparent;
          cursor:pointer;
          position:relative;
          transition:transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease;
          white-space:nowrap;
          overflow:hidden;
        }

        .cn-btn:hover{ transform:translateY(-2px); }

        .cn-btn-sm{ min-height:38px; padding:0 16px; font-size:11.5px; }

        .cn-btn-cyber{
          color:#050510;
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          box-shadow:
            0 0 20px rgba(0,229,255,0.55),
            0 0 44px rgba(0,229,255,0.25),
            inset 0 0 10px rgba(255,255,255,0.4);
        }
        .cn-btn-cyber:hover{
          box-shadow:
            0 0 30px rgba(0,229,255,0.8),
            0 0 60px rgba(0,229,255,0.4),
            inset 0 0 12px rgba(255,255,255,0.55);
        }

        .cn-btn-cyber::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transform:translateX(-100%);
          transition:transform .5s ease;
        }
        .cn-btn-cyber:hover::after{ transform:translateX(100%); }

        .cn-btn-outline{
          color:#00e5ff;
          background:rgba(0,229,255,0.05);
          border-color:rgba(0,229,255,0.35);
          box-shadow:inset 0 0 12px rgba(0,229,255,0.12);
        }
        .cn-btn-outline:hover{
          background:rgba(0,229,255,0.12);
          border-color:#00e5ff;
          color:#a8f8ff;
          box-shadow:
            inset 0 0 20px rgba(0,229,255,0.2),
            0 0 22px rgba(0,229,255,0.35);
        }

        /* Corner brackets */
        .cn-corners{ position:relative; }
        .cn-corners::before,
        .cn-corners::after{
          content:'';
          position:absolute;
          width:8px; height:8px;
          border:1px solid currentColor;
          opacity:0.5;
          pointer-events:none;
        }
        .cn-corners::before{
          top:3px; left:3px;
          border-right:0; border-bottom:0;
        }
        .cn-corners::after{
          bottom:3px; right:3px;
          border-left:0; border-top:0;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:820px){
          .cn-nav-links{ display:none; }
        }

        @media (max-width:560px){
          .cn-wrap{ width:calc(100% - 24px); }
          .cn-nav-inner .cn-btn{ padding:0 12px; font-size:10.5px; letter-spacing:0.1em; }
          .cn-logo{ font-size:16px; }
          .cn-logo-mark{ width:32px; height:32px; font-size:16px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;