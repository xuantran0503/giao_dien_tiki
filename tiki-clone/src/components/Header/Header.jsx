import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  // Search
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const popularSearches = [
    { id: 1, text: "máy cạo râu", image: "https://salt.tikicdn.com/cache/100x100/ts/product/a0/34/4c/54b71b44120b4ee9c7659fedeab864b0.jpg" },
    { id: 2, text: "đầm ", image: "https://salt.tikicdn.com/cache/100x100/ts/product/8f/c1/9f/39488ea2efd63d5796c371928cffa81e.jpg" },
    { id: 3, text: "boot nữ", image: "https://salt.tikicdn.com/cache/100x100/ts/product/55/55/77/41e3243e86064979f5fcee112e0c70ff.jpg" },
    { id: 4, text: "lego", image: "https://salt.tikicdn.com/cache/100x100/ts/product/6f/bb/47/1821149c9e781c3ac537de028c56f96a.jpg" },
    { id: 5, text: "tai heo", image: "https://salt.tikicdn.com/cache/100x100/ts/product/e9/04/37/17cb2ae8fd0e819aa962bf057625594c.jpg" },
    { id: 6, text: "bộ áo nam", image: "https://salt.tikicdn.com/cache/100x100/ts/product/d4/72/15/fe3b18d47e449abcdcef42612bfcc5be.jpg" }
  ];

  const featuredCategories = [
    { id: 1, name: "Đồ Chơi - Mẹ & Bé", image: "https://salt.tikicdn.com/ts/category/13/64/43/226301adcc7660ffcf44a61bb6df99b7.png" },
    { id: 2, name: "Điện Thoại - Máy Tính Bảng", image: "https://salt.tikicdn.com/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png" },
    { id: 3, name: "NGON", image: "https://salt.tikicdn.com/ts/category/1e/8c/08/d8b02f8a0d958c74539316e8cd437cbd.png" },
    { id: 4, name: "Làm Đẹp - Sức Khỏe", image: "https://salt.tikicdn.com/ts/category/73/0e/89/bf5095601d17f9971d7a08a1ffe98a42.png" },
    { id: 5, name: "Điện Gia Dụng", image: "https://salt.tikicdn.com/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png" },
    { id: 6, name: "Thời trang nữ", image: "https://salt.tikicdn.com/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png" },
    { id: 7, name: "Thời trang nam", image: "https://salt.tikicdn.com/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png" },
    { id: 8, name: "Giày - Dép nữ", image: "https://salt.tikicdn.com/ts/category/cf/ed/e1/5a6b58f21fbcad0d201480c987f8defe.png" }
  ];

  // Load search history từ localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Lưu vào history (giới hạn 5 item)
      const newHistory = [searchValue, ...searchHistory.filter(item => item !== searchValue)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setShowDropdown(false);

      console.log("Searching for:", searchValue);
    }
  };

  const handleHistoryClick = (text) => {
    setSearchValue(text);
    setShowDropdown(false);
    console.log("Searching for:", text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  // Location
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội");
  const [locationType, setLocationType] = useState("default");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  // Dữ liệu địa chỉ mẫu
  const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Nam Định", "Nha Trang", "Ninh Bình", "Phú Quốc", "Quảng Bình", "Quảng Trị", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Vũng Tàu", "Xuan Thuy", "Yên Bái"];

  const handleLocationClick = (e) => {
    e.preventDefault();
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    if (locationType === "default") {
      setSelectedAddress("Thị trấn Chúc Sơn, Huyện Chương Mỹ, Hà Nội");
      setShowLocationModal(false);
    } else if (locationType === "custom" && selectedCity && selectedDistrict && selectedWard) {
      setSelectedAddress(`${selectedWard}, ${selectedDistrict}, ${selectedCity}`);
      setShowLocationModal(false);
    }
  };





  return (
    <>
      {/* Overlay backdrop */}
      {showDropdown && <div className="search-overlay" onClick={() => setShowDropdown(false)}></div>}

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
                <div className="search" ref={searchRef}>
                  <div className="search-wrapper">
                    <div className="img-search">
                      <img src="/search.png" alt="search" />
                    </div>
                    <input
                      type="text"
                      placeholder="Túi rác Inochi 79k/8 cuộn"
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onKeyPress={handleKeyPress}
                    />
                    <span className="search-divider"></span>
                    <button className="search-btn" onClick={handleSearch}>Tìm kiếm</button>
                  </div>

                  {/* Search Dropdown */}
                  {showDropdown && (
                    <div className="search-dropdown">
                      {/* Lịch sử tìm kiếm */}
                      {searchHistory.length > 0 && (
                        <div className="search-section search-history-section">
                          <div className="search-history-list">
                            {searchHistory.map((item, index) => (
                              <div
                                key={index}
                                className="search-history-item"
                                onClick={() => handleHistoryClick(item)}
                              >
                                <img src="https://salt.tikicdn.com/ts/upload/33/d0/37/6fef2e788f00a16dc7d5a1dfc5d0e97a.png" alt="search" className="history-icon" />
                                <span className="history-text">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="view-all">
                            <span>Xem thêm</span>
                            <span className="arrow-down">▼</span>
                          </div>
                        </div>
                      )}


                      {/* Tìm Kiếm Phổ Biến */}
                      <div className="search-section">
                        <div className="section-header">
                          <img src="https://salt.tikicdn.com/ts/upload/4f/03/a0/2455cd7c0f3aef0c4fd58aa7ff93545a.png" alt="trending" className="section-icon-img" />
                          <h3>Tìm Kiếm Phổ Biến</h3>
                        </div>

                        <div className="popular-search-list">
                          {popularSearches.map((item) => (
                            <div
                              key={item.id}
                              className="popular-search-item-horizontal"
                              onClick={() => handleHistoryClick(item.text)}
                            >
                              <div className="popular-item-thumbnail">
                                <img src={item.image} alt={item.text} />
                              </div>
                              <span className="popular-item-label">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Danh Mục Nổi Bật */}
                      <div className="search-section">
                        <div className="section-header">
                          <div>
                            <h3>Danh Mục Nổi Bật</h3>
                          </div>
                        </div>

                        <div className="featured-categories-grid">
                          {featuredCategories.map((category) => (
                            <div key={category.id} className="featured-category-item">

                              <div className="category-image">
                                <img src={category.image} alt={category.name} />
                              </div>
                              <span className="category-name">{category.name}</span>

                            </div>
                          ))}
                        </div>


                      </div>
                    </div>
                  )}
                </div>

                <div className="icon-bar">
                  <Link to="/" className="icon-btn-with-text">

                    <div className="img-home">
                      <img src="/home.png" alt="home" />
                    </div>
                    <span className="text">Trang chủ</span>
                  </Link>

                  <Link to="/account" className="icon-btn-with-text">

                    <div className="img-account">
                      <img src="/account.png" alt="account" />
                    </div>
                    <span className="text">Tài khoản</span>
                  </Link>

                  <span className="dau1">|</span>

                  <Link to="/cart" className="cart-btn">
                    <div className="img-cart">
                      <img src="/cart.png" alt="cart" />
                    </div>

                    <span className="cart-badge">0</span>
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

                <div className="location">
                  <div className="img-location">
                    <img src="/location.png" alt="location" />
                  </div>
                  <h4 className="text-location1">Giao đến: </h4>
                  <button onClick={handleLocationClick} className="location-link">
                    {selectedAddress}
                  </button>
                </div>
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

      {/* Location Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-header">
              <h2>Địa chỉ giao hàng</h2>
              <button className="close-btn" onClick={() => setShowLocationModal(false)}>×</button>
            </div>

            <div className="location-modal-body">
              <p className="location-description">
                Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đóng gói, vận chuyển một cách chính xác nhất.
              </p>

              <button className="btn-login-location">
                Đăng nhập để chọn địa chỉ giao hàng
              </button>

              <div className="or-divider">hoặc</div>

              <div className="location-options">
                <label className="location-option">
                  <input
                    type="radio"
                    name="location-type"
                    value="default"
                    checked={locationType === "default"}
                    onChange={(e) => setLocationType(e.target.value)}
                  />
                  <span>Thị trấn Chúc Sơn, Huyện Chương Mỹ, Hà Nội</span>
                </label>

                <label className="location-option">
                  <input
                    type="radio"
                    name="location-type"
                    value="custom"
                    checked={locationType === "custom"}
                    onChange={(e) => setLocationType(e.target.value)}
                  />
                  <span>Chọn khu vực giao hàng khác</span>
                </label>

                {locationType === "custom" && (
                  <div className="location-selects">
                    <div className="select-group">
                      <label>Tỉnh/Thành phố</label>
                      <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                        <option value="">Vui lòng chọn tỉnh/thành phố</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="select-group">
                      <label>Quận/Huyện</label>
                      <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                        <option value="">Vui lòng chọn quận/huyện</option>
                        <option value="Q. Hoàn Kiếm">Q. Hoàn Kiếm</option>
                        <option value="Q. Đống Đa">Q. Đống Đa</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Hai Bà Trưng">Q. Hai Bà Trưng</option>
                        <option value="Q. Hoàng Mai">Q. Hoàng Mai</option>
                        <option value="Q. Thanh Xuân">Q. Thanh Xuân</option>
                        <option value="Q. Ba Đình">Q. Ba Đình</option>
                        <option value="Q. Tây Hồ">Q. Tây Hồ</option>
                        <option value="Q. Long Biên">Q. Long Biên</option>
                        <option value="Q. Nam Từ Liêm">Q. Nam Từ Liêm</option>
                        <option value="Q. Hà Đông">Q. Hà Đông</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                        <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>

                      </select>
                    </div>

                    <div className="select-group">
                      <label>Phường/Xã</label>
                      <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                        <option value="">Vui lòng chọn phường/xã</option>
                        <option value="P. Hàng Trống">P. Hàng Trống</option>
                        <option value="P. Hàng Bạc">P. Hàng Bạc</option>
                        <option value="P. Hàng Gai">P. Hàng Gai</option>
                        <option value="P. Hàng Đào">P. Hàng Đào</option>
                        <option value="P. Cửa Đông">P. Cửa Đông</option>
                        <option value="P. Lý Thái Tổ">P. Lý Thái Tổ</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Phan Chu Trinh">P. Phan Chu Trinh</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                        <option value="P. Tràng Tiền">P. Tràng Tiền</option>

                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn-save-location" onClick={handleSaveLocation}>
                GIAO ĐẾN ĐỊA CHỈ NÀY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
