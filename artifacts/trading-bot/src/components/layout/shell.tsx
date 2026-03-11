import * as React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Globe, 
  LineChart, 
  Terminal,
  Power,
  ZapOff,
  Radio,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetBotStatus, useStartBot, useStopBot, useTriggerKillSwitch } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trading", label: "Live Trading", icon: Activity },
  { href: "/strategies", label: "AI Strategies", icon: Cpu },
  { href: "/risk", label: "Risk Management", icon: ShieldAlert },
  { href: "/market", label: "Market Intel", icon: Globe },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/logs", label: "System Logs", icon: Terminal },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { toast } = useToast();
  
  const { data: status, refetch } = useGetBotStatus({
    query: { refetchInterval: 3000 }
  });

  const startBot = useStartBot({
    mutation: {
      onSuccess: () => {
        toast({ title: "Bot Started", description: "Trading engines initialized." });
        refetch();
      }
    }
  });

  const stopBot = useStopBot({
    mutation: {
      onSuccess: () => {
        toast({ title: "Bot Stopped", description: "Trading engines halted gracefully." });
        refetch();
      }
    }
  });

  const killSwitch = useTriggerKillSwitch({
    mutation: {
      onSuccess: () => {
        toast({ 
          title: "KILL SWITCH ACTIVATED", 
          description: "All trading halted immediately. Positions liquidating.",
          variant: "destructive" 
        });
        refetch();
      }
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-y-0 border-l-0 flex-shrink-0 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden box-glow-primary border border-primary/50 flex items-center justify-center bg-black">
            <img src={`${import.meta.env.BASE_URL}images/bot-avatar.png`} alt="AI Brain" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-primary/20 animate-pulse mix-blend-overlay"></div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider text-white">NEXUS<span className="text-primary">.AI</span></h1>
            <p className="text-xs text-muted-foreground font-mono">QUANT_CORE_V9</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 box-glow-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "animate-pulse-slow" : "group-hover:scale-110 transition-transform")} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
            <span className="flex items-center gap-2"><Server className="w-3 h-3" /> Uptime</span>
            <span>{status?.uptime ? Math.floor(status.uptime / 3600) + 'h ' + Math.floor((status.uptime % 3600) / 60) + 'm' : '0h 0m'}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Data Feed</span>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", status?.dataFeedStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-destructive')} />
                <span className="text-xs font-mono">{status?.dataFeedStatus?.toUpperCase() || 'OFFLINE'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">ML Core</span>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", status?.mlModelStatus === 'ready' ? 'bg-primary animate-pulse' : 'bg-warning')} />
                <span className="text-xs font-mono">{status?.mlModelStatus?.toUpperCase() || 'STANDBY'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 glass-panel border-b border-x-0 border-t-0 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Radio className={cn("w-5 h-5", status?.isRunning ? "text-success animate-pulse" : "text-muted-foreground")} />
              <span className="font-display font-semibold text-lg">
                STATUS: {status?.isKillSwitchActive ? (
                  <span className="text-destructive animate-pulse text-glow-destructive">EMERGENCY HALT</span>
                ) : status?.isRunning ? (
                  <span className="text-success text-glow-success">ACTIVE & TRADING</span>
                ) : (
                  <span className="text-muted-foreground">STANDBY</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {status?.isRunning ? (
              <button 
                onClick={() => stopBot.mutate()}
                disabled={stopBot.isPending || status.isKillSwitchActive}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 transition-all font-mono text-sm font-bold disabled:opacity-50"
              >
                <Power className="w-4 h-4" /> PAUSE BOT
              </button>
            ) : (
              <button 
                onClick={() => startBot.mutate()}
                disabled={startBot.isPending || status?.isKillSwitchActive}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-success/10 text-success border border-success/20 hover:bg-success/20 hover:box-glow-primary transition-all font-mono text-sm font-bold disabled:opacity-50"
              >
                <Power className="w-4 h-4" /> INITIALIZE
              </button>
            )}

            <button 
              onClick={() => killSwitch.mutate()}
              disabled={killSwitch.isPending || status?.isKillSwitchActive}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 box-glow-destructive transition-all font-display tracking-widest font-bold disabled:opacity-50 active:scale-95"
            >
              <ZapOff className="w-4 h-4" /> KILL SWITCH
            </button>
          </div>
        </header>

        {/* Page Content with scroll */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
