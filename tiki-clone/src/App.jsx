import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import FlashSalePage from "./pages/FlashSalePage";
import PromotionPage from "./pages/PromotionPage";
import BrandPage from "./pages/BrandPage";
import AboutPage from "./pages/AboutPage";
import BuyerInfo from "./pages/BuyerInfo";
import "./App.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />
        <Route path="/promotion/:promoType" element={<PromotionPage />} />
        <Route path="/brand/:brandId" element={<BrandPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/buyer-info" element={<BuyerInfo />} />
        {/* <Route path="/view-all-top-deals" element={<ViewAllTopDeals />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
