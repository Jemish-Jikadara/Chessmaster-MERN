import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const pageStyles = `
.h-page{
  --h-bg:#0f1411;
  --h-panel:#1b241d;
  --h-panel-2:#222d24;
  --h-line:rgba(255,255,255,0.09);
  --h-text:#f5f7f1;
  --h-muted:#aeb7aa;
  --h-soft:#d7ded0;
  --h-green:#81b64c;
  --h-green-2:#95c95e;
  --h-dark-green:#5d8b32;
  --h-gold:#f0c15b;
  --h-orange:#e58b42;
  background:
    linear-gradient(180deg,rgba(129,182,76,0.08),transparent 360px),
    radial-gradient(circle at 15% 8%,rgba(129,182,76,0.18),transparent 34%),
    radial-gradient(circle at 85% 12%,rgba(240,193,91,0.1),transparent 32%),
    var(--h-bg);
  color:var(--h-text);
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

.h-page *{ box-sizing:border-box; }

.cm2-wrap{
  width:min(1180px,calc(100% - 40px));
  margin:0 auto;
}

.cm2-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:var(--h-green-2);
  font-size:12px;
  line-height:1;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.14em;
  margin-bottom:18px;
}

.cm2-eyebrow .sq{
  width:9px;
  height:9px;
  border-radius:2px;
  background:var(--h-green);
  box-shadow:0 0 0 5px rgba(129,182,76,.12);
}

.cm2-h1{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2.2rem,5vw,3.2rem);
  line-height:1.02;
  letter-spacing:0;
  font-weight:900;
}

.cm2-accent{
  color:var(--h-green-2);
}

.cm2-sub{
  max-width:520px;
  margin:14px 0 0;
  color:var(--h-muted);
  font-size:15px;
  line-height:1.7;
}

.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  min-height:48px;
  padding:0 20px;
  border-radius:8px;
  font-size:15px;
  font-weight:850;
  text-decoration:none;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  width:100%;
}

.cm2-btn:hover{
  transform:translateY(-2px);
}

.cm2-btn-primary{
  color:#10180e;
  background:linear-gradient(180deg,#9bd761,#7fb64a);
  box-shadow:0 16px 30px rgba(129,182,76,.25), inset 0 1px rgba(255,255,255,.45);
}

.cm2-btn-primary:hover{
  background:linear-gradient(180deg,#a8e372,#82bd4a);
  box-shadow:0 20px 38px rgba(129,182,76,.32), inset 0 1px rgba(255,255,255,.55);
}

.cm2-btn:disabled{
  opacity:0.6;
  cursor:not-allowed;
  transform:none;
}

/* Reset specific */
.reset-wrap{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 24px;
  position:relative;
  overflow:hidden;
}

.reset-wrap::before{
  content:'';
  position:absolute;
  width:550px;
  height:550px;
  background:radial-gradient(circle,rgba(129,182,76,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}

.reset-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(240,193,91,0.1) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.reset-card{
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:36px 32px;
  width:100%;
  max-width:420px;
  position:relative;
  z-index:1;
  box-shadow:0 16px 36px rgba(0,0,0,.35);
}

.reset-icon{
  width:46px;
  height:46px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:20px;
  font-size:21px;
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.24);
}

.reset-kicker{
  display:block;
  color:var(--h-green-2);
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:8px;
}

.reset-title{
  margin:0 0 8px;
  color:var(--h-text);
  font-size:2.2rem;
  font-weight:900;
}

.reset-sub{
  margin:0 0 24px;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

.reset-alert{
  padding:12px 16px;
  border-radius:10px;
  font-size:13px;
  margin-bottom:20px;
  line-height:1.5;
}

.reset-alert-error{
  background:rgba(239,68,68,0.1);
  border:1px solid rgba(239,68,68,0.25);
  color:#f87171;
}

.reset-alert-success{
  background:rgba(74,222,128,0.1);
  border:1px solid rgba(74,222,128,0.25);
  color:#4ade80;
}

.reset-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.reset-form label{
  display:flex;
  flex-direction:column;
  gap:8px;
  font-size:11px;
  font-weight:800;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:.12em;
}

.reset-form input{
  padding:13px 16px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  color:#ffffff;
  font-size:14px;
  outline:none;
  transition:all .2s ease;
  box-sizing:border-box;
  width:100%;
}

.reset-form input:focus{
  border-color:var(--h-green);
  background:rgba(129,182,76,.06);
  box-shadow:0 0 0 3px rgba(129,182,76,.15);
}

.reset-form input::placeholder{
  color:var(--h-muted);
}

.reset-note{
  margin-top:18px;
  padding-top:16px;
  border-top:1px solid rgba(255,255,255,.07);
  font-size:11px;
  color:var(--h-muted);
  text-align:center;
  line-height:1.5;
}

.reset-switch{
  text-align:center;
  font-size:13px;
  color:var(--h-muted);
  margin-top:24px;
}

.reset-switch a{
  color:var(--h-green-2);
  text-decoration:none;
  font-weight:850;
  transition:color .18s ease;
}

.reset-switch a:hover{
  color:var(--h-green);
  text-decoration:underline;
}

/* Responsive */
@media (max-width:560px){
  .cm2-wrap{
    width:min(100% - 24px,1180px);
  }
  .reset-wrap{
    padding:46px 18px;
  }
  .reset-card{
    padding:28px 22px;
  }
  .reset-title{
    font-size:1.9rem;
  }
}
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/reset-password/${token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      setSuccess(
        response.data.message ||
        'Password reset successfully.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Reset link is invalid or has expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <div className="reset-wrap">
          <div className="reset-card">
            <div className="reset-icon">🔑</div>

            <span className="reset-kicker">Secure Account</span>

            <h1 className="reset-title">Create new password</h1>

            <p className="reset-sub">
              Choose a strong new password for your ChessMaster account.
            </p>

            {error && (
              <div className="reset-alert reset-alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="reset-alert reset-alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="reset-form">
              <label>
                New Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </label>

              <button
                type="submit"
                className="cm2-btn cm2-btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password →'}
              </button>
            </form>

            <p className="reset-note">
              Your reset link is valid for 15 minutes.
              <br />
              After changing your password, you'll be redirected to login.
            </p>

            <p className="reset-switch">
              Remember your password?{' '}
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;