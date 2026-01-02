import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DomainsPage from "./pages/Domains";
import StudioPage from "./pages/Studio";
import BlogsPage from "./pages/Blogs";
import KeywordsPage from "./pages/Keywords";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/keywords" element={<KeywordsPage />} />
            <Route path="/bulk" element={<Dashboard />} />
            <Route path="/seo" element={<Dashboard />} />
            <Route path="/images" element={<Dashboard />} />
            <Route path="/social" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
