import React, { useState } from "react";
import { suggestedProductsData } from "../../data/suggestedProductsData";
import "./SuggestedProducts.css";

const SuggestedProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(34);

    // Duplicate products to have more items
    const allProducts = [];
    for (let i = 0; i < 50; i++) {
        const product = suggestedProductsData[i % suggestedProductsData.length];
        allProducts.push({
            ...product,
            id: i + 1
        });
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star filled">★</span>);
        }

        const emptyStars = 5 - fullStars;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star">★</span>);
        }

        return stars;
    };

    const loadMore = () => {
        setVisibleProducts(prev => Math.min(prev + 30, allProducts.length));
    };

    return (
        <div className="suggested-products">

            <div className="suggested-header">
                <h2 className="suggested-title">Gợi ý hôm nay</h2>
                <div className="for-you-container">
                    <img
                        src="https://salt.tikicdn.com/cache/w100/ts/ta/70/b9/49/43f25c0f4ee6b7a0d918f047e37e8c87.png.webp"
                        alt="Dành cho bạn"
                        className="for-you-icon"
                    />
                    <span className="for-you-text">Dành cho bạn</span>
                </div>
            </div>

            {/* First row: Banner bên trái + 4 sản phẩm AD bên phải */}
            <div className="first-row-container">
                <div className="featured-banner">
                    <img
                        src="https://salt.tikicdn.com/cache/w750/ts/tka/4b/fa/ce/49ccb824b095950eae35f461198d9de0.png.webp"
                        alt="Chào iPhone 17 Series"
                        className="banner-image"
                    />
                    <button className="banner-view-more">
                        Xem thêm
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="first-row-products">
                    {allProducts.slice(0, 4).map((product, index) => (
                        <div key={product.id} className="product-card-suggested product-card-ad">
                            {index < 4 && <span className="ad-label">AD</span>}
                            <div className="product-image-container">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image-suggested"
                                />
                                {product.badgeIcon && (
                                    <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                                )}
                            </div>

                            <div className="product-info-suggested">
                                <h3 className="product-name-suggested">{product.name}</h3>
                                {product.rating && (
                                    <div className="rating">
                                        <div className="stars">
                                            {renderStars(product.rating)}
                                        </div>
                                    </div>
                                )}

                                <div className="product-price-section">
                                    <div className="price-row">
                                        <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                            {formatPrice(product.price)}<sup>₫</sup>
                                        </span>
                                    </div>
                                    {product.discount && product.discount > 0 && product.originalPrice && (
                                        <div className="discount-row">
                                            <span className="discount-percent">-{product.discount}%</span>
                                            <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                        </div>
                                    )}
                                    {product.madeIn && (
                                        <div className="made-in">{product.madeIn}</div>
                                    )}
                                </div>

                                <div className="product-bottom-badges">
                                    <div className="divider"></div>
                                    <div className="badge-row">
                                        {product.isFreeShip && (
                                            <img src={product.isFreeShip} alt="now" />
                                        )}
                                        {product.deliveryTime && (
                                            <span className="product-badge">{product.deliveryTime}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Second row: 6 products */}
            <div className="products-grid-suggested">
                {allProducts.slice(4, 10).map((product, index) => (
                    <div key={product.id} className="product-card-suggested">
                        {index === 0 && <span className="ad-label">AD</span>}
                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-suggested"
                            />
                            {product.badgeIcon && (
                                <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                            )}
                        </div>

                        <div className="product-info-suggested">
                            <h3 className="product-name-suggested">{product.name}</h3>
                            {product.rating && (
                                <div className="rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                            )}

                            <div className="product-price-section">
                                <div className="price-row">
                                    <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.discount > 0 && product.originalPrice && (
                                    <div className="discount-row">
                                        <span className="discount-percent">-{product.discount}%</span>
                                        <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                    </div>
                                )}
                                {product.madeIn && (
                                    <div className="made-in">{product.madeIn}</div>
                                )}
                            </div>

                            <div className="product-bottom-badges">
                                <div className="divider"></div>
                                <div className="badge-row">
                                    {product.isFreeShip && (
                                        <img src={product.isFreeShip} alt="now" />
                                    )}
                                    {product.deliveryTime && (
                                        <span className="product-badge">{product.deliveryTime}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Third row: 6 products */}
            <div className="products-grid-suggested">
                {allProducts.slice(10, 16).map((product, index) => (
                    <div key={product.id} className="product-card-suggested">
                        {(index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5) && <span className="ad-label">AD</span>}
                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-suggested"
                            />
                            {product.badgeIcon && (
                                <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                            )}
                        </div>

                        <div className="product-info-suggested">
                            <h3 className="product-name-suggested">{product.name}</h3>
                            {product.rating && (
                                <div className="rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                            )}

                            <div className="product-price-section">
                                <div className="price-row">
                                    <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.discount > 0 && product.originalPrice && (
                                    <div className="discount-row">
                                        <span className="discount-percent">-{product.discount}%</span>
                                        <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                    </div>
                                )}
                                {product.madeIn && (
                                    <div className="made-in">{product.madeIn}</div>
                                )}
                            </div>

                            <div className="product-bottom-badges">
                                <div className="divider"></div>
                                <div className="badge-row">
                                    {product.isFreeShip && (
                                        <img src={product.isFreeShip} alt="now" />
                                    )}
                                    {product.deliveryTime && (
                                        <span className="product-badge">{product.deliveryTime}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fourth row: 3 products + Magic Korea Banner + 1 product */}
            <div className="products-grid-suggested">
                {/* First 3 products (positions 1-2-3) */}
                {allProducts.slice(16, 19).map((product, index) => (
                    <div key={product.id} className="product-card-suggested">
                        {(index === 0) && <span className="ad-label">AD</span>}
                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-suggested"
                            />
                            {product.badgeIcon && (
                                <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                            )}
                        </div>

                        <div className="product-info-suggested">
                            <h3 className="product-name-suggested">{product.name}</h3>
                            {product.rating && (
                                <div className="rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                            )}

                            <div className="product-price-section">
                                <div className="price-row">
                                    <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.discount > 0 && product.originalPrice && (
                                    <div className="discount-row">
                                        <span className="discount-percent">-{product.discount}%</span>
                                        <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                    </div>
                                )}
                                {product.madeIn && (
                                    <div className="made-in">{product.madeIn}</div>
                                )}
                            </div>

                            <div className="product-bottom-badges">
                                <div className="divider"></div>
                                <div className="badge-row">
                                    {product.isFreeShip && (
                                        <img src={product.isFreeShip} alt="now" />
                                    )}
                                    {product.deliveryTime && (
                                        <span className="product-badge">{product.deliveryTime}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Magic Korea Banner (positions 4-5) */}
                <div className="magic-korea-banner">
                    <div className="banner-top-section">
                        <div className="banner-image-wrapper">
                            <img
                                src="https://salt.tikicdn.com/ts/tka/fd/c8/f2/46a0ac456c6f6a4fd0420dc5a571dfae.jpg"
                                alt="Magic Korea"
                                className="magic-banner-img"
                            />
                        </div>
                    </div>
                    <div className="banner-bottom-section">
                        <div className="banner-info-top">
                            <h3 className="discount-text">Giảm đến 50%</h3>
                            <p className="sponsor-text">Tài trợ bởi <strong>Magic Korea Official Store</strong> 5/5 ⭐</p>
                        </div>
                        <div className="banner-carousel-actions">
                            <div className="product-carousel-wrapper">
                                <div className="product-carousel-scroll">
                                    <div className="carousel-product">
                                        <span className="carousel-badge">-38%</span>
                                        <img src="https://salt.tikicdn.com/cache/100x100/ts/product/3f/1f/b3/873c531eb1d9c37d132246c3637bbe3f.jpg.webp" alt="Product 1" />
                                    </div>
                                    <div className="carousel-product">
                                        <span className="carousel-badge">-25%</span>
                                        <img src="https://salt.tikicdn.com/cache/100x100/ts/product/3f/74/95/d58d0289dd92c389ac367d34644de17a.jpg.webp" alt="Product 2" />
                                    </div>
                                    <div className="carousel-product">
                                        <span className="carousel-badge">-46%</span>
                                        <img src="https://salt.tikicdn.com/cache/100x100/ts/product/d8/d5/89/88f9a5787844bad148750acf2516a116.jpg.webp" alt="Product 3" />
                                    </div>
                                    <div className="carousel-product">
                                        <span className="carousel-badge">-25%</span>
                                        <img src="https://salt.tikicdn.com/cache/100x100/ts/product/df/6c/6e/141cd2ebffacef24230785ecf045cb20.jpg.webp" alt="Product 4" />
                                    </div>
                                </div>
                                {/* <div className="carousel-scrollbar">
                                    <div className="scrollbar-track"></div>
                                </div> */}
                            </div>
                            <div className="banner-actions-right">
                                <p className="text-discount-200k">Giảm 200K</p>
                                <button className="btn-view-more-blue">Xem thêm</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Last product (position 6) */}
                {allProducts.slice(19, 20).map((product) => (
                    <div key={product.id} className="product-card-suggested">
                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-suggested"
                            />
                            {product.badgeIcon && (
                                <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                            )}
                        </div>

                        <div className="product-info-suggested">
                            <h3 className="product-name-suggested">{product.name}</h3>
                            {product.rating && (
                                <div className="rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                            )}

                            <div className="product-price-section">
                                <div className="price-row">
                                    <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.discount > 0 && product.originalPrice && (
                                    <div className="discount-row">
                                        <span className="discount-percent">-{product.discount}%</span>
                                        <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                    </div>
                                )}
                                {product.madeIn && (
                                    <div className="made-in">{product.madeIn}</div>
                                )}
                            </div>

                            <div className="product-bottom-badges">
                                <div className="divider"></div>
                                <div className="badge-row">
                                    {product.isFreeShip && (
                                        <img src={product.isFreeShip} alt="now" />
                                    )}
                                    {product.deliveryTime && (
                                        <span className="product-badge">{product.deliveryTime}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remaining products in grid */}
            <div className="products-grid-suggested">
                {allProducts.slice(20, visibleProducts).map((product, index) => (
                    <div key={product.id} className="product-card-suggested">
                        {(index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 8 || index === 14) && <span className="ad-label">AD</span>}
                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-suggested"
                            />
                            {product.badgeIcon && (
                                <img src={product.badgeIcon} alt="Badge" className="product-badge-icon" />
                            )}
                        </div>

                        <div className="product-info-suggested">
                            <h3 className="product-name-suggested">{product.name}</h3>
                            {product.rating && (
                                <div className="rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                            )}

                            <div className="product-price-section">
                                <div className="price-row">
                                    <span className={`current-price ${!product.discount || product.discount === 0 || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.discount > 0 && product.originalPrice && (
                                    <div className="discount-row">
                                        <span className="discount-percent">-{product.discount}%</span>
                                        <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                                    </div>
                                )}
                                {product.madeIn && (
                                    <div className="made-in">{product.madeIn}</div>
                                )}
                            </div>

                            <div className="product-bottom-badges">
                                <div className="divider"></div>
                                <div className="badge-row">
                                    {product.isFreeShip && (
                                        <img src={product.isFreeShip} alt="now" />
                                    )}
                                    {product.deliveryTime && (
                                        <span className="product-badge">{product.deliveryTime}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visibleProducts < allProducts.length && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>
                        Xem thêm
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuggestedProducts;
