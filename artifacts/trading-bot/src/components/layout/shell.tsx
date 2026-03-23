import { Link, useLocation } from "wouter";
import { 
  Activity, 
  LayoutDashboard, 
  TerminalSquare, 
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trading", label: "Live Trading", icon: Activity },
  { href: "/strategies", label: "AI Strategies", icon: TrendingUp },
  { href: "/logs", label: "System Logs", icon: TerminalSquare },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-full bg-brand-surface text-foreground overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-brand-panel border-r border-brand-border flex flex-col justify-between shrink-0">
        
        <div className="flex flex-col h-full">
          <div className="h-20 flex flex-col justify-center px-6 border-b border-brand-border shrink-0">
            <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
              <span className="text-brand-blue">AI</span> Trader
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
              Class Project
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 group relative",
                    isActive 
                      ? "bg-brand-blue/10 text-brand-blue" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-blue rounded-r-md shadow-sm shadow-brand-blue/30" />
                    )}
                    <Icon className={cn("w-5 h-5", isActive ? "text-brand-blue" : "text-muted-foreground group-hover:text-white")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom System Status */}
          <div className="p-4 mx-3 mb-4 rounded-lg bg-brand-surface border border-brand-border shrink-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-slow"></span>
                  <span className="text-xs text-brand-green">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-surface relative z-0">
        
        <header className="h-20 bg-brand-panel/50 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-md bg-brand-green/10 border border-brand-green/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
              <span className="text-xs font-semibold text-brand-green tracking-wider">Bot Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            Prototype Interface
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 layout-content">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
      
    </div>
  );
}