import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "../src/components/ScrollToTop";
import HomePage from "../src/pages/HomePage";
import CategoryPage from "../src/pages/CategoryPage";
import ProductDetailPage from "../src/pages/ProductDetailPage";
import CartPage from "../src/pages/CartPage";
import FlashSalePage from "../src/pages/FlashSalePage";
import PromotionPage from "../src/pages/PromotionPage";
import BrandPage from "../src/pages/BrandPage";
import AboutPage from "../src/pages/AboutPage";
import BuyerInfo from "../src/pages/BuyerInfo";
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
