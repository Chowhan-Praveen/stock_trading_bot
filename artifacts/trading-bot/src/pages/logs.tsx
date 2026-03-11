import React, { useRef, useEffect } from "react";
import { useGetBotLogs } from "@workspace/api-client-react";
import { Terminal, ShieldAlert, Info, AlertTriangle, Bug } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Logs() {
  const { data: logs } = useGetBotLogs({ limit: 200 }, { query: { refetchInterval: 2000 } });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (level: string) => {
    switch(level) {
      case 'error': return <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
      case 'debug': return <Bug className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
    }
  };

  const getLogColor = (level: string) => {
    switch(level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'debug': return 'text-muted-foreground';
      default: return 'text-white';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
      
      {/* Terminal Header */}
      <div className="h-12 bg-[#111] border-b border-white/10 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm text-muted-foreground">syslog@nexus-core:~/logs</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20"></div>
          <div className="w-3 h-3 rounded-full bg-white/20"></div>
          <div className="w-3 h-3 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-1"
      >
        {logs?.map((log) => (
          <div key={log.id} className="flex gap-4 hover:bg-white/5 py-1 px-2 rounded -mx-2 transition-colors">
            <div className="text-muted-foreground/60 shrink-0 w-[140px] select-none">
              {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
            </div>
            
            <div className="w-20 shrink-0 select-none">
              <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest", 
                log.level === 'error' ? 'bg-destructive/20 text-destructive' :
                log.level === 'warning' ? 'bg-warning/20 text-warning' :
                log.level === 'debug' ? 'bg-white/10 text-muted-foreground' : 'bg-primary/20 text-primary'
              )}>
                {log.level}
              </span>
            </div>

            <div className="w-24 shrink-0 text-muted-foreground truncate select-none">
              [{log.source}]
            </div>

            <div className={cn("flex-1 break-words", getLogColor(log.level))}>
              {log.message}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <span className="ml-2 opacity-50 text-xs">
                  {JSON.stringify(log.metadata)}
                </span>
              )}
            </div>
          </div>
        ))}
        {!logs && (
          <div className="animate-pulse text-primary">Awaiting stream...</div>
        )}
      </div>
      
      {/* Terminal input simulation */}
      <div className="h-12 bg-[#0a0a0a] border-t border-white/5 flex items-center px-4 shrink-0">
        <span className="text-success font-mono mr-2">➜</span>
        <span className="text-primary font-mono mr-2">~</span>
        <span className="w-2 h-4 bg-white/50 animate-pulse"></span>
      </div>
    </div>
  );
}
