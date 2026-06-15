'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

/**
 * LoginPage — Allows users to sign in or register to cast votes on the platform.
 * Supports a graceful demo/fallback mode if Supabase keys are not set up.
 */
export default function LoginPage() {
  const { user, loading, isFallback, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Redirect to home/battle if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/battle');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/battle');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="battle-page__loading">
          <span className="battle-page__loading-text">⚡ Connecting... ⚡</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Title */}
        <h2 className="login-title">
          {isSignUp ? '⚔️ REGISTER' : '⚡ SIGN IN'}
        </h2>
        <p className="login-subtitle">
          {isSignUp ? 'Join the community to crown the champion' : 'Enter the arena to vote'}
        </p>

        {/* Demo Fallback Banner */}
        {isFallback && (
          <div className="login-demo-badge">
            <strong>⚠️ Demo Mode Active</strong>
            <p>Database keys are not set. Enter any credentials to log in instantly!</p>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-input-group">
            <label className="login-label" htmlFor="email">Email Address</label>
            <input
              className="login-input"
              id="email"
              type="email"
              placeholder="e.g. phonk@champion.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="login-input-group">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              className="login-input"
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <button className="login-btn" type="submit" disabled={submitting}>
            <span>{submitting ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'ENTER ARENA'}</span>
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="login-toggle">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button className="login-toggle-btn" onClick={() => { setIsSignUp(false); setError(null); }}>
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button className="login-toggle-btn" onClick={() => { setIsSignUp(true); setError(null); }}>
                Register Now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
