import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.h-page{
  position:relative;
  background:#050510;
  color:#e8f4ff;
  font-family:'Inter', system-ui, sans-serif;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:80px 20px;
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
   BUTTONS
   ========================================================= */
.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:52px;
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
  overflow:hidden;
  flex:1;
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

/* =========================================================
   CARD
   ========================================================= */
.ep-card{
  position:relative;
  z-index:1;
  width:100%;
  max-width:680px;
  padding:40px 36px;
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

/* HUD corner brackets */
.ep-card::before,
.ep-card::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
  pointer-events:none;
}
.ep-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.ep-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

/* =========================================================
   HEADINGS
   ========================================================= */
.ep-kicker{
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

.ep-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.ep-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.ep-title{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.8rem, 4vw, 2.4rem);
  font-weight:800;
  letter-spacing:-0.01em;
  text-transform:uppercase;
  line-height:1.05;
}

.ep-sub{
  margin:0 0 28px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* =========================================================
   AVATAR
   ========================================================= */
.ep-avatar-box{
  display:flex;
  justify-content:center;
  margin-bottom:30px;
}

.ep-avatar{
  width:140px;
  height:140px;
  border-radius:8px;
  overflow:hidden;
  border:2px solid rgba(0,229,255,0.6);
  background:#0a0a1e;
  position:relative;
  transition:transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow:
    0 0 22px rgba(0,229,255,0.5),
    0 0 44px rgba(139,92,246,0.3),
    inset 0 0 16px rgba(0,229,255,0.2);
}

.ep-avatar::after{
  content:'';
  position:absolute;
  inset:-6px;
  border-radius:12px;
  border:1px solid rgba(0,229,255,0.35);
  pointer-events:none;
}

.ep-avatar:hover{
  transform:scale(1.03);
  border-color:#00e5ff;
  box-shadow:
    0 0 32px rgba(0,229,255,0.8),
    0 0 60px rgba(139,92,246,0.4),
    inset 0 0 20px rgba(0,229,255,0.3);
}

.ep-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

/* =========================================================
   FORM
   ========================================================= */
.ep-form{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.ep-form-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
}

@media(max-width:650px){
  .ep-form-row{
    grid-template-columns:1fr;
  }
  .ep-card{
    padding:30px 22px;
  }
}

.ep-form label{
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

.ep-form input,
.ep-form textarea,
.ep-form select{
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

.ep-form input:focus,
.ep-form textarea:focus,
.ep-form select:focus{
  border-color:#00e5ff;
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 0 3px rgba(0,229,255,.15),
    0 0 22px rgba(0,229,255,.25),
    inset 0 0 10px rgba(0,229,255,.06);
}

.ep-form input::placeholder,
.ep-form textarea::placeholder{
  color:#5a6684;
  letter-spacing:.02em;
}

.ep-form select option{
  background-color:#08081a;
  color:#e8f4ff;
}

.ep-form textarea{
  resize:none;
  height:100px;
}

.ep-optional{
  font-size:9.5px;
  color:#5a6684;
  text-transform:lowercase;
  font-weight:600;
  letter-spacing:.06em;
}

/* File input styled */
.ep-form input[type="file"]{
  padding:11px 14px;
  cursor:pointer;
  font-size:12.5px;
  color:#b8c6dd;
}

.ep-form input[type="file"]::file-selector-button{
  padding:6px 14px;
  margin-right:12px;
  background:rgba(0,229,255,0.08);
  border:1px solid rgba(0,229,255,0.35);
  border-radius:4px;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  font-weight:700;
  letter-spacing:.16em;
  text-transform:uppercase;
  cursor:pointer;
  transition:background .18s ease, box-shadow .18s ease;
}

.ep-form input[type="file"]::file-selector-button:hover{
  background:rgba(0,229,255,0.16);
  box-shadow:0 0 14px rgba(0,229,255,0.4);
}

/* =========================================================
   BUTTON ROW
   ========================================================= */
.ep-btn-row{
  display:flex;
  gap:14px;
  margin-top:24px;
}

.ep-btn-cancel{
  flex:1;
  padding:14px;
  border-radius:6px;
  border:1px solid rgba(0,229,255,.35);
  text-decoration:none;
  text-align:center;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:#00e5ff;
  transition:all .18s ease;
  background:rgba(0,229,255,.05);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:inset 0 0 10px rgba(0,229,255,.08);
}

.ep-btn-cancel:hover{
  border-color:#00e5ff;
  color:#a8f8ff;
  background:rgba(0,229,255,.12);
  box-shadow:
    inset 0 0 16px rgba(0,229,255,.15),
    0 0 18px rgba(0,229,255,.35);
}

/* Error message */
.ep-error{
  padding:12px 16px;
  border-radius:6px;
  background:rgba(255,45,149,.08);
  border:1px solid rgba(255,45,149,.35);
  color:#ff6bb0;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  font-weight:600;
  letter-spacing:.06em;
  box-shadow:inset 0 0 14px rgba(255,45,149,.1);
  margin-top:-4px;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:560px){
  .h-page{
    padding:46px 18px;
  }
  .ep-title{
    font-size:1.7rem;
  }
  .ep-avatar{
    width:110px;
    height:110px;
  }
  .ep-btn-row{
    flex-direction:column;
  }
}
`;

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    country: user?.country || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    bio: user?.bio || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Image preview state
  const [previewImage, setPreviewImage] = useState(
    user?.profileImage || '/images/default-avatar.png'
  );

  // Handle text/select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.append('profileImage', imageFile);

      await updateProfile(data);
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
        <div className="ep-card">
          <span className="ep-kicker">Edit Profile</span>
          <h1 className="ep-title">Update Your Profile</h1>
          <p className="ep-sub">Update your personal information and profile picture.</p>

          {/* Avatar Preview */}
          <div className="ep-avatar-box">
            <div className="ep-avatar">
              <img src={previewImage} alt="Profile" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="ep-form" encType="multipart/form-data">
            {/* Profile Image */}
            <label>
              Profile Image <span className="ep-optional">optional</span>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {/* Username */}
            <label>
              Username *
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>

            {/* Full Name & Country */}
            <div className="ep-form-row">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </label>

              <label>
                Country
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Date of Birth */}
            <label>
              Date Of Birth
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </label>

            {/* Bio */}
            <label>
              Bio <span className="ep-optional">optional</span>
              <textarea
                name="bio"
                maxLength="200"
                placeholder="Tell other players about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
            </label>

            {/* Error */}
            {error && (
              <div className="ep-error">{error}</div>
            )}

            {/* Buttons */}
            <div className="ep-btn-row">
              <Link to="/profile" className="ep-btn-cancel">Cancel</Link>
              <button
                type="submit"
                className="cm2-btn cm2-btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditProfile;