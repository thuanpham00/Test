import { Gamepad2 } from 'lucide-react';

export function ManualTab() {
  return (
    <div className="h-full flex-col overflow-y-auto p-10 bg-app-bg w-full flex">
      <div className="max-w-2xl mx-auto bg-panel border border-border rounded-3xl p-10 shadow-sm text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
        <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Gamepad2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-text-main uppercase tracking-wider">Manual Key Drive</h2>
        <p className="text-text-muted text-sm font-medium">
          Chức năng đang được phát triển. Vui lòng đăng nhập vào mạng nội bộ để dùng Joystick.
        </p>
      </div>
    </div>
  );
}
