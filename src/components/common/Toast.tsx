import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ToastType } from '../../types/ros';

const iconMap: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-error',
};

export function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className="toast-enter flex items-center gap-3 py-3.5 px-5 rounded-2xl border border-border bg-panel shadow-lg pointer-events-auto max-w-sm"
          >
            <Icon className={`w-5 h-5 shrink-0 ${colorMap[toast.type]}`} />
            <span className="font-bold text-sm text-text-main">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
