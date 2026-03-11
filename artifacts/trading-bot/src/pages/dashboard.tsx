import React from "react";
import { useGetPortfolio, useGetPortfolioHistory, useGetBotStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/core";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Target, Activity, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from "date-fns";

export default function Dashboard() {
  const { data: portfolio } = useGetPortfolio({ query: { refetchInterval: 3000 } });
  const { data: history } = useGetPortfolioHistory({ period: "7d" }, { query: { refetchInterval: 30000 } });
  const { data: status } = useGetBotStatus({ query: { refetchInterval: 3000 } });

  const isProfitDay = (portfolio?.dayPnl || 0) >= 0;
  const isProfitTotal = (portfolio?.totalPnl || 0) >= 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Portfolio Value" 
          value={formatCurrency(portfolio?.totalValue || 0)} 
          icon={DollarSign}
          glowColor="primary"
        />
        <MetricCard 
          title="Today's P&L" 
          value={formatCurrency(portfolio?.dayPnl || 0)} 
          subtitle={`${isProfitDay ? '+' : ''}${formatPercent(portfolio?.dayPnlPercent || 0)}`}
          icon={isProfitDay ? TrendingUp : TrendingDown}
          trend={isProfitDay ? 'up' : 'down'}
          glowColor={isProfitDay ? 'success' : 'destructive'}
        />
        <MetricCard 
          title="Total P&L" 
          value={formatCurrency(portfolio?.totalPnl || 0)} 
          subtitle={`${isProfitTotal ? '+' : ''}${formatPercent(portfolio?.totalPnlPercent || 0)}`}
          icon={isProfitTotal ? TrendingUp : TrendingDown}
          trend={isProfitTotal ? 'up' : 'down'}
          glowColor={isProfitTotal ? 'success' : 'destructive'}
        />
        <MetricCard 
          title="Active Positions" 
          value={portfolio?.positions.length.toString() || "0"} 
          subtitle={`${formatCurrency(portfolio?.investedValue || 0)} invested`}
          icon={Briefcase}
          glowColor="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Equity Curve (7D)
            </CardTitle>
            <Badge variant="outline" className="font-mono bg-black/50">LIVE</Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pt-4">
            {history && history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(tick) => format(new Date(tick), 'MMM dd')}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(tick) => `$${(tick/1000).toFixed(1)}k`}
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
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                    labelFormatter={(label) => format(new Date(label), 'MMM dd, HH:mm')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                No historical data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {status?.alerts && status.alerts.length > 0 ? (
              status.alerts.map((alert) => (
                <div key={alert.id} className="flex gap-3 items-start pb-4 border-b border-white/5 last:border-0">
                  <div className={cn(
                    "mt-0.5 w-2 h-2 rounded-full shrink-0 animate-pulse",
                    alert.level === 'info' ? 'bg-primary' :
                    alert.level === 'warning' ? 'bg-warning' :
                    alert.level === 'error' ? 'bg-destructive' : 'bg-destructive'
                  )} />
                  <div className="space-y-1">
                    <p className="text-sm leading-snug">{alert.message}</p>
                    <p className="text-xs text-muted-foreground font-mono">{format(new Date(alert.timestamp), 'HH:mm:ss')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                <ShieldAlert className="w-8 h-8 opacity-20" />
                <span className="font-mono text-sm">No active alerts</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Avg Price</th>
                  <th className="px-4 py-3 text-right">Mkt Price</th>
                  <th className="px-4 py-3 text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio?.positions.map((pos) => {
                  const isPos = pos.pnl >= 0;
                  return (
                    <tr key={pos.symbol} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4 font-bold font-display tracking-wider text-base">{pos.symbol}</td>
                      <td className="px-4 py-4 text-muted-foreground">{pos.sector}</td>
                      <td className="px-4 py-4 text-right font-mono">{pos.quantity}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatCurrency(pos.avgPrice)}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatCurrency(pos.currentPrice)}</td>
                      <td className={cn(
                        "px-4 py-4 text-right font-mono font-semibold",
                        isPos ? "text-success text-glow-success" : "text-destructive text-glow-destructive"
                      )}>
                        {isPos ? '+' : ''}{formatCurrency(pos.pnl)}
                        <span className="block text-xs opacity-70 font-normal">
                          {isPos ? '+' : ''}{formatPercent(pos.pnlPercent)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {(!portfolio?.positions || portfolio.positions.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-mono">
                      No open positions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, glowColor = "primary" }: any) {
  return (
    <Card className="relative overflow-hidden group">
      <div className={cn(
        "absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-0",
        glowColor === 'primary' ? 'bg-primary/20' : 
        glowColor === 'success' ? 'bg-success/20' : 'bg-destructive/20'
      )} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center bg-black/50 border",
            glowColor === 'primary' ? 'border-primary/30 text-primary' : 
            glowColor === 'success' ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'
          )}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <span className={cn(
            "text-3xl font-bold font-mono tracking-tight",
            glowColor === 'primary' ? 'text-white' :
            glowColor === 'success' ? 'text-success text-glow-success' : 'text-destructive text-glow-destructive'
          )}>
            {value}
          </span>
          {subtitle && (
            <span className={cn(
              "text-sm font-mono flex items-center gap-1",
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {subtitle}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
