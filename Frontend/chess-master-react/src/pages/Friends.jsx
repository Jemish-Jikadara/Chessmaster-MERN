import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Friends = () => {
  const { user } = useAuth();

  // Local state
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load current friends + pending requests on mount
  useEffect(() => {
    let mounted = true;
    api.get('/friends')
      .then((res) => {
        if (!mounted) return;
        setFriends(res.data.user?.friends || []);
        setFriendRequests(res.data.user?.friendRequests || []);
      })
      .catch((err) => console.error('Failed to load friends:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.users || []);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Send friend request
  const sendRequest = async (id) => {
    try {
      const res = await api.post('/api/friends/request', { userId: id });
      if (res.data.success) {
        setSentRequests(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Accept request
  const acceptRequest = async (id) => {
    try {
      const res = await api.post('/api/friends/accept', { userId: id });
      if (res.data.success) {
        const acceptedReq = friendRequests.find(r => r._id === id);
        setFriendRequests(prev => prev.filter(r => r._id !== id));
        if (acceptedReq) setFriends(prev => [...prev, acceptedReq]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Decline request
  const declineRequest = async (id) => {
    try {
      const res = await api.post('/api/friends/decline', { userId: id });
      if (res.data.success) {
        setFriendRequests(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove friend
  const removeFriend = async (id) => {
    if (!window.confirm('Remove this friend?')) return;
    try {
      const res = await api.post('/api/friends/remove', { userId: id });
      if (res.data.success) {
        setFriends(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Avatar helper
  const getAvatar = (person, size = 'mini') => {
    const isLarge = size === 'large';
    if (person?.profileImage) {
      return (
        <img
          src={person.profileImage}
          alt={person.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    return (
      <span style={{
        fontSize: isLarge ? '28px' : '16px',
        fontWeight: 800,
        color: '#050510',
        fontFamily: "'Orbitron', sans-serif",
      }}>
        {person?.username?.charAt(0)?.toUpperCase() || '?'}
      </span>
    );
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

        .friends-page {
          position:relative;
          background:#050510;
          color:var(--h-text);
          font-family:var(--h-font-body);
          min-height:100vh;
          overflow-x:hidden;
        }

        /* Animated grid backdrop */
        .friends-page::before{
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

        .friends-page::after{
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

        .friends-page > *{ position:relative; z-index:1; }

        /* =========================================================
           HERO
           ========================================================= */
        .friends-hero {
          padding:48px 0 28px;
          border-bottom:1px solid var(--h-line);
          background:linear-gradient(180deg, rgba(0,229,255,0.05) 0%, transparent 100%);
          position:relative;
        }

        .hero-inner {
          max-width:1240px;
          margin:0 auto;
          padding:0 24px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:24px;
          flex-wrap:wrap;
        }

        .hero-user {
          display:flex;
          align-items:center;
          gap:22px;
        }

        .friends-avatar {
          width:76px;
          height:76px;
          border-radius:8px;
          background:linear-gradient(135deg, #00e5ff, #8b5cf6);
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid rgba(0,229,255,0.6);
          box-shadow:
            0 0 22px rgba(0,229,255,0.5),
            0 0 44px rgba(139,92,246,0.3),
            inset 0 0 16px rgba(255,255,255,0.35);
          overflow:hidden;
          flex-shrink:0;
          position:relative;
        }

        .friends-avatar::after{
          content:'';
          position:absolute;
          inset:-4px;
          border-radius:12px;
          border:1px solid rgba(0,229,255,0.4);
          pointer-events:none;
        }

        .hero-info h1 {
          font-family:var(--h-font-display);
          font-size:clamp(1.6rem, 3.5vw, 2.2rem);
          margin:0 0 6px 0;
          color:#fff;
          text-transform:uppercase;
          letter-spacing:0.02em;
          font-weight:800;
          text-shadow:0 0 22px rgba(0,229,255,0.3);
        }

        .hero-info p {
          margin:0;
          color:var(--h-muted);
          font-size:14px;
        }

        .stats-pills {
          display:flex;
          gap:12px;
        }

        .stat-pill {
          background:rgba(0,229,255,0.04);
          border:1px solid rgba(0,229,255,0.24);
          padding:12px 22px;
          border-radius:6px;
          text-align:center;
          backdrop-filter:blur(10px);
          box-shadow:inset 0 0 14px rgba(0,229,255,0.08);
          transition:border-color .2s ease, box-shadow .2s ease;
        }

        .stat-pill:hover {
          border-color:rgba(0,229,255,0.5);
          box-shadow:
            inset 0 0 18px rgba(0,229,255,0.14),
            0 0 18px rgba(0,229,255,0.25);
        }

        .stat-pill .num {
          font-family:var(--h-font-display);
          font-size:22px;
          color:var(--h-cyan);
          font-weight:800;
          text-shadow:0 0 14px rgba(0,229,255,0.55);
          line-height:1;
          margin-bottom:4px;
        }

        .stat-pill .label {
          font-family:var(--h-font-tech);
          font-size:10px;
          text-transform:uppercase;
          letter-spacing:0.2em;
          color:var(--h-muted);
          font-weight:700;
        }

        /* =========================================================
           DASHBOARD GRID
           ========================================================= */
        .dashboard-grid {
          max-width:1240px;
          margin:32px auto;
          padding:0 24px;
          display:grid;
          grid-template-columns:380px 1fr;
          gap:24px;
        }

        .dash-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,0.24);
          border-radius:8px;
          padding:24px;
          box-shadow:
            0 0 28px rgba(0,229,255,0.1),
            inset 0 0 28px rgba(0,229,255,0.03);
          margin-bottom:24px;
          transition:border-color .22s ease, box-shadow .22s ease;
        }

        .dash-card:hover {
          border-color:rgba(0,229,255,0.4);
          box-shadow:
            0 0 40px rgba(0,229,255,0.18),
            inset 0 0 32px rgba(0,229,255,0.05);
        }

        .card-title {
          font-family:var(--h-font-display);
          font-size:13px;
          color:var(--h-cyan);
          margin-bottom:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          text-transform:uppercase;
          letter-spacing:0.12em;
          font-weight:800;
          text-shadow:0 0 12px rgba(0,229,255,0.5);
          position:relative;
          padding-left:14px;
        }

        .card-title::before {
          content:'';
          position:absolute;
          left:0;
          top:50%;
          transform:translateY(-50%);
          width:6px;
          height:6px;
          background:var(--h-cyan);
          box-shadow:
            0 0 0 4px rgba(0,229,255,.15),
            0 0 12px rgba(0,229,255,.7);
        }

        /* Search input */
        .friend-search-input {
          width:100%;
          padding:13px 16px;
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.22);
          border-radius:6px;
          color:#fff;
          font-family:var(--h-font-body);
          font-size:14px;
          box-sizing:border-box;
          transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }

        .friend-search-input:focus {
          outline:none;
          border-color:var(--h-cyan);
          background:rgba(0,229,255,.06);
          box-shadow:
            0 0 0 3px rgba(0,229,255,.15),
            0 0 22px rgba(0,229,255,.25),
            inset 0 0 10px rgba(0,229,255,.06);
        }

        .friend-search-input::placeholder {
          color:#5a6684;
        }

        /* User rows */
        .user-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:13px 14px;
          border-radius:6px;
          background:rgba(0,229,255,.025);
          border:1px solid rgba(0,229,255,.12);
          margin-bottom:10px;
          transition:all 0.2s ease;
          gap:12px;
        }

        .user-row:hover {
          border-color:rgba(0,229,255,.5);
          background:rgba(0,229,255,.07);
          transform:translateY(-2px);
          box-shadow:0 0 18px rgba(0,229,255,0.2);
        }

        .user-meta {
          display:flex;
          align-items:center;
          gap:12px;
          min-width:0;
          flex:1;
        }

        .mini-avatar {
          width:42px;
          height:42px;
          border-radius:6px;
          background:linear-gradient(135deg, #00e5ff, #8b5cf6);
          color:#050510;
          font-family:var(--h-font-display);
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          overflow:hidden;
          flex-shrink:0;
          border:1px solid rgba(0,229,255,0.5);
          box-shadow:0 0 14px rgba(0,229,255,0.35);
        }

        .user-info {
          min-width:0;
          flex:1;
        }

        .user-info .name {
          font-family:var(--h-font-tech);
          font-size:13.5px;
          font-weight:700;
          color:#fff;
          letter-spacing:0.04em;
          text-transform:uppercase;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .user-info .sub {
          font-size:11.5px;
          color:var(--h-muted);
          font-family:var(--h-font-tech);
          letter-spacing:0.06em;
          margin-top:2px;
        }

        .btn-group {
          display:flex;
          gap:8px;
          flex-shrink:0;
        }

        /* =========================================================
           ACTION BUTTONS
           ========================================================= */
        .btn-action {
          padding:9px 16px;
          border-radius:4px;
          font-family:var(--h-font-tech);
          font-size:11px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          border:1px solid transparent;
          transition:all 0.2s ease;
          white-space:nowrap;
        }

        .btn-primary {
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          color:#050510;
          box-shadow:
            0 0 16px rgba(0,229,255,0.4),
            inset 0 0 8px rgba(255,255,255,0.35);
        }

        .btn-primary:hover:not(:disabled) {
          transform:translateY(-1px);
          box-shadow:
            0 0 24px rgba(0,229,255,0.75),
            0 0 44px rgba(0,229,255,0.35),
            inset 0 0 10px rgba(255,255,255,0.45);
        }

        .btn-primary:disabled {
          opacity:0.5;
          cursor:not-allowed;
        }

        .btn-danger {
          background:rgba(255,45,149,.06);
          color:#ff6bb0;
          border:1px solid rgba(255,45,149,.35);
          box-shadow:inset 0 0 10px rgba(255,45,149,.08);
        }

        .btn-danger:hover {
          background:rgba(255,45,149,.14);
          border-color:rgba(255,45,149,.7);
          color:#ff9ecb;
          box-shadow:
            inset 0 0 14px rgba(255,45,149,.14),
            0 0 18px rgba(255,45,149,.4);
        }

        /* Empty state */
        .empty-state {
          text-align:center;
          padding:32px 20px;
          color:var(--h-muted);
          font-family:var(--h-font-tech);
          font-size:12px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          border:1px dashed rgba(0,229,255,0.24);
          border-radius:6px;
          background:rgba(0,229,255,0.02);
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:850px) {
          .dashboard-grid {
            grid-template-columns:1fr;
          }
          .hero-inner {
            flex-direction:column;
            align-items:flex-start;
            gap:22px;
          }
          .stats-pills {
            width:100%;
          }
          .stat-pill {
            flex:1;
          }
        }

        @media (max-width:560px) {
          .friends-hero {
            padding:36px 0 24px;
          }
          .hero-inner {
            padding:0 16px;
          }
          .dashboard-grid {
            padding:0 16px;
            gap:18px;
          }
          .dash-card {
            padding:18px;
          }
          .friends-avatar {
            width:64px;
            height:64px;
          }
          .user-row {
            flex-wrap:wrap;
          }
          .btn-action {
            padding:8px 12px;
            font-size:10px;
          }
        }
      `}</style>

      <div className="friends-page">
        {/* ====== HERO ====== */}
        <header className="friends-hero">
          <div className="hero-inner">
            <div className="hero-user">
              <div className="friends-avatar">
                {getAvatar(user, 'large')}
              </div>
              <div className="hero-info">
                <h1>Friends Network</h1>
                <p>Connect, challenge, and grow your network.</p>
              </div>
            </div>

            <div className="stats-pills">
              <div className="stat-pill">
                <div className="num">{friends.length}</div>
                <div className="label">Friends</div>
              </div>
              <div className="stat-pill">
                <div className="num">{friendRequests.length}</div>
                <div className="label">Requests</div>
              </div>
            </div>
          </div>
        </header>

        {/* ====== DASHBOARD ====== */}
        <main className="dashboard-grid">

          {/* LEFT: Search + Requests */}
          <div className="dash-left">

            {/* Search */}
            <div className="dash-card">
              <div className="card-title">Find Players</div>
              <input
                type="text"
                className="friend-search-input"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div style={{ marginTop: '14px' }}>
                {searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="empty-state">No users found</div>
                )}
                {searchResults.map(u => (
                  <div key={u._id} className="user-row">
                    <div className="user-meta">
                      <div className="mini-avatar">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          u.username?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div className="user-info">
                        <div className="name">{u.username}</div>
                      </div>
                    </div>
                    <button
                      className="btn-action btn-primary"
                      onClick={() => sendRequest(u._id)}
                      disabled={sentRequests.has(u._id)}
                    >
                      {sentRequests.has(u._id) ? 'Sent' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Requests */}
            <div className="dash-card">
              <div className="card-title">
                Pending Requests
                <span style={{ fontSize: '11px', opacity: 0.85, fontFamily: "'Chakra Petch', sans-serif" }}>
                  ({friendRequests.length})
                </span>
              </div>

              {friendRequests.length === 0 ? (
                <div className="empty-state">No pending invites.</div>
              ) : (
                friendRequests.map(request => (
                  <div key={request._id} className="user-row">
                    <div className="user-meta">
                      <div className="mini-avatar">
                        {getAvatar(request)}
                      </div>
                      <div className="user-info">
                        <div className="name">{request.username}</div>
                        {request.fullName && (
                          <div className="sub">{request.fullName}</div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      <button className="btn-action btn-primary" onClick={() => acceptRequest(request._id)}>Accept</button>
                      <button className="btn-action btn-danger" onClick={() => declineRequest(request._id)}>Decline</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* RIGHT: Friends List */}
          <div className="dash-right">
            <div className="dash-card">
              <div className="card-title">All Connections</div>

              {friends.length === 0 ? (
                <div className="empty-state">
                  You haven't added any friends yet. Search for players to build your network!
                </div>
              ) : (
                friends.map(friend => (
                  <div key={friend._id} className="user-row">
                    <div className="user-meta">
                      <div className="mini-avatar">
                        {getAvatar(friend)}
                      </div>
                      <div className="user-info">
                        <div className="name">{friend.username}</div>
                        {friend.fullName && (
                          <div className="sub">{friend.fullName}</div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      <button className="btn-action btn-danger" onClick={() => removeFriend(friend._id)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default Friends;