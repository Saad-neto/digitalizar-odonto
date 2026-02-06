import { BrowserRouter, HashRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { getRouterType } from "../utils/router";

// Loading component for lazy routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Eager load: Critical public pages (landing pages)
import VendaB from "../pages/VendaB";
import NotFound from "../pages/NotFound";

// Lazy load: Public pages (less critical)
const Index = lazy(() => import("../pages/Index"));
const IndexNew = lazy(() => import("../pages/IndexNew"));
const OfertaDeLancamento = lazy(() => import("../pages/OfertaDeLancamento"));
const VendaA = lazy(() => import("../pages/VendaA"));
const VendaC = lazy(() => import("../pages/VendaC"));
const Privacidade = lazy(() => import("../pages/Privacidade"));
const Termos = lazy(() => import("../pages/Termos"));
const Page1 = lazy(() => import("../pages/Page1"));
const Page2 = lazy(() => import("../pages/Page2"));
const Afiliados = lazy(() => import("../pages/Afiliados"));
const NovaVenda = lazy(() => import("../pages/NovaVenda"));

// Lazy load: Blog public (separate chunk)
const Blog = lazy(() => import("../pages/Blog"));
const BlogPost = lazy(() => import("../pages/BlogPost"));

// Lazy load: Conversion funnel (separate chunk for briefing/payment)
const Briefing = lazy(() => import("../pages/Briefing"));
const BriefingComplete = lazy(() => import("../pages/BriefingComplete"));
const Payment = lazy(() => import("../pages/Payment"));
const ThankYou = lazy(() => import("../pages/ThankYou"));
const Agendar = lazy(() => import("../pages/Agendar"));

// Lazy load: Admin pages (separate chunk with admin dependencies)
const Login = lazy(() => import("../pages/admin/Login"));
const DashboardOverview = lazy(() => import("../pages/admin/DashboardOverview"));
const Clientes = lazy(() => import("../pages/admin/Clientes"));
const LeadsParciais = lazy(() => import("../pages/admin/LeadsParciais"));
const LeadDetails = lazy(() => import("../pages/admin/LeadDetails"));
const Reports = lazy(() => import("../pages/admin/Reports"));
const Agendamentos = lazy(() => import("../pages/admin/Agendamentos"));
const Configuracoes = lazy(() => import("../pages/admin/Configuracoes"));
const VendasHotmart = lazy(() => import("../pages/admin/VendasHotmart"));
const AffiliadosAdmin = lazy(() => import("../pages/admin/AffiliadosAdmin"));

// Lazy load: Blog admin (separate chunk with Tiptap editor)
const BlogPosts = lazy(() => import("../pages/admin/BlogPosts"));
const BlogPostEditor = lazy(() => import("../pages/admin/BlogPostEditor"));
const BlogCategories = lazy(() => import("../pages/admin/BlogCategories"));
const BlogTags = lazy(() => import("../pages/admin/BlogTags"));

// Lazy load: Demo pages (interactive demo for prospects)
const DemoLayout = lazy(() => import("../components/demo/DemoLayout"));
const DemoDashboard = lazy(() => import("../pages/demo/DemoDashboard"));
const DemoPacientes = lazy(() => import("../pages/demo/DemoPacientes"));
const DemoAgendamentos = lazy(() => import("../pages/demo/DemoAgendamentos"));
const DemoFinanceiro = lazy(() => import("../pages/demo/DemoFinanceiro"));
const DemoBlog = lazy(() => import("../pages/demo/DemoBlog"));

// Lazy load: PrivateRoute component
const PrivateRoute = lazy(() => import("../components/admin/PrivateRoute"));

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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<NovaVenda />} />
        <Route path="/home-antiga" element={<Index />} />
        <Route path="/novo" element={<IndexNew />} />
        <Route path="/oferta-de-lancamento" element={<OfertaDeLancamento />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/briefing-completo" element={<BriefingComplete />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/obrigado" element={<ThankYou />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />

        {/* Blog Public Routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Hotmart Sales Pages - A/B/C Test */}
        <Route path="/venda-a" element={<VendaA />} />
        <Route path="/venda-b" element={<VendaB />} />
        <Route path="/venda-c" element={<VendaC />} />
        <Route path="/venda" element={<VendaB />} /> {/* Default to version B (current home) */}

        {/* Nova página de vendas (sistema único) */}
        <Route path="/nova-venda" element={<NovaVenda />} />

        {/* Affiliates Public Page */}
        <Route path="/afiliados" element={<Afiliados />} />

        {/* Demo Routes (interactive prospect demo — no backend) */}
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<DemoDashboard />} />
          <Route path="pacientes" element={<DemoPacientes />} />
          <Route path="agendamentos" element={<DemoAgendamentos />} />
          <Route path="financeiro" element={<DemoFinanceiro />} />
          <Route path="blog" element={<DemoBlog />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<DashboardOverview />} />
        <Route path="/admin/leads" element={<LeadsParciais />} />
        <Route path="/admin/vendas-hotmart" element={<VendasHotmart />} />
        <Route path="/admin/afiliados" element={<AffiliadosAdmin />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/leads/:id" element={<LeadDetails />} />
        <Route path="/admin/clientes/:id" element={<LeadDetails />} />
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
    </Suspense>
  );

  // Use HashRouter as fallback if BrowserRouter doesn't work
  if (routerType === 'hash') {
    return <HashRouter>{routes}</HashRouter>;
  }

  return <BrowserRouter>{routes}</BrowserRouter>;
};

export default RouterProvider;