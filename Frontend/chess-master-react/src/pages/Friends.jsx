import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Friends = () => {
  const { user } = useAuth();

  // Local state (taaki page refresh bina update ho)
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
        // Request hatao, friend add karo
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
        fontWeight: 700,
        color: '#000',
      }}>
        {person?.username?.charAt(0)?.toUpperCase() || '?'}
      </span>
    );
  };

  return (
    <>
      <style>{`
        :root {
          --gold: #C9A227;
          --gold-light: #F0D265;
          --gold-dark: #8F6B18;
          --bg-dark: #0A0A0C;
          --card-bg: rgba(22, 22, 26, 0.75);
          --card-border: rgba(201, 162, 39, 0.15);
          --card-border-hover: rgba(201, 162, 39, 0.4);
          --text-main: #F5F2EA;
          --text-muted: #8E8E93;
          --danger: #FF453A;
          --danger-bg: rgba(255, 69, 58, 0.1);
        }

        .friends-page {
          background-color: var(--bg-dark);
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          background-image: 
            radial-gradient(circle at 10% 10%, rgba(201, 162, 39, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(201, 162, 39, 0.03) 0%, transparent 50%);
          min-height: 100vh;
        }

        .friends-hero {
          padding: 45px 0 25px;
          border-bottom: 1px solid var(--card-border);
          background: linear-gradient(180deg, rgba(20,20,25,0.8) 0%, rgba(10,10,12,0) 100%);
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-user {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .friends-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--gold);
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.25);
          overflow: hidden;
          flex-shrink: 0;
        }

        .hero-info h1 {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          margin: 0 0 4px 0;
        }

        .hero-info p {
          margin: 0;
          color: var(--text-muted);
          font-size: 14px;
        }

        .stats-pills {
          display: flex;
          gap: 12px;
        }

        .stat-pill {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 10px 18px;
          border-radius: 12px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-pill .num {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: var(--gold-light);
          font-weight: 700;
        }

        .stat-pill .label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .dashboard-grid {
          max-width: 1200px;
          margin: 32px auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
        }

        .dash-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
          margin-bottom: 24px;
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: var(--gold-light);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .friend-search-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .friend-search-input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 12px rgba(201, 162, 39, 0.2);
        }

        .user-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .user-row:hover {
          border-color: var(--card-border-hover);
          background: rgba(201, 162, 39, 0.04);
          transform: translateY(-1px);
        }

        .user-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mini-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: #000;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .user-info .name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .user-info .sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        .btn-group {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: #000;
        }

        .btn-primary:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 10px rgba(201, 162, 39, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: none;
        }

        .btn-danger {
          background: var(--danger-bg);
          color: var(--danger);
          border: 1px solid rgba(255, 69, 58, 0.2);
        }

        .btn-danger:hover {
          background: rgba(255, 69, 58, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 30px;
          color: var(--text-muted);
          font-size: 13px;
          border: 1px dashed var(--card-border);
          border-radius: 10px;
        }

        @media (max-width: 850px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .hero-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
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
                <span style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'sans-serif' }}>
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