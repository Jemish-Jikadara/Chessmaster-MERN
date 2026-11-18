import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const THEMES = {
  classic: ['#f0d9b5', '#b58863'],
  midnight: ['#6b7fa3', '#2c3e6b'],
  forest: ['#ffffdd', '#6faa3f'],
  ocean: ['#d6eaf8', '#2e86c1'],
  ruby: ['#f5cba7', '#b91c1c'],
  walnut: ['#e8d5b0', '#6b4226'],
};

const Profile = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllGames, setShowAllGames] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/profile')
      .then((res) => {
        if (!mounted) return;
        setUser(res.data.user);
        setGames(res.data.games || []);
      })
      .catch(() => mounted && setError('Could not load your profile.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00e5ff',
        background: '#050510',
        fontFamily: "'Chakra Petch', system-ui, sans-serif",
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontSize: '13px',
        textShadow: '0 0 12px rgba(0,229,255,.6)',
      }}>
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6bb0',
        background: '#050510',
        fontFamily: "'Chakra Petch', system-ui, sans-serif",
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontSize: '13px',
        textShadow: '0 0 12px rgba(255,45,149,.6)',
      }}>
        {error || 'Profile not found.'}
      </div>
    );
  }

  const t = THEMES[user.boardTheme] || THEMES.classic;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --h-bg:#050510;
          --h-bg-2:#0a0a1e;
          --h-panel:#08081a;
          --h-line:rgba(0,229,255,0.14);
          --h-line-soft:rgba(255,255,255,0.06);
          --h-text:#e8f4ff;
          --h-muted:#7d8ba8;
          --h-soft:#b8c6dd;
          --h-cyan:#00e5ff;
          --h-cyan-2:#5cf0ff;
          --h-cyan-3:#a8f8ff;
          --h-pink:#ff2d95;
          --h-pink-2:#ff6bb0;
          --h-acid:#b6ff3c;
          --h-purple:#8b5cf6;
          --h-font-display:'Orbitron', system-ui, sans-serif;
          --h-font-tech:'Chakra Petch', system-ui, sans-serif;
          --h-font-body:'Inter', system-ui, sans-serif;
        }

        body {
          background:#050510;
          margin:0;
        }

        /* =========================================================
           BANNER
           ========================================================= */
        .profile-banner {
          background:
            radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
            radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
            #050510;
          border-bottom: 1px solid var(--h-line);
          padding: 56px 24px 0;
          position: relative;
          overflow: hidden;
        }

        .profile-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          pointer-events: none;
          animation: h-grid 24s linear infinite;
        }

        @keyframes h-grid {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 52px 52px, 52px 52px; }
        }

        .banner-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* =========================================================
           AVATAR ROW
           ========================================================= */
        .avatar-row {
          display: flex;
          align-items: flex-end;
          gap: 26px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00e5ff, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-family: var(--h-font-display);
          font-weight: 900;
          color: #050510;
          border: 2px solid rgba(0,229,255,0.6);
          box-shadow:
            0 0 22px rgba(0,229,255,0.6),
            0 0 44px rgba(139,92,246,0.35),
            inset 0 0 16px rgba(255,255,255,0.35);
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 12px;
          border: 1px solid rgba(0,229,255,0.4);
          pointer-events: none;
        }

        .profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .avatar-info {
          flex: 1;
          padding-bottom: 4px;
        }

        .profile-username {
          font-family: var(--h-font-display);
          font-size: clamp(1.7rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          text-shadow: 0 0 22px rgba(0,229,255,0.35);
        }

        .profile-fullname {
          font-family: var(--h-font-tech);
          font-size: 13px;
          color: var(--h-soft);
          margin-bottom: 12px;
          letter-spacing: 0.08em;
        }

        .profile-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--h-font-tech);
          font-size: 11px;
          color: var(--h-cyan-2);
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.28);
          padding: 5px 11px;
          border-radius: 4px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          box-shadow: inset 0 0 10px rgba(0,229,255,0.08);
        }

        .profile-bio {
          font-size: 14px;
          color: var(--h-soft);
          line-height: 1.7;
          margin-top: 12px;
          max-width: 560px;
          padding-bottom: 20px;
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .edit-profile-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          text-decoration: none;
          font-size: 15px;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.35);
          color: var(--h-cyan);
          transition: all .25s ease;
          font-weight: 800;
          box-shadow: inset 0 0 10px rgba(0,229,255,0.1);
        }

        .edit-profile-btn:hover {
          background: rgba(0,229,255,0.14);
          transform: rotate(-10deg) scale(1.08);
          border-color: var(--h-cyan);
          box-shadow:
            inset 0 0 14px rgba(0,229,255,0.2),
            0 0 18px rgba(0,229,255,0.5);
        }

        .profile-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-left: auto;
          align-self: flex-start;
          padding-top: 8px;
        }

        /* =========================================================
           TABS
           ========================================================= */
        .profile-tabs {
          display: flex;
          gap: 0;
          border-top: 1px solid var(--h-line);
          margin-top: 6px;
        }

        .tab {
          padding: 14px 22px;
          font-family: var(--h-font-tech);
          font-size: 11.5px;
          font-weight: 700;
          color: var(--h-muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          text-decoration: none;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .tab.active {
          color: var(--h-cyan);
          border-bottom-color: var(--h-cyan);
          text-shadow: 0 0 12px rgba(0,229,255,0.7);
        }

        .tab:hover {
          color: var(--h-cyan-2);
        }

        /* =========================================================
           BUTTONS
           ========================================================= */
        .btn-primary {
          padding: 10px 20px;
          background: linear-gradient(90deg, #00e5ff, #a8f8ff);
          border: none;
          border-radius: 6px;
          color: #050510;
          font-family: var(--h-font-tech);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow:
            0 0 18px rgba(0,229,255,0.45),
            inset 0 0 10px rgba(255,255,255,0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 28px rgba(0,229,255,0.75),
            0 0 50px rgba(0,229,255,0.35),
            inset 0 0 12px rgba(255,255,255,0.5);
        }

        .btn-secondary {
          padding: 10px 20px;
          background: rgba(0,229,255,0.05);
          border: 1px solid rgba(0,229,255,0.35);
          border-radius: 6px;
          color: var(--h-cyan);
          font-family: var(--h-font-tech);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: inset 0 0 10px rgba(0,229,255,0.1);
        }

        .btn-secondary:hover {
          background: rgba(0,229,255,0.12);
          border-color: var(--h-cyan);
          color: var(--h-cyan-3);
          box-shadow:
            inset 0 0 16px rgba(0,229,255,0.18),
            0 0 16px rgba(0,229,255,0.4);
        }

        .btn-danger {
          padding: 10px 20px;
          background: rgba(255,45,149,0.05);
          border: 1px solid rgba(255,45,149,0.35);
          border-radius: 6px;
          color: var(--h-pink-2);
          font-family: var(--h-font-tech);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: inset 0 0 10px rgba(255,45,149,0.08);
        }

        .btn-danger:hover {
          background: rgba(255,45,149,0.14);
          border-color: rgba(255,45,149,0.7);
          color: #ff9ecb;
          box-shadow:
            inset 0 0 16px rgba(255,45,149,0.15),
            0 0 18px rgba(255,45,149,0.4);
        }

        /* =========================================================
           PROFILE BODY
           ========================================================= */
        .profile-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .profile-body { grid-template-columns: 1fr; }
        }

        /* Section title */
        .sec-title {
          font-family: var(--h-font-display);
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sec-title a {
          font-family: var(--h-font-tech);
          font-size: 11px;
          color: var(--h-cyan);
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color .18s ease, text-shadow .18s ease;
        }

        .sec-title a:hover {
          color: var(--h-cyan-3);
          text-shadow: 0 0 10px rgba(0,229,255,0.7);
        }

        /* =========================================================
           RATINGS
           ========================================================= */
        .ratings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 26px;
        }

        @media (max-width: 560px) {
          .ratings-grid { grid-template-columns: 1fr; }
        }

        .rating-card {
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border: 1px solid rgba(0,229,255,0.22);
          border-radius: 8px;
          padding: 22px 18px;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .rating-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .rating-card:hover {
          border-color: rgba(0,229,255,0.6);
          transform: translateY(-3px);
          box-shadow:
            0 0 28px rgba(0,229,255,0.28),
            0 0 60px rgba(139,92,246,0.15),
            0 12px 30px rgba(0,0,0,0.4);
        }

        .rating-card:hover::before { opacity: 1; }

        .rc-1::before { background: linear-gradient(90deg, #00e5ff, #a8f8ff); }
        .rc-2::before { background: linear-gradient(90deg, #b6ff3c, #d4ff85); }
        .rc-3::before { background: linear-gradient(90deg, #ff2d95, #ff6bb0); }

        .rc-icon {
          font-family: var(--h-font-tech);
          font-size: 10px;
          color: var(--h-cyan);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 12px;
          opacity: 0.9;
        }

        .rc-mode {
          font-family: var(--h-font-tech);
          font-size: 10px;
          color: var(--h-muted);
          text-transform: uppercase;
          letter-spacing: 0.22em;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .rc-val {
          font-family: var(--h-font-display);
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 4px;
          color: #ffffff;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        .rc-val.brass {
          color: var(--h-cyan);
          text-shadow: 0 0 16px rgba(0,229,255,0.55);
        }
        .rc-val.sage {
          color: var(--h-acid);
          text-shadow: 0 0 16px rgba(182,255,60,0.55);
        }
        .rc-val.rust {
          color: var(--h-pink-2);
          text-shadow: 0 0 16px rgba(255,45,149,0.55);
        }

        .rc-sub {
          font-family: var(--h-font-tech);
          font-size: 10px;
          color: var(--h-muted);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* =========================================================
           W/L/D STATS
           ========================================================= */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }

        .stat-box {
          background: rgba(0,229,255,0.025);
          border: 1px solid rgba(0,229,255,0.16);
          border-radius: 6px;
          padding: 18px 12px;
          text-align: center;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-box:hover {
          border-color: rgba(0,229,255,0.4);
          box-shadow: 0 0 18px rgba(0,229,255,0.18);
        }

        .sb-val {
          font-family: var(--h-font-display);
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .sb-val.green {
          color: var(--h-acid);
          text-shadow: 0 0 14px rgba(182,255,60,0.5);
        }
        .sb-val.red {
          color: var(--h-pink-2);
          text-shadow: 0 0 14px rgba(255,45,149,0.5);
        }
        .sb-val.gray {
          color: var(--h-muted);
        }

        .sb-label {
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          color: var(--h-muted);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-top: 8px;
          font-weight: 700;
        }

        /* =========================================================
           TABLE
           ========================================================= */
        .table-wrap {
          background: rgba(5,5,16,0.75);
          border: 1px solid rgba(0,229,255,0.25);
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 0 30px rgba(0,229,255,0.12),
            inset 0 0 30px rgba(0,229,255,0.04);
        }

        .profile-body table {
          width: 100%;
          border-collapse: collapse;
        }

        .profile-body thead {
          background: rgba(0,229,255,0.06);
          border-bottom: 1px solid rgba(0,229,255,0.22);
        }

        .profile-body th {
          padding: 12px 14px;
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--h-cyan);
          text-align: left;
        }

        .profile-body td {
          padding: 13px 14px;
          font-size: 13px;
          color: var(--h-text);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .profile-body tr:last-child td { border-bottom: none; }
        .profile-body tr:hover td { background: rgba(0,229,255,0.05); }

        .td-p {
          color: #ffffff;
          font-family: var(--h-font-tech);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .bw {
          padding: 3px 10px;
          background: rgba(0,229,255,0.1);
          border: 1px solid rgba(0,229,255,0.4);
          border-radius: 4px;
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          font-weight: 700;
          color: var(--h-cyan-3);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          box-shadow: inset 0 0 8px rgba(0,229,255,0.15);
        }

        .bb {
          padding: 3px 10px;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.4);
          border-radius: 4px;
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          font-weight: 700;
          color: #c4b5fd;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          box-shadow: inset 0 0 8px rgba(139,92,246,0.15);
        }

        .bd {
          padding: 3px 10px;
          background: rgba(182,255,60,0.1);
          border: 1px solid rgba(182,255,60,0.4);
          border-radius: 4px;
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          font-weight: 700;
          color: var(--h-acid);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          box-shadow: inset 0 0 8px rgba(182,255,60,0.15);
        }

        .btn-watch {
          padding: 5px 12px;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.3);
          border-radius: 4px;
          color: var(--h-cyan);
          font-family: var(--h-font-tech);
          font-size: 10.5px;
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .btn-watch:hover {
          background: rgba(0,229,255,0.14);
          border-color: var(--h-cyan);
          color: var(--h-cyan-3);
          box-shadow: 0 0 14px rgba(0,229,255,0.5);
        }

        .empty-row {
          text-align: center;
          color: var(--h-muted);
          padding: 40px !important;
          font-family: var(--h-font-tech);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 12px;
        }

        /* =========================================================
           RIGHT COLUMN
           ========================================================= */
        .right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .side-card {
          background:
            linear-gradient(180deg, rgba(0,229,255,.05), rgba(139,92,246,.025)),
            #08081a;
          border: 1px solid rgba(0,229,255,0.22);
          border-radius: 8px;
          padding: 20px;
          position: relative;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .side-card:hover {
          border-color: rgba(0,229,255,0.45);
          box-shadow: 0 0 24px rgba(0,229,255,0.18);
        }

        .side-card-title {
          font-family: var(--h-font-display);
          font-size: 11px;
          font-weight: 800;
          color: var(--h-cyan);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          text-shadow: 0 0 10px rgba(0,229,255,0.5);
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid rgba(0,229,255,0.1);
        }

        .info-row:last-child { border-bottom: none; }

        .ir-label {
          font-family: var(--h-font-tech);
          font-size: 11px;
          color: var(--h-muted);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ir-value {
          font-family: var(--h-font-tech);
          font-size: 12px;
          color: var(--h-text);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .mini-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-radius: 6px;
          overflow: hidden;
          margin: 12px 0;
          border: 1px solid rgba(0,229,255,0.28);
          box-shadow: 0 0 18px rgba(0,229,255,0.18);
        }

        .mb-sq { aspect-ratio: 1; }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width: 768px) {
          .avatar-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .profile-actions {
            margin-left: 0;
            width: 100%;
          }
          .profile-actions .btn-primary,
          .profile-actions .btn-secondary,
          .profile-actions .btn-danger {
            flex: 1;
            justify-content: center;
          }
          .profile-tabs {
            overflow-x: auto;
          }
          .tab {
            white-space: nowrap;
            padding: 12px 14px;
            font-size: 11px;
          }
          .ratings-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-row {
            grid-template-columns: repeat(3, 1fr);
          }
          .profile-body table { font-size: 12px; }
          .profile-body th, .profile-body td { padding: 9px 10px; }
          .profile-body table th:nth-child(5),
          .profile-body table td:nth-child(5),
          .profile-body table th:nth-child(6),
          .profile-body table td:nth-child(6) { display: none; }
        }

        @media (max-width: 480px) {
          .ratings-grid { grid-template-columns: 1fr !important; }
          .profile-avatar {
            width: 76px;
            height: 76px;
            font-size: 30px;
          }
          .profile-username { font-size: 1.5rem; }
        }
      `}</style>

      <div className="profile-banner">
        <div className="banner-inner">
          <div className="avatar-row">
            <div className="profile-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="profile-avatar-img" />
              ) : (
                user.username?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div className="avatar-info">
              <div className="profile-name-row">
                <h1 className="profile-username">{user.username}</h1>
                <Link to="/edit-profile" className="edit-profile-btn" title="Edit Profile">✎</Link>
              </div>
              {user.fullName && <div className="profile-fullname">{user.fullName}</div>}
              <div className="profile-meta">
                {user.country && <span className="meta-pill">◆ {user.country}</span>}
                <span className="meta-pill">{user.gamesPlayed || 0} games</span>
                {user.createdAt && (
                  <span className="meta-pill">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
                <span className="meta-pill">{user.friends ? user.friends.length : 0} friends</span>
              </div>
            </div>
            <div className="profile-actions">
              <Link to="/play" className="btn-primary">▶ Play</Link>
              <Link to="/settings" className="btn-secondary">Settings</Link>
              <button type="button" className="btn-danger" onClick={logout}>Logout</button>
            </div>
          </div>

          {user.bio && <p className="profile-bio">{user.bio}</p>}

          <div className="profile-tabs">
            <a className="tab active" href="#overview">Overview</a>
            <a className="tab" href="#games">Games</a>
            <Link className="tab" to="/friends">Friends</Link>
            <Link className="tab" to="/profile/status">Status</Link>
          </div>
        </div>
      </div>

      <main id="overview">
        <div className="profile-body">
          <div>
            <div className="sec-title" style={{ marginBottom: '14px' }}>Ratings</div>
            <div className="ratings-grid">
              <div className="rating-card rc-1">
                <div className="rc-icon">◆ Rapid</div>
                <div className="rc-mode">Rapid</div>
                <div className="rc-val brass">{user.rapidRating || 1200}</div>
                <div className="rc-sub">Rating</div>
              </div>
              <div className="rating-card rc-2">
                <div className="rc-icon">◆ Blitz</div>
                <div className="rc-mode">Blitz</div>
                <div className="rc-val sage">{user.blitzRating || 1200}</div>
                <div className="rc-sub">Rating</div>
              </div>
              <div className="rating-card rc-3">
                <div className="rc-icon">◆ Bullet</div>
                <div className="rc-mode">Bullet</div>
                <div className="rc-val rust">{user.bulletRating || 1200}</div>
                <div className="rc-sub">Rating</div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <div className="sb-val green">{user.wins || 0}</div>
                <div className="sb-label">Wins</div>
              </div>
              <div className="stat-box">
                <div className="sb-val red">{user.losses || 0}</div>
                <div className="sb-label">Losses</div>
              </div>
              <div className="stat-box">
                <div className="sb-val gray">{user.draws || 0}</div>
                <div className="sb-label">Draws</div>
              </div>
            </div>

            <div id="games">
              <div className="sec-title">
                <span>{showAllGames ? 'All Games' : 'Recent Games'}</span>

                {games.length > 5 && (
                  <a
                    href="#games"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllGames((prev) => !prev);
                    }}
                  >
                    {showAllGames ? '← Show Less' : 'Show All →'}
                  </a>
                )}
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>White</th>
                      <th>Black</th>
                      <th>Winner</th>
                      <th>Moves</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!games || games.length === 0) ? (
                      <tr><td colSpan="7" className="empty-row">No games yet, go play!</td></tr>
                    ) : (
                      (showAllGames ? games : games.slice(0, 5)).map((game, index) => (
                        <tr key={game._id}>
                          <td style={{ color: 'var(--h-cyan)', fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="td-p">{game.whitePlayer}</td>
                          <td className="td-p">{game.blackPlayer}</td>
                          <td>
                            {game.winner === 'white' ? (
                              <span className="bw">White</span>
                            ) : game.winner === 'black' ? (
                              <span className="bb">Black</span>
                            ) : (
                              <span className="bd">Draw</span>
                            )}
                          </td>
                          <td>{game.totalMoves}</td>
                          <td>{new Date(game.createdAt).toLocaleDateString()}</td>
                          <td><Link to={`/game/${game._id}`} className="btn-watch">▶ View</Link></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="side-card">
              <div className="side-card-title">Account</div>
              <div className="info-row">
                <span className="ir-label">Email</span>
                <span className="ir-value" style={{ color: 'var(--h-muted)', fontSize: '11px' }}>{user.email}</span>
              </div>
              <div className="info-row">
                <span className="ir-label">Role</span>
                <span className="ir-value">{user.role}</span>
              </div>
              <div className="info-row">
                <span className="ir-label">Total Games</span>
                <span className="ir-value">{user.gamesPlayed || 0}</span>
              </div>
              {user.dateOfBirth && (
                <div className="info-row">
                  <span className="ir-label">Birthday</span>
                  <span className="ir-value">
                    {new Date(user.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            <div className="side-card">
              <div className="side-card-title">Board Theme</div>
              <div className="mini-board">
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={i}
                    className="mb-sq"
                    style={{ background: (Math.floor(i / 4) + i) % 2 === 0 ? t[0] : t[1] }}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: '11px',
                color: 'var(--h-muted)',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '12px',
              }}>
                {user.boardTheme || 'classic'}
              </div>
              <Link to="/settings" style={{
                display: 'block',
                textAlign: 'center',
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: '11px',
                color: 'var(--h-cyan)',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>
                Change theme →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;