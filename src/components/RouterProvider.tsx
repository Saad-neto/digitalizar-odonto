import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "../pages/Index";
import Briefing from "../pages/Briefing";
import Payment from "../pages/Payment";
import ThankYou from "../pages/ThankYou";
import NotFound from "../pages/NotFound";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import LeadDetails from "../pages/admin/LeadDetails";
import PrivateRoute from "../components/admin/PrivateRoute";
import { getRouterType } from "../utils/router";

const RouterProvider = () => {
  const [routerType, setRouterType] = useState<'browser' | 'hash'>('browser');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect the appropriate router type
    const type = getRouterType();
    setRouterType(type);
    setIsReady(true);

    // Log router type for debugging
    if (import.meta.env.DEV) {
      console.log(`Using ${type} router for navigation`);
    }
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  const routes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/briefing" element={<Briefing />} />
      <Route path="/pagamento" element={<Payment />} />
      <Route path="/obrigado" element={<ThankYou />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin/leads/:id" element={<PrivateRoute><LeadDetails /></PrivateRoute>} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  // Use HashRouter as fallback if BrowserRouter doesn't work
  if (routerType === 'hash') {
    return <HashRouter>{routes}</HashRouter>;
  }

  return <BrowserRouter>{routes}</BrowserRouter>;
};

export default RouterProvider;