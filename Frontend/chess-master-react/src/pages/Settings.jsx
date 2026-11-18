import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const THEMES = [
  { id: 'classic', name: 'Classic', light: '#f0d9b5', dark: '#b58863' },
  { id: 'midnight', name: 'Midnight', light: '#6b7fa3', dark: '#2c3e6b' },
  { id: 'forest', name: 'Forest', light: '#ffffdd', dark: '#6faa3f' },
  { id: 'ocean', name: 'Ocean', light: '#d6eaf8', dark: '#2e86c1' },
  { id: 'ruby', name: 'Ruby', light: '#f5cba7', dark: '#b91c1c' },
  { id: 'walnut', name: 'Walnut', light: '#e8d5b0', dark: '#6b4226' },
];

const SIDEBAR_ITEMS = [
  { id: 'theme', icon: '◆', label: 'Board Theme', desc: 'Chessboard colors' },
  { id: 'background', icon: '▣', label: 'Background', desc: 'Page background', soon: true },
  { id: 'pieces', icon: '♟', label: 'Pieces', desc: 'Piece style & design', soon: true },
  { id: 'sound', icon: '♪', label: 'Sound', desc: 'Move & game sounds', soon: true },
  { id: 'notifications', icon: '◈', label: 'Notifications', desc: 'Alerts & emails', soon: true },
  { id: 'privacy', icon: '◇', label: 'Privacy', desc: 'Visibility settings', soon: true },
  { id: 'account', icon: '⚙', label: 'Account', desc: 'Logout & delete' },
];

const COMING_SOON_COPY = {
  background: { icon: '▣', title: 'Background', text: 'Background customization will be available in a future update. Stay tuned!' },
  pieces: { icon: '♟', title: 'Piece Style', text: 'Multiple piece sets (Classic, Modern, Neo, etc.) will be added soon.' },
  sound: { icon: '♪', title: 'Sound Settings', text: 'Sound effects for moves, captures, check, and game end will be added.' },
  notifications: { icon: '◈', title: 'Notifications', text: 'Email alerts for friend requests, game invites, and match results coming soon.' },
  privacy: { icon: '◇', title: 'Privacy', text: 'Profile visibility, game history privacy, and block user features coming soon.' },
};

const Settings = () => {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('theme');
  const [activeTheme, setActiveTheme] = useState(user?.boardTheme || 'classic');
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleSelectTheme = async (themeId) => {
    setActiveTheme(themeId);
    try {
      const res = await api.post('/api/settings/theme', { boardTheme: themeId });
      if (res.data.success) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        checkAuth();
      }
    } catch (err) {
      console.error('Theme save failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await api.post('/api/settings/delete-account');
      if (res.data.success) {
        await logout();
        navigate('/login');
      } else {
        setDeleteError(res.data.message || 'Failed to delete account.');
      }
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setDeleting(false);
    }
  };

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

        .settings-wrap {
          position:relative;
          min-height:100vh;
          background:#050510;
          font-family:var(--h-font-body);
          color:var(--h-text);
          overflow-x:hidden;
        }

        .settings-wrap::before{
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

        .settings-wrap::after{
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

        .settings-wrap > *{ position:relative; z-index:1; }

        /* =========================================================
           BANNER
           ========================================================= */
        .settings-banner {
          position:relative;
          padding:44px 24px 0;
          background:
            radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
            radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
            #050510;
          border-bottom:1px solid var(--h-line);
          overflow:hidden;
        }

        .settings-banner::before {
          content:'';
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
          background-size:52px 52px;
          mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          pointer-events:none;
        }

        .set-banner-inner {
          max-width:1100px;
          margin:0 auto;
          position:relative;
          z-index:1;
          padding-bottom:4px;
        }

        .set-back-link {
          display:inline-flex;
          align-items:center;
          gap:8px;
          color:var(--h-muted);
          font-family:var(--h-font-tech);
          font-size:12px;
          letter-spacing:0.16em;
          text-transform:uppercase;
          text-decoration:none;
          margin-bottom:22px;
          transition:color 0.2s ease, text-shadow 0.2s ease;
          font-weight:700;
        }

        .set-back-link:hover {
          color:var(--h-cyan);
          text-shadow:0 0 12px rgba(0,229,255,0.7);
        }

        .settings-title {
          font-family:var(--h-font-display);
          font-size:clamp(1.8rem, 4vw, 2.6rem);
          font-weight:800;
          color:#ffffff;
          margin:0 0 10px;
          letter-spacing:0.02em;
          text-transform:uppercase;
          text-shadow:0 0 26px rgba(0,229,255,0.35);
        }

        .settings-sub {
          font-family:var(--h-font-tech);
          font-size:13px;
          color:var(--h-muted);
          margin:0 0 26px;
          letter-spacing:0.1em;
        }

        .settings-tabs {
          display:flex;
          gap:0;
          border-top:1px solid var(--h-line);
          margin-top:4px;
        }

        .set-tab {
          padding:16px 22px;
          font-family:var(--h-font-tech);
          font-size:11.5px;
          font-weight:700;
          color:var(--h-cyan);
          border-bottom:2px solid var(--h-cyan);
          letter-spacing:0.22em;
          text-transform:uppercase;
          text-shadow:0 0 10px rgba(0,229,255,0.6);
        }

        /* =========================================================
           BODY GRID
           ========================================================= */
        .settings-body {
          max-width:1100px;
          margin:0 auto;
          padding:28px 24px 80px;
          display:grid;
          grid-template-columns:280px 1fr;
          gap:24px;
        }

        @media (max-width:900px) {
          .settings-body { grid-template-columns:1fr; }
        }

        /* =========================================================
           SIDEBAR
           ========================================================= */
        .sidebar {
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .sidebar-item {
          display:flex;
          align-items:center;
          gap:12px;
          padding:13px 16px;
          border-radius:6px;
          cursor:pointer;
          transition:all 0.2s ease;
          border:1px solid transparent;
          text-decoration:none;
          background:transparent;
          width:100%;
          text-align:left;
          font-family:inherit;
        }

        .sidebar-item:hover {
          background:rgba(0,229,255,0.05);
          border-color:rgba(0,229,255,0.25);
        }

        .sidebar-item.active {
          background:rgba(0,229,255,0.1);
          border-color:rgba(0,229,255,0.5);
          box-shadow:
            inset 0 0 14px rgba(0,229,255,0.1),
            0 0 18px rgba(0,229,255,0.25);
        }

        .sidebar-icon {
          font-size:16px;
          width:28px;
          text-align:center;
          color:var(--h-cyan);
          filter:drop-shadow(0 0 6px rgba(0,229,255,0.5));
        }

        .sidebar-item.active .sidebar-icon {
          filter:drop-shadow(0 0 10px rgba(0,229,255,0.8));
        }

        .sidebar-text { flex:1; }

        .sidebar-label {
          font-family:var(--h-font-tech);
          font-size:12.5px;
          font-weight:700;
          color:var(--h-text);
          letter-spacing:0.1em;
          text-transform:uppercase;
        }

        .sidebar-desc {
          font-family:var(--h-font-tech);
          font-size:10.5px;
          color:var(--h-muted);
          margin-top:3px;
          letter-spacing:0.08em;
        }

        .sidebar-item.active .sidebar-label {
          color:var(--h-cyan);
          text-shadow:0 0 10px rgba(0,229,255,0.6);
        }

        .coming-soon-badge {
          font-family:var(--h-font-tech);
          font-size:9px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:0.16em;
          padding:3px 7px;
          border-radius:3px;
          background:rgba(255,45,149,0.1);
          color:var(--h-pink-2);
          border:1px solid rgba(255,45,149,0.35);
        }

        /* =========================================================
           CONTENT PANEL
           ========================================================= */
        .content-panel {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.28);
          border-radius:8px;
          padding:30px;
          min-height:440px;
          box-shadow:
            0 0 40px rgba(0,229,255,.15),
            inset 0 0 40px rgba(0,229,255,.04);
        }

        .section-header {
          margin-bottom:26px;
          padding-bottom:18px;
          border-bottom:1px solid rgba(0,229,255,.18);
        }

        .section-header h2 {
          font-family:var(--h-font-display);
          font-size:18px;
          font-weight:800;
          color:#ffffff;
          margin:0 0 8px;
          text-transform:uppercase;
          letter-spacing:0.06em;
          text-shadow:0 0 14px rgba(0,229,255,0.35);
        }

        .section-header p {
          font-family:var(--h-font-tech);
          font-size:12.5px;
          color:var(--h-muted);
          margin:0;
          letter-spacing:0.06em;
          line-height:1.6;
        }

        /* =========================================================
           THEME GRID
           ========================================================= */
        .theme-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(180px,1fr));
          gap:14px;
        }

        .theme-card {
          position:relative;
          border:2px solid rgba(0,229,255,.22);
          border-radius:6px;
          overflow:hidden;
          cursor:pointer;
          transition:border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          background:rgba(0,229,255,.03);
        }

        .theme-card:hover {
          border-color:rgba(0,229,255,.6);
          transform:translateY(-4px);
          box-shadow:
            0 0 24px rgba(0,229,255,.3),
            0 12px 30px rgba(0,0,0,.4);
        }

        .theme-card.active {
          border-color:var(--h-cyan);
          box-shadow:
            0 0 24px rgba(0,229,255,.5),
            inset 0 0 14px rgba(0,229,255,.1);
        }

        .theme-card.active::after {
          content:'✓';
          position:absolute;
          top:10px;
          right:10px;
          width:26px;
          height:26px;
          background:linear-gradient(135deg, #00e5ff, #a8f8ff);
          border-radius:4px;
          font-size:13px;
          color:#050510;
          font-weight:900;
          line-height:26px;
          text-align:center;
          box-shadow:0 0 14px rgba(0,229,255,.7);
        }

        .theme-preview {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          aspect-ratio:1;
          width:100%;
        }

        .theme-preview-sq { aspect-ratio:1; }

        .theme-name {
          padding:12px;
          font-family:var(--h-font-tech);
          font-size:12px;
          color:var(--h-text);
          text-align:center;
          background:rgba(0,229,255,.04);
          letter-spacing:0.16em;
          text-transform:uppercase;
          font-weight:700;
          border-top:1px solid rgba(0,229,255,.15);
        }

        #saveStatus {
          margin-top:18px;
          font-family:var(--h-font-tech);
          font-size:12px;
          color:var(--h-acid);
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          text-shadow:0 0 12px rgba(182,255,60,.6);
        }

        /* =========================================================
           COMING SOON
           ========================================================= */
        .coming-soon-box {
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:60px 20px;
          text-align:center;
        }

        .coming-soon-icon {
          font-size:64px;
          margin-bottom:20px;
          color:var(--h-cyan);
          opacity:0.8;
          filter:drop-shadow(0 0 20px rgba(0,229,255,.6));
        }

        .coming-soon-title {
          font-family:var(--h-font-display);
          font-size:18px;
          font-weight:800;
          color:#ffffff;
          margin-bottom:12px;
          text-transform:uppercase;
          letter-spacing:0.06em;
          text-shadow:0 0 16px rgba(0,229,255,0.4);
        }

        .coming-soon-text {
          font-family:var(--h-font-tech);
          font-size:13px;
          color:var(--h-muted);
          max-width:360px;
          line-height:1.7;
          letter-spacing:0.06em;
        }

        /* =========================================================
           ACCOUNT ACTIONS
           ========================================================= */
        .account-actions {
          display:flex;
          flex-direction:column;
          gap:12px;
          margin-top:8px;
        }

        .btn-logout {
          width:100%;
          padding:15px 20px;
          background:rgba(0,229,255,.04);
          border:1px solid rgba(0,229,255,.3);
          border-radius:6px;
          color:var(--h-cyan);
          font-family:var(--h-font-tech);
          font-size:12.5px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:12px;
          transition:all 0.2s ease;
          box-shadow:inset 0 0 12px rgba(0,229,255,.08);
        }

        .btn-logout:hover {
          background:rgba(0,229,255,.14);
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          box-shadow:
            inset 0 0 18px rgba(0,229,255,.18),
            0 0 20px rgba(0,229,255,.4);
        }

        .btn-delete {
          width:100%;
          padding:15px 20px;
          background:rgba(255,45,149,.04);
          border:1px solid rgba(255,45,149,.35);
          border-radius:6px;
          color:var(--h-pink-2);
          font-family:var(--h-font-tech);
          font-size:12.5px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:12px;
          transition:all 0.2s ease;
          box-shadow:inset 0 0 12px rgba(255,45,149,.08);
        }

        .btn-delete:hover {
          background:rgba(255,45,149,.14);
          border-color:rgba(255,45,149,.7);
          color:#ff9ecb;
          box-shadow:
            inset 0 0 18px rgba(255,45,149,.15),
            0 0 20px rgba(255,45,149,.4);
        }

        /* =========================================================
           MODAL
           ========================================================= */
        .modal-overlay {
          position:fixed;
          inset:0;
          background:rgba(5,5,16,0.88);
          display:none;
          align-items:center;
          justify-content:center;
          z-index:1000;
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
        }

        .modal-overlay.active { display:flex; }

        .modal-box {
          position:relative;
          background:
            linear-gradient(180deg, rgba(255,45,149,.08), rgba(139,92,246,.04)),
            #08081a;
          border:1px solid rgba(255,45,149,.4);
          border-radius:8px;
          padding:36px 30px;
          max-width:460px;
          width:90%;
          text-align:center;
          box-shadow:
            0 0 60px rgba(255,45,149,.28),
            0 0 100px rgba(139,92,246,.15);
        }

        .modal-box::before,
        .modal-box::after {
          content:'';
          position:absolute;
          width:22px;
          height:22px;
          border:2px solid #ff2d95;
          filter:drop-shadow(0 0 10px rgba(255,45,149,.9));
          pointer-events:none;
        }
        .modal-box::before { top:-2px; left:-2px; border-right:0; border-bottom:0; }
        .modal-box::after { bottom:-2px; right:-2px; border-left:0; border-top:0; }

        .modal-icon {
          font-size:52px;
          margin-bottom:18px;
          color:var(--h-pink-2);
          filter:drop-shadow(0 0 20px rgba(255,45,149,.6));
        }

        .modal-title {
          font-family:var(--h-font-display);
          font-size:20px;
          font-weight:800;
          color:#ffffff;
          margin:0 0 12px;
          text-transform:uppercase;
          letter-spacing:0.04em;
        }

        .modal-text {
          font-family:var(--h-font-tech);
          font-size:12.5px;
          color:var(--h-soft);
          margin:0 0 22px;
          line-height:1.7;
          letter-spacing:0.06em;
        }

        .modal-warning {
          background:rgba(255,45,149,.08);
          border:1px solid rgba(255,45,149,.35);
          border-radius:4px;
          padding:12px 14px;
          font-family:var(--h-font-tech);
          font-size:11.5px;
          font-weight:700;
          color:var(--h-pink-2);
          margin-bottom:24px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          box-shadow:inset 0 0 14px rgba(255,45,149,.1);
        }

        .modal-btns {
          display:flex;
          gap:12px;
        }

        .modal-btns button {
          flex:1;
          padding:14px;
          border-radius:4px;
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all 0.2s ease;
        }

        .btn-cancel {
          background:rgba(0,229,255,.04);
          border:1px solid rgba(0,229,255,.3);
          color:var(--h-cyan);
          box-shadow:inset 0 0 10px rgba(0,229,255,.08);
        }

        .btn-cancel:hover:not(:disabled) {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.12);
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.18),
            0 0 18px rgba(0,229,255,.4);
        }

        .btn-confirm-delete {
          background:linear-gradient(90deg, #ff2d95, #ff6bb0);
          border:none;
          color:#ffffff;
          box-shadow:
            0 0 20px rgba(255,45,149,.5),
            inset 0 0 8px rgba(255,255,255,.3);
        }

        .btn-confirm-delete:hover:not(:disabled) {
          box-shadow:
            0 0 30px rgba(255,45,149,.8),
            0 0 60px rgba(255,45,149,.4),
            inset 0 0 10px rgba(255,255,255,.4);
          transform:translateY(-1px);
        }

        .modal-btns button:disabled {
          opacity:0.55;
          cursor:not-allowed;
          transform:none;
        }

        .modal-error {
          padding:10px 14px;
          background:rgba(255,45,149,.08);
          border:1px solid rgba(255,45,149,.35);
          border-radius:4px;
          color:var(--h-pink-2);
          font-family:var(--h-font-tech);
          font-size:11.5px;
          font-weight:600;
          letter-spacing:0.08em;
          margin:-8px 0 16px;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:900px) {
          .sidebar {
            flex-direction:row;
            overflow-x:auto;
            padding-bottom:8px;
            gap:10px;
          }
          .sidebar-item {
            min-width:150px;
            flex-direction:column;
            gap:6px;
            padding:14px 12px;
          }
          .sidebar-text { text-align:center; }
          .sidebar-desc { display:none; }
          .sidebar-icon { font-size:18px; width:auto; }
        }

        @media (max-width:560px) {
          .settings-banner {
            padding:32px 16px 0;
          }
          .settings-body {
            padding:20px 16px 60px;
          }
          .content-panel {
            padding:22px 18px;
          }
          .theme-grid {
            grid-template-columns:repeat(auto-fill, minmax(140px,1fr));
          }
          .modal-box {
            padding:28px 20px;
          }
        }
      `}</style>

      <div className="settings-wrap">
        <div className="settings-banner">
          <div className="set-banner-inner">
            <Link to="/profile" className="set-back-link">← Back to Profile</Link>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-sub">Customize your ChessMaster experience.</p>
            <div className="settings-tabs">
              <span className="set-tab">General</span>
            </div>
          </div>
        </div>

        <main>
          <div className="settings-body">
            {/* LEFT SIDEBAR */}
            <div className="sidebar">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <div className="sidebar-text">
                    <div className="sidebar-label">{item.label}</div>
                    <div className="sidebar-desc">{item.desc}</div>
                  </div>
                  {item.soon && <span className="coming-soon-badge">Soon</span>}
                </button>
              ))}
            </div>

            {/* RIGHT CONTENT */}
            <div className="content-panel">
              {activeSection === 'theme' && (
                <div className="content-section active">
                  <div className="section-header">
                    <h2>Board Theme</h2>
                    <p>Choose how your chess board looks. Your preference is saved to your account.</p>
                  </div>
                  <div className="theme-grid">
                    {THEMES.map((theme) => (
                      <div
                        key={theme.id}
                        className={`theme-card ${activeTheme === theme.id ? 'active' : ''}`}
                        onClick={() => handleSelectTheme(theme.id)}
                      >
                        <div className="theme-preview">
                          {Array.from({ length: 16 }, (_, i) => (
                            <div
                              key={i}
                              className="theme-preview-sq"
                              style={{ background: (Math.floor(i / 4) + i) % 2 === 0 ? theme.light : theme.dark }}
                            />
                          ))}
                        </div>
                        <div className="theme-name">{theme.name}</div>
                      </div>
                    ))}
                  </div>
                  {showSaved && <div id="saveStatus">✓ Theme saved!</div>}
                </div>
              )}

              {['background', 'pieces', 'sound', 'notifications', 'privacy'].includes(activeSection) && (
                <div className="content-section active">
                  <div className="section-header">
                    <h2>{COMING_SOON_COPY[activeSection].title}</h2>
                    <p>{COMING_SOON_COPY[activeSection].text}</p>
                  </div>
                  <div className="coming-soon-box">
                    <div className="coming-soon-icon">{COMING_SOON_COPY[activeSection].icon}</div>
                    <div className="coming-soon-title">Coming Soon</div>
                    <div className="coming-soon-text">{COMING_SOON_COPY[activeSection].text}</div>
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <div className="content-section active">
                  <div className="section-header">
                    <h2>Manage Account</h2>
                    <p>Logout or permanently delete your account and all associated data.</p>
                  </div>
                  <div className="account-actions">
                    <button type="button" className="btn-logout" onClick={logout}>
                      <span>◆</span> Logout
                    </button>
                    <button type="button" className="btn-delete" onClick={() => setShowDeleteModal(true)}>
                      <span>◆</span> Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Modal */}
      <div className={`modal-overlay ${showDeleteModal ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}>
        <div className="modal-box">
          <div className="modal-icon">◆</div>
          <h3 className="modal-title">Delete Account?</h3>
          <p className="modal-text">This will permanently delete your account, ratings, statistics, friends, and game history. This action cannot be undone.</p>
          <div className="modal-warning">◆ All your data will be lost forever!</div>
          {deleteError && <p className="modal-error">{deleteError}</p>}
          <div className="modal-btns">
            <button type="button" className="btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</button>
            <button type="button" className="btn-confirm-delete" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Forever'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;