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
      if (imageFile) data.append('profileImage', imageFile);

      await setupProfile(data);
      navigate('/profile');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --gold-primary: #d4af37;
          --gold-light: #f3e5ab;
          --gold-gradient: linear-gradient(135deg, #fce082 0%, #d4af37 50%, #996515 100%);
          --gold-glow: 0 0 25px rgba(212, 175, 55, 0.22);
          --bg-card: rgba(18, 15, 11, 0.85);
          --border-gold: rgba(212, 175, 55, 0.28);
          --text-main: #fefcf0;
          --text-muted: #c5a880;
          --text-faint: #8c7355;
          --input-bg: rgba(25, 20, 14, 0.7);
        }
        .sp-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 20px; background: #080810; }
        .sp-card { width: 100%; max-width: 650px; background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: 22px; padding: 45px 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.7), var(--gold-glow); position: relative; overflow: hidden; }
        .sp-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold-gradient); }
        .sp-kicker { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-primary); margin-bottom: 8px; display: inline-block; font-weight: 600; }
        .sp-title { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 700; color: var(--gold-light); margin-bottom: 8px; }
        .sp-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 30px; line-height: 1.6; }
        .sp-avatar-box { display: flex; justify-content: center; margin-bottom: 26px; }
        .sp-avatar { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 3px solid var(--gold-primary); box-shadow: 0 0 20px rgba(212,175,55,0.35); background: #0d0b08; }
        .sp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .sp-form { display: flex; flex-direction: column; gap: 20px; }
        .sp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media(max-width: 650px) { .sp-form-row { grid-template-columns: 1fr; } .sp-card { padding: 30px 20px; } }
        .sp-form label { display: flex; flex-direction: column; gap: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold-light); }
        .sp-form input, .sp-form textarea, .sp-form select { padding: 13px 16px; background: var(--input-bg); border: 1px solid var(--border-gold); border-radius: 12px; color: var(--text-main); font-size: 14px; outline: none; }
        .sp-form input:focus, .sp-form textarea:focus, .sp-form select:focus { border-color: var(--gold-primary); box-shadow: 0 0 12px rgba(212,175,55,0.25); }
        .sp-form select option { background-color: #120f0b; color: var(--text-main); }
        .sp-form textarea { resize: none; height: 90px; }
        .sp-optional { font-size: 10px; color: var(--text-faint); text-transform: lowercase; font-weight: normal; }
        .sp-error { color: #f87171; font-size: 13px; }
        .sp-btn-save { padding: 14px; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; background: var(--gold-gradient); color: #0a0908; margin-top: 10px; }
        .sp-btn-save:disabled { opacity: 0.6; cursor: default; }
      `}</style>

      <div className="sp-wrap">
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

            <button type="submit" className="sp-btn-save" disabled={saving}>
              {saving ? 'Saving...' : 'Complete Setup →'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SetupProfile;
