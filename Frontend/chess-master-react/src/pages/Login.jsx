import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Flash messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);

      if (data.needsProfileSetup) {
        setSuccess('Almost there — let\'s finish setting up your profile.');
        setTimeout(() => navigate('/setup-profile'), 800);
        return;
      }

      setSuccess('Login successful!');
      setTimeout(() => navigate('/profile'), 600);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --cm-gold: #C9A227;
          --cm-gold-lt: #F0D265;
          --cm-gold-dk: #8F6B18;
          --cm-bg: #080810;
          --cm-bg-2: #13131d;
          --cm-line: rgba(201, 162, 39, 0.2);
          --cm-ink: #f3f4f6;
          --cm-ink-dim: #9ca3af;
          --cm-ink-faint: #6b7280;
        }

        .login-page {
          background-color: var(--cm-bg);
          background-image: radial-gradient(circle at 50% 30%, rgba(201, 162, 39, 0.12) 0%, rgba(8, 8, 16, 1) 75%);
          background-attachment: fixed;
          color: var(--cm-ink);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .login-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        .login-wrap::before {
          content: '';
          position: absolute;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
          top: -120px;
          left: -120px;
          pointer-events: none;
        }

        .login-wrap::after {
          content: '';
          position: absolute;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(143, 107, 24, 0.12) 0%, transparent 70%);
          bottom: -80px;
          right: 5%;
          pointer-events: none;
        }

        .login-card {
          background: var(--cm-bg-2);
          border: 1px solid var(--cm-line);
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
        }

        .login-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cm-gold-lt);
          margin-bottom: 8px;
          display: block;
        }

        .login-title {
          font-family: 'Fraunces', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .login-sub {
          font-size: 14px;
          color: var(--cm-ink-dim);
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .login-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .login-alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .login-alert-success {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          color: #4ade80;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.12em;
          color: var(--cm-ink-dim);
          text-transform: uppercase;
        }

        .login-form input {
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }

        .login-form input:focus {
          border-color: var(--cm-gold);
          background: rgba(201, 162, 39, 0.05);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }

        .login-form input::placeholder {
          color: var(--cm-ink-faint);
        }

        .login-submit {
          padding: 14px;
          background: linear-gradient(135deg, var(--cm-gold-dk) 0%, var(--cm-gold) 100%);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 6px 20px rgba(201, 162, 39, 0.25);
          margin-top: 6px;
        }

        .login-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201, 162, 39, 0.4);
        }

        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .login-switch {
          text-align: center;
          font-size: 13px;
          color: var(--cm-ink-dim);
          margin-top: 24px;
        }

        .login-switch a {
          color: var(--cm-gold-lt);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .login-switch a:hover {
          color: #ffffff;
          text-decoration: underline;
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrap">
          <div className="login-card">
            <span className="login-kicker">Player Login</span>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">
              Login to continue your chess journey and save your match history.
            </p>

            {/* Error Message */}
            {error && (
              <div className="login-alert login-alert-error">{error}</div>
            )}

            {/* Success Message */}
            {success && (
              <div className="login-alert login-alert-success">{success}</div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="forgot-password-link">
  <Link to="/forgot-password">
    Forgot Password?
  </Link>
</div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            <p className="login-switch">
              New to ChessMaster? <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;