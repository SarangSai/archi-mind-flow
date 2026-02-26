import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload, FileText, Search, CheckCircle2, Clock, Loader2, AlertCircle,
  X, Building2, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Doc {
  id: string;
  name: string;
  type: string;
  building: string;
  system: string;
  status: 'indexed' | 'parsing' | 'indexing' | 'failed';
  uploadedAt: string;
}

const mockDocs: Doc[] = [
  { id: '1', name: 'Carrier_50XC_Manual.pdf', type: 'PDF', building: 'Building A', system: 'HVAC', status: 'indexed', uploadedAt: '2025-01-15' },
  { id: '2', name: 'Fire_Pump_SOP.docx', type: 'DOCX', building: 'All', system: 'Fire Safety', status: 'indexed', uploadedAt: '2025-01-12' },
  { id: '3', name: 'Electrical_Panels_Guide.pdf', type: 'PDF', building: 'Building B', system: 'Electrical', status: 'indexed', uploadedAt: '2025-01-10' },
  { id: '4', name: 'Plumbing_Specs_2024.pdf', type: 'PDF', building: 'Building A', system: 'Plumbing', status: 'indexing', uploadedAt: '2025-01-18' },
  { id: '5', name: 'HVAC_Maintenance_Log.txt', type: 'TXT', building: 'Building C', system: 'HVAC', status: 'parsing', uploadedAt: '2025-01-18' },
];

const statusConfig = {
  indexed: { icon: CheckCircle2, label: 'Indexed', className: 'text-success' },
  parsing: { icon: Loader2, label: 'Parsing…', className: 'text-accent animate-spin' },
  indexing: { icon: Clock, label: 'Indexing…', className: 'text-accent' },
  failed: { icon: AlertCircle, label: 'Failed', className: 'text-destructive' },
};

export default function Documents() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('All');
  const [filterSystem, setFilterSystem] = useState('All');
  const [docs] = useState(mockDocs);

  const filtered = docs.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterBuilding !== 'All' && d.building !== filterBuilding) return false;
    if (filterSystem !== 'All' && d.system !== filterSystem) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Document Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload and manage knowledge base documents</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterBuilding}
          onChange={e => setFilterBuilding(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option>All</option>
          <option>Building A</option>
          <option>Building B</option>
          <option>Building C</option>
        </select>
        <select
          value={filterSystem}
          onChange={e => setFilterSystem(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option>All</option>
          <option>HVAC</option>
          <option>Electrical</option>
          <option>Plumbing</option>
          <option>Fire Safety</option>
        </select>
      </div>

      {/* Document table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-display font-semibold text-foreground mb-2">No documents found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {docs.length === 0
              ? "No documents uploaded yet. Add manuals or SOPs to enable AI knowledge."
              : "No documents match your current filters."}
          </p>
          {docs.length === 0 && (
            <Button onClick={() => setShowUpload(true)} className="mt-4">
              <Upload className="h-4 w-4" /> Upload Your First Document
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Building</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">System</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-display font-semibold text-muted-foreground">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => {
                  const status = statusConfig[doc.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={doc.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium font-mono text-xs">{doc.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{doc.type}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{doc.building}</td>
                      <td className="px-4 py-3 text-muted-foreground">{doc.system}</td>
                      <td className="px-4 py-3">
                        <span className={cn("flex items-center gap-1.5 text-xs font-medium", status.className)}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{doc.uploadedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-xl border border-border p-6 w-full max-w-lg elevated-shadow"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">Upload Documents</h3>
                <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer mb-4">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
                <p className="font-display font-medium text-foreground">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT supported</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">example_manual.pdf</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <select className="text-xs px-2 py-1 rounded border border-input bg-background">
                        <option>Building A</option>
                        <option>Building B</option>
                      </select>
                      <select className="text-xs px-2 py-1 rounded border border-input bg-background">
                        <option>HVAC</option>
                        <option>Electrical</option>
                      </select>
                      <select className="text-xs px-2 py-1 rounded border border-input bg-background">
                        <option>Asset…</option>
                        <option>AHU-4B</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                <Button>Upload 1 File</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
