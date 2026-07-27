import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function StatCard({ title, icon: Icon, children }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden card-glow"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(99,102,241,0.06)',
      }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.4), transparent)' }}
      />

      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.07))',
            border: '1px solid rgba(99,102,241,0.18)',
          }}>
          <Icon className="w-4 h-4" style={{ color: '#6366f1' }} />
        </div>
        <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#64748b' }}>{title}</span>
      </div>

      {children}
    </div>
  );
}
