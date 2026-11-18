import { useState } from 'react';
import { Link } from 'react-router-dom';
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

/* Animated grid backdrop */
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

/* Ambient glows */
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

/* =========================================================
   BUTTON
   ========================================================= */
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

.cm2-btn:disabled{
  opacity:0.55;
  cursor:not-allowed;
  transform:none;
}

/* Corner brackets */
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
.cm2-corners::before{
  top:3px; left:3px;
  border-right:0; border-bottom:0;
}
.cm2-corners::after{
  bottom:3px; right:3px;
  border-left:0; border-top:0;
}

/* =========================================================
   FORGOT WRAP + CARD
   ========================================================= */
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
  background:radial-gradient(circle,rgba(0,229,255,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}

.forgot-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(255,45,149,0.12) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.forgot-card{
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

/* HUD corner brackets on card */
.forgot-card::before,
.forgot-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.forgot-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.forgot-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

/* =========================================================
   ICON
   ========================================================= */
.forgot-icon{
  width:52px;
  height:52px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:22px;
  font-size:22px;
  background:rgba(0,229,255,.08);
  border:1px solid rgba(0,229,255,.35);
  box-shadow:
    inset 0 0 20px rgba(0,229,255,.15),
    0 0 20px rgba(0,229,255,.25);
}

/* =========================================================
   HEADINGS
   ========================================================= */
.forgot-kicker{
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

.forgot-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.forgot-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.forgot-title{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.7rem, 4vw, 2.2rem);
  font-weight:800;
  letter-spacing:-0.01em;
  text-transform:uppercase;
  line-height:1.05;
}

.forgot-sub{
  margin:0 0 26px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* =========================================================
   ALERTS
   ========================================================= */
.forgot-alert{
  padding:12px 16px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  margin-bottom:22px;
  line-height:1.55;
}

.forgot-alert-error{
  background:rgba(255,45,149,.08);
  border:1px solid rgba(255,45,149,.35);
  color:#ff6bb0;
  box-shadow:inset 0 0 14px rgba(255,45,149,.1);
}

.forgot-alert-success{
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.35);
  color:#b6ff3c;
  box-shadow:inset 0 0 14px rgba(182,255,60,.1);
}

/* =========================================================
   FORM
   ========================================================= */
.forgot-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.forgot-form label{
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

.forgot-form input{
  padding:13px 16px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.22);
  border-radius:6px;
  color:#ffffff;
  font-family:'Inter', system-ui, sans-serif;
  font-size:14px;
  outline:none;
  transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
  width:100%;
}

.forgot-form input:focus{
  border-color:#00e5ff;
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 0 3px rgba(0,229,255,.15),
    0 0 22px rgba(0,229,255,.25),
    inset 0 0 10px rgba(0,229,255,.06);
}

.forgot-form input::placeholder{
  color:#5a6684;
  letter-spacing:.02em;
}

/* =========================================================
   SWITCH LINK
   ========================================================= */
.forgot-switch{
  text-align:center;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  color:#7d8ba8;
  margin-top:26px;
  text-transform:uppercase;
}

.forgot-switch a{
  color:#00e5ff;
  text-decoration:none;
  font-weight:800;
  transition:color .18s ease, text-shadow .18s ease;
}

.forgot-switch a:hover{
  color:#a8f8ff;
  text-shadow:0 0 10px rgba(0,229,255,.7);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:560px){
  .forgot-wrap{
    padding:46px 18px;
  }
  .forgot-card{
    padding:30px 22px;
  }
  .forgot-title{
    font-size:1.7rem;
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
                className="cm2-btn cm2-btn-primary cm2-corners"
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