import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(243,234,217,0.08)',
        background: '#15120e',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Fraunces',serif",
            fontSize: '16px',
            fontWeight: 700,
            color: '#f3ead9',
          }}
        >
          <span style={{ color: '#c9a227' }}>♞</span> ChessMaster
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link
            to="/"
            style={{ fontSize: '13px', color: '#7d715f', textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link
            to="/play"
            style={{ fontSize: '13px', color: '#7d715f', textDecoration: 'none' }}
          >
            Play
          </Link>
          <Link
            to="/about"
            style={{ fontSize: '13px', color: '#7d715f', textDecoration: 'none' }}
          >
            About
          </Link>
          <Link
            to="/leaderboard"
            style={{ fontSize: '13px', color: '#7d715f', textDecoration: 'none' }}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;