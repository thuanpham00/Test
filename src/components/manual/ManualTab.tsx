import { Gamepad2 } from 'lucide-react';

export function ManualTab() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar w-full flex items-center justify-center" style={{ background: '#f1f5f9' }}>
      <div className="max-w-lg w-full rounded-3xl p-10 text-center relative overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(99,102,241,0.08)' }}>
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px animated-border"
          style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #06b6d4, transparent)' }}
        />
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.07))', border: '1px solid rgba(99,102,241,0.18)' }}>
            <Gamepad2 className="w-12 h-12" style={{ color: '#6366f1' }} />
          </div>
          <h2 className="text-2xl font-black mb-3 uppercase tracking-widest grad-text">Manual Key Drive</h2>
          <p className="text-sm font-medium" style={{ color: '#64748b' }}>
            Chức năng đang được phát triển.<br />
            Vui lòng đăng nhập vào mạng nội bộ để dùng Joystick.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#f59e0b', display: 'inline-block' }} />
            Đang phát triển
          </div>
        </div>
      </div>
    </div>
  );
}
