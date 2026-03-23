import { 
  Globe, 
  BarChart, 
  Rss, 
  TrendingUp, 
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

const SENTIMENT_NEWS = [
  { source: "Bloomberg", time: "10 mins ago", headline: "Fed hints at potential rate hold next quarter", impact: "neutral", score: 0.12 },
  { source: "Reuters", time: "25 mins ago", headline: "Tech sector earnings blowout pushes NASDAQ to new highs", impact: "bullish", score: 0.85 },
  { source: "WSJ", time: "1 hour ago", headline: "Global supply chain disruptions hit manufacturing data", impact: "bearish", score: -0.65 },
  { source: "CNBC", time: "2 hours ago", headline: "AI infrastructure spending doubles year over year", impact: "bullish", score: 0.92 },
];

const SECTOR_HEAT = [
  { name: "Information Technology", perf: "+2.4%", status: "bullish" },
  { name: "Communication Services", perf: "+1.8%", status: "bullish" },
  { name: "Consumer Discretionary", perf: "+0.5%", status: "neutral" },
  { name: "Financials", perf: "-0.2%", status: "neutral" },
  { name: "Energy", perf: "-1.5%", status: "bearish" },
  { name: "Utilities", perf: "-2.1%", status: "bearish" },
];

export default function MarketPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-brand-blue" />
            Market Intel
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Macro regime detection and real-time news sentiment analysis.
          </p>
        </div>
        <StatusBadge status="active" label="NLP ACTIVE" pulse />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Market Regime */}
        <Card className="flex flex-col border-brand-green/30 shadow-[0_0_15px_rgba(0,255,102,0.05)] bg-gradient-to-b from-brand-green/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              Detected Regime
            </CardTitle>
            <CardDescription>Current macro market state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white tracking-widest mt-2">BULLISH</div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="text-muted-foreground">Confidence:</span>
              <div className="flex-1 bg-black/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-green w-[85%] h-full" />
              </div>
              <span className="font-mono text-brand-green">85%</span>
            </div>
          </CardContent>
        </Card>

        {/* Volatility Index */}
        <Card className="flex flex-col border-brand-amber/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-amber" />
              Volatility Index
            </CardTitle>
            <CardDescription>Estimated VIX equivalent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mt-2 font-mono">14.2<span className="text-xl text-muted-foreground">v</span></div>
            <div className="flex items-center justify-between mt-4 border-t border-brand-border/50 pt-2 text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className="text-brand-amber font-semibold">Elevated</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Sentiment */}
        <Card className="flex flex-col border-brand-blue/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Rss className="w-5 h-5 text-brand-blue" />
              Global Sentiment
            </CardTitle>
            <CardDescription>Aggregated NLP score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mt-2 font-mono">+0.45</div>
            <div className="mt-4 text-xs text-brand-blue flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-blue" />
              Skewing Positive (Tech/AI)
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Sentiment Feed */}
        <Card className="h-[400px] flex flex-col">
          <CardHeader className="border-b border-brand-border/50 bg-black/20 pb-4 shrink-0">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-blue" />
              Financial News Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="divide-y divide-brand-border/20">
              {SENTIMENT_NEWS.map((news, i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded border border-brand-border/50">{news.source}</span>
                      <span className="text-[10px] text-muted-foreground">{news.time}</span>
                    </div>
                    <StatusBadge 
                      status={news.impact === 'bullish' ? 'buy' : news.impact === 'bearish' ? 'sell' : 'hold'} 
                      label={news.impact.toUpperCase()}
                    />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{news.headline}</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">NLP Score Vector</span>
                    <span className={news.score > 0 ? "text-brand-green" : news.score < 0 ? "text-brand-red" : "text-brand-amber"}>
                      {news.score > 0 ? "+" : ""}{news.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sector Heatmap Alternative */}
        <Card className="h-[400px] flex flex-col">
          <CardHeader className="border-b border-brand-border/50 bg-black/20 pb-4 shrink-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-brand-blue" />
              Sector Momentum
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {SECTOR_HEAT.map((sector, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-black/20 rounded-lg border border-brand-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">{sector.name}</span>
                  <span className={`text-sm font-mono font-bold ${sector.status === 'bullish' ? 'text-brand-green' : sector.status === 'bearish' ? 'text-brand-red' : 'text-brand-amber'}`}>
                    {sector.perf}
                  </span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${sector.status === 'bullish' ? 'bg-brand-green' : sector.status === 'bearish' ? 'bg-brand-red' : 'bg-brand-amber'}`} style={{ width: sector.status === 'bullish' ? '80%' : sector.status === 'bearish' ? '20%' : '50%' }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Needed simple icon that wasn't imported top
function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}