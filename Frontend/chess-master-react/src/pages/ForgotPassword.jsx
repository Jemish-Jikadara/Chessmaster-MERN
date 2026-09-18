import { useState } from 'react';
import { Link } from 'react-router-dom';
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

/* Forgot specific */
.forgot-wrap{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 24px;
  position:relative;
  overflow:hidden;
}

.forgot-wrap::before{
  content:'';
  position:absolute;
  width:550px;
  height:550px;
  background:radial-gradient(circle,rgba(129,182,76,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}

.forgot-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(240,193,91,0.1) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.forgot-card{
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

.forgot-icon{
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

.forgot-kicker{
  display:block;
  color:var(--h-green-2);
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:8px;
}

.forgot-title{
  margin:0 0 8px;
  color:var(--h-text);
  font-size:2.2rem;
  font-weight:900;
}

.forgot-sub{
  margin:0 0 24px;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

.forgot-alert{
  padding:12px 16px;
  border-radius:10px;
  font-size:13px;
  margin-bottom:20px;
  line-height:1.5;
}

.forgot-alert-error{
  background:rgba(239,68,68,0.1);
  border:1px solid rgba(239,68,68,0.25);
  color:#f87171;
}

.forgot-alert-success{
  background:rgba(74,222,128,0.1);
  border:1px solid rgba(74,222,128,0.25);
  color:#4ade80;
}

.forgot-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.forgot-form label{
  display:flex;
  flex-direction:column;
  gap:8px;
  font-size:11px;
  font-weight:800;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:.12em;
}

.forgot-form input{
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

.forgot-form input:focus{
  border-color:var(--h-green);
  background:rgba(129,182,76,.06);
  box-shadow:0 0 0 3px rgba(129,182,76,.15);
}

.forgot-form input::placeholder{
  color:var(--h-muted);
}

.forgot-switch{
  text-align:center;
  font-size:13px;
  color:var(--h-muted);
  margin-top:24px;
}

.forgot-switch a{
  color:var(--h-green-2);
  text-decoration:none;
  font-weight:850;
  transition:color .18s ease;
}

.forgot-switch a:hover{
  color:var(--h-green);
  text-decoration:underline;
}

/* Responsive */
@media (max-width:560px){
  .cm2-wrap{
    width:min(100% - 24px,1180px);
  }
  .forgot-wrap{
    padding:46px 18px;
  }
  .forgot-card{
    padding:28px 22px;
  }
  .forgot-title{
    font-size:1.9rem;
  }
}
`;

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
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <div className="forgot-wrap">
          <div className="forgot-card">
            <div className="forgot-icon">🔐</div>

            <span className="forgot-kicker">Account Recovery</span>

            <h1 className="forgot-title">Forgot your password?</h1>

            <p className="forgot-sub">
              No worries. Enter your registered email and we'll send you a secure link to reset your password.
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

            <form onSubmit={handleSubmit} className="forgot-form">
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
                className="cm2-btn cm2-btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>

            <p className="forgot-switch">
              Remember your password?{' '}
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;