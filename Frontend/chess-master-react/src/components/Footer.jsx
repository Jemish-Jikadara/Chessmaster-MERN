import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="cm-nav">
        <div className="cm-nav-inner">
          <Link to="/" className="cm-brand" onClick={() => setMenuOpen(false)}>
            <span className="cm-brand-icon">♞</span>
            <span>ChessMaster</span>
          </Link>

          <button
            id="menuBtn"
            className="cm-menu-btn"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div
            id="navLinks"
            className={`cm-nav-links ${menuOpen ? 'cm-open' : ''}`}
          >
            <Link to="/" className="cm-nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/play" className="cm-nav-link" onClick={() => setMenuOpen(false)}>
              Play
            </Link>
            <Link to="/leaderboard" className="cm-nav-link" onClick={() => setMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/about" className="cm-nav-link" onClick={() => setMenuOpen(false)}>
              About
            </Link>

            {user ? (
              <div
                className="cm-profile-wrap"
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button
                  type="button"
                  className="cm-profile-btn"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                >
                  <img
                    src={user.profileImage || '/images/default-avatar.png'}
                    alt="Profile"
                    className="cm-profile-img"
                  />
                  <span className="cm-profile-name">{user.username}</span>
                  <span className="cm-profile-arrow">▾</span>
                </button>

                {profileMenuOpen && (
                  <div className="cm-profile-menu">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="cm-profile-item"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/friends"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="cm-profile-item"
                    >
                      Friends
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="cm-profile-item"
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        setMenuOpen(false);
                        await logout();
                      }}
                      className="cm-profile-item cm-logout-btn"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="cm-auth-links">
              </div>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        .cm-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 20, 17, 0.88);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.22);
        }

        .cm-nav-inner {
          max-width: 1180px;
          height: 66px;
          margin: 0 auto;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .cm-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #f5f7f1;
          text-decoration: none;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .cm-brand-icon {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #10180e;
          background: linear-gradient(180deg, #9bd761, #7fb64a);
          font-size: 22px;
          box-shadow: 0 12px 24px rgba(129,182,76,0.24), inset 0 1px rgba(255,255,255,0.42);
        }

        .cm-menu-btn {
          display: none;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          color: #f5f7f1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px;
          cursor: pointer;
          font-size: 20px;
        }

        .cm-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cm-nav-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 13px;
          color: #b9c2b3;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
          border-radius: 8px;
          transition: color .18s ease, background .18s ease, transform .18s ease;
        }

        .cm-nav-link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.075);
          transform: translateY(-1px);
        }

        .cm-auth-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        

        .cm-profile-wrap {
          position: relative;
          margin-left: 4px;
        }

        .cm-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 42px;
          padding: 4px 10px 4px 5px;
          color: #f5f7f1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          cursor: pointer;
          transition: background .18s ease, border-color .18s ease;
        }

        .cm-profile-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(129,182,76,0.32);
        }

        .cm-profile-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #81b64c;
        }

        .cm-profile-name {
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 850;
        }

        .cm-profile-arrow {
          color: #9bd761;
          font-size: 12px;
          line-height: 1;
        }

        .cm-profile-menu {
          position: absolute;
          right: 0;
          top: 52px;
          min-width: 190px;
          overflow: hidden;
          background: #151c17;
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 12px;
          box-shadow: 0 24px 54px rgba(0,0,0,0.44);
        }

        .cm-profile-item {
          display: block;
          width: 100%;
          padding: 12px 15px;
          color: #e9eee3;
          background: transparent;
          border: none;
          text-align: left;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
          transition: background .16s ease, color .16s ease;
        }

        .cm-profile-item:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.075);
        }

        .cm-logout-btn {
          color: #ff8585;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .cm-logout-btn:hover {
          color: #ff9c9c;
          background: rgba(248,113,113,0.1);
        }

        @media (max-width: 768px) {
          .cm-nav-inner {
            height: 62px;
            padding: 0 14px;
          }

          .cm-menu-btn {
            display: inline-flex;
          }

          .cm-nav-links {
            display: none;
            position: absolute;
            top: 62px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 6px;
            padding: 12px 14px 16px;
            background: rgba(15, 20, 17, 0.97);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 22px 40px rgba(0,0,0,0.28);
          }

          .cm-nav-links.cm-open {
            display: flex;
          }

          .cm-nav-link,
          .cm-register-btn {
            width: 100%;
            justify-content: flex-start;
            min-height: 42px;
          }

          .cm-auth-links {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 6px;
          }

          .cm-profile-wrap {
            width: 100%;
            margin-left: 0;
          }

          .cm-profile-btn {
            width: 100%;
            border-radius: 10px;
            justify-content: flex-start;
          }

          .cm-profile-name {
            flex: 1;
            text-align: left;
          }

          .cm-profile-menu {
            position: static;
            min-width: 100%;
            margin-top: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;