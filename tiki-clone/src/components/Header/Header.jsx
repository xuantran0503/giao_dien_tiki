import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Banner freeship */}
      <div className="banner">
        <div className="text-and-img-banner">
          <span>Freeship đơn từ 45k, giảm nhiều hơn cùng</span>
          <div className="img-text-banner">
            <img src="/img-text-banner.png" alt="banner" />
          </div>
        </div>
      </div>

      <div className="header-container">
        {/* Main header */}
        <div className="header-main">
          {/* Logo */}
          <div className="logo-tiki">
            <img src="/tiki-logo.png" alt="Tiki Logo" />
          </div>

          {/* Nhóm phải gồm 2 khối lớn */}
          <div className="right-wrapper">
            {/* Khối 1: search + icon bar */}
            <div className="top-row">
              <div className="search">
                <div className="search-wrapper">
                  {/* <span className="search-icon">🔍</span> */}
                  <div className="img-search">
                    <img src="/search.png" alt="search" />
                  </div>
                  <input type="text" placeholder="Túi rác Inochi 79k/8 cuộn" />
                  <span className="search-divider"></span>
                  <button className="search-btn">Tìm kiếm</button>
                </div>
              </div>

              <div className="icon-bar">
                <a href="#" className="icon-btn-with-text">
                  {/* <span className="icon">🏠</span> */}
                  <div className="img-home">
                    <img src="/home.png" alt="home" />
                  </div>
                  <span className="text">Trang chủ</span>
                </a>

                <a href="#" className="icon-btn-with-text">
                  {/* <span className="icon">😊</span> */}
                  <div className="img-account">
                    <img src="/account.png" alt="account" />
                  </div>
                  <span className="text">Tài khoản</span>
                </a>

                <span className="dau1">|</span>
                <a href="#" className="cart-btn">
                  <div className="img-cart">
                    <img src="/cart.png" alt="cart" />
                  </div>
                  {/* 🛒 */}
                  <span className="cart-badge">0</span>
                </a>
              </div>
            </div>

            {/* Khối 2: location + menu */}
            <div className="bottom-row">
              <nav className="menu">
                <a href="#">điện gia dụng</a>
                <a href="#">xe cộ</a>
                <a href="#">mẹ & bé</a>
                <a href="#">khỏe đẹp</a>
                <a href="#">nhà cửa</a>
                <a href="#">sách</a>
                <a href="#">thể thao</a>
              </nav>

              <div className="location">
                {/* <span className="loc-pin">📍</span> */}
                <div className="img-location">
                  <img src="/location.png" alt="location" />
                </div>
                <h4 className="text-location1">Giao đến: </h4>
                {/* <span className="text-location-1">Giao đến: </span> */}
                <a href="#" className="location-link">
                  Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features row */}
      <div className="features-row">
        <div className="features-container">
          <div className="feature-item">
            <span className="feat-text-1">Cam kết</span>
          </div>
          <div className="feature-item">
            <div className="img-hang-that">
              <img src="/img_hang_that.png" alt="heart" />
            </div>
            <span className="feat-text">100% hàng thật</span>
          </div>
          <div className="feature-item">
            <span className="dau2"></span>
            <div className="img-freeship">
              <img src="/img_freeship.png" alt="freeship" />
            </div>
            <span className="feat-text">Freeship mọi đơn</span>
            <span className="dau2"></span>
          </div>
          <div className="feature-item">
            <div className="img-hoan-tien">
              <img src="/img_hoantien.png" alt="hoantien" />
            </div>
            <span className="feat-text">Hoàn 200% nếu hàng giả</span>
            <span className="dau2"></span>
          </div>
          <div className="feature-item">
            <div className="img-doi-tra">
              <img src="/img_doitra.png" alt="doitra" />
            </div>
            <span className="feat-text">30 ngày đổi trả</span>
            <span className="dau2"></span>
          </div>
          <div className="feature-item">
            <div className="img-giao-nhanh">
              <img src="/img_giaonhanh.png" alt="giaonhanh" />
            </div>
            <span className="feat-text">Giao nhanh 2h</span>
            <span className="dau2"></span>
          </div>
          <div className="feature-item">
            <div className="img-gia-re">
              <img src="/img_giare.png" alt="giare" />
            </div>
            <span className="feat-text">Giá siêu rẻ</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
