import { useState, useEffect } from 'react';
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

.cm2-btn-secondary{
  color:#f4f7ef;
  background:rgba(255,255,255,.075);
  border-color:rgba(255,255,255,.13);
}

.cm2-btn-secondary:hover{
  background:rgba(255,255,255,.11);
  border-color:rgba(255,255,255,.2);
}

/* Edit Profile card */
.ep-card{
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:36px 32px;
  width:100%;
  max-width:650px;
  position:relative;
  box-shadow:0 16px 36px rgba(0,0,0,.35);
}

.ep-kicker{
  display:inline-block;
  color:var(--h-green-2);
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:8px;
}

.ep-title{
  margin:0 0 8px;
  color:var(--h-text);
  font-size:2.2rem;
  font-weight:900;
}

.ep-sub{
  margin:0 0 24px;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

.ep-avatar-box{
  display:flex;
  justify-content:center;
  margin-bottom:26px;
}

.ep-avatar{
  width:130px;
  height:130px;
  border-radius:50%;
  overflow:hidden;
  border:3px solid var(--h-green);
  box-shadow:0 0 20px rgba(129,182,76,.35);
  background:#0d0b08;
  position:relative;
  transition:transform 0.3s ease, border-color 0.3s ease;
}

.ep-avatar:hover{
  transform:scale(1.03);
  border-color:var(--h-green-2);
}

.ep-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

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
    padding:28px 22px;
  }
}

.ep-form label{
  display:flex;
  flex-direction:column;
  gap:8px;
  font-size:11px;
  font-weight:800;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:.12em;
}

.ep-form input,
.ep-form textarea,
.ep-form select{
  padding:13px 16px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  color:#ffffff;
  font-size:14px;
  outline:none;
  transition:all .2s ease;
}

.ep-form input:focus,
.ep-form textarea:focus,
.ep-form select:focus{
  border-color:var(--h-green);
  background:rgba(129,182,76,.06);
  box-shadow:0 0 0 3px rgba(129,182,76,.15);
}

.ep-form select option{
  background-color:#0f1411;
  color:var(--h-text);
}

.ep-form textarea{
  resize:none;
  height:95px;
}

.ep-optional{
  font-size:10px;
  color:var(--h-muted);
  text-transform:lowercase;
  font-weight:normal;
}

.ep-btn-row{
  display:flex;
  gap:15px;
  margin-top:20px;
}

.ep-btn-save{
  flex:1;
  padding:14px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:850;
  font-size:14px;
  background:linear-gradient(180deg,#9bd761,#7fb64a);
  color:#10180e;
  transition:all .18s ease;
  box-shadow:0 16px 30px rgba(129,182,76,.25), inset 0 1px rgba(255,255,255,.45);
}

.ep-btn-save:hover:not(:disabled){
  transform:translateY(-2px);
  background:linear-gradient(180deg,#a8e372,#82bd4a);
  box-shadow:0 20px 38px rgba(129,182,76,.32), inset 0 1px rgba(255,255,255,.55);
}

.ep-btn-save:disabled{
  opacity:0.6;
  cursor:not-allowed;
  transform:none;
}

.ep-btn-cancel{
  flex:1;
  padding:14px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.12);
  text-decoration:none;
  text-align:center;
  font-weight:850;
  font-size:14px;
  color:var(--h-text);
  transition:all .18s ease;
  background:rgba(255,255,255,.06);
  display:flex;
  align-items:center;
  justify-content:center;
}

.ep-btn-cancel:hover{
  border-color:rgba(129,182,76,.35);
  background:rgba(255,255,255,.1);
}

/* Responsive */
@media (max-width:560px){
  .h-page{
    padding:46px 18px;
  }
  .ep-title{
    font-size:1.9rem;
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

            {/* Buttons */}
            {error && (
              <p style={{ color: '#ff8585', fontSize: '13px', marginTop: '-8px', marginBottom: '8px' }}>{error}</p>
            )}
            <div className="ep-btn-row">
              <Link to="/profile" className="ep-btn-cancel">Cancel</Link>
              <button type="submit" className="cm2-btn cm2-btn-primary" disabled={saving}>
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