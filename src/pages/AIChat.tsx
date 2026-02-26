import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Send, Sparkles, FileText, ChevronDown, ChevronUp, ClipboardList,
  Search, AlertCircle, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  confidence?: number;
  sources?: { name: string; page: string; section: string }[];
  timestamp: Date;
}

const suggestedPrompts = [
  "How do I reset AHU-4B?",
  "What's the SOP for fire pump testing?",
  "Draft a work order for the leaking pipe in Building A",
  "Show maintenance history for RTU-2A",
];

const mockAIResponse = (query: string): Omit<Message, 'id' | 'timestamp'> => ({
  role: 'ai',
  content: query.toLowerCase().includes('ahu') || query.toLowerCase().includes('reset')
    ? `Based on the **Carrier 50XC Operation & Maintenance Manual** (Section 4.2, p.47), here are the steps to reset AHU-4B:\n\n1. **Locate the control panel** on the side of the unit\n2. **Press and hold the RESET button** for 3 seconds until the indicator light turns green\n3. **Verify the unit restarts** — listen for the compressor engaging\n4. **Check the discharge air temperature** after 5 minutes to confirm normal operation\n\n⚠️ If the unit fails to restart after two attempts, contact a licensed HVAC technician and submit a work order.`
    : query.toLowerCase().includes('draft') || query.toLowerCase().includes('work order')
    ? `I can help draft a work order for that issue. Here's what I've prepared:\n\n**Title:** Leaking Pipe — Building A, 2nd Floor\n**Priority:** 🔴 High\n**Trade:** Plumbing\n**Description:** Water leak detected at the 2nd floor supply line junction in Building A. Immediate attention required to prevent water damage.\n\nThis is an **AI Draft** and requires your confirmation before submission.`
    : `Based on available documentation, here is what I found regarding your query:\n\nThe standard operating procedure involves several key steps that should be followed in sequence. Please refer to the source documentation for complete details.\n\nIf you need more specific information, try narrowing your query to a particular building or asset.`,
  confidence: query.toLowerCase().includes('ahu') ? 92 : query.toLowerCase().includes('draft') ? 87 : 65,
  sources: query.toLowerCase().includes('ahu')
    ? [{ name: 'Carrier_50XC_Manual.pdf', page: 'p.47', section: 'Section 4.2 — Reset Procedures' }]
    : query.toLowerCase().includes('draft')
    ? [{ name: 'Building_A_Plumbing_Specs.pdf', page: 'p.12', section: 'Section 2.1 — Supply Lines' }]
    : [{ name: 'General_SOPs.pdf', page: 'p.3', section: 'Section 1 — Overview' }],
});

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-confidence-high' : value >= 50 ? 'bg-confidence-medium' : 'bg-confidence-low';
  const label = value >= 80 ? 'High confidence' : value >= 50 ? 'Moderate — verify with supervisor' : 'Low — insufficient documentation';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full animate-confidence-fill", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SourcePanel({ sources }: { sources: { name: string; page: string; section: string }[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>{sources.length} source{sources.length > 1 ? 's' : ''} cited</span>
        {expanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            {sources.map((src, i) => (
              <div key={i} className="px-3 py-2 text-xs border-b last:border-b-0 border-border">
                <p className="font-medium text-foreground font-mono">{src.name}</p>
                <p className="text-muted-foreground">{src.page} · {src.section}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scopeBuilding, setScopeBuilding] = useState('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    const aiData = mockAIResponse(text);
    const aiMsg: Message = {
      ...aiData,
      id: (Date.now() + 1).toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const isManager = user?.role === 'manager';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
            <div className="h-14 w-14 rounded-2xl bg-ai-surface border border-ai-border flex items-center justify-center mb-4 ai-glow">
              <Sparkles className="h-7 w-7 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              ArchiTech AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Ask questions about your facilities, SOPs, and equipment. 
              Answers are grounded in your uploaded documentation.
            </p>

            {/* Scope filter */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Scope:</span>
              <select
                value={scopeBuilding}
                onChange={e => setScopeBuilding(e.target.value)}
                className="bg-secondary border border-border rounded-md px-2 py-1 text-sm text-foreground"
              >
                <option>All</option>
                <option>Building A</option>
                <option>Building B</option>
                <option>Building C</option>
              </select>
            </div>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {suggestedPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-lg border border-border hover:border-primary/30 hover:bg-card transition-all text-sm text-muted-foreground hover:text-foreground card-shadow"
                >
                  <Search className="h-3.5 w-3.5 inline mr-2 opacity-50" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'ai' && (
                  <div className="h-8 w-8 rounded-lg bg-ai-surface border border-ai-border flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div className={cn(
                  "rounded-xl px-4 py-3 max-w-[85%]",
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border card-shadow"
                )}>
                  {/* Content with markdown-like rendering */}
                  <div className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === 'ai' && "text-foreground"
                  )}>
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.match(/^\d+\.\s\*\*/)) {
                        const parts = line.match(/^(\d+\.)\s\*\*(.*?)\*\*(.*)/);
                        if (parts) {
                          return (
                            <p key={i} className="ml-2 my-0.5">
                              <span className="font-mono text-muted-foreground">{parts[1]}</span>{' '}
                              <strong>{parts[2]}</strong>{parts[3]}
                            </p>
                          );
                        }
                      }
                      if (line.startsWith('⚠️')) {
                        return <p key={i} className="mt-2 p-2 rounded-md bg-ai-surface border border-ai-border text-xs">{line}</p>;
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>

                  {/* AI metadata */}
                  {msg.role === 'ai' && msg.confidence && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-border">
                      <ConfidenceBar value={msg.confidence} />
                      {msg.sources && <SourcePanel sources={msg.sources} />}
                      {isManager && msg.content.toLowerCase().includes('draft') && (
                        <Button variant="ai" size="sm" className="w-full text-xs">
                          <ClipboardList className="h-3.5 w-3.5" />
                          Convert to Work Order Draft
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-1 text-primary-foreground font-display text-xs font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-ai-surface border border-ai-border flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                </div>
                <div className="bg-card border border-border rounded-xl px-4 py-3 card-shadow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="italic text-xs">Searching internal manuals…</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask ArchiTech…"
              disabled={isLoading}
              className="w-full h-11 px-4 pr-12 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          <Button type="submit" disabled={isLoading || !input.trim()} className="h-11 px-4">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
