import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import HashScroller from "@/components/HashScroller";
import Index from "./pages/Index";
import ALPUniversity from "./pages/ALPUniversity";
import PowerHour from "./pages/PowerHour";
import Coaching from "./pages/Coaching";

import Programs from "./pages/Programs";
import ContractorSchool from "./pages/ContractorSchool";
import SalesMarketingSchool from "./pages/SalesMarketingSchool";
import HandbookSpecial from "./pages/HandbookSpecial";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminPostEditor from "./pages/AdminPostEditor";
import AskMarshall from "./pages/AskMarshall";
import ClientLogin from "./pages/ClientLogin";
import PortalLogin from "./pages/PortalLogin";
import PortalResetPassword from "./pages/PortalResetPassword";
import PortalDashboard from "./pages/PortalDashboard";
import PortalLibrary from "./pages/PortalLibrary";
import PortalReplay from "./pages/PortalReplay";
import AdminRecordings from "./pages/AdminRecordings";
import AdminClients from "./pages/AdminClients";
import NotFound from "./pages/NotFound";

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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/power-hour" element={<PowerHour />} />
          <Route path="/coaching" element={<Coaching />} />
          
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Smooth scroll to hash anchors across routes */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore - component returns null */}
        <HashScroller />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
