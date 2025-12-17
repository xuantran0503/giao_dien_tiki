import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../SearchBar/SearchBar";
import AddressSelector from "../AddressSelector/AddressSelector";
import Login from "../Login/Login";
import "./Header.css";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const cartItemsCount = useSelector((state) => state.cart.items.length);

  const handleAccountClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setShowLogin(true);
  };

  return (
    <>
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
            <Link to="/" className="logo-tiki">
              <img src="/tiki-logo.png" alt="Tiki Logo" />
            </Link>

            {/* Nhóm phải gồm 2 khối lớn */}
            <div className="right-wrapper">
              {/* Khối 1: search + icon bar */}
              <div className="top-row">
                <SearchBar />

                <div className="icon-bar">
                  <Link to="/" className="icon-btn-with-text">
                    <div className="img-home">
                      <img src="/home.png" alt="home" />
                    </div>
                    <span className="text">Trang chủ</span>
                  </Link>

                  <button
                    onClick={handleAccountClick}
                    className="icon-btn-with-text"
                  >
                    <div className="img-account">
                      <img src="/account.png" alt="account" />
                    </div>
                    <span className="text">Tài khoản</span>
                  </button>

                  <span className="dau1">|</span>

                  <Link to="/cart" className="cart-btn">
                    <div className="img-cart">
                      <img src="/cart.png" alt="cart" />
                    </div>

                    <span className="cart-badge">{cartItemsCount}</span>
                  </Link>

                  <Link to="/buyer-info" className="icon-btn-with-text">
                    <span className="text">📋 Lịch sử đơn hàng</span>
                  </Link>
                </div>
              </div>

              {/* Khối 2: location + menu */}
              <div className="bottom-row">
                <nav className="menu">
                  <Link to="/category/dien-gia-dung">điện gia dụng</Link>
                  <Link to="/category/xe-co">xe cộ</Link>
                  <Link to="/category/me-be">mẹ & bé</Link>
                  <Link to="/category/khoe-dep">khỏe đẹp</Link>
                  <Link to="/category/nha-cua">nhà cửa</Link>
                  <Link to="/category/sach">sách</Link>
                  <Link to="/category/the-thao">thể thao</Link>
                </nav>

                <AddressSelector onLoginClick={handleAccountClick} />
              </div>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="features-row">
          <div className="features-container">
            <Link to="/about" className="feature-item">
              <span className="feat-text-1">Cam kết</span>
            </Link>

            <Link to="/promotion/hang-that" className="feature-item">
              <div className="img-hang-that">
                <img src="/img_hang_that.png" alt="heart" />
              </div>
              <span className="feat-text">100% hàng thật</span>
            </Link>

            <Link to="/promotion/freeship" className="feature-item">
              <span className="dau2"></span>
              <div className="img-freeship">
                <img src="/img_freeship.png" alt="freeship" />
              </div>
              <span className="feat-text">Freeship mọi đơn</span>
              <span className="dau2"></span>
            </Link>

            <Link to="/promotion/hoan-tien" className="feature-item">
              <div className="img-hoan-tien">
                <img src="/img_hoantien.png" alt="hoantien" />
              </div>
              <span className="feat-text">Hoàn 200% nếu hàng giả</span>
              <span className="dau2"></span>
            </Link>

            <Link to="/promotion/doi-tra" className="feature-item">
              <div className="img-doi-tra">
                <img src="/img_doitra.png" alt="doitra" />
              </div>
              <span className="feat-text">30 ngày đổi trả</span>
              <span className="dau2"></span>
            </Link>

            <Link to="/promotion/giao-nhanh" className="feature-item">
              <div className="img-giao-nhanh">
                <img src="/img_giaonhanh.png" alt="giaonhanh" />
              </div>
              <span className="feat-text">Giao nhanh 2h</span>
              <span className="dau2"></span>
            </Link>

            <Link to="/promotion/gia-re" className="feature-item">
              <div className="img-gia-re">
                <img src="/img_giare.png" alt="giare" />
              </div>
              <span className="feat-text">Giá siêu rẻ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;
