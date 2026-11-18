import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
   RESET WRAP + CARD
   ========================================================= */
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
  background:radial-gradient(circle,rgba(0,229,255,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}

.reset-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(255,45,149,0.12) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.reset-card{
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
.reset-card::before,
.reset-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.reset-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.reset-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

/* =========================================================
   ICON
   ========================================================= */
.reset-icon{
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
.reset-kicker{
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

.reset-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.reset-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.reset-title{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.7rem, 4vw, 2.2rem);
  font-weight:800;
  letter-spacing:-0.01em;
  text-transform:uppercase;
  line-height:1.05;
}

.reset-sub{
  margin:0 0 26px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* =========================================================
   ALERTS
   ========================================================= */
.reset-alert{
  padding:12px 16px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  margin-bottom:22px;
  line-height:1.55;
}

.reset-alert-error{
  background:rgba(255,45,149,.08);
  border:1px solid rgba(255,45,149,.35);
  color:#ff6bb0;
  box-shadow:inset 0 0 14px rgba(255,45,149,.1);
}

.reset-alert-success{
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.35);
  color:#b6ff3c;
  box-shadow:inset 0 0 14px rgba(182,255,60,.1);
}

/* =========================================================
   FORM
   ========================================================= */
.reset-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.reset-form label{
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

.reset-form input{
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

.reset-form input:focus{
  border-color:#00e5ff;
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 0 3px rgba(0,229,255,.15),
    0 0 22px rgba(0,229,255,.25),
    inset 0 0 10px rgba(0,229,255,.06);
}

.reset-form input::placeholder{
  color:#5a6684;
  letter-spacing:.02em;
}

/* =========================================================
   NOTE + SWITCH
   ========================================================= */
.reset-note{
  margin-top:22px;
  padding-top:18px;
  border-top:1px solid rgba(0,229,255,.14);
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  color:#7d8ba8;
  text-align:center;
  line-height:1.65;
  letter-spacing:.08em;
}

.reset-switch{
  text-align:center;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  color:#7d8ba8;
  margin-top:26px;
  text-transform:uppercase;
}

.reset-switch a{
  color:#00e5ff;
  text-decoration:none;
  font-weight:800;
  transition:color .18s ease, text-shadow .18s ease;
}

.reset-switch a:hover{
  color:#a8f8ff;
  text-shadow:0 0 10px rgba(0,229,255,.7);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:560px){
  .reset-wrap{
    padding:46px 18px;
  }
  .reset-card{
    padding:30px 22px;
  }
  .reset-title{
    font-size:1.6rem;
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
                className="cm2-btn cm2-btn-primary cm2-corners"
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