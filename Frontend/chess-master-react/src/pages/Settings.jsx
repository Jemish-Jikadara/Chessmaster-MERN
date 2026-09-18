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
  { id: 'theme', icon: '🎨', label: 'Board Theme', desc: 'Chessboard colors' },
  { id: 'background', icon: '🖼️', label: 'Background', desc: 'Page background', soon: true },
  { id: 'pieces', icon: '♟️', label: 'Pieces', desc: 'Piece style & design', soon: true },
  { id: 'sound', icon: '🔊', label: 'Sound', desc: 'Move & game sounds', soon: true },
  { id: 'notifications', icon: '🔔', label: 'Notifications', desc: 'Alerts & emails', soon: true },
  { id: 'privacy', icon: '🔒', label: 'Privacy', desc: 'Visibility settings', soon: true },
  { id: 'account', icon: '⚙️', label: 'Account', desc: 'Logout & delete' },
];

const COMING_SOON_COPY = {
  background: { icon: '🖼️', title: 'Background', text: 'Background customization will be available in a future update. Stay tuned!' },
  pieces: { icon: '♟️', title: 'Piece Style', text: 'Multiple piece sets (Classic, Modern, Neo, etc.) will be added soon.' },
  sound: { icon: '🔊', title: 'Sound Settings', text: 'Sound effects for moves, captures, check, and game end will be added.' },
  notifications: { icon: '🔔', title: 'Notifications', text: 'Email alerts for friend requests, game invites, and match results coming soon.' },
  privacy: { icon: '🔒', title: 'Privacy', text: 'Profile visibility, game history privacy, and block user features coming soon.' },
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
        :root {
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
        }

        .settings-wrap { min-height:100vh; background:var(--h-bg); }

        .settings-banner {
          background: linear-gradient(135deg, rgba(129,182,76,0.10) 0%, rgba(129,182,76,0.04) 50%, transparent 100%);
          border-bottom:1px solid var(--h-line);
          padding:40px 24px 0;
          position:relative;
          overflow:hidden;
        }

        .settings-banner::before {
          content:''; position:absolute; width:600px; height:600px;
          background: radial-gradient(circle, rgba(129,182,76,0.12) 0%, transparent 70%);
          top:-200px; right:-100px; pointer-events:none;
        }

        .set-banner-inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; padding-bottom: 4px; }

        .set-back-link { display:inline-flex; align-items:center; gap:6px; color:var(--h-muted); font-size:13px; text-decoration:none; margin-bottom:20px; transition:color 0.2s; font-weight:800; }
        .set-back-link:hover { color:var(--h-text); }

        .settings-title { font-family:'Fraunces',serif; font-size:clamp(1.8rem,4vw,2.6rem); font-weight:700; color:var(--h-text); margin:0 0 6px; letter-spacing:-0.02em; }
        .settings-sub { font-size:14px; color:var(--h-muted); margin:0 0 24px; }

        .settings-tabs { display:flex; gap:0; border-top:1px solid var(--h-line); margin-top:4px; }
        .set-tab { padding:14px 20px; font-size:13px; font-weight:800; color:var(--h-text); border-bottom:2px solid var(--h-green); font-family:'Fraunces',serif; }

        .settings-body { max-width:1100px; margin:0 auto; padding:28px 24px 80px; display:grid; grid-template-columns:260px 1fr; gap:24px; }
        @media (max-width:900px) { .settings-body { grid-template-columns:1fr; } }

        .sidebar { display:flex; flex-direction:column; gap:6px; }
        .sidebar-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; cursor:pointer; transition:all 0.2s; border:1px solid transparent; text-decoration:none; background:transparent; width: 100%; text-align: left; font-family: inherit; }
        .sidebar-item:hover { background:rgba(255,255,255,0.03); border-color:var(--h-line); }
        .sidebar-item.active { background:rgba(129,182,76,0.1); border-color:rgba(129,182,76,0.35); }
        .sidebar-icon { font-size:18px; width:28px; text-align:center; }
        .sidebar-text { flex:1; }
        .sidebar-label { font-size:14px; font-weight:600; color:var(--h-text); }
        .sidebar-desc { font-size:11px; color:var(--h-muted); margin-top:1px; }
        .sidebar-item.active .sidebar-label { color:var(--h-green-2); }
        .coming-soon-badge { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:2px 6px; border-radius:4px; background:rgba(129,182,76,0.12); color:var(--h-green-2); border:1px solid rgba(129,182,76,0.25); }

        .content-panel { background:rgba(255,255,255,0.045); border:1px solid rgba(255,255,255,0.09); border-radius:16px; padding:28px; min-height:400px; }

        .section-header { margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--h-line); }
        .section-header h2 { font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--h-text); margin:0 0 6px; }
        .section-header p { font-size:13px; color:var(--h-muted); margin:0; }

        .theme-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:14px; }
        .theme-card { border:2px solid var(--h-line); border-radius:14px; overflow:hidden; cursor:pointer; transition:border-color 0.2s, transform 0.15s; position:relative; background:rgba(255,255,255,0.04); }
        .theme-card:hover { border-color:rgba(129,182,76,0.35); transform:translateY(-3px); }
        .theme-card.active { border-color:var(--h-green); }
        .theme-card.active::after { content:'✓'; position:absolute; top:8px; right:8px; width:24px; height:24px; background:var(--h-green); border-radius:50%; font-size:13px; color:#10180e; font-weight:700; line-height:24px; text-align:center; }
        .theme-preview { display:grid; grid-template-columns:repeat(4,1fr); aspect-ratio:1; width:100%; }
        .theme-preview-sq { aspect-ratio:1; }
        .theme-name { padding:12px; font-family:'Fraunces',serif; font-size:13px; color:var(--h-text); text-align:center; background:rgba(255,255,255,0.045); }
        #saveStatus { margin-top:16px; font-size:13px; color:var(--h-green-2); font-weight:600; }

        .coming-soon-box { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; }
        .coming-soon-icon { font-size:64px; margin-bottom:16px; opacity:0.6; }
        .coming-soon-title { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--h-text); margin-bottom:8px; }
        .coming-soon-text { font-size:14px; color:var(--h-muted); max-width:320px; line-height:1.6; }

        .account-actions { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
        .btn-logout { width:100%; padding:14px 20px; background:rgba(255,255,255,0.045); border:1px solid rgba(255,255,255,0.09); border-radius:12px; color:var(--h-text); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:10px; transition:all 0.2s; font-family:'Inter',sans-serif; }
        .btn-logout:hover { background:rgba(129,182,76,0.1); border-color:rgba(129,182,76,0.35); color:var(--h-green-2); }
        .btn-delete { width:100%; padding:14px 20px; background:transparent; border:1px solid rgba(229,139,66,0.25); border-radius:12px; color:var(--h-orange); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:10px; transition:all 0.2s; font-family:'Inter',sans-serif; }
        .btn-delete:hover { background:rgba(229,139,66,0.1); border-color:rgba(229,139,66,0.45); }

        .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); display:none; align-items:center; justify-content:center; z-index:1000; backdrop-filter:blur(4px); }
        .modal-overlay.active { display:flex; }
        .modal-box { background:rgba(255,255,255,0.045); border:1px solid rgba(255,255,255,0.09); border-radius:16px; padding:32px; max-width:420px; width:90%; text-align:center; }
        .modal-icon { font-size:48px; margin-bottom:16px; }
        .modal-title { font-family:'Fraunces',serif; font-size:20px; color:var(--h-text); margin:0 0 8px; }
        .modal-text { font-size:14px; color:var(--h-muted); margin:0 0 24px; line-height:1.6; }
        .modal-warning { background:rgba(229,139,66,0.1); border:1px solid rgba(229,139,66,0.25); border-radius:8px; padding:12px; font-size:13px; color:var(--h-orange); margin-bottom:24px; }
        .modal-btns { display:flex; gap:12px; }
        .modal-btns button { flex:1; padding:12px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
        .btn-cancel { background:rgba(255,255,255,0.045); border:1px solid rgba(255,255,255,0.09); color:var(--h-text); }
        .btn-cancel:hover { border-color:rgba(129,182,76,0.35); }
        .btn-confirm-delete { background:rgba(229,139,66,0.12); border:1px solid rgba(229,139,66,0.35); color:var(--h-orange); }
        .btn-confirm-delete:hover { background:rgba(229,139,66,0.2); }
        .modal-error { color: #ff8585; font-size: 13px; margin-top: -12px; margin-bottom: 16px; }

        @media (max-width:900px) {
          .sidebar { flex-direction:row; overflow-x:auto; padding-bottom:8px; }
          .sidebar-item { min-width:140px; flex-direction:column; gap:4px; padding:12px; }
          .sidebar-text { text-align:center; }
          .sidebar-desc { display:none; }
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
                      <span>🚪</span> Logout
                    </button>
                    <button type="button" className="btn-delete" onClick={() => setShowDeleteModal(true)}>
                      <span>🗑️</span> Delete Account
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
          <div className="modal-icon">⚠️</div>
          <h3 className="modal-title">Delete Account?</h3>
          <p className="modal-text">This will permanently delete your account, ratings, statistics, friends, and game history. This action cannot be undone.</p>
          <div className="modal-warning">⚠️ All your data will be lost forever!</div>
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