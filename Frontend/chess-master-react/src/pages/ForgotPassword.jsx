import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/forgot-password', {
        email: email.trim(),
      });

      setSuccess(
        response.data.message ||
        'Reset link has been sent to your email.'
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
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

        .forgot-page {
          background-color: var(--cm-bg);
          background-image:
            radial-gradient(
              circle at 50% 30%,
              rgba(201, 162, 39, 0.12) 0%,
              rgba(8, 8, 16, 1) 75%
            );
          background-attachment: fixed;
          color: var(--cm-ink);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .forgot-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        .forgot-wrap::before {
          content: '';
          position: absolute;
          width: 550px;
          height: 550px;
          background:
            radial-gradient(
              circle,
              rgba(201, 162, 39, 0.15) 0%,
              transparent 70%
            );
          top: -120px;
          left: -120px;
          pointer-events: none;
        }

        .forgot-wrap::after {
          content: '';
          position: absolute;
          width: 450px;
          height: 450px;
          background:
            radial-gradient(
              circle,
              rgba(143, 107, 24, 0.12) 0%,
              transparent 70%
            );
          bottom: -80px;
          right: 5%;
          pointer-events: none;
        }

        .forgot-card {
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

        .forgot-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cm-gold-lt);
          margin-bottom: 8px;
          display: block;
        }

        .forgot-title {
          font-family: 'Fraunces', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .forgot-sub {
          font-size: 14px;
          color: var(--cm-ink-dim);
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .forgot-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .forgot-alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .forgot-alert-success {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          color: #4ade80;
        }

        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .forgot-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.12em;
          color: var(--cm-ink-dim);
          text-transform: uppercase;
        }

        .forgot-form input {
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .forgot-form input:focus {
          border-color: var(--cm-gold);
          background: rgba(201, 162, 39, 0.05);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }

        .forgot-form input::placeholder {
          color: var(--cm-ink-faint);
        }

        .forgot-submit {
          padding: 14px;
          background:
            linear-gradient(
              135deg,
              var(--cm-gold-dk) 0%,
              var(--cm-gold) 100%
            );
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
          box-shadow: 0 6px 20px rgba(201, 162, 39, 0.25);
          margin-top: 6px;
        }

        .forgot-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201, 162, 39, 0.4);
        }

        .forgot-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .forgot-switch {
          text-align: center;
          font-size: 13px;
          color: var(--cm-ink-dim);
          margin-top: 24px;
        }

        .forgot-switch a {
          color: var(--cm-gold-lt);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .forgot-switch a:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .forgot-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 21px;
          background: rgba(201, 162, 39, 0.08);
          border: 1px solid rgba(201, 162, 39, 0.2);
        }

        @media (max-width: 480px) {
          .forgot-wrap {
            padding: 35px 16px;
          }

          .forgot-card {
            padding: 32px 24px;
          }

          .forgot-title {
            font-size: 1.9rem;
          }
        }
      `}</style>

      <div className="forgot-page">
        <div className="forgot-wrap">
          <div className="forgot-card">

            <div className="forgot-icon">
              🔐
            </div>

            <span className="forgot-kicker">
              Account Recovery
            </span>

            <h1 className="forgot-title">
              Forgot your password?
            </h1>

            <p className="forgot-sub">
              No worries. Enter your registered email and we'll
              send you a secure link to reset your password.
            </p>

            {error && (
              <div className="forgot-alert forgot-alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="forgot-alert forgot-alert-success">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="forgot-form"
            >
              <label>
                Email

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="forgot-submit"
                disabled={loading}
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Link →'}
              </button>
            </form>

            <p className="forgot-switch">
              Remember your password?{' '}
              <Link to="/login">
                Back to Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

