import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { youMayLikeData } from "../../data/youMayLikeData";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import "./YouMayLike.css";
import "../shared/NavigationArrows.css";

const YouMayLike = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState('next');
    const itemsPerPage = 6;
    const totalPages = Math.ceil(youMayLikeData.length / itemsPerPage);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const products = youMayLikeData.slice(startIndex, endIndex);

    const handlePrev = () => {
        setDirection('prev');
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setDirection('next');
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star">★</span>);
        }
        return stars;
    };

    return (
        <div className="you-may-like">
            <h2 className="section-title">Bạn có thể thích</h2>

            <div className="products-grid-wrapper">
                <PrevArrow onClick={handlePrev} />
                <div className={`products-grid slide-${direction}`} key={currentPage}>
                    {products.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card">

                            <div className="product-image-wrapper">
                                <img src={product.image} alt={product.name} className="yml-product-image" />
                                {product.badgeIcon && (
                                    <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                                )}
                            </div>

                            <div className="you-may-like-info">
                                <h3 className="you-may-like-name">{product.name}</h3>
                                {product.rating && (
                                    <div className="rating">
                                        <div className="stars">
                                            {renderStars(product.rating)}
                                        </div>
                                    </div>
                                )}

                                <div className="you-may-like-price-section">
                                    <div className="price-row">
                                        <span className={`current-price ${!product.discount || product.discount <= 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                            {formatPrice(calculateDiscountedPrice(product.originalPrice, product.discount))}<sup>₫</sup>
                                        </span>
                                    </div>
                                    {product.discount > 0 && product.originalPrice && (
                                        <div className="discount-row">
                                            <span className="discount-percent">-{product.discount}%</span>
                                            <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                        </div>
                                    )}

                                </div>

                                <div className="product-bottom-badges">
                                    {product.madeIn && (
                                        <div className="made-in">{product.madeIn}</div>
                                    )}
                                    <div className="divider"></div>
                                    <div className="badge-row">

                                        {product.badge === "NOW" && (
                                            <img src="../img_giao_ngay.png" alt="now" />
                                        )}
                                        {product.badge === "DELIVERY" && (
                                            <img src="../img_giao_chieu_mai.png" alt="delivery" />
                                        )}
                                        {product.shippingBadge && (
                                            <span className="shipping-info">{product.shippingBadge}</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
                <NextArrow onClick={handleNext} />
            </div>
        </div>
    );
};

export default YouMayLike;
