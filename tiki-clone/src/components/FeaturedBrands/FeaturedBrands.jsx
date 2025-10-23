import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { featuredBrandsData } from "../../data/featuredBrandsData";
import "./FeaturedBrands.css";
import "../shared/NavigationArrows.css";

const FeaturedBrands = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('next');
  const itemsPerPage = 6;
  const totalPages = Math.ceil(featuredBrandsData.length / itemsPerPage);
  
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const brands = featuredBrandsData.slice(startIndex, endIndex);
  
  const handlePrev = () => {
    setDirection('prev');
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };
  
  const handleNext = () => {
    setDirection('next');
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="featured-brands">
      <div className="brands-header">
        <h2 className="brands-title">Thương hiệu nổi bật</h2>
      </div>

      <div className="brands-grid-wrapper">
        <PrevArrow onClick={handlePrev} />
        <div className={`brands-grid slide-${direction}`} key={currentPage}>
        {brands.map((brand) => (
          <Link to={`/brand/${brand.id}`} key={brand.id} className="brand-card">
            <div className="brand-image-wrapper">
              <img src={brand.image} alt={brand.title} className="brand-image" />
            </div>
          </Link>
        ))}
        </div>
        <NextArrow onClick={handleNext} />
      </div>
    </div>
  );
};

export default FeaturedBrands;
