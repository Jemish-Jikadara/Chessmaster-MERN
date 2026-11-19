import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.ce-page{
  position:relative;
  background:#050510;
  color:#e8f4ff;
  font-family:'Inter', system-ui, sans-serif;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 24px;
  overflow-x:hidden;
}
.ce-page::before{
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
}
.ce-page::after{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%);
  pointer-events:none;
}
.ce-page *{ box-sizing:border-box; }

.ce-card{
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
  text-align:center;
}
.ce-card::before,
.ce-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.ce-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.ce-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.ce-icon{
  font-size:56px;
  margin-bottom:16px;
  filter:drop-shadow(0 0 14px rgba(0,229,255,.6));
}

.ce-kicker{
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
.ce-kicker::before{ content:'['; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }
.ce-kicker::after{ content:']'; color:#a8f8ff; font-family:'Orbitron'; font-weight:900; }

.ce-title{
  margin:0 0 12px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.6rem, 4vw, 2rem);
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:-0.01em;
}

.ce-sub{
  margin:0 0 8px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

.ce-email{
  color:#00e5ff;
  font-weight:700;
  word-break:break-all;
  font-family:'Chakra Petch', system-ui, sans-serif;
  letter-spacing:.04em;
}

.ce-note{
  color:#5a6684;
  font-size:12px;
  line-height:1.6;
  margin:18px 0 24px;
}

.ce-alert{
  padding:12px 16px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  margin:16px 0;
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.35);
  color:#b6ff3c;
}

.ce-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:100%;
  min-height:48px;
  padding:0 22px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  border:1px solid transparent;
  cursor:pointer;
  color:#050510;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  box-shadow:
    0 0 20px rgba(0,229,255,0.55),
    0 0 44px rgba(0,229,255,0.25);
  transition:transform .18s ease, box-shadow .22s ease;
  margin-bottom:18px;
}
.ce-btn:hover{
  transform:translateY(-2px);
  box-shadow:
    0 0 30px rgba(0,229,255,0.8),
    0 0 60px rgba(0,229,255,0.4);
}
.ce-btn:disabled{ opacity:0.55; cursor:not-allowed; transform:none; }

.ce-back{
  display:block;
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  text-transform:uppercase;
  text-decoration:none;
  transition:color .18s ease;
}
.ce-back:hover{ color:#00e5ff; }
`;

export default function CheckEmail() {
  const { state } = useLocation();
  const email = state?.email || '';
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    if (!email) {
      setMsg('Email not found. Please register again.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/resend-verification', { email });
      setMsg('✅ Verification email sent! Check your inbox.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to resend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <main className="ce-page">
        <div className="ce-card">
          <div className="ce-icon">📧</div>
          <span className="ce-kicker">Verify Your Email</span>
          <h1 className="ce-title">Check Your Inbox</h1>
          <p className="ce-sub">
            We sent a verification link to
          </p>
          <p className="ce-email">{email || 'your email'}</p>
          <p className="ce-note">
            Click the link in the email to activate your account.<br />
            The link is valid for <b style={{ color: '#00e5ff' }}>1 hour</b>.
          </p>

          <button onClick={resend} disabled={loading} className="ce-btn">
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          {msg && <div className="ce-alert">{msg}</div>}

          <Link to="/login" className="ce-back">← Back to Login</Link>
        </div>
      </main>
    </>
  );
}