import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare, FileText, ClipboardList, Building2, Plug, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'AI Chat', path: '/', icon: MessageSquare },
  { title: 'Work Orders', path: '/work-orders', icon: ClipboardList },
  { title: 'Documents', path: '/documents', icon: FileText },
  { title: 'Assets', path: '/assets', icon: Building2 },
  { title: 'Integrations', path: '/integrations', icon: Plug },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
          <Sparkles className="h-5 w-5 text-sidebar-ring shrink-0" />
          {!collapsed && (
            <span className="font-display font-bold text-sidebar-primary text-lg tracking-tight">
              ArchiTech
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-1 px-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!collapsed && (
            <div className="px-2 pb-2">
              <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
              <p className="text-xs font-medium text-sidebar-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Manager
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-muted hover:text-destructive hover:bg-sidebar-accent/50 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card">
          <div />
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-semibold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="font-medium text-foreground hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
