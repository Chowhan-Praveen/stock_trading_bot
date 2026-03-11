import React from "react";
import { useGetTrades, useGetWatchlist } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/core";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Activity, BrainCircuit } from "lucide-react";

export default function Trading() {
  const { data: trades } = useGetTrades({ limit: 50 }, { query: { refetchInterval: 3000 } });
  const { data: watchlist } = useGetWatchlist({ query: { refetchInterval: 3000 } });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Live Feed */}
      <Card className="col-span-1 xl:col-span-2 flex flex-col h-full overflow-hidden">
        <CardHeader className="shrink-0 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Execution Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-xs font-mono text-muted-foreground">LIVE</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto no-scrollbar p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase font-mono sticky top-0 bg-card z-10 border-b border-white/10 shadow-sm">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Size</th>
                <th className="px-6 py-4 text-center">AI Confidence</th>
                <th className="px-6 py-4 text-right">Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {trades?.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {format(new Date(trade.timestamp), 'HH:mm:ss.SSS')}
                  </td>
                  <td className="px-6 py-4 font-bold text-white tracking-wider">{trade.symbol}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      trade.action === 'buy' ? 'success' : 
                      trade.action === 'sell' ? 'destructive' : 'outline'
                    } className="uppercase px-3">
                      {trade.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">{formatCurrency(trade.price)}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{trade.quantity}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            trade.confidence > 80 ? "bg-success" : 
                            trade.confidence > 60 ? "bg-warning" : "bg-primary"
                          )}
                          style={{ width: `${trade.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs opacity-70 w-8 text-right">{trade.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs opacity-60 uppercase">{trade.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Watchlist */}
      <Card className="col-span-1 flex flex-col h-full overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Neural Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto no-scrollbar p-0">
          <div className="divide-y divide-white/5">
            {watchlist?.map((item) => (
              <div key={item.symbol} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-xl tracking-wider">{item.symbol}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-lg">{formatCurrency(item.price)}</div>
                    <div className={cn(
                      "font-mono text-sm",
                      item.change >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)} ({formatPercent(item.changePercent)})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-muted-foreground font-mono">AI Prediction</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono opacity-60">Conf: {item.predictionConfidence}%</span>
                    <Badge variant={
                      item.prediction === 'strong_buy' ? 'success' :
                      item.prediction === 'buy' ? 'success' :
                      item.prediction === 'strong_sell' ? 'destructive' :
                      item.prediction === 'sell' ? 'destructive' : 'outline'
                    } className="uppercase">
                      {item.prediction.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
