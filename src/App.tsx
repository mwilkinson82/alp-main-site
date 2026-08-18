import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import HashScroller from "@/components/HashScroller";

const Index = lazy(() => import("./pages/Index"));
const ContractorCircle = lazy(() => import("./pages/ContractorCircle"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const ALPUniversity = lazy(() => import("./pages/ALPUniversity"));
const PowerHour = lazy(() => import("./pages/PowerHour"));
const Coaching = lazy(() => import("./pages/Coaching"));
const Programs = lazy(() => import("./pages/Programs"));
const ContractorSchool = lazy(() => import("./pages/ContractorSchool"));
const SalesMarketingSchool = lazy(() => import("./pages/SalesMarketingSchool"));
const HandbookSpecial = lazy(() => import("./pages/HandbookSpecial"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPostEditor = lazy(() => import("./pages/AdminPostEditor"));
const AskMarshall = lazy(() => import("./pages/AskMarshall"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const PortalLogin = lazy(() => import("./pages/PortalLogin"));
const PortalResetPassword = lazy(() => import("./pages/PortalResetPassword"));
const PortalDashboard = lazy(() => import("./pages/PortalDashboard"));
const PortalLibrary = lazy(() => import("./pages/PortalLibrary"));
const PortalReplay = lazy(() => import("./pages/PortalReplay"));
const AdminRecordings = lazy(() => import("./pages/AdminRecordings"));
const AdminClients = lazy(() => import("./pages/AdminClients"));
const NotFound = lazy(() => import("./pages/NotFound"));

const BlogSlugRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/insights/${slug}`} replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" aria-label="Loading page" />}>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/power-hour" element={<PowerHour />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/contractor-circle" element={<ContractorCircle />} />
          <Route path="/circle" element={<Navigate to="/contractor-circle" replace />} />
          <Route path="/partnerships" element={<Partnerships />} />
          
          <Route path="/contractor-school" element={<ContractorSchool />} />
          <Route path="/sales-marketing-school" element={<SalesMarketingSchool />} />
          <Route path="/handbook-special" element={<HandbookSpecial />} />
          <Route path="/alp-university" element={<ALPUniversity />} />
          <Route path="/ask-marshall" element={<AskMarshall />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* Canonical Insights routes */}
          <Route path="/insights" element={<Blog />} />
          <Route path="/insights/:slug" element={<BlogPost />} />
          {/* Legacy redirects — SEO-safe 301-equivalent client redirects */}
          <Route path="/blog" element={<Navigate to="/insights" replace />} />
          <Route path="/blog/:slug" element={<BlogSlugRedirect />} />
          <Route path="/articles" element={<Navigate to="/insights" replace />} />
          <Route path="/articles/:slug" element={<BlogSlugRedirect />} />
          {/* Client replay portal */}
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/reset-password" element={<PortalResetPassword />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route
            path="/portal/power-hour"
            element={
              <PortalLibrary
                classType="power_hour"
                title="Power Hour"
                description="Daily 8am EST high-impact strategy sessions. Most recent replays first."
                canonical="/portal/power-hour"
              />
            }
          />
          <Route
            path="/portal/contractor-school"
            element={
              <PortalLibrary
                classType="contractor_school"
                title="Contractor School"
                description="Tuesday night deep-dives on contracting systems and operations."
                canonical="/portal/contractor-school"
              />
            }
          />
          <Route
            path="/portal/sales-marketing-school"
            element={
              <PortalLibrary
                classType="sales_marketing_school"
                title="Sales and Marketing School"
                description="Wednesday night sessions on sales, marketing, and revenue growth."
                canonical="/portal/sales-marketing-school"
              />
            }
          />
          <Route path="/portal/replay/:id" element={<PortalReplay />} />
          <Route path="/admin/recordings" element={<AdminRecordings />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Smooth scroll to hash anchors across routes */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore - component returns null */}
        <HashScroller />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
