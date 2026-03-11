import React from "react";
import { useGetPerformanceMetrics, useGetBacktestResults } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/core";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from "date-fns";
import { LineChart, Calculator, Trophy, Skull } from "lucide-react";

export default function Analytics() {
  const { data: metrics } = useGetPerformanceMetrics();
  const { data: backtest } = useGetBacktestResults();

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep metrics and historical backtest results.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/30">
          SHARPE: {metrics?.sharpeRatio.toFixed(2)}
        </Badge>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-card rounded-xl border border-white/5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-warning" /> Win Rate
          </div>
          <div className="text-3xl font-mono font-bold">{metrics?.winRate}%</div>
          <div className="text-sm mt-2 text-muted-foreground font-mono">
            {metrics?.winningTrades}W / {metrics?.losingTrades}L
          </div>
        </div>
        <div className="p-6 bg-card rounded-xl border border-white/5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" /> Profit Factor
          </div>
          <div className="text-3xl font-mono font-bold text-success">{metrics?.profitFactor.toFixed(2)}</div>
          <div className="text-sm mt-2 text-muted-foreground font-mono">Gross Gain / Loss</div>
        </div>
        <div className="p-6 bg-card rounded-xl border border-white/5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <LineChart className="w-4 h-4 text-success" /> Ann. Return
          </div>
          <div className="text-3xl font-mono font-bold text-success">+{formatPercent(metrics?.annualizedReturn || 0)}</div>
          <div className="text-sm mt-2 text-muted-foreground font-mono">CAGR</div>
        </div>
        <div className="p-6 bg-card rounded-xl border border-white/5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <Skull className="w-4 h-4 text-destructive" /> Max Drawdown
          </div>
          <div className="text-3xl font-mono font-bold text-destructive">-{metrics?.maxDrawdown}%</div>
          <div className="text-sm mt-2 text-muted-foreground font-mono">Current: -{metrics?.currentDrawdown}%</div>
        </div>
      </div>

      {/* Backtest Chart */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Backtest Equity Curve ({backtest?.period})</CardTitle>
          <div className="text-sm font-mono text-muted-foreground">
            Initial: {formatCurrency(backtest?.initialCapital || 0)} → Final: <span className="text-white">{formatCurrency(backtest?.finalValue || 0)}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          {backtest?.equityCurve ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={backtest.equityCurve} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(tick) => format(new Date(tick), 'MMM yyyy')}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={50}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(tick) => `$${(tick/1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: 'var(--font-mono)' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Equity']}
                  labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBt)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">No backtest data</div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase">Advanced Ratios</CardTitle></CardHeader>
          <CardContent className="space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Sortino Ratio</span><span className="text-white">{metrics?.sortinoRatio.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Calmar Ratio</span><span className="text-white">{metrics?.calmarRatio.toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Alpha</span><span className="text-success">+{metrics?.alpha.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span>Beta</span><span className="text-white">{metrics?.beta.toFixed(2)}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase">Trade Stats</CardTitle></CardHeader>
          <CardContent className="space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Total Trades</span><span className="text-white">{metrics?.totalTrades}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Avg Win</span><span className="text-success">{formatCurrency(metrics?.avgWin || 0)}</span></div>
            <div className="flex justify-between"><span>Avg Loss</span><span className="text-destructive">{formatCurrency(metrics?.avgLoss || 0)}</span></div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
