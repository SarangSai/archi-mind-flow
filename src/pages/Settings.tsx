import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User, Bell, Palette, Shield, Building2, Plus, X,
  Lock, Users, Mail, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
] as const;

const collaborators = [
  { name: 'Mike Chen', type: 'Internal', access: 'Building A, B', email: 'mike@company.com' },
  { name: 'Acme Maintenance', type: 'External', access: 'Building A only', email: 'contact@acme.com' },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-sm text-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-secondary"
        )}
      >
        <span className={cn(
          "absolute top-1 left-1 h-4 w-4 rounded-full bg-card transition-transform",
          checked && "translate-x-4"
        )} />
      </button>
    </label>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('account');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    woStatusChanges: true,
    aiDraftReady: true,
  });
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');
  const isManager = user?.role === 'manager';

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-up">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-48 shrink-0">
          <div className="space-y-1">
            {tabs.filter(t => isManager || t.id !== 'security').map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'account' && (
            <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-6">
              <h2 className="font-display font-semibold text-lg">Account & Role</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <div className="flex items-center gap-1.5">
                    {user?.role === 'manager' ? <Building2 className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
                    <span className="text-sm font-medium capitalize">{user?.role}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Buildings</p>
                  <p className="text-sm font-medium">{user?.buildings?.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm">Switch Account</Button>
                <Button variant="destructive" size="sm" onClick={logout}>Logout</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <h2 className="font-display font-semibold text-lg mb-4">Notification Preferences</h2>
              <div className="divide-y divide-border">
                <Toggle
                  checked={notifications.emailAlerts}
                  onChange={v => setNotifications(p => ({ ...p, emailAlerts: v }))}
                  label="Email alerts"
                />
                <Toggle
                  checked={notifications.woStatusChanges}
                  onChange={v => setNotifications(p => ({ ...p, woStatusChanges: v }))}
                  label="Work order status changes"
                />
                <Toggle
                  checked={notifications.aiDraftReady}
                  onChange={v => setNotifications(p => ({ ...p, aiDraftReady: v }))}
                  label="AI draft ready alerts"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <h2 className="font-display font-semibold text-lg mb-4">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setAppearance('light'); document.documentElement.classList.remove('dark'); }}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center",
                    appearance === 'light' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="h-16 rounded-lg bg-background border border-border mb-3 flex items-center justify-center">
                    <div className="h-2 w-12 bg-foreground/20 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => { setAppearance('dark'); document.documentElement.classList.add('dark'); }}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center",
                    appearance === 'dark' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="h-16 rounded-lg bg-foreground border border-foreground/20 mb-3 flex items-center justify-center">
                    <div className="h-2 w-12 bg-background/20 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && isManager && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-4 w-4 text-primary" />
                  <h2 className="font-display font-semibold text-lg">Security & Permissions</h2>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20 mb-6 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>All data encrypted at rest and in transit</span>
                </div>

                <h3 className="font-display font-semibold text-sm mb-3">Collaborators</h3>
                <div className="space-y-2 mb-4">
                  {collaborators.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          c.type === 'Internal' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"
                        )}>
                          {c.type}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{c.access}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" /> Add Collaborator
                </Button>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Changes to permissions require confirmation and are logged.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last permission change: Jan 15, 2025 by {user?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
