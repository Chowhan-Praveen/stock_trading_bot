import React from "react";
import { useGetMarketRegime, useGetNewsSentiment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/core";
import { cn } from "@/lib/utils";
import { Globe, BarChart3, Newspaper, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Market() {
  const { data: regime } = useGetMarketRegime({ query: { refetchInterval: 10000 } });
  const { data: news } = useGetNewsSentiment({ query: { refetchInterval: 15000 } });

  const getRegimeColor = (r?: string) => {
    switch(r) {
      case 'bull': return 'text-success bg-success/10 border-success/20';
      case 'bear': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'volatile': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Regime Detection */}
      <Card className="col-span-1 border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Globe className="w-48 h-48" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 relative z-10">
            <BarChart3 className="w-6 h-6 text-primary" />
            Macro Regime Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 relative z-10">
          
          <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Current Environment</span>
            <div className={cn(
              "text-5xl font-display font-bold uppercase tracking-widest px-8 py-4 rounded-2xl border-2 backdrop-blur-md shadow-2xl",
              getRegimeColor(regime?.regime)
            )}>
              {regime?.regime || 'ANALYZING...'}
            </div>
            <div className="mt-6 flex items-center gap-4 font-mono text-sm">
              <span className="opacity-60">AI Confidence:</span>
              <span className="text-white font-bold">{regime?.confidence}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-center">
              <div className="text-xs text-muted-foreground mb-2">VIX LEVEL</div>
              <div className={cn("text-2xl font-mono", (regime?.vixLevel || 0) > 25 ? "text-warning" : "text-white")}>
                {regime?.vixLevel}
              </div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-center">
              <div className="text-xs text-muted-foreground mb-2">MOMENTUM</div>
              <div className={cn("text-2xl font-mono", (regime?.momentum || 0) > 0 ? "text-success" : "text-destructive")}>
                {(regime?.momentum || 0) > 0 ? '+' : ''}{regime?.momentum}
              </div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-center">
              <div className="text-xs text-muted-foreground mb-2">TREND STRENGTH</div>
              <div className="text-2xl font-mono text-white">{regime?.trendStrength}%</div>
            </div>
          </div>

          {regime?.signals && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground uppercase">Key Signals</div>
              <div className="flex flex-wrap gap-2">
                {regime.signals.map((sig, i) => (
                  <Badge key={i} variant="outline" className="bg-white/5">{sig}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Sentiment */}
      <Card className="col-span-1 flex flex-col h-[800px]">
        <CardHeader className="shrink-0 border-b border-white/5 pb-4">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              NLP Sentiment Stream
            </div>
            <Badge variant="outline" className="animate-pulse">PROCESSING</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto no-scrollbar p-0">
          <div className="divide-y divide-white/5">
            {news?.map((item) => (
              <div key={item.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <Badge variant={
                    item.sentiment === 'positive' ? 'success' :
                    item.sentiment === 'negative' ? 'destructive' : 'default'
                  }>
                    {item.sentiment.toUpperCase()} ({item.score.toFixed(2)})
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground shrink-0">
                    {format(new Date(item.timestamp), 'HH:mm')}
                  </span>
                </div>
                
                <h4 className="text-base font-medium leading-snug mb-2">{item.headline}</h4>
                
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">{item.symbol}</span>
                    <span>•</span>
                    <span>{item.source}</span>
                  </div>
                  {item.impact === 'high' && (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertCircle className="w-3 h-3" /> HIGH IMPACT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
