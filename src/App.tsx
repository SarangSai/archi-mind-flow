import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import AIChat from "./pages/AIChat";
import Documents from "./pages/Documents";
import WorkOrders from "./pages/WorkOrders";
import Integrations from "./pages/Integrations";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Redirect root to role-based path
const RoleRedirect = () => {
  const saved = localStorage.getItem('architech_user');
  return <Navigate to="/technician" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login temporarily disabled */}
            <Route element={<AppLayout />}>
              <Route path="/manager" element={<AIChat />} />
              <Route path="/manager/work-orders" element={<WorkOrders />} />
              <Route path="/manager/documents" element={<Documents />} />
              <Route path="/manager/assets" element={<Assets />} />
              <Route path="/manager/integrations" element={<Integrations />} />
              <Route path="/manager/settings" element={<Settings />} />
              <Route path="/technician" element={<AIChat />} />
              <Route path="/technician/work-orders" element={<WorkOrders />} />
              <Route path="/technician/assets" element={<Assets />} />
              <Route path="/technician/settings" element={<Settings />} />
              <Route path="/" element={<RoleRedirect />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
