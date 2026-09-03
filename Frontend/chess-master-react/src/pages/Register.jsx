import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    // mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('RSGISTER SUCCSESS');
    setError('');
    setSuccess('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

   setLoading(true);

    try {
      await register(formData);
      setSuccess('Account created! Let\'s set up your profile...');
      setTimeout(() => navigate('/setup-profile'), 800);
    } catch (err) {
      console.log("Registration error:", err);
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

        .reg-page {
          background-color: var(--cm-bg);
          background-image: radial-gradient(circle at 50% 30%, rgba(201, 162, 39, 0.12) 0%, rgba(8, 8, 16, 1) 75%);
          background-attachment: fixed;
          color: var(--cm-ink);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .reg-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        .reg-wrap::before {
          content: '';
          position: absolute;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
          top: -120px;
          left: -120px;
          pointer-events: none;
        }

        .reg-wrap::after {
          content: '';
          position: absolute;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(143, 107, 24, 0.12) 0%, transparent 70%);
          bottom: -80px;
          right: 5%;
          pointer-events: none;
        }

        .reg-card {
          background: var(--cm-bg-2);
          border: 1px solid var(--cm-line);
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
        }

        .reg-steps {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .reg-step-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .reg-step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        .reg-step-dot.active {
          background: linear-gradient(135deg, var(--cm-gold-dk) 0%, var(--cm-gold) 100%);
          color: #fff;
        }

        .reg-step-dot.inactive {
          background: rgba(255,255,255,0.08);
          color: var(--cm-ink-faint);
        }

        .reg-step-label {
          color: var(--cm-ink-faint);
          font-size: 12px;
        }

        .reg-step-label.active {
          color: var(--cm-gold-lt);
        }

        .reg-step-line {
          flex: 1;
          height: 1px;
          background: var(--cm-line);
        }

        .reg-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cm-gold-lt);
          margin-bottom: 8px;
          display: block;
        }

        .reg-title {
          font-family: 'Fraunces', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .reg-sub {
          font-size: 14px;
          color: var(--cm-ink-dim);
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .reg-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .reg-alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .reg-alert-success {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          color: #4ade80;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .reg-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.12em;
          color: var(--cm-ink-dim);
          text-transform: uppercase;
        }

        .reg-form input {
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

        .reg-form input:focus {
          border-color: var(--cm-gold);
          background: rgba(201, 162, 39, 0.05);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }

        .reg-form input::placeholder {
          color: var(--cm-ink-faint);
        }

        .reg-submit {
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

        .reg-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201, 162, 39, 0.4);
        }

        .reg-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reg-switch {
          text-align: center;
          font-size: 13px;
          color: var(--cm-ink-dim);
          margin-top: 24px;
        }

        .reg-switch a {
          color: var(--cm-gold-lt);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .reg-switch a:hover {
          color: #ffffff;
          text-decoration: underline;
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-wrap">
          <div className="reg-card">
            {/* Steps Indicator */}
            <div className="reg-steps">
              <div className="reg-step-item">
                <div className="reg-step-dot active">1</div>
                <span className="reg-step-label active">Account</span>
              </div>
              <div className="reg-step-line"></div>
              <div className="reg-step-item">
                <div className="reg-step-dot inactive">2</div>
                <span className="reg-step-label">Profile</span>
              </div>
            </div>

            <span className="reg-kicker">Player Registration</span>
            <h1 className="reg-title">Create Account</h1>
            <p className="reg-sub">Enter your email and password to get started.</p>

            {/* Error Message */}
            {error && (
              <div className="reg-alert reg-alert-error">{error}</div>
            )}

            {/* Success Message */}
            {success && (
              <div className="reg-alert reg-alert-success">{success}</div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="reg-form">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* <label>
                Mobile Number
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </label> */}

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className="reg-submit" disabled={loading}>
                {loading ? 'Creating...' : 'Continue →'}
              </button>
            </form>

            <p className="reg-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;