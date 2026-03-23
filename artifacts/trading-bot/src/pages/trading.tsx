import { Activity, ShieldCheck, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { useGetTrades, useGetWatchlist } from "@workspace/api-client-react";

export default function TradingPage() {
  const { data: tradesData } = useGetTrades({ limit: 50 }, { query: { refetchInterval: 3000 }});
  const { data: watchlistData } = useGetWatchlist({ query: { refetchInterval: 5000 }});

  const trades = tradesData || [];
  const prices = watchlistData || [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-brand-blue" />
            Live Trading
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time execution feed and neural watchlist monitoring.
          </p>
        </div>
        <StatusBadge status="active" label="EXECUTION: LIVE" pulse />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Execution Feed */}
        <Card className="md:col-span-2 flex flex-col h-[600px] border-brand-border/50">
          <CardHeader className="border-b border-brand-border/50 bg-black/20 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-amber" />
                  Execution Feed
                </CardTitle>
                <CardDescription className="mt-1">Live algorithmic order routing.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-brand-surface px-3 py-1.5 rounded-md border border-brand-border">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                API Connected
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-surface sticky top-0 z-10">
                <tr className="text-muted-foreground border-b border-brand-border/50">
                  <th className="font-medium px-6 py-4">Time</th>
                  <th className="font-medium px-6 py-4">Symbol</th>
                  <th className="font-medium px-6 py-4">Action</th>
                  <th className="font-medium px-6 py-4 text-right">Fill Price</th>
                  <th className="font-medium px-6 py-4">Strategy Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/20">
                {trades.map((trade: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-muted-foreground group-hover:text-white transition-colors">{new Date(trade.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 font-bold text-white">{trade.symbol}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trade.type.toLowerCase() as StatusType} />
                    </td>
                    <td className="px-6 py-4 font-mono text-white text-right">${trade.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{trade.reason || trade.strategyId || 'RL Agent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Neural Watchlist */}
        <Card className="flex flex-col h-[600px] border-brand-border/50">
          <CardHeader className="border-b border-brand-border/50 bg-black/20 pb-4 shrink-0">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
              Neural Watchlist
            </CardTitle>
            <CardDescription className="mt-1">Real-time asset tracking.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-3">
            {prices.map((stock: any) => (
              <div key={stock.symbol} className="flex flex-col p-4 rounded-lg bg-black/40 border border-brand-border/50 hover:border-brand-blue/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-white group-hover:text-brand-blue transition-colors">{stock.symbol}</span>
                  <span className="font-mono text-white">${stock.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground text-xs">24h Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
                  <span className={stock.change >= 0 ? "text-brand-green" : "text-brand-red"}>
                    {stock.change > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}