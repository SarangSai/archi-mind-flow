import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Plus, ClipboardList, FileText, Sparkles, AlertTriangle, CheckCircle2,
  Clock, Loader2, MessageSquare, ChevronDown, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type WOStatus = 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed';
type Priority = 'high' | 'medium' | 'low';

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: WOStatus;
  trade: string;
  building: string;
  asset?: string;
  isAIDraft: boolean;
  confidence?: number;
  createdAt: string;
  comments: number;
}

const mockOrders: WorkOrder[] = [
  { id: 'WO-401', title: 'AHU-4B Compressor Reset', description: 'Compressor on AHU-4B requires manual reset per Carrier 50XC manual.', priority: 'high', status: 'pending', trade: 'HVAC', building: 'Building A', asset: 'AHU-4B', isAIDraft: true, confidence: 92, createdAt: '2025-01-18', comments: 2 },
  { id: 'WO-400', title: 'Replace Fluorescent Lights — Lobby', description: 'Multiple fluorescent lights in the main lobby need replacement.', priority: 'medium', status: 'in_progress', trade: 'Electrical', building: 'Building B', isAIDraft: false, createdAt: '2025-01-17', comments: 4 },
  { id: 'WO-399', title: 'Leaking Pipe — 2nd Floor', description: 'Water leak at supply line junction on 2nd floor.', priority: 'high', status: 'approved', trade: 'Plumbing', building: 'Building A', isAIDraft: true, confidence: 87, createdAt: '2025-01-16', comments: 1 },
  { id: 'WO-398', title: 'Quarterly HVAC Filter Replacement', description: 'Scheduled filter replacement for all AHU units in Building C.', priority: 'low', status: 'completed', trade: 'HVAC', building: 'Building C', isAIDraft: false, createdAt: '2025-01-14', comments: 0 },
  { id: 'WO-397', title: 'Fire Pump Annual Inspection', description: 'Annual fire pump testing per NFPA 25 requirements.', priority: 'medium', status: 'draft', trade: 'Fire Safety', building: 'All', isAIDraft: true, confidence: 78, createdAt: '2025-01-13', comments: 0 },
  { id: 'WO-396', title: 'Emergency Exit Sign Repair', description: 'Exit sign on 3rd floor stairwell not illuminating.', priority: 'medium', status: 'completed', trade: 'Electrical', building: 'Building A', isAIDraft: false, createdAt: '2025-01-11', comments: 3 },
];

const priorityConfig = {
  high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Medium', className: 'bg-accent/10 text-accent-foreground border-accent/20' },
  low: { label: 'Low', className: 'bg-success/10 text-success border-success/20' },
};

const statusConfig: Record<WOStatus, { label: string; icon: typeof Clock; className: string }> = {
  draft: { label: 'Draft', icon: FileText, className: 'text-muted-foreground' },
  pending: { label: 'Pending Approval', icon: Clock, className: 'text-accent' },
  approved: { label: 'Approved', icon: CheckCircle2, className: 'text-success' },
  in_progress: { label: 'In Progress', icon: Loader2, className: 'text-primary' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'text-success' },
};

export default function WorkOrders() {
  const { user } = useAuth();
  const [orders] = useState(mockOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | WOStatus>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

  const isTechnician = user?.role === 'technician';
  const filtered = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  const statusTabs: { key: 'all' | WOStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: 'Draft' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className={cn("animate-fade-up", isTechnician ? "p-4" : "p-6 max-w-6xl mx-auto")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Work Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} orders</p>
        </div>
        {!isTechnician && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Work Order
          </Button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              statusFilter === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Work order list */}
      {isTechnician ? (
        // Mobile card view for technicians
        <div className="space-y-3">
          {filtered.map(order => {
            const priority = priorityConfig[order.priority];
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={order.id}
                layout
                className="bg-card rounded-xl border border-border p-4 card-shadow"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", priority.className)}>
                    {priority.label}
                  </span>
                  {order.isAIDraft && (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <Sparkles className="h-3 w-3" /> AI
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{order.title}</h3>
                <p className="text-xs text-muted-foreground">{order.building} · {order.trade}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className={cn("flex items-center gap-1 text-xs font-medium", status.className)}>
                    <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // Desktop table view for managers
        <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Priority</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Trade</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Building</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const priority = priorityConfig[order.priority];
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.title}</span>
                          {order.isAIDraft && (
                            <span className="flex items-center gap-0.5 text-xs text-accent bg-ai-surface px-1.5 py-0.5 rounded-full border border-ai-border">
                              <Sparkles className="h-3 w-3" /> AI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", priority.className)}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("flex items-center gap-1 text-xs font-medium", status.className)}>
                          <StatusIcon className="h-3.5 w-3.5" /> {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{order.trade}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.building}</td>
                      <td className="px-4 py-3">
                        {order.comments > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> {order.comments}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-xl border border-border p-6 w-full max-w-md elevated-shadow"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold">Create Work Order</h3>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-6">Choose creation method:</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/40 transition-all"
                >
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="font-display font-semibold text-sm">Manual Entry</span>
                  <span className="text-xs text-muted-foreground">Fill in all fields</span>
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-ai-border hover:border-accent/60 bg-ai-surface/50 transition-all"
                >
                  <Sparkles className="h-8 w-8 text-accent" />
                  <span className="font-display font-semibold text-sm">AI Assisted</span>
                  <span className="text-xs text-muted-foreground">Describe the issue</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail side panel */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-card w-full max-w-lg h-full overflow-auto border-l border-border p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-mono text-muted-foreground">{selectedOrder.id}</span>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedOrder.isAIDraft && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-ai-surface border border-ai-border mb-4 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-medium">AI Draft — Requires Human Confirmation</span>
                </div>
              )}

              <h2 className="font-display text-xl font-bold text-foreground mb-2">{selectedOrder.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{selectedOrder.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", priorityConfig[selectedOrder.priority].className)}>
                    {priorityConfig[selectedOrder.priority].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={cn("text-xs font-medium", statusConfig[selectedOrder.status].className)}>
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trade</p>
                  <p className="text-sm font-medium">{selectedOrder.trade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Building</p>
                  <p className="text-sm font-medium">{selectedOrder.building}</p>
                </div>
              </div>

              {selectedOrder.confidence && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-2">AI Confidence</p>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        selectedOrder.confidence >= 80 ? 'bg-confidence-high' : 'bg-confidence-medium'
                      )}
                      style={{ width: `${selectedOrder.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{selectedOrder.confidence}%</p>
                </div>
              )}

              {selectedOrder.status === 'pending' && !isTechnician && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">Reject</Button>
                  <Button variant="success" className="flex-1">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
