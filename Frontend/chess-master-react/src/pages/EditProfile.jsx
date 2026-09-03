import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <>
      <style>{`
        :root {
          --gold-primary: #d4af37;
          --gold-light: #f3e5ab;
          --gold-dark: #aa7c11;
          --gold-gradient: linear-gradient(135deg, #fce082 0%, #d4af37 50%, #996515 100%);
          --gold-glow: 0 0 25px rgba(212, 175, 55, 0.22);
          --bg-dark: #0a0908;
          --bg-card: rgba(18, 15, 11, 0.85);
          --border-gold: rgba(212, 175, 55, 0.28);
          --border-gold-hover: rgba(212, 175, 55, 0.6);
          --text-main: #fefcf0;
          --text-muted: #c5a880;
          --text-faint: #8c7355;
          --input-bg: rgba(25, 20, 14, 0.7);
        }

        .ep-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }

        .ep-card {
          width: 100%;
          max-width: 650px;
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 22px;
          padding: 45px 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), var(--gold-glow);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }

        .ep-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gold-gradient);
        }

        .ep-kicker {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-primary);
          margin-bottom: 8px;
          display: inline-block;
          font-weight: 600;
        }

        .ep-title {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--gold-light);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .ep-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .ep-avatar-box {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .ep-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--gold-primary);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.35), inset 0 0 10px rgba(0, 0, 0, 0.8);
          background: #0d0b08;
          position: relative;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .ep-avatar:hover {
          transform: scale(1.03);
          border-color: var(--gold-light);
        }

        .ep-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ep-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ep-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        @media(max-width: 650px) {
          .ep-form-row {
            grid-template-columns: 1fr;
          }
          .ep-card {
            padding: 30px 20px;
          }
        }

        .ep-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gold-light);
        }

        .ep-form input,
        .ep-form textarea,
        .ep-form select {
          padding: 13px 16px;
          background: var(--input-bg);
          border: 1px solid var(--border-gold);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }

        .ep-form input:focus,
        .ep-form textarea:focus,
        .ep-form select:focus {
          border-color: var(--gold-primary);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
          background: rgba(30, 24, 16, 0.85);
        }

        .ep-form input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8) sepia(1) saturate(5) hue-rotate(5deg);
          cursor: pointer;
        }

        .ep-form input[type="file"] {
          font-size: 12px;
          color: var(--text-muted);
        }

        .ep-form input[type="file"]::-webkit-file-upload-button {
          background: var(--gold-gradient);
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          color: #0a0908;
          font-weight: 600;
          cursor: pointer;
          margin-right: 10px;
          transition: opacity 0.2s ease;
        }

        .ep-form input[type="file"]::-webkit-file-upload-button:hover {
          opacity: 0.9;
        }

        .ep-form select option {
          background-color: #120f0b;
          color: var(--text-main);
        }

        .ep-form textarea {
          resize: none;
          height: 95px;
        }

        .ep-optional {
          font-size: 10px;
          color: var(--text-faint);
          text-transform: lowercase;
          font-weight: normal;
        }

        .ep-btn-row {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .ep-btn-save {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          background: var(--gold-gradient);
          color: #0a0908;
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }

        .ep-btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
          filter: brightness(1.05);
        }

        .ep-btn-cancel {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--border-gold);
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-muted);
          transition: all 0.25s ease;
          background: rgba(10, 9, 8, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ep-btn-cancel:hover {
          border-color: var(--gold-primary);
          color: var(--gold-light);
          background: rgba(212, 175, 55, 0.05);
        }
      `}</style>

      <div className="ep-wrap">
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
              <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-8px', marginBottom: '8px' }}>{error}</p>
            )}
            <div className="ep-btn-row">
              <Link to="/profile" className="ep-btn-cancel">Cancel</Link>
              <button type="submit" className="ep-btn-save" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes →'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;