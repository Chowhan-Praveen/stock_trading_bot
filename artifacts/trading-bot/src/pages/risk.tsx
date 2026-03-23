import { useState } from "react";
import { 
  ShieldAlert, 
  AlertOctagon, 
  ShieldCheck, 
  Activity,
  Save,
  SlidersHorizontal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";

export default function RiskPage() {
  const [settings, setSettings] = useState({
    maxDrawdown: 15,
    posSizeLimit: 5,
    stopLossBase: 2.5,
    takeProfitBase: 5.0,
    killSwitchEnabled: false,
    autoHedge: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-brand-amber" />
            Risk Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure hard limits and portfolio exposure guardrails.
          </p>
        </div>
        <StatusBadge status="warning" label="GUARDRAILS ACTIVE" pulse />
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        
        {/* Core Limits */}
        <Card className="md:col-span-2 border-brand-border/50">
          <CardHeader className="border-b border-brand-border/50 bg-black/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="w-5 h-5 text-brand-blue" />
              Execution Parameters
            </CardTitle>
            <CardDescription>Global limits applied before any ML/RL order execution.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-white">Max Portfolio Drawdown (%)</label>
                <span className="text-brand-amber font-mono font-bold">{settings.maxDrawdown}%</span>
              </div>
              <input 
                type="range" 
                min="1" max="50" 
                value={settings.maxDrawdown}
                onChange={e => setSettings({...settings, maxDrawdown: parseInt(e.target.value)})}
                className="w-full h-2 bg-brand-surface rounded-lg appearance-none cursor-pointer accent-brand-amber"
              />
              <p className="text-xs text-muted-foreground">If total portfolio value drops by this amount from peak, halt all trading.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-white">Max Position Size (%)</label>
                <span className="text-brand-blue font-mono font-bold">{settings.posSizeLimit}%</span>
              </div>
              <input 
                type="range" 
                min="1" max="25" 
                value={settings.posSizeLimit}
                onChange={e => setSettings({...settings, posSizeLimit: parseInt(e.target.value)})}
                className="w-full h-2 bg-brand-surface rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
              <p className="text-xs text-muted-foreground">Maximum capital allocation for a single asset.</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-brand-border/50">
               <div>
                  <label className="text-sm font-medium text-white mb-2 block">Base Stop-Loss (%)</label>
                  <div className="flex items-center bg-black/40 border border-brand-border/50 rounded-md overflow-hidden">
                    <input 
                      type="number"
                      value={settings.stopLossBase}
                      onChange={e => setSettings({...settings, stopLossBase: parseFloat(e.target.value)})}
                      className="bg-transparent text-white font-mono p-3 w-full outline-none"
                    />
                  </div>
               </div>
               <div>
                  <label className="text-sm font-medium text-white mb-2 block">Base Take-Profit (%)</label>
                  <div className="flex items-center bg-black/40 border border-brand-border/50 rounded-md overflow-hidden">
                    <input 
                      type="number"
                      value={settings.takeProfitBase}
                      onChange={e => setSettings({...settings, takeProfitBase: parseFloat(e.target.value)})}
                      className="bg-transparent text-white font-mono p-3 w-full outline-none"
                    />
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/30 px-6 py-2.5 rounded-md hover:bg-brand-blue/20 transition-all font-semibold shadow-[0_0_10px_rgba(0,229,255,0.1)]"
              >
                {saving ? (
                  <span className="animate-pulse">Syncing...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Apply Parameters
                  </>
                )}
              </button>
            </div>

          </CardContent>
        </Card>

        {/* System Safeguards */}
        <div className="space-y-6">
          <Card className={`border-brand-red/30 bg-gradient-to-b ${settings.killSwitchEnabled ? 'from-brand-red/10' : 'from-transparent'} transition-colors`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-red">
                  <AlertOctagon className="w-5 h-5" />
                  Kill Switch
                </div>
                <Switch 
                  checked={settings.killSwitchEnabled} 
                  onCheckedChange={v => setSettings({...settings, killSwitchEnabled: v})}
                  className="data-[state=checked]:bg-brand-red"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When ARM status is enabled, the system will immediately liquidate all open positions at market price and halt the execution engine.
              </p>
              {settings.killSwitchEnabled && (
                <div className="mt-4 p-3 bg-brand-red/10 border border-brand-red/30 rounded text-brand-red text-xs font-bold uppercase tracking-wider text-center animate-pulse">
                  System Armed & Ready
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`border-brand-green/30 bg-gradient-to-b ${settings.autoHedge ? 'from-brand-green/5' : 'from-transparent'} transition-colors`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-green">
                  <ShieldCheck className="w-5 h-5" />
                  Auto-Hedging
                </div>
                <Switch 
                  checked={settings.autoHedge} 
                  onCheckedChange={v => setSettings({...settings, autoHedge: v})}
                  className="data-[state=checked]:bg-brand-green"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automatically allocate 10% of portfolio to inverse ETFs (e.g., SQQQ, SH) when Market Intel detects a BEARISH macro regime.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
