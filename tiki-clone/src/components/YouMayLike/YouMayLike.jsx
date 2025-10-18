import React from "react";
import "./YouMayLike.css";

const YouMayLike = () => {
    const products = [
        {
            id: 1,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/dd/2b/a6/fefd132c5ba9b5629c0119f57549e5d4.png.webp",
            name: "Apple iPhone 13",
            price: 20000000,
            discount: 20,
            originalPrice: 25000000,
            badgeIcon: "https://salt.tikicdn.com/ts/upload/c2/bc/6d/ff18cc8968e2bbb43f7ac58efbfafdff.png",
            isFreeShip: "img_giao_ngay.png",
            badge: "NOW",
            deliveryTime: "Giao siêu tốc 2h",
            madeIn: "Made in Hàn Quốc"
        },
        {
            id: 2,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/0d/d1/72/5f3167f4799d01e7faed0da0d92d3a50.png.webp",
            name: "Sách Con Thú Mù",
            price: 64100,
            originalPrice: 169900,
            discount: 62,
            badgeIcon: "https://salt.tikicdn.com/ts/upload/c2/bc/6d/ff18cc8968e2bbb43f7ac58efbfafdff.png",
            deliveryTime: "Giao thứ 2, 20/10"
        },
        {
            id: 3,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/3b/95/ec/5b2c7ec0e09565f399a0a184bd71696b.png.webp",
            name: "Apple iPhone 14",
            rating: 4.8,
            price: 12650000,
            originalPrice: 12650000,
            discount: 30,
            badgeIcon: "https://salt.tikicdn.com/ts/upload/f7/9e/83/ab28365ea395893fe5abac88b5103444.png",
            deliveryTime: "Thanh toán qua thẻ & ví",
            madeIn: "Made in Hàn Quốc"
        },
        {
            id: 4,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/f3/01/96/ec586ec789d954b6a498a7ebfdb68b25.jpg.webp",
            name: "Điện Thoại Oppo A58 6GB/128GB - Hàng Chính Hãng",
            rating: 4.6,

            price: 4090000,
            madeIn: "Made in Hàn Quốc",
            badgeIcon: "https://salt.tikicdn.com/ts/upload/f7/9e/83/ab28365ea395893fe5abac88b5103444.png",
            isFreeShip: "img_giao_ngay.png",
            deliveryTime: "Giao siêu tốc 2h"
        },
        {
            id: 5,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/cf/c1/31/3436e1380470ed8bf1bcbfe1b5affa51.jpg.webp",
            name: "Dầu gội Selsun chống gàu, sạch sâu & hết ngứa da đầu",
            rating: 4.7,
            reviewCount: 1523,
            price: 49000,
            originalPrice: 59000,
            discount: 17,
            badgeIcon: "https://salt.tikicdn.com/ts/upload/f7/9e/83/ab28365ea395893fe5abac88b5103444.png",
            isFreeShip: "img_giao_ngay.png",
            deliveryTime: "Giao siêu tốc 2h"
        },
        {
            id: 6,
            image: "https://salt.tikicdn.com/cache/750x750/ts/product/ef/67/33/79cbb046ea3942e6e9046f172a08573e.jpg.webp",
            name: "Apple iPhone Air - Xanh Đá Trời - 256GB",

            reviewCount: 234,
            price: 29990000,
            originalPrice: 31990000,

            badgeIcon: "https://salt.tikicdn.com/ts/upload/12/e2/4a/c5226426ee9429b0050449ae5403c9cf.png",
            isFreeShip: "img_giao_ngay.png",
            deliveryTime: "Giao siêu tốc 2h"
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
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

            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">

                        <div className="product-image-wrapper">
                            <img src={product.image} alt={product.name} className="product-image" />
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
                                    <span className={`current-price ${!product.discount || !product.originalPrice ? 'no-discount' : ''}`}>
                                        {formatPrice(product.price)}<sup>₫</sup>
                                    </span>
                                </div>
                                {product.discount && product.originalPrice && (
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
        // </div>
    );
};

export default YouMayLike;
