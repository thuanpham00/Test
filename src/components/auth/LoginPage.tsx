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
    <div className="flex h-screen w-screen bg-app-bg items-center justify-center relative">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="bg-panel p-12 rounded-3xl shadow-lg w-[420px] border border-border flex flex-col items-center z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

        <div className="p-4 bg-slate-50 rounded-full shadow-inner mb-4">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>

        <h2 className="text-3xl font-black text-text-main tracking-widest mb-1">HCMUT</h2>
        <p className="text-primary text-xs font-bold mb-10 tracking-widest uppercase">
          Autonomous Vehicle System
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-4 mb-4 rounded-xl bg-slate-50 text-text-main border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition placeholder-slate-400 text-sm font-semibold shadow-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Password"
          className="w-full p-4 mb-8 rounded-xl bg-slate-50 text-text-main border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition placeholder-slate-400 text-sm font-semibold shadow-sm"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 tracking-widest text-sm uppercase"
        >
          ĐĂNG NHẬP
        </button>

        {error && (
          <div className="text-error text-xs font-bold mt-5 bg-red-50 py-3 px-4 rounded-lg w-full text-center border border-red-200">
            Tài khoản hoặc mật khẩu không đúng!
          </div>
        )}
      </div>
    </div>
  );
}
