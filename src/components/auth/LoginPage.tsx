import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function LoginPage() {
  const { login } = useAuth();
  const { startSimulation } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (login(username, password)) {
      setError(false);
      setTimeout(() => startSimulation(), 200);
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Card */}
      <div
        className="relative z-10 w-[440px] flex flex-col items-center"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '24px',
          boxShadow: '0 4px 6px rgba(99,102,241,0.04), 0 20px 60px rgba(99,102,241,0.1)',
          padding: '52px 44px',
        }}
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-8 right-8 h-px animated-border"
          style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #06b6d4, transparent)' }} />

        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.08))',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <ShieldCheck className="w-10 h-10" style={{ color: '#6366f1' }} />
          </div>
        </div>

        <h2 className="text-4xl font-black tracking-widest mb-1 grad-text">HCMUT</h2>
        <p className="text-xs font-bold mb-10 tracking-[0.25em] uppercase" style={{ color: '#94a3b8' }}>
          Autonomous Vehicle System
        </p>

        {/* Inputs */}
        {[
          { type: 'text', value: username, onChange: (v: string) => setUsername(v), placeholder: 'Username' },
          { type: 'password', value: password, onChange: (v: string) => setPassword(v), placeholder: 'Password' },
        ].map(({ type, value, onChange, placeholder }, i) => (
          <input
            key={placeholder}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={type === 'password' ? handleKeyDown : undefined}
            placeholder={placeholder}
            className="w-full p-4 rounded-xl text-sm font-semibold transition-all outline-none placeholder:text-slate-300"
            style={{
              marginBottom: i === 0 ? '12px' : '28px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              color: '#0f172a',
            }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        ))}

        <button
          type="button"
          onClick={handleLogin}
          className="btn-grad w-full py-4 rounded-xl font-extrabold tracking-widest text-sm uppercase text-white active:scale-95 flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
        >
          ĐĂNG NHẬP
        </button>

        {error && (
          <div className="mt-5 w-full text-center text-xs font-bold py-3 px-4 rounded-xl"
            style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.25)', color: '#f43f5e' }}>
            Tài khoản hoặc mật khẩu không đúng!
          </div>
        )}
      </div>
    </div>
  );
}
