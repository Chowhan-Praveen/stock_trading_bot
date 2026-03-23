import { 
  BarChart2, 
  TrendingUp, 
  Target, 
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const EQUITY_DATA = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i+1}`,
  value: 100000 + (Math.sin(i / 3) * 5000) + (i * 800) + (Math.random() * 2000)
}));

const DRAWDOWN_DATA = EQUITY_DATA.map((d, i) => {
  const peak = Math.max(...EQUITY_DATA.slice(0, i + 1).map(x => x.value));
  return {
    day: d.day,
    drawdown: ((d.value - peak) / peak) * 100
  };
});

const WIN_LOSS_DATA = [
  { name: 'Wins', value: 684 },
  { name: 'Losses', value: 316 },
];

const COLORS = ['#00FF66', '#FF0055'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-brand-blue" />
            Performance Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Historical backtest and live forward-test metrics.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              Total Return
              <TrendingUp className="w-4 h-4 text-brand-green" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-green">+24.5%</div>
            <p className="text-xs text-muted-foreground mt-1 text-brand-green">Outperforming SPY by 8.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              Profit Factor
              <Activity className="w-4 h-4 text-brand-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.14</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent (Gross Profit / Gross Loss)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              Max Drawdown
              <Activity className="w-4 h-4 text-brand-amber" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-8.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Acceptable risk profile</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              Win Rate
              <Target className="w-4 h-4 text-brand-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">68.4%</div>
            <p className="text-xs text-muted-foreground mt-1">1000 Total Trades</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Equity Curve */}
        <Card className="md:col-span-2 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Historical Equity Curve (30D)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EQUITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 10}} dy={10} interval="preserveStartEnd" minTickGap={30} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 10}} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
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
                  fill="url(#colorEquity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win/Loss Ratio */}
        <Card className="flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-brand-blue" />
              Trade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WIN_LOSS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {WIN_LOSS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121620', borderColor: '#1E2433', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-brand-green" />
                 <span className="text-sm font-semibold text-white">Wins (68%)</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-brand-red" />
                 <span className="text-sm font-semibold text-white">Losses (32%)</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Drawdown Chart */}
        <Card className="md:col-span-3 h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Drawdown Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DRAWDOWN_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0055" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#FF0055" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 10}} dy={10} interval="preserveStartEnd" minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8A94A6', fontSize: 10}} tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121620', borderColor: '#1E2433', color: '#fff' }}
                  itemStyle={{ fill: '#FF0055', color: '#FF0055' }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
                />
                <Area 
                  type="monotone" 
                  dataKey="drawdown" 
                  stroke="#FF0055" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDrawdown)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}