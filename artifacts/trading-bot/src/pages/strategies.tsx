import React from "react";
import { useGetStrategies, useActivateStrategy, useDeactivateStrategy } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui/core";
import { formatPercent, cn } from "@/lib/utils";
import { Brain, Cpu, Network, Zap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Strategies() {
  const { data: strategies, refetch } = useGetStrategies({ query: { refetchInterval: 5000 } });
  const { toast } = useToast();

  const activate = useActivateStrategy({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Strategy Activated", description: `${data.name} is now live.` });
        refetch();
      }
    }
  });

  const deactivate = useDeactivateStrategy({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Strategy Deactivated", description: `${data.name} has been paused.` });
        refetch();
      }
    }
  });

  const toggleStrategy = (strategy: any) => {
    if (strategy.isActive) {
      deactivate.mutate({ id: strategy.id });
    } else {
      activate.mutate({ id: strategy.id });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'RL': return <Brain className="w-6 h-6 text-primary" />;
      case 'ML': return <Network className="w-6 h-6 text-accent" />;
      default: return <Cpu className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">AI Strategies</h2>
        <p className="text-muted-foreground mt-2">Manage active machine learning and reinforcement learning agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {strategies?.map((strategy) => (
          <Card key={strategy.id} className={cn(
            "relative transition-all duration-300",
            strategy.isActive ? "border-primary/50 shadow-lg shadow-primary/5" : "opacity-80 hover:opacity-100"
          )}>
            {strategy.isActive && (
              <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none" />
            )}
            <CardHeader className="flex flex-row items-start justify-between border-b-0 pb-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/50 rounded-xl border border-white/10">
                  {getIcon(strategy.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] py-0">{strategy.type}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{strategy.algorithm}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant={strategy.isActive ? "destructive" : "success"}
                size="sm"
                className="w-24 font-mono uppercase tracking-wider text-xs"
                onClick={() => toggleStrategy(strategy)}
                disabled={activate.isPending || deactivate.isPending}
              >
                {strategy.isActive ? "Pause" : "Deploy"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed h-10 line-clamp-2">
                {strategy.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Win Rate</div>
                  <div className={cn(
                    "text-2xl font-mono font-bold text-glow-success",
                    strategy.winRate > 50 ? "text-success" : "text-warning"
                  )}>
                    {strategy.winRate}%
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Sharpe Ratio</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {strategy.sharpeRatio.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  Total Trades: <span className="text-white">{strategy.totalTrades}</span>
                </div>
                {strategy.isTraining ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>TRAINING...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    <span>READY</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
