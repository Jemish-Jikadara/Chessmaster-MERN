import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const countries = [
  { code: 'IN', flag: '🇮🇳', name: 'India' },
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: 'CN', flag: '🇨🇳', name: 'China' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'OTHER', flag: '🌍', name: 'Other' },
];

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
  align-items:center;
  justify-content:center;
  padding:80px 20px;
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
  cursor:pointer;
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

/* Setup specific */
.sp-card{
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:36px 32px;
  width:100%;
  max-width:650px;
  position:relative;
  box-shadow:0 16px 36px rgba(0,0,0,.35);
}

.sp-kicker{
  display:inline-block;
  color:var(--h-green-2);
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:8px;
}

.sp-title{
  margin:0 0 8px;
  color:var(--h-text);
  font-size:2.2rem;
  font-weight:900;
}

.sp-sub{
  margin:0 0 24px;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

.sp-avatar-box{
  display:flex;
  justify-content:center;
  margin-bottom:26px;
}

.sp-avatar{
  width:120px;
  height:120px;
  border-radius:50%;
  overflow:hidden;
  border:3px solid var(--h-green);
  box-shadow:0 0 20px rgba(129,182,76,.35);
  background:#0d0b08;
}

.sp-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.sp-form{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.sp-form-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
}

.sp-form label{
  display:flex;
  flex-direction:column;
  gap:8px;
  font-size:11px;
  font-weight:800;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:.12em;
}

.sp-form input,
.sp-form textarea,
.sp-form select{
  padding:13px 16px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  color:#ffffff;
  font-size:14px;
  outline:none;
  transition:all .2s ease;
}

.sp-form input:focus,
.sp-form textarea:focus,
.sp-form select:focus{
  border-color:var(--h-green);
  background:rgba(129,182,76,.06);
  box-shadow:0 0 0 3px rgba(129,182,76,.15);
}

.sp-form select option{
  background-color:#0f1411;
  color:var(--h-text);
}

.sp-form textarea{
  resize:none;
  height:90px;
}

.sp-optional{
  font-size:10px;
  color:var(--h-muted);
  text-transform:lowercase;
  font-weight:normal;
}

.sp-error{
  color:#f87171;
  font-size:13px;
  margin:0;
}

/* Responsive */
@media (max-width:650px){
  .sp-form-row{
    grid-template-columns:1fr;
  }
  .sp-card{
    padding:28px 22px;
  }
}

@media (max-width:560px){
  .h-page{
    padding:46px 18px;
  }
  .sp-title{
    font-size:1.9rem;
  }
}
`;

const SetupProfile = () => {
  const { setupProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    country: '',
    dateOfBirth: '',
    bio: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('/images/default-avatar.png');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || formData.username.length < 3 || formData.username.length > 24) {
      setError('Username must be 3-24 characters.');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const setupToken = localStorage.getItem('setupToken');
      if (setupToken) {
        data.append('setupToken', setupToken);
      }

      if (imageFile) data.append('profileImage', imageFile);

      await setupProfile(data);
      localStorage.removeItem('setupToken');
      navigate('/profile');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <div className="sp-card">
          <span className="sp-kicker">Almost There</span>
          <h1 className="sp-title">Set Up Your Profile</h1>
          <p className="sp-sub">One last step — tell us a bit about yourself before you start playing.</p>

          <div className="sp-avatar-box">
            <div className="sp-avatar">
              <img src={previewImage} alt="Profile" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="sp-form" encType="multipart/form-data">
            <label>
              Profile Image <span className="sp-optional">optional</span>
              <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
            </label>

            <label>
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                required
                minLength={3}
                maxLength={24}
              />
            </label>

            <div className="sp-form-row">
              <label>
                Full Name <span className="sp-optional">optional</span>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
              </label>
              <label>
                Country <span className="sp-optional">optional</span>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Date Of Birth <span className="sp-optional">optional</span>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </label>

            <label>
              Bio <span className="sp-optional">optional</span>
              <textarea name="bio" maxLength="200" placeholder="Tell other players about yourself..." value={formData.bio} onChange={handleChange} />
            </label>

            {error && <p className="sp-error">{error}</p>}

            <button type="submit" className="cm2-btn cm2-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Complete Setup →'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SetupProfile;