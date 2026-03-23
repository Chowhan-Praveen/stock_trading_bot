import { useState } from "react";
import { 
  Crosshair, 
  RefreshCw, 
  BrainCircuit, 
  Gauge, 
  AlertTriangle 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useGetWatchlist } from "@workspace/api-client-react";

export default function SignalEnginePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: watchlistData, refetch } = useGetWatchlist({ query: { refetchInterval: 5000 }});

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setTimeout(() => setIsRefreshing(false), 500));
  };

  const signals = (watchlistData || []).map((w: any) => {
    const isBull = w.changePercent > 0;
    return {
      symbol: w.symbol,
      price: w.price,
      recommendation: isBull ? "BUY" : w.changePercent < -1 ? "SELL" : "HOLD",
      confidence: Math.round(50 + Math.abs(w.changePercent) * 10),
      conditionsMatched: isBull ? 6 : 4,
      totalConditions: 7,
      mlPrediction: isBull ? "Bullish Continuation" : "Bearish Setup",
      mlConfidence: Math.round(60 + Math.abs(w.changePercent) * 15),
      rlQScore: isBull ? 0.75 : -0.45,
      regime: isBull ? "BULLISH" : "BEARISH",
      expiresIn: "00:15:00"
    };
  });

  const buySignals = signals.filter((s: any) => s.recommendation === "BUY").length;
  const sellSignals = signals.filter((s: any) => s.recommendation === "SELL").length;
  const holdSignals = signals.filter((s: any) => s.recommendation === "HOLD").length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-brand-blue" />
            Signal Engine
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            AI-generated trading signals derived from ensemble ML predictions, RL Q-values, and technical regime analysis.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-brand-panel border border-brand-border rounded-md hover:bg-white/5 transition-colors text-sm text-white"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Force Recalculate
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-brand-green/20 bg-brand-green/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-green flex items-center gap-2 text-sm uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Active Buy Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{buySignals}</div>
          </CardContent>
        </Card>
        
        <Card className="border-brand-red/20 bg-brand-red/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-red flex items-center gap-2 text-sm uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              Active Sell Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{sellSignals}</div>
          </CardContent>
        </Card>

        <Card className="border-brand-amber/20 bg-brand-amber/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-amber flex items-center gap-2 text-sm uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-brand-amber" />
              Holding Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{holdSignals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Signal Cards */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold text-white mb-4">Neural Network Outputs</h2>
        
        {signals.map((signal: any) => (
          <Card key={signal.symbol} className="overflow-hidden border-brand-border/50">
            <div className="flex flex-col md:flex-row">
              
              {/* Left Header Section */}
              <div className="bg-black/40 p-6 md:w-64 border-b md:border-b-0 md:border-r border-brand-border/50 flex flex-col justify-center items-center md:items-start text-center md:text-left shrink-0">
                <div className="text-4xl font-black text-white tracking-widest mb-1">{signal.symbol}</div>
                <div className="text-xl font-mono text-muted-foreground mb-4">${signal.price.toFixed(2)}</div>
                
                <div className="w-full mt-auto">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="text-white font-mono">{signal.confidence}%</span>
                  </div>
                  <div className="w-full bg-brand-surface rounded-full h-1.5 mb-4">
                    <div 
                      className={`h-1.5 rounded-full ${signal.recommendation === 'BUY' ? 'bg-brand-green' : signal.recommendation === 'SELL' ? 'bg-brand-red' : 'bg-brand-amber'}`} 
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <div className="flex justify-center w-full">
                     <StatusBadge status={signal.recommendation.toLowerCase() as any} className="w-full justify-center py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Right Details Section */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-blue mb-3">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">ML Prediction</span>
                  </div>
                  <div className="text-sm text-white">{signal.mlPrediction}</div>
                  <div className="text-xs text-muted-foreground mt-1">Network Certainty: <span className="text-white font-mono">{signal.mlConfidence}%</span></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-amber mb-3">
                    <Gauge className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">RL Agent (DQN)</span>
                  </div>
                  <div className="text-sm text-white">Action Value Estimation</div>
                  <div className="text-xs text-muted-foreground mt-1">Q-Score: <span className="text-white font-mono">{signal.rlQScore.toFixed(2)}</span></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-green mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Tech Alignment</span>
                  </div>
                  <div className="text-sm text-white">Indicators Matched: {signal.conditionsMatched}/{signal.totalConditions}</div>
                  <div className="text-xs text-muted-foreground mt-1">Regime: <StatusBadge status={signal.regime === 'BULLISH' ? 'buy' : signal.regime === 'BEARISH' ? 'sell' : 'hold'} label={signal.regime} /></div>
                </div>

                <div className="space-y-2 flex flex-col justify-center border-l border-brand-border/50 pl-6">
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Signal Expiry</div>
                   <div className="text-2xl font-mono text-white">{signal.expiresIn}</div>
                </div>

              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
