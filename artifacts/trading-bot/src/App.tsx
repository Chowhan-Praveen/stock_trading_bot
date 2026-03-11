import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/shell";

// Pages
import Dashboard from "@/pages/dashboard";
import Trading from "@/pages/trading";
import Strategies from "@/pages/strategies";
import Risk from "@/pages/risk";
import Market from "@/pages/market";
import Analytics from "@/pages/analytics";
import Logs from "@/pages/logs";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/trading" component={Trading} />
        <Route path="/strategies" component={Strategies} />
        <Route path="/risk" component={Risk} />
        <Route path="/market" component={Market} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/logs" component={Logs} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
