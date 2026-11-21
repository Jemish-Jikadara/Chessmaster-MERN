import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.h-page{
  position:relative;
  background:#050510;
  color:#e8f4ff;
  font-family:'Inter', system-ui, sans-serif;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  overflow-x:hidden;
}

.h-page::before{
  content:'';
  position:fixed;
  inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  pointer-events:none;
  z-index:0;
  animation:h-grid 24s linear infinite;
}

.h-page::after{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
    radial-gradient(800px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%);
  pointer-events:none;
  z-index:0;
}

@keyframes h-grid{
  0%{ background-position:0 0, 0 0; }
  100%{ background-position:52px 52px, 52px 52px; }
}

.h-page > *{ position:relative; z-index:1; }
.h-page *{ box-sizing:border-box; }

/* EYEBROW */
.cm2-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  line-height:1;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:18px;
}
.cm2-eyebrow::before{ content:'['; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }
.cm2-eyebrow::after{ content:']'; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }

/* BUTTON */
.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:48px;
  padding:0 22px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  border:1px solid transparent;
  cursor:pointer;
  position:relative;
  transition:transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease;
  width:100%;
  overflow:hidden;
}
.cm2-btn:hover{ transform:translateY(-2px); }

.cm2-btn-primary{
  color:#050510;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  box-shadow:
    0 0 20px rgba(0,229,255,0.55),
    0 0 44px rgba(0,229,255,0.25),
    inset 0 0 10px rgba(255,255,255,0.4);
}
.cm2-btn-primary:hover{
  box-shadow:
    0 0 30px rgba(0,229,255,0.8),
    0 0 60px rgba(0,229,255,0.4),
    inset 0 0 12px rgba(255,255,255,0.55);
}
.cm2-btn-primary::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  transform:translateX(-100%);
  transition:transform .5s ease;
}
.cm2-btn-primary:hover::after{ transform:translateX(100%); }
.cm2-btn:disabled{ opacity:0.55; cursor:not-allowed; transform:none; }

.cm2-corners{ position:relative; }
.cm2-corners::before,
.cm2-corners::after{
  content:'';
  position:absolute;
  width:8px; height:8px;
  border:1px solid currentColor;
  opacity:0.55;
  pointer-events:none;
  z-index:2;
}
.cm2-corners::before{ top:3px; left:3px; border-right:0; border-bottom:0; }
.cm2-corners::after{ bottom:3px; right:3px; border-left:0; border-top:0; }

/* LOGIN WRAP + CARD */
.login-wrap{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 24px;
  position:relative;
  overflow:hidden;
}
.login-wrap::before{
  content:'';
  position:absolute;
  width:550px;
  height:550px;
  background:radial-gradient(circle,rgba(0,229,255,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}
.login-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(255,45,149,0.12) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.login-card{
  position:relative;
  z-index:1;
  width:100%;
  max-width:440px;
  padding:40px 34px;
  border-radius:8px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.04)),
    #08081a;
  border:1px solid rgba(0,229,255,.35);
  box-shadow:
    0 0 60px rgba(0,229,255,.18),
    0 0 120px rgba(255,45,149,.1),
    inset 0 0 60px rgba(0,229,255,.06);
}
.login-card::before,
.login-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.login-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.login-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.login-kicker{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:14px;
}
.login-kicker::before{ content:'['; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }
.login-kicker::after{ content:']'; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }

.login-title{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.8rem, 4vw, 2.4rem);
  font-weight:800;
  letter-spacing:-0.01em;
  text-transform:uppercase;
  line-height:1.05;
}

.login-sub{
  margin:0 0 26px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* ALERTS */
.login-alert{
  padding:12px 16px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  margin-bottom:22px;
}
.login-alert-error{
  background:rgba(255,45,149,.08);
  border:1px solid rgba(255,45,149,.35);
  color:#ff6bb0;
  box-shadow:inset 0 0 14px rgba(255,45,149,.1);
}
.login-alert-success{
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.35);
  color:#b6ff3c;
  box-shadow:inset 0 0 14px rgba(182,255,60,.1);
}

/* RESEND BOX */
.resend-box{
  margin-top:-10px;
  margin-bottom:22px;
  padding:14px 16px;
  background:rgba(0,229,255,.06);
  border:1px solid rgba(0,229,255,.3);
  border-radius:6px;
  text-align:center;
}
.resend-box p{
  margin:0 0 10px;
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
}
.resend-box button{
  width:100%;
  min-height:42px;
  padding:0 16px;
  border:none;
  border-radius:4px;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  color:#050510;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:800;
  letter-spacing:.14em;
  text-transform:uppercase;
  cursor:pointer;
  transition:box-shadow .22s ease, transform .18s ease;
}
.resend-box button:hover{
  box-shadow:0 0 22px rgba(0,229,255,.7);
  transform:translateY(-1px);
}
.resend-box button:disabled{ opacity:.55; cursor:not-allowed; transform:none; }

.resend-msg{
  margin-top:10px !important;
  color:#b6ff3c !important;
  font-family:'Inter', system-ui, sans-serif !important;
  font-size:12px !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  font-weight:500 !important;
}

/* FORM */
.login-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}
.login-form label{
  display:flex;
  flex-direction:column;
  gap:9px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  font-weight:700;
  color:#00e5ff;
  text-transform:uppercase;
  letter-spacing:.2em;
}
.login-form input{
  padding:13px 16px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.22);
  border-radius:6px;
  color:#ffffff;
  font-family:'Inter', system-ui, sans-serif;
  font-size:14px;
  outline:none;
  transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.login-form input:focus{
  border-color:#00e5ff;
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 0 3px rgba(0,229,255,.15),
    0 0 22px rgba(0,229,255,.25),
    inset 0 0 10px rgba(0,229,255,.06);
}
.login-form input::placeholder{ color:#5a6684; letter-spacing:.02em; }

.forgot-password-link{ margin-top:-6px; }
.forgot-password-link a{
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  transition:color .18s ease, text-shadow .18s ease;
}
.forgot-password-link a:hover{
  color:#a8f8ff;
  text-shadow:0 0 10px rgba(0,229,255,.7);
}

.login-switch{
  text-align:center;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  color:#7d8ba8;
  margin-top:26px;
  text-transform:uppercase;
}
.login-switch a{
  color:#00e5ff;
  text-decoration:none;
  font-weight:800;
  transition:color .18s ease, text-shadow .18s ease;
}
.login-switch a:hover{
  color:#a8f8ff;
  text-shadow:0 0 10px rgba(0,229,255,.7);
}

@media (max-width:560px){
  .login-wrap{ padding:46px 18px; }
  .login-card{ padding:30px 22px; }
  .login-title{ font-size:1.7rem; }
}
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Email verification states
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      await api.post('/resend-verification', { email: unverifiedEmail });
      setResendMsg('✅ Verification email sent! Check your inbox.');
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUnverifiedEmail('');
    setResendMsg('');
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);

      if (data.needsProfileSetup) {
        // Email send first 
        if(data.email){
          localStorage.setItem('verifiedEmail', data.email);
        }
        setSuccess("Almost there — let's finish setting up your profile.");
        setTimeout(() => navigate('/setup-profile'), 800);
        return;
      }

      setSuccess('Login successful!');
      setTimeout(() => navigate('/profile'), 600);
    } catch (err) {
      const data = err?.response?.data;

      if (data?.needsEmailVerification) {
        setError('Please verify your email first. Check your inbox.');
        setUnverifiedEmail(formData.email);
      } else {
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <div className="login-wrap">
          <div className="login-card">
            <span className="login-kicker">Player Login</span>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">
              Login to continue your chess journey and save your match history.
            </p>

            {error && (
              <div className="login-alert login-alert-error">{error}</div>
            )}

            {unverifiedEmail && (
              <div className="resend-box">
                <p>Didn't get the email?</p>
                <button onClick={handleResend} disabled={resendLoading}>
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
                {resendMsg && <p className="resend-msg">{resendMsg}</p>}
              </div>
            )}

            {success && (
              <div className="login-alert login-alert-success">{success}</div>
            )}

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
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="cm2-btn cm2-btn-primary cm2-corners"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            <p className="login-switch">
              New to ChessMaster? <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;