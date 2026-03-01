import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, ClipboardList, Building2, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { title: 'Chat', path: '/', icon: MessageSquare },
  { title: 'Orders', path: '/work-orders', icon: ClipboardList },
  { title: 'Assets', path: '/assets', icon: Building2 },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export default function TechnicianLayout() {
  const { user, switchRole } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Top bar */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-display font-bold text-foreground text-lg">ArchiTech</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Technician</p>
          </div>
          <button
            onClick={() => switchRole('manager')}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2 py-1 transition-colors"
          >
            Switch to Manager
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom tabs */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around z-50">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs font-medium",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{tab.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
