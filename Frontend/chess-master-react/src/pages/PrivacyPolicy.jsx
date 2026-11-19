import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#e8f4ff',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#00e5ff', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to ChessMaster
        </Link>

        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '2rem',
          margin: '24px 0',
          color: '#fff',
          textTransform: 'uppercase',
        }}>
          Privacy Policy
        </h1>

        <p style={{ color: '#7d8ba8', marginBottom: '24px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <Section title="1. Information We Collect">
          We collect your email address when you register. We also store your username, profile information, and game statistics to provide the ChessMaster service.
        </Section>

        <Section title="2. How We Use Your Information">
          Your email is used only for account verification and password reset. We do not sell or share your email with third parties. Game data is used to calculate ratings and display your profile.
        </Section>

        <Section title="3. Email Communication">
          We use Google's Gmail API to send verification and password reset emails. Your email address is transmitted securely to Google for this purpose only. We do not send marketing emails.
        </Section>

        <Section title="4. Data Storage">
          Your data is stored securely in MongoDB Atlas. Passwords are hashed using bcrypt and never stored in plain text.
        </Section>

        <Section title="5. Cookies & Sessions">
          We use session cookies to keep you logged in. These are essential for the service to function. No third-party tracking cookies are used.
        </Section>

        <Section title="6. Your Rights">
          You can request deletion of your account and data at any time by contacting us. You can also update your profile information from your account settings.
        </Section>

        <Section title="7. Contact">
          For any privacy-related questions, contact us at: <a href="mailto:chessmaster.contact@gmail.com" style={{ color: '#00e5ff' }}>chessmaster.contact@gmail.com</a>
        </Section>

        <p style={{ marginTop: '40px', color: '#7d8ba8', fontSize: '14px' }}>
          By using ChessMaster, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontFamily: 'Chakra Petch, sans-serif',
        fontSize: '1.1rem',
        color: '#00e5ff',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {title}
      </h2>
      <p style={{ color: '#b8c6dc', lineHeight: '1.7', fontSize: '15px' }}>
        {children}
      </p>
    </div>
  );
}