import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "@/components/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </AuthProvider>
);

export default App;
