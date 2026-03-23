import { useState } from "react";
import { 
  TrendingUp, 
  BrainCircuit, 
  Network, 
  MessageSquare,
  BarChart3,
  ListTree
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";

const STRATEGIES = [
  {
    id: "dqn-01",
    name: "Deep Q-Network Agent",
    category: "Reinforcement Learning",
    description: "Learns optimal trading policy through delayed rewards. Excellent for volatile markets.",
    icon: BrainCircuit,
    winRate: 68.4,
    sharpe: 1.85,
    trades: 1245,
    status: "active",
    color: "brand-blue"
  },
  {
    id: "ppo-01",
    name: "PPO Policy gradient",
    category: "Reinforcement Learning",
    description: "Stable and continuous action space policy optimization for complex regime handling.",
    icon: Network,
    winRate: 64.2,
    sharpe: 1.62,
    trades: 890,
    status: "active",
    color: "brand-purple"
  },
  {
    id: "lstm-01",
    name: "LSTM Price Predictor",
    category: "Deep Learning",
    description: "Time-series forecasting using long short-term memory recurrent neural networks.",
    icon: TrendingUp,
    winRate: 61.8,
    sharpe: 1.45,
    trades: 3420,
    status: "paused",
    color: "brand-green"
  },
  {
    id: "trans-01",
    name: "Transformer Market Model",
    category: "Deep Learning",
    description: "Attention-based sequence modeling capturing long-range market dependencies.",
    icon: ListTree,
    winRate: 71.2,
    sharpe: 2.10,
    trades: 560,
    status: "paused",
    color: "brand-amber"
  },
  {
    id: "nlp-01",
    name: "Sentiment Analysis Engine",
    category: "Natural Language",
    description: "Real-time news and social media sentiment processing using FinBERT.",
    icon: MessageSquare,
    winRate: 58.9,
    sharpe: 1.25,
    trades: 180,
    status: "active",
    color: "brand-red"
  },
  {
    id: "hyb-01",
    name: "Ensemble Hybrid",
    category: "Meta Model",
    description: "Weighted voting system combining outputs from all base predictive models.",
    icon: BarChart3,
    winRate: 74.5,
    sharpe: 2.35,
    trades: 412,
    status: "active",
    color: "white"
  }
];

export default function StrategiesPage() {
  const [activeStrategies, setActiveStrategies] = useState<Record<string, boolean>>(
    STRATEGIES.reduce((acc, s) => ({ ...acc, [s.id]: s.status === "active" }), {})
  );

  const toggleStrategy = (id: string) => {
    setActiveStrategies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-brand-blue" />
            AI Strategies
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage active machine learning models and reinforcement learning agents.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-md bg-white/5 border border-brand-border text-xs text-muted-foreground">
          Models Loaded: {Object.values(activeStrategies).filter(Boolean).length} / {STRATEGIES.length}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {STRATEGIES.map((strategy) => {
          const Icon = strategy.icon;
          const isActive = activeStrategies[strategy.id];

          return (
            <Card 
              key={strategy.id} 
              className={`transition-all duration-300 ${isActive ? 'border-brand-blue/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]' : 'border-brand-border/50 opacity-80'}`}
            >
              <CardHeader className="flex flex-row flex-nowrap items-start justify-between pb-2 gap-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg bg-black/40 border border-brand-border/50 shrink-0 ${isActive ? 'text-brand-blue' : 'text-muted-foreground'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-tight mb-1">{strategy.name}</CardTitle>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {strategy.category}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={() => toggleStrategy(strategy.id)} 
                  className={`data-[state=checked]:bg-brand-blue`}
                />
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="h-12 mb-4 text-xs leading-relaxed">
                  {strategy.description}
                </CardDescription>
                
                <div className="grid grid-cols-3 gap-2 border-t border-brand-border/50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Win Rate</span>
                    <span className={`text-sm font-semibold font-mono ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{strategy.winRate}%</span>
                  </div>
                  <div className="flex flex-col border-l border-brand-border/50 pl-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Sharpe</span>
                    <span className={`text-sm font-semibold font-mono ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{strategy.sharpe.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col border-l border-brand-border/50 pl-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Trades</span>
                    <span className={`text-sm font-semibold font-mono ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{strategy.trades}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-border/50">
                  <StatusBadge status={isActive ? 'active' : 'paused'} pulse={isActive} />
                  <span className="text-[10px] font-mono text-muted-foreground">ID: {strategy.id.toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}