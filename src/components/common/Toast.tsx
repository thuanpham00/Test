import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ToastType } from '../../types/ros';

const iconMap: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const styleMap: Record<ToastType, { bg: string; border: string; iconColor: string; textColor: string }> = {
  info:    { bg: '#ffffff', border: 'rgba(99,102,241,0.3)',  iconColor: '#6366f1', textColor: '#0f172a' },
  success: { bg: '#ffffff', border: 'rgba(16,185,129,0.35)', iconColor: '#059669', textColor: '#0f172a' },
  warning: { bg: '#ffffff', border: 'rgba(244,63,94,0.3)',   iconColor: '#e11d48', textColor: '#0f172a' },
};

export function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const s = styleMap[toast.type];
        return (
          <div
            key={toast.id}
            className="toast-enter flex items-center gap-3 py-3 px-4 rounded-2xl pointer-events-auto max-w-sm"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: s.iconColor }} />
            <span className="font-bold text-sm" style={{ color: s.textColor }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
