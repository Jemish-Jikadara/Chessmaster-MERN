import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

.cm2-btn:disabled{
  opacity:0.55;
  cursor:not-allowed;
  transform:none;
}

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

/* REGISTER WRAP + CARD */
.reg-wrap{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 24px;
  position:relative;
  overflow:hidden;
}

.reg-wrap::before{
  content:'';
  position:absolute;
  width:550px;
  height:550px;
  background:radial-gradient(circle,rgba(0,229,255,0.15) 0%,transparent 70%);
  top:-120px;
  left:-120px;
  pointer-events:none;
}

.reg-wrap::after{
  content:'';
  position:absolute;
  width:450px;
  height:450px;
  background:radial-gradient(circle,rgba(255,45,149,0.12) 0%,transparent 70%);
  bottom:-80px;
  right:5%;
  pointer-events:none;
}

.reg-card{
  position:relative;
  z-index:1;
  width:100%;
  max-width:460px;
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

.reg-card::before,
.reg-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.reg-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.reg-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

/* STEPS INDICATOR - 3 steps now */
.reg-steps{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:24px;
}

.reg-step-item{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:12px;
}

.reg-step-dot{
  width:26px;
  height:26px;
  border-radius:4px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:11px;
  font-weight:900;
  color:#5a6684;
  background:rgba(0,229,255,.04);
  border:1px solid rgba(0,229,255,.22);
  transition:all .22s ease;
}

.reg-step-dot.active{
  color:#050510;
  background:linear-gradient(135deg, #00e5ff, #a8f8ff);
  border-color:transparent;
  box-shadow:
    0 0 16px rgba(0,229,255,.7),
    inset 0 0 8px rgba(255,255,255,.4);
}

.reg-step-label{
  color:#5a6684;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:.16em;
  text-transform:uppercase;
}

.reg-step-label.active{
  color:#00e5ff;
  text-shadow:0 0 10px rgba(0,229,255,.6);
}

.reg-step-line{
  flex:1;
  height:1px;
  background:linear-gradient(90deg, rgba(0,229,255,.4), rgba(0,229,255,.12));
}

/* HEADINGS */
.reg-kicker{
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

.reg-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.reg-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.reg-title{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.8rem, 4vw, 2.4rem);
  font-weight:800;
  letter-spacing:-0.01em;
  text-transform:uppercase;
  line-height:1.05;
}

.reg-sub{
  margin:0 0 26px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* ALERTS */
.reg-alert{
  padding:12px 16px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  margin-bottom:22px;
}

.reg-alert-error{
  background:rgba(255,45,149,.08);
  border:1px solid rgba(255,45,149,.35);
  color:#ff6bb0;
  box-shadow:inset 0 0 14px rgba(255,45,149,.1);
}

.reg-alert-success{
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.35);
  color:#b6ff3c;
  box-shadow:inset 0 0 14px rgba(182,255,60,.1);
}

/* FORM */
.reg-form{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.reg-form label{
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

.reg-form input{
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

.reg-form input:focus{
  border-color:#00e5ff;
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 0 3px rgba(0,229,255,.15),
    0 0 22px rgba(0,229,255,.25),
    inset 0 0 10px rgba(0,229,255,.06);
}

.reg-form input::placeholder{
  color:#5a6684;
  letter-spacing:.02em;
}

.reg-switch{
  text-align:center;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  color:#7d8ba8;
  margin-top:26px;
  text-transform:uppercase;
}

.reg-switch a{
  color:#00e5ff;
  text-decoration:none;
  font-weight:800;
  transition:color .18s ease, text-shadow .18s ease;
}

.reg-switch a:hover{
  color:#a8f8ff;
  text-shadow:0 0 10px rgba(0,229,255,.7);
}

@media (max-width:560px){
  .reg-wrap{
    padding:46px 18px;
  }
  .reg-card{
    padding:30px 22px;
  }
  .reg-title{
    font-size:1.7rem;
  }
  .reg-steps{
    gap:6px;
  }
  .reg-step-dot{
    width:24px;
    height:24px;
    font-size:10px;
  }
  .reg-step-label{
    font-size:10px;
    letter-spacing:.1em;
  }
}
`;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
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
      const data = await register(formData);

      // ✅ NEW: Email verification flow
      if (data.needsEmailVerification) {
        setSuccess('Account created! Redirecting to verification...');
        setTimeout(() => {
          navigate('/check-email', {
            state: { email: data.email || formData.email }
          });
        }, 1000);
        return;
      }

      // Legacy fallback (agar backend purana response bheje)
      if (data.setupToken) {
        localStorage.setItem('setupToken', data.setupToken);
      }
      setSuccess("Account created! Let's set up your profile...");
      setTimeout(() => navigate('/setup-profile'), 800);
    } catch (err) {
      console.log('Registration error:', err);
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <div className="reg-wrap">
          <div className="reg-card">
            {/* Steps Indicator — 3 steps now */}
            <div className="reg-steps">
              <div className="reg-step-item">
                <div className="reg-step-dot active">1</div>
                <span className="reg-step-label active">Account</span>
              </div>
              <div className="reg-step-line"></div>
              <div className="reg-step-item">
                <div className="reg-step-dot">2</div>
                <span className="reg-step-label">Verify</span>
              </div>
              <div className="reg-step-line"></div>
              <div className="reg-step-item">
                <div className="reg-step-dot">3</div>
                <span className="reg-step-label">Profile</span>
              </div>
            </div>

            <span className="reg-kicker">Player Registration</span>
            <h1 className="reg-title">Create Account</h1>
            <p className="reg-sub">
              Enter your email and password. We'll send you a verification link.
            </p>

            {error && (
              <div className="reg-alert reg-alert-error">{error}</div>
            )}

            {success && (
              <div className="reg-alert reg-alert-success">{success}</div>
            )}

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

              <button
                type="submit"
                className="cm2-btn cm2-btn-primary cm2-corners"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Continue →'}
              </button>
            </form>

            <p className="reg-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;