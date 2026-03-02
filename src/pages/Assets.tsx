import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  Building2, Search, Wrench, Zap, Droplets, Flame, ChevronRight,
  BarChart3, AlertTriangle, TrendingUp, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Building {
  name: string;
  systems: {
    name: string;
    icon: typeof Wrench;
    equipment: {
      id: string;
      name: string;
      type: string;
      openOrders: number;
      lastService: string;
      totalOrders: number;
    }[];
  }[];
}

const buildings: Building[] = [
  {
    name: 'Building A',
    systems: [
      {
        name: 'HVAC', icon: Wrench,
        equipment: [
          { id: 'AHU-4B', name: 'Air Handler Unit 4B', type: 'HVAC', openOrders: 3, lastService: 'Jan 12, 2025', totalOrders: 12 },
          { id: 'AHU-4C', name: 'Air Handler Unit 4C', type: 'HVAC', openOrders: 1, lastService: 'Jan 8, 2025', totalOrders: 7 },
          { id: 'RTU-2A', name: 'Rooftop Unit 2A', type: 'HVAC', openOrders: 0, lastService: 'Dec 20, 2024', totalOrders: 5 },
        ],
      },
      {
        name: 'Electrical', icon: Zap,
        equipment: [
          { id: 'PNL-A1', name: 'Main Panel A1', type: 'Electrical', openOrders: 0, lastService: 'Jan 5, 2025', totalOrders: 3 },
        ],
      },
      {
        name: 'Plumbing', icon: Droplets,
        equipment: [
          { id: 'PMP-1', name: 'Booster Pump 1', type: 'Plumbing', openOrders: 2, lastService: 'Jan 16, 2025', totalOrders: 8 },
        ],
      },
    ],
  },
  {
    name: 'Building B',
    systems: [
      {
        name: 'HVAC', icon: Wrench,
        equipment: [
          { id: 'AHU-B1', name: 'Air Handler Unit B1', type: 'HVAC', openOrders: 1, lastService: 'Jan 14, 2025', totalOrders: 9 },
        ],
      },
      {
        name: 'Electrical', icon: Zap,
        equipment: [
          { id: 'PNL-B1', name: 'Main Panel B1', type: 'Electrical', openOrders: 1, lastService: 'Jan 10, 2025', totalOrders: 4 },
          { id: 'LGT-B3', name: 'Lobby Lighting B3', type: 'Electrical', openOrders: 0, lastService: 'Jan 17, 2025', totalOrders: 6 },
        ],
      },
    ],
  },
  {
    name: 'Building C',
    systems: [
      {
        name: 'HVAC', icon: Wrench,
        equipment: [
          { id: 'AHU-C1', name: 'Air Handler Unit C1', type: 'HVAC', openOrders: 0, lastService: 'Jan 14, 2025', totalOrders: 4 },
        ],
      },
    ],
  },
];

const systemIcons: Record<string, typeof Wrench> = {
  HVAC: Wrench,
  Electrical: Zap,
  Plumbing: Droplets,
  'Fire Safety': Flame,
};

export default function Assets() {
  const { user } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Building['systems'][0]['equipment'][0] | null>(null);
  const [search, setSearch] = useState('');
  const isTechnician = user?.role === 'technician';

  const filteredEquipment = selectedBuilding.systems
    .filter(s => !selectedSystem || s.name === selectedSystem)
    .flatMap(s => s.equipment)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={cn("animate-fade-up", isTechnician ? "p-4" : "p-6")}>
      {/* Summary widgets — Manager only */}
      {!isTechnician && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground font-medium">Most Issues</span>
            </div>
            <p className="font-display font-bold text-lg">AHU-4B</p>
            <p className="text-xs text-muted-foreground">12 work orders total</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">WO Volume</span>
            </div>
            <div className="space-y-1">
              {buildings.map(b => (
                <div key={b.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{b.name}</span>
                  <span className="font-mono font-medium">{b.systems.reduce((a, s) => a + s.equipment.reduce((a2, e) => a2 + e.totalOrders, 0), 0)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground font-medium">Top Issue Type</span>
            </div>
            <p className="font-display font-bold text-lg">HVAC</p>
            <p className="text-xs text-muted-foreground">47% of all work orders</p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Buildings panel */}
      {!isTechnician && (
      <div className="shrink-0 w-56">
          <h2 className="font-display font-bold text-lg mb-3">Buildings</h2>

          {!isTechnician && (
            <div className="space-y-1 mb-4">
              {buildings.map(b => (
                <button
                  key={b.name}
                  onClick={() => { setSelectedBuilding(b); setSelectedEquipment(null); setSelectedSystem(null); }}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedBuilding.name === b.name
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  {b.name}
                  <ChevronRight className="h-3 w-3 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {/* System filter */}
          {!isTechnician && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium px-1 mb-2">Filter by System</p>
              {['HVAC', 'Electrical', 'Plumbing'].map(sys => {
                const Icon = systemIcons[sys] || Wrench;
                return (
                  <button
                    key={sys}
                    onClick={() => setSelectedSystem(selectedSystem === sys ? null : sys)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                      selectedSystem === sys
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {sys}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

        {/* Equipment list + detail */}
        {!isTechnician && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display font-bold text-lg">{selectedBuilding.name} Equipment</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search equipment…" value={search} onChange={e => setSearch(e.target.value.slice(0, 100))} maxLength={100} className="pl-9 h-9" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Equipment cards */}
              <div className="space-y-2">
                {filteredEquipment.map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEquipment(eq)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      selectedEquipment?.id === eq.id
                        ? "border-primary bg-primary/5 card-shadow"
                        : "border-border bg-card hover:border-primary/30 card-shadow"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{eq.id}</span>
                      {eq.openOrders > 0 && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                          {eq.openOrders} open
                        </span>
                      )}
                    </div>
                    <p className="font-display font-semibold text-sm">{eq.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{eq.type} · Last: {eq.lastService}</p>
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              {selectedEquipment && (
                <div className="bg-card rounded-xl border border-border p-6 card-shadow h-fit">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-sm text-muted-foreground">{selectedEquipment.id}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-4">{selectedEquipment.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <p className="text-sm font-medium">{selectedEquipment.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Building</p>
                      <p className="text-sm font-medium">{selectedBuilding.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Work Orders</p>
                      <p className="text-sm font-medium">{selectedEquipment.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Open Orders</p>
                      <p className="text-sm font-medium">{selectedEquipment.openOrders}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Last Service</p>
                      <p className="text-sm font-medium">{selectedEquipment.lastService}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                      <ClipboardList className="h-3.5 w-3.5" /> View Work Orders
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                      <Search className="h-3.5 w-3.5" /> View Docs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technician: simple list */}
        {isTechnician && (
          <div className="w-full">
            <h2 className="font-display font-bold text-lg mb-3">Asset Lookup</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assets…" value={search} onChange={e => setSearch(e.target.value.slice(0, 100))} maxLength={100} className="pl-9" />
            </div>
            <div className="space-y-2">
              {buildings.flatMap(b => b.systems.flatMap(s => s.equipment)).filter(e =>
                !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
              ).map(eq => (
                <div key={eq.id} className="bg-card rounded-xl border border-border p-4 card-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{eq.id}</span>
                    <span className="text-xs text-muted-foreground">{eq.type}</span>
                  </div>
                  <p className="font-display font-semibold text-sm">{eq.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last service: {eq.lastService}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
