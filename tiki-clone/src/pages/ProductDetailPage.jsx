import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, fetchCartDetail } from '../store/cartSlice';
import { fetchProductById, clearCurrentProduct } from '../store/listingSlice';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CheckoutForm from '../components/CheckoutForm/CheckoutForm';
// import AddressSelector from "../components/AddressSelector/AddressSelector";
// import { PrevArrow, NextArrow } from "../components/shared/NavigationArrows";
// import { suggestedProductsData } from "../data/suggestedProductsData";
import { calculateDiscountedPrice, formatPrice } from '../utils/priceUtils';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { currentProduct, productDetailStatus: listingStatus } = useSelector((state) => state.listing);

  const productDetailStatus =
    listingStatus === 'pending' ? 'pending' : listingStatus === 'succeeded' ? 'succeeded' : 'idle';

  const { productId } = useParams();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { products: allProducts } = useSelector((state) => state.listing);

  const location = useLocation();
  const cartItemFromState = location.state?.cartItem;

  // Tìm sản phẩm trong giỏ hàng hoặc danh sách liệt kê để hiển thị tạm thời trong khi tải API
  const cartItemFromStore = cartItems.find(
    (item) => item.productId === productId || item.id === productId || item.listingId === productId
  );
  const cartItem = cartItemFromState || cartItemFromStore;

  const productFromListing = allProducts.find(
    (p) => p.productId === productId || p.id === productId
  );

  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Đối tượng sản phẩm tổng hợp (Ưu tiên từ API -> Giỏ hàng -> Danh sách Trang chủ)
  const product = currentProduct
    ? {
        ...currentProduct,
        id: currentProduct.id,
        productId: currentProduct.productId || currentProduct.id,
        name: currentProduct.name || currentProduct.title,
        originalPrice: currentProduct.originalPrice || currentProduct.Price || 0,
        currentPrice: currentProduct.currentPrice || currentProduct.originalPrice || 0,
        discount: currentProduct.discount || 0,

      }
    : cartItem
    ? {
        id: cartItem.listingId || cartItem.id,
        productId: cartItem.productId,
        name: cartItem.name,
        originalPrice: cartItem.originalPrice || cartItem.price || 0,
        currentPrice: cartItem.price || 0,
        discount: cartItem.discount || 0,
        image: cartItem.image,
        // quantity: 1,
      }
    : productFromListing
    ? {
        ...productFromListing,
        id: productFromListing.id,
        productId: productFromListing.productId || productFromListing.id,
      }
    : null;

  const cartListingId = cartItem?.listingId;
  const listingStoreId = productFromListing?.id;

//    const hasCartItemFromState = !!cartItemFromState;
//   const hasCartItemFromStore = !!cartItemFromStore;

  useEffect(() => {
    if (productId) {
      // if(hasCartItemFromState){
      //   dispatch(fetchCartDetail());
      //   return;
      // }
      // if(!hasCartItemFromStore){
      //   dispatch(fetchProductById(productId));
        
      // }

      // Tự động tìm Mapping ID nếu productId hiện tại là Service ID
      // (Bởi vì API listing chỉ nhận Listing ID, dùng Service ID sẽ bị lỗi 400)
      const mappedIds = JSON.parse(localStorage.getItem('product_mapping') || '{}');

      const resolvedId =
        mappedIds[productId] || // 1. Ưu tiên từ Mapping Storage
        cartListingId || // 2. Nếu không có, thử lấy listingId từ giỏ hàng
        listingStoreId || // 3. Thử tìm trong danh sách trang chủ
        productId; // 4. Cuối cùng mới dùng chính nó

      dispatch(fetchProductById(resolvedId));
      dispatch(fetchCartDetail());
    }
  }, [dispatch, productId, cartListingId, listingStoreId /*, hasCartItemFromState, hasCartItemFromStore*/]);

  // Cơ chế tự sửa lỗi: Lưu mapping giữa Service ID và Listing ID để lần sau mở tab mới vẫn xem được
  useEffect(() => {
    if (currentProduct && currentProduct.productId && currentProduct.id) {
      const mappedIds = JSON.parse(localStorage.getItem('product_mapping') || '{}');
      // productId ở đây là Service ID (dùng để mua), id là Listing ID (dùng để xem)
      if (mappedIds[currentProduct.productId] !== currentProduct.id) {
        mappedIds[currentProduct.productId] = currentProduct.id;
        localStorage.setItem('product_mapping', JSON.stringify(mappedIds));
      }
    }
  }, [currentProduct]);

  //  Luôn dọn dẹp mỗi khi chuyển trang hoặc đóng tab
  useEffect(() => {
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch]); // chỉ chạy duy nhất 1 lần khi component unmount

  if (productDetailStatus === 'pending' && !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải thông tin sản phẩm...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-not-found" style={{ padding: '100px', textAlign: 'center' }}>
          <h2>Rất tiếc, sản phẩm này hiện không có sẵn!</h2>
          <Link
            to="/"
            className="back-home-link"
            style={{
              color: '#0b74e5',
              marginTop: '15px',
              display: 'inline-block',
            }}
          >
            Quay về trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Tính giá sau giảm giá
  const finalPrice = calculateDiscountedPrice(product.originalPrice, product.discount);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Thêm sản phẩm vào giỏ hàng (nếu trùng sẽ tự động tăng số lượng)
  const handleAddToCart = async () => {
    // console.log("Current Product in UI:", product);
    const result = await dispatch(
      addItemToCart({
        id: product.id,
        productId: product.productId,
        name: product.name,
        price: product.currentPrice,
        originalPrice: product.originalPrice,
        discount: product.discount,
        quantity: quantity,
      })
    );

    if (addItemToCart.fulfilled.match(result)) {
      setNotification({
        show: true,
        message: `Đã thêm ${quantity} ${product.name} vào giỏ hàng!`,
        type: 'success',
      });
    } else {
      setNotification({
        show: true,
        message: `Không thể thêm vào giỏ hàng: ${result.payload || 'Lỗi không xác định'}`,
        type: 'error',
      });
    }

    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleBuyNow = () => {
    // console.log("Buy now clicked");
    setShowCheckoutForm(true);
    // console.log("showCheckoutForm set to true");
  };

  const handleCheckoutSubmit = (checkoutData) => {
    console.log('Checkout completed:', checkoutData);
    // console.log("Sản phẩm mua ngay:", product);
    // console.log("Số lượng:", quantity);

    setShowCheckoutForm(false);

    // Sử dụng thông báo trong ứng dụng thay vì alert trình duyệt
    setNotification({
      show: true,
      message: 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Tiki.',
      type: 'success',
    });

    // Tự động đóng thông báo sau 4 giây
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };


  return (
    <div className="product-detail-page">
      <Header />

      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">{'>'}</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-main-info">
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  product.image ||
                  'https://salt.tikicdn.com/cache/750x750/ts/product/ac/65/4e/e21a92395ae8a7a1c2af3da945d76944.jpg.webp'
                }
                alt={product.name}
              />
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail active">
                <img
                  src={
                    product.image ||
                    'https://salt.tikicdn.com/cache/750x750/ts/product/ac/65/4e/e21a92395ae8a7a1c2af3da945d76944.jpg.webp'
                  }
                  alt={product.name}
                />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info-detail">
            {product.imageBadges && (
              <div className="product-badge-container">
                <img src={product.imageBadges} alt="Badge" className="product-badge-icon-detail" />
              </div>
            )}

            <h1 className="product-name-detail">{product.name}</h1>

            <div className="rating-section">
              {product.rating && (
                <>
                  <span className="rating-number">{product.rating}</span>
                  {/* <div className="rating-stars-detail">{renderStars(product.rating)}</div> */}
                  <span className="separator-dot">•</span>
                  {product.sold && (
                    <span className="sold-count">
                      Đã bán {product.sold.toLocaleString('vi-VN')}
                    </span>
                  )}
                  {!product.sold && <span className="sold-count">Đã bán sản phẩm</span>}
                </>
              )}
            </div>

            {/* Price Section */}
            <div className="price-section-detail">
              <div
                className={`current-price-detail ${
                  !product.discount || product.discount <= 0 ? 'no-discount' : ''
                }`}
              >
                {formatPrice(finalPrice)}
                <sup>₫</sup>
              </div>
              {product.discount > 0 && (
                <div className="price-discount-info">
                  <span className="discount-badge">- {product.discount}%</span>
                  <span className="original-price-detail">
                    {formatPrice(product.originalPrice)}
                    <sup>₫</sup>
                  </span>
                </div>
              )}
            </div>

            <div className="delivery-info-section">
              <div className="info-row">
                <span className="info-label">Thông tin vận chuyển</span>
              </div>
              <div className="delivery-detail">
                {/* <div className="delivery-address-section">
                  <AddressSelector
                    forceOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                  />

                  <button
                    className="btn-change-address"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    Đổi
                  </button>
                </div> */}

                <div className="delivery-text">
                  <p className="delivery-main">{product.deliveryTime || 'Giao siêu tốc 2h'}</p>
                  <p className="delivery-sub">Freeship 10k đơn từ 45k, Freeship 25k đơn từ 100k</p>
                </div>
              </div>
            </div>

            {/* Made In */}
            {product.madeIn && (
              <div className="made-in-section">
                <span className="info-label">Xuất xứ:</span>
                <span className="made-in-value">{product.madeIn}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <span className="quantity-label">Số Lượng</span>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={handleDecrease}
                  // disabled={item.quantity <= 1}
                  //  disabled={quantity <= 1}
                  //   aria-disabled={quantity <= 1}
                >
                  -
                </button>

                <input type="text" className="quantity-input" value={quantity} readOnly />

                <button className="quantity-btn" onClick={handleIncrease}>
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="total-price-section">
              <span className="total-label">Tạm tính</span>
              <span className="total-price">
                {formatPrice(finalPrice * quantity)}
                <sup>₫</sup>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Mua ngay
              </button>

              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>

              <button className="btn-add-to-cart">Mua trả góp - trả sau</button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {(product.description || product.shortDescription) && (
          <div className="product-description-section">
            <h2 className="section-title">Mô tả sản phẩm</h2>
            <div className="description-content">
              {product.shortDescription && (
                <div
                  className="item-short-desc"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                />
              )}
              {product.description && (
                <div
                  className="item-full-desc"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>
        )}

      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`add-to-cart-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">{notification.type === 'success' ? '✓' : '✕'}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <Footer />

      {showCheckoutForm && (
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          meta={{
            items: [
              {
                id: product.id,

                productId: product.productId || product.id,
                name: product.name,
                image: product.image,
                price: finalPrice,
                originalPrice: product.originalPrice,
                discount: product.discount,
                quantity: quantity,
              },
            ],
            totalAmount: finalPrice * quantity,
          }}
          onCancel={handleCheckoutCancel}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
