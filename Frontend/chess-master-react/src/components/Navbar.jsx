import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  // Mobile menu open/close ke liye state
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // AuthContext se user le rahe hain (EJS ke currentUser ki jagah)
  const { user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav
        style={{
          background: '#15120e',
          borderBottom: '1px solid rgba(243,234,217,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: "'Fraunces',serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#f3ead9',
            }}
          >
            <span style={{ fontSize: '22px', color: '#c9a227' }}>♞</span>
            ChessMaster
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            id="menuBtn"
            type="button"
            onClick={toggleMenu}
            style={{
              display: 'none', // Desktop pe hide, CSS mein mobile pe show
              background: 'transparent',
              border: '1px solid rgba(243,234,217,0.1)',
              color: '#f3ead9',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ☰
          </button>

          {/* Nav Links */}
          <div
            id="navLinks"
            className={menuOpen ? 'cm-open' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Link
              to="/"
              style={{
                padding: '7px 14px',
                color: '#b6a892',
                textDecoration: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
            >
              Home
            </Link>
            <Link
              to="/play"
              style={{
                padding: '7px 14px',
                color: '#b6a892',
                textDecoration: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
            >
              Play
            </Link>
            <Link
              to="/leaderboard"
              style={{
                padding: '7px 14px',
                color: '#b6a892',
                textDecoration: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
            >
              Leaderboard
            </Link>
            <Link
              to="/about"
              style={{
                padding: '7px 14px',
                color: '#b6a892',
                textDecoration: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
            >
              About
            </Link>

            {/* Agar user login hai toh profile dropdown dikhao, warna login/register */}
            {user ? (
              <div style={{ position: 'relative' }} onMouseLeave={() => setProfileMenuOpen(false)}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    color: '#f3ead9',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    transition: '.25s',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.profileImage || '/images/default-avatar.png'}
                    alt="Profile"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #c9a227',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#f3ead9',
                    }}
                  >
                    {user.username}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      background: '#1a1710',
                      border: '1px solid rgba(201,162,39,0.25)',
                      borderRadius: '12px',
                      minWidth: '170px',
                      overflow: 'hidden',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                      zIndex: 200,
                    }}
                  >
                    <Link to="/profile" onClick={() => setProfileMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#f3ead9', textDecoration: 'none', fontSize: '13px' }}>Profile</Link>
                    <Link to="/friends" onClick={() => setProfileMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#f3ead9', textDecoration: 'none', fontSize: '13px' }}>Friends</Link>
                    <Link to="/settings" onClick={() => setProfileMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#f3ead9', textDecoration: 'none', fontSize: '13px' }}>Settings</Link>
                    <button
                      type="button"
                      onClick={async () => { setProfileMenuOpen(false); await logout(); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', color: '#f87171', background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: '7px 14px',
                    color: '#b6a892',
                    textDecoration: 'none',
                    fontSize: '14px',
                    borderRadius: '8px',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '8px 18px',
                    background: 'linear-gradient(135deg,#c9a227,#a9791f)',
                    color: '#1a1408',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(201,162,39,0.3)',
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile responsive CSS — yeh EJS ke <style> tag ka same content hai */}
      <style>{`
        @media (max-width: 768px) {
          #menuBtn { display: block !important; }
          #navLinks { 
            display: none !important; 
            flex-direction: column; 
            position: absolute; 
            top: 60px; 
            left: 0; 
            right: 0; 
            background: #15120e; 
            border-bottom: 1px solid rgba(243,234,217,0.08); 
            padding: 16px 24px; 
            gap: 4px !important; 
          }
          #navLinks.cm-open { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;