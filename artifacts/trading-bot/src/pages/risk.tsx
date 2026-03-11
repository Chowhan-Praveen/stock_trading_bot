import React, { useEffect, useState } from "react";
import { useGetRiskSettings, useUpdateRiskSettings, type RiskSettings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Label, Input } from "@/components/ui/core";
import { ShieldAlert, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Risk() {
  const { data: settings, isLoading } = useGetRiskSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<RiskSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateSettings = useUpdateRiskSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: "Settings Saved", description: "Risk parameters updated successfully." });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  });

  const handleChange = (key: keyof RiskSettings, value: string | boolean | number) => {
    if (!formData) return;
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateSettings.mutate({ data: formData });
    }
  };

  if (isLoading || !formData) return <div className="p-8 text-center text-muted-foreground font-mono animate-pulse">LOADING SECURE PROTOCOLS...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-destructive/20 pb-4 mb-8">
        <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">Risk Management</h2>
          <p className="text-muted-foreground">Strict hard-limits and capital allocation rules.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Global Hard Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Kill Switch Threshold (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.killSwitchLossThreshold} 
                onChange={(e) => handleChange('killSwitchLossThreshold', parseFloat(e.target.value))}
                className="font-mono text-lg border-destructive/50 focus-visible:ring-destructive"
              />
              <p className="text-xs text-muted-foreground">Halt all trading if portfolio drops this much in 24h.</p>
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Max Drawdown (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.maxDrawdown} 
                onChange={(e) => handleChange('maxDrawdown', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Max Daily Loss ($)</Label>
              <Input 
                type="number" 
                value={formData.maxDailyLoss} 
                onChange={(e) => handleChange('maxDailyLoss', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position & Capital Sizing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Base Stop Loss (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.stopLossPercent} 
                onChange={(e) => handleChange('stopLossPercent', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Max Position Size (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.maxPositionSize} 
                onChange={(e) => handleChange('maxPositionSize', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Portfolio Concentration Limit (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.maxPortfolioConcentration} 
                onChange={(e) => handleChange('maxPortfolioConcentration', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs">Volatility Multiplier</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.volatilityMultiplier} 
                onChange={(e) => handleChange('volatilityMultiplier', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adaptive Behaviors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <label className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="space-y-1">
                <div className="font-medium">Dynamic Stop Loss</div>
                <div className="text-sm text-muted-foreground">Automatically trail stop loss based on ATR and regime.</div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                formData.enableDynamicStopLoss ? "bg-primary" : "bg-muted"
              )}>
                <input type="checkbox" className="sr-only" checked={formData.enableDynamicStopLoss} onChange={(e) => handleChange('enableDynamicStopLoss', e.target.checked)} />
                <div className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform", formData.enableDynamicStopLoss ? "translate-x-6" : "")} />
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="space-y-1">
                <div className="font-medium">Volatility Scaling</div>
                <div className="text-sm text-muted-foreground">Reduce position sizes automatically during high VIX environments.</div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                formData.enableVolatilityScaling ? "bg-primary" : "bg-muted"
              )}>
                <input type="checkbox" className="sr-only" checked={formData.enableVolatilityScaling} onChange={(e) => handleChange('enableVolatilityScaling', e.target.checked)} />
                <div className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform", formData.enableVolatilityScaling ? "translate-x-6" : "")} />
              </div>
            </label>

          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={updateSettings.isPending} className="w-full md:w-auto px-12 font-bold tracking-widest text-sm">
            {updateSettings.isPending ? "SAVING..." : <><Save className="w-4 h-4 mr-2" /> ENFORCE LIMITS</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
