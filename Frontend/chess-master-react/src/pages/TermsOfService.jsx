import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <p style={{ color: '#7d8ba8', marginBottom: '24px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <Section title="1. Acceptance of Terms">
          By creating an account on ChessMaster, you agree to these Terms of Service. If you do not agree, please do not use the service.
        </Section>

        <Section title="2. Account Responsibility">
          You are responsible for maintaining the confidentiality of your password. You must verify your email address to activate your account. Do not share your account with others.
        </Section>

        <Section title="3. Acceptable Use">
          You agree not to:
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>Use cheats, bots, or engines during live games</li>
            <li>Harass or abuse other players</li>
            <li>Attempt to hack or disrupt the service</li>
            <li>Create fake accounts or impersonate others</li>
          </ul>
        </Section>

        <Section title="4. Fair Play">
          ChessMaster is a fair-play platform. Using chess engines or external assistance during rated games is strictly prohibited and may result in account termination.
        </Section>

        <Section title="5. Game Results">
          Game results and rating changes are final once a game is completed. Disconnections may be treated as a loss per standard online chess rules.
        </Section>

        <Section title="6. Account Termination">
          We reserve the right to suspend or terminate accounts that violate these terms, engage in cheating, or misuse the platform.
        </Section>

        <Section title="7. Service Availability">
          The service is provided "as is" without warranty. We do not guarantee uninterrupted availability and may perform maintenance at any time.
        </Section>

        <Section title="8. Changes to Terms">
          We may update these terms from time to time. Continued use of the service after changes means you accept the new terms.
        </Section>

        <Section title="9. Contact">
          Questions? Email us at: <a href="mailto:chessmaster.contact@gmail.com" style={{ color: '#00e5ff' }}>chessmaster.contact@gmail.com</a>
        </Section>
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
      <div style={{ color: '#b8c6dc', lineHeight: '1.7', fontSize: '15px' }}>
        {children}
      </div>
    </div>
  );
}