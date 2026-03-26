import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductListing from "./pages/ProductListing";
import Feed from "./pages/Feed";
import ProductDetail from "./pages/ProductDetail";
import ProductDetailOld from "./pages/ProductDetailOld";
import ProductReviews from "./pages/ProductReviews";
import PriceDrops from "./pages/PriceDrops";
import MyPurchases from "./pages/MyPurchases";
import WriteReview from "./pages/WriteReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product-old/:id" element={<ProductDetailOld />} />
            <Route path="/product/:id/reviews" element={<ProductReviews />} />
            <Route path="/price-drops" element={<PriceDrops />} />
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/feed" element={<Feed />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
