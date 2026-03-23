import { useState, useMemo } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Target, 
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  useGetPortfolio, 
  useGetPortfolioHistory, 
  useGetTrades,
  useGetWatchlist,
  useGetPerformanceMetrics
} from "@workspace/api-client-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const { data: portfolioData } = useGetPortfolio({ query: { refetchInterval: 3000 }});
  const { data: historyData } = useGetPortfolioHistory({ period: '1d' }, { query: { refetchInterval: 3000 }});
  const { data: tradesData } = useGetTrades({ limit: 5 }, { query: { refetchInterval: 3000 }});
  const { data: watchlistData } = useGetWatchlist({ query: { refetchInterval: 5000 }});
  const { data: perfData } = useGetPerformanceMetrics({ query: { refetchInterval: 10000 }});

  const chartData = useMemo(() => {
    if (!historyData) return [];
    return historyData.map((h: any) => {
      const date = new Date(h.timestamp);
      return {
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: h.value
      };
    });
  }, [historyData]);

  const totalValue = portfolioData?.totalValue || 0;
  const dailyPnl = portfolioData?.dayPnl || 0;
  const dailyPnlPercent = portfolioData?.dayPnlPercent || 0;
  const winRate = perfData?.winRate || 0;
  const activePositions = portfolioData?.positions?.length || 0;
  const sharpeRatio = perfData?.sharpeRatio || 0;
  const trades = tradesData || [];
  const signals = watchlistData?.slice(0, 3) || [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time performance and active signals.</p>
        </div>
        <StatusBadge status="active" label="LIVE" pulse />
      </div>

      {/* Top Value Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily P&L</CardTitle>
            <Activity className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold flex items-center gap-2 ${dailyPnl >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
              {dailyPnl >= 0 ? '+' : '-'}
              ${Math.abs(dailyPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {dailyPnl >= 0 ? <ArrowUpRight className="w-3 h-3 text-brand-green" /> : <ArrowDownRight className="w-3 h-3 text-brand-red" />}
              <span className={dailyPnl >= 0 ? 'text-brand-green' : 'text-brand-red'}>
                {dailyPnlPercent.toFixed(2)}%
              </span>
              <span>vs yesterday</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate (24h)</CardTitle>
            <Target className="h-4 w-4 text-brand-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {winRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activePositions} Active Positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {sharpeRatio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-brand-green flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +0.12 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Chart Section */}
        <Card className="md:col-span-4 lg:col-span-5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <CardDescription>Live portfolio value mapped against ML trajectory.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 12}} dy={10} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 12}} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121620', borderColor: '#1E2433', color: '#fff' }}
                  itemStyle={{ fill: '#00E5FF', color: '#00E5FF' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00E5FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right column: Signals & Recent Executions */}
        <div className="md:col-span-3 lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Top AI Signals</CardTitle>
              <CardDescription>Highest confidence network outputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signals.map((signal: any) => (
                  <div key={signal.symbol} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-brand-border/50">
                    <div>
                      <div className="font-bold text-white">{signal.symbol}</div>
                      <div className="text-xs text-muted-foreground">{signal.confidence || 85}% Confidence</div>
                    </div>
                    <StatusBadge status={(signal.recommendation || (signal.changePercent > 0 ? 'buy' : 'sell')).toLowerCase() as any} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>Live trade feed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trades.slice(0, 3).map((trade: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b border-brand-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{trade.symbol}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono text-white">${trade.price.toFixed(2)}</span>
                      <span className={trade.type.toUpperCase() === 'BUY' ? 'text-[10px] text-brand-green font-bold' : trade.type.toUpperCase() === 'SELL' ? 'text-[10px] text-brand-red font-bold' : 'text-[10px] text-brand-amber font-bold'}>
                        {trade.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}