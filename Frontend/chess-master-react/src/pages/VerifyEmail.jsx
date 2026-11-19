import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully.');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message ||
          'Verification link is invalid or has expired.'
        );
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#e8f4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        padding: '40px 32px',
        background: '#08081a',
        border: '1px solid rgba(0,229,255,.35)',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(0,229,255,.18)',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#fff',
              marginBottom: '10px',
            }}>Verifying your email...</h2>
            <p style={{ color: '#7d8ba8' }}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#b6ff3c',
              marginBottom: '10px',
            }}>Email Verified!</h2>
            <p style={{ color: '#7d8ba8', marginBottom: '24px' }}>
              {message}
            </p>
            <Link to="/login" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(90deg, #00e5ff, #a8f8ff)',
              color: '#050510',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              fontSize: '13px',
            }}>
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#ff6bb0',
              marginBottom: '10px',
            }}>Verification Failed</h2>
            <p style={{ color: '#7d8ba8', marginBottom: '24px' }}>
              {message}
            </p>
            <Link to="/login" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(90deg, #00e5ff, #a8f8ff)',
              color: '#050510',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              fontSize: '13px',
            }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}