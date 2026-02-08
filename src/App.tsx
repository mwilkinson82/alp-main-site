import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import HashScroller from "@/components/HashScroller";
import Index from "./pages/Index";
import PowerHour from "./pages/PowerHour";
import Coaching from "./pages/Coaching";
import ALPUniversity from "./pages/ALPUniversity";
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
import NotFound from "./pages/NotFound";

const BlogSlugRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/articles/${slug}`} replace />;
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
          <Route path="/alp-university" element={<ALPUniversity />} />
          <Route path="/contractor-school" element={<ContractorSchool />} />
          <Route path="/sales-marketing-school" element={<SalesMarketingSchool />} />
          <Route path="/handbook-special" element={<HandbookSpecial />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/articles" element={<Blog />} />
          <Route path="/articles/:slug" element={<BlogPost />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
          <Route path="/blog" element={<Navigate to="/articles" replace />} />
          <Route path="/blog/:slug" element={<BlogSlugRedirect />} />
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
