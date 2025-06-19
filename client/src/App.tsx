import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminPanel from "@/pages/admin-panel";
import PhishingSite from "@/pages/phishing-site";
import DownloadPage from "@/pages/download";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdminPanel} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/login" component={PhishingSite} />
      <Route path="/download" component={DownloadPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
