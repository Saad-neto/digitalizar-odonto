import { BrowserRouter, HashRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "../pages/Index";
import IndexNew from "../pages/IndexNew";
import Briefing from "../pages/Briefing";
import Payment from "../pages/Payment";
import ThankYou from "../pages/ThankYou";
import Agendar from "../pages/Agendar";
import Privacidade from "../pages/Privacidade";
import Termos from "../pages/Termos";
import NotFound from "../pages/NotFound";
import Login from "../pages/admin/Login";
import DashboardOverview from "../pages/admin/DashboardOverview";
import Leads from "../pages/admin/Leads";
import LeadDetails from "../pages/admin/LeadDetails";
import Reports from "../pages/admin/Reports";
import Agendamentos from "../pages/admin/Agendamentos";
import Configuracoes from "../pages/admin/Configuracoes";
import BlogPosts from "../pages/admin/BlogPosts";
import BlogPostEditor from "../pages/admin/BlogPostEditor";
import BlogCategories from "../pages/admin/BlogCategories";
import BlogTags from "../pages/admin/BlogTags";
import PrivateRoute from "../components/admin/PrivateRoute";
import { getRouterType } from "../utils/router";

// Redirect component for routes with params
const LeadRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/leads/${id}`} replace />;
};

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
      <Route path="/novo" element={<IndexNew />} />
      <Route path="/briefing" element={<Briefing />} />
      <Route path="/pagamento" element={<Payment />} />
      <Route path="/obrigado" element={<ThankYou />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<Termos />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<DashboardOverview />} />
      <Route path="/admin/leads" element={<Leads />} />
      <Route path="/admin/leads/:id" element={<LeadDetails />} />
      <Route path="/admin/agendamentos" element={<Agendamentos />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/configuracoes" element={<Configuracoes />} />

      {/* Blog Admin Routes */}
      <Route path="/admin/blog" element={<BlogPosts />} />
      <Route path="/admin/blog/novo" element={<BlogPostEditor />} />
      <Route path="/admin/blog/editar/:id" element={<BlogPostEditor />} />
      <Route path="/admin/blog/categorias" element={<BlogCategories />} />
      <Route path="/admin/blog/tags" element={<BlogTags />} />

      {/* Redirect old routes without /admin prefix to /admin/* */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/leads" element={<Navigate to="/admin/leads" replace />} />
      <Route path="/leads/:id" element={<LeadRedirect />} />
      <Route path="/agendamentos" element={<Navigate to="/admin/agendamentos" replace />} />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      <Route path="/configuracoes" element={<Navigate to="/admin/configuracoes" replace />} />

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