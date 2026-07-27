import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function StatCard({ title, icon: Icon, children }: StatCardProps) {
  return (
    <div className="bg-panel border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
      <div className="absolute left-0 top-0 w-1.5 h-full bg-primary" />
      <div className="flex items-center gap-2 text-text-main font-black text-sm uppercase tracking-wide mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
