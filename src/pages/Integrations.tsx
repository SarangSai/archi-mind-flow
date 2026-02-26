import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Mail, Server, Download, Copy, CheckCircle2, Clock, Loader2,
  ExternalLink, Shield, FileDown, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'email', label: 'Email Forwarding', icon: Mail },
  { id: 'cmms', label: 'CMMS Connectors', icon: Server },
  { id: 'export', label: 'Export Tools', icon: Download },
] as const;

const recentEmails = [
  { subject: 'WO #4421 — HVAC Compressor', from: 'john@company.com', status: 'parsed' as const, time: '2 min ago' },
  { subject: 'Urgent: Water leak Bldg A', from: 'mary@company.com', status: 'processing' as const, time: '5 min ago' },
  { subject: 'Monthly Fire Inspection', from: 'safety@vendor.com', status: 'parsed' as const, time: '1 hour ago' },
];

const cmmsConnectors = [
  { name: 'Angus AnyWhere', status: 'Export-Ready' },
  { name: 'Yardi Voyager', status: 'Export-Ready' },
  { name: 'MRI Software', status: 'Export-Ready' },
  { name: 'Custom CSV', status: 'Configurable' },
];

const downloadHistory = [
  { name: 'WO_Export_Jan2025.csv', date: 'Jan 15, 2025' },
  { name: 'Monthly_Report_Dec.pdf', date: 'Jan 01, 2025' },
  { name: 'HVAC_WO_Report.csv', date: 'Dec 15, 2024' },
];

export default function Integrations() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('email');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('intake-bldga@architech.ai');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect your existing systems without API dependencies</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Email Forwarding */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <h3 className="font-display font-semibold text-foreground mb-4">Email Ingestion Setup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Forward work order emails to this address. ArchiTech will parse and index them automatically.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <code className="flex-1 text-sm font-mono">intake-bldga@architech.ai</code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Processing time: ≤20 seconds
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Ingested Emails</h3>
            <div className="space-y-3">
              {recentEmails.map((email, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">{email.from} · {email.time}</p>
                  </div>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-medium shrink-0 ml-3",
                    email.status === 'parsed' ? 'text-success' : 'text-accent'
                  )}>
                    {email.status === 'parsed'
                      ? <><CheckCircle2 className="h-3.5 w-3.5" /> Parsed</>
                      : <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing</>
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CMMS Connectors */}
      {activeTab === 'cmms' && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <div className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">ArchiTech overlays your existing system — no API connection required.</p>
                <p className="text-xs text-muted-foreground mt-1">Your data never leaves ArchiTech without your explicit export.</p>
              </div>
            </div>

            <h3 className="font-display font-semibold text-foreground mb-4">Supported Systems</h3>
            <div className="space-y-2">
              {cmmsConnectors.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <span className="text-xs text-success font-medium">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Tools */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <h3 className="font-display font-semibold text-foreground mb-4">Export Work Orders</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button variant="outline"><FileDown className="h-4 w-4" /> Export as PDF</Button>
              <Button variant="outline"><FileDown className="h-4 w-4" /> Export as CSV</Button>
              <Button variant="outline"><FileDown className="h-4 w-4" /> CMMS-formatted CSV</Button>
            </div>

            <h3 className="font-display font-semibold text-foreground mb-4">Generate Report</h3>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input type="date" className="h-9 px-3 rounded-md border border-input bg-background text-sm" />
                <span className="text-muted-foreground">→</span>
                <input type="date" className="h-9 px-3 rounded-md border border-input bg-background text-sm" />
              </div>
              <select className="h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option>All Buildings</option>
                <option>Building A</option>
                <option>Building B</option>
              </select>
              <Button>Generate Report</Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <h3 className="font-display font-semibold text-foreground mb-4">Download History</h3>
            <div className="space-y-2">
              {downloadHistory.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <FileDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{d.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
