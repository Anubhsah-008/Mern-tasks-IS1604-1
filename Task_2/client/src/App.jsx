import React, { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Palette, Layers, UserRound } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function GridxLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="2.5" width="5" height="5" rx="1.5" fill="#82a9ff" />
      <rect x="16.5" y="2.5" width="5" height="5" rx="1.5" fill="#5b87ff" />
      <rect x="2.5" y="16.5" width="5" height="5" rx="1.5" fill="#5b87ff" />
      <rect x="16.5" y="16.5" width="5" height="5" rx="1.5" fill="#82a9ff" />
      <path d="M7.5 7.5L16.5 16.5" stroke="#9bb8ff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16.5 7.5L7.5 16.5" stroke="#9bb8ff" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.4" fill="#ffffff" />
      <circle cx="12" cy="12" r="1.1" fill="#315bd0" />
    </svg>
  );
}

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [createdUser, setCreatedUser] = useState(null);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const passwordReady = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice({ type: '', text: '' });
    setCreatedUser(null);
    if (form.password !== form.confirmPassword) {
      setNotice({ type: 'error', text: 'Your passwords do not match. Please check again.' });
      return;
    }
    if (!passwordReady) {
      setNotice({ type: 'error', text: 'Use at least 8 characters for your password.' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create your account.');
      setCreatedUser(data.user);
      setNotice({ type: 'success', text: data.message || 'Account created successfully!' });
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      const isNetworkError = error.message === 'Failed to fetch' || error.message === 'Load failed';
      setNotice({
        type: 'error',
        text: isNetworkError
          ? `Cannot reach the backend server at ${API_URL}. Check if the server is running.`
          : error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="visual-panel">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="visual-top"><div className="brand-mark"><GridxLogo size={20} /></div><span className="brand-name">GRIDX<span> / the creative circuit</span></span></div>
        <div className="visual-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE GLOBAL DESIGN COLLECTIVE</div>
          <h1>Design beyond<br />the <em>canvas.</em></h1>
          <p>A premier creative circuit for graphic designers, 3D artists, brand strategists, and visual innovators.</p>
          <div className="feature-stack">
            <div className="feature"><span className="feature-icon"><Palette size={17} /></span><div><strong>Curated Design Vault</strong><small>Exclusive vector packs, 3D assets & type presets.</small></div></div>
            <div className="feature"><span className="feature-icon"><Layers size={17} /></span><div><strong>The Creative Circuit</strong><small>Live project crits & high-caliber peer collaboration.</small></div></div>
          </div>
        </div>
        <div className="panel-footer"><span>GRIDX // CREATIVE PROTOCOL</span><span>CIRCUIT 01 — 04</span></div>
      </section>

      <section className="form-panel">
        <div className="mobile-brand"><div className="brand-mark"><GridxLogo size={18} /></div><span className="brand-name">GRIDX<span> / the creative circuit</span></span></div>
        <div className="form-wrap">
          <div className="form-heading"><div className="step-label"> <span>01</span> / JOIN THE CIRCUIT</div><h2>Sign up<span>.</span></h2><p>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); setNotice({ type: 'info', text: 'Login is outside the scope of this sign-up lab task.' }); }}>Log in</a></p></div>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="name">YOUR NAME</label>
            <div className="input-wrap"><UserRound size={18} /><input id="name" name="name" type="text" placeholder="e.g. Alex Morgan" value={form.name} onChange={update} minLength="2" maxLength="60" autoComplete="name" required /></div>

            <label className="field-label" htmlFor="email">EMAIL ADDRESS</label>
            <div className="input-wrap"><Mail size={18} /><input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} autoComplete="email" required /></div>

            <label className="field-label" htmlFor="password">PASSWORD</label>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={form.password} onChange={update} minLength="8" autoComplete="new-password" required /><button className="icon-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <div className="password-hint"><span className={passwordReady ? 'hint-good' : ''}>{passwordReady && <Check size={12} />} 8+ characters</span></div>

            <label className="field-label" htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Enter your password again" value={form.confirmPassword} onChange={update} autoComplete="new-password" required /><button className="icon-button" type="button" aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {form.confirmPassword && <div className={`match-hint ${passwordsMatch ? 'match-good' : 'match-bad'}`}>{passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}</div>}

            <button className="submit-button" type="submit" disabled={loading}>{loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'} <ArrowRight size={17} /></button>
          </form>
          {notice.text && <div className={`notice ${notice.type}`} role="status">{notice.text}{createdUser && <strong> Welcome, {createdUser.name}!</strong>}</div>}
          <p className="terms">By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
        <div className="form-footer"><span>© 2026 GRIDX</span><span>THE CREATIVE CIRCUIT <span className="footer-star">✳</span></span></div>
      </section>
    </main>
  );
}
