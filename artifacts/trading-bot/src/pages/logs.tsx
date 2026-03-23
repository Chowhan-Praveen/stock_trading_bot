import { useEffect, useState, useRef } from "react";
import { TerminalSquare, Filter, Play, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBotLogs } from "@workspace/api-client-react";

export default function LogsPage() {
  const { data: fetchLogs } = useGetBotLogs({ limit: 100 }, { query: { refetchInterval: 2000 }});
  const logs = fetchLogs || [];
  
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate incoming logs handled by React Query with refetchInterval

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = filter === "ALL" ? logs : logs.filter((l: any) => (l.level || 'INFO').toUpperCase() === filter);

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <TerminalSquare className="w-8 h-8 text-brand-blue" />
            System Logs
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Live diagnostic output and execution traces.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 border border-brand-border rounded-md p-1">
            {["ALL", "INFO", "EXECUTION", "MODEL", "WARNING"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filter === f ? 'bg-brand-blue text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors text-xs font-mono
              ${autoScroll ? 'bg-brand-green/10 text-brand-green border-brand-green/30' : 'bg-brand-panel text-muted-foreground border-brand-border hover:bg-white/5'}`}
          >
            {autoScroll ? <Play className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            Auto-Scroll
          </button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-brand-border/50 bg-[#0A0D14]">
        <CardHeader className="border-b border-brand-border/50 bg-[#121620] pb-3 pt-3 shrink-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-mono text-muted-foreground flex items-center gap-2 font-normal">
            <TerminalSquare className="w-4 h-4" />
            root@nexus-core:~# tail -f /var/log/trading-engine.log
          </CardTitle>
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed" ref={scrollRef}>
          <div className="space-y-1">
            {filteredLogs.map((log: any) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 px-2 py-1 rounded transition-colors group">
                <span className="text-muted-foreground shrink-0 w-20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`shrink-0 w-24 font-bold tracking-wider
                  ${(log.level || 'INFO').toUpperCase() === 'EXECUTION' ? 'text-brand-green' : 
                    (log.level || 'INFO').toUpperCase() === 'WARNING' ? 'text-brand-amber' : 
                    (log.level || 'INFO').toUpperCase() === 'MODEL' ? 'text-brand-blue' : 'text-gray-400'}`}
                >
                  [{(log.level || 'INFO').toUpperCase()}]
                </span>
                <span className="text-white group-hover:text-brand-blue transition-colors break-words">
                  {log.message}
                </span>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-muted-foreground italic px-2 py-4">No logs matching filter '{filter}'</div>
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}