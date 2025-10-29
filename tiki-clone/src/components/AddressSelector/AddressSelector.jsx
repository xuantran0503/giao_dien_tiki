import React, { useState } from "react";
import "./AddressSelector.css";

const AddressSelector = ({ onLoginClick }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    "Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội"
  );
  const [locationType, setLocationType] = useState("default");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Dữ liệu địa chỉ mẫu
  const cities = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bắc Ninh",
    "Nam Định",
    "Nha Trang",
    "Ninh Bình",
    "Phú Quốc",
    "Quảng Bình",
    "Quảng Trị",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Vũng Tàu",
    "Xuân Thủy",
    "Yên Bái",
  ];

  const handleLocationClick = (e) => {
    e.preventDefault();
    // Reset về lựa chọn default khi mở modal
    setLocationType("default");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedWard("");
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    if (locationType === "default") {
      // Giữ nguyên địa chỉ hiện tại
      setShowLocationModal(false);
    } else if (
      locationType === "custom" &&
      selectedCity &&
      selectedDistrict &&
      selectedWard
    ) {
      // Cập nhật địa chỉ mới
      setSelectedAddress(
        `${selectedWard}, ${selectedDistrict}, ${selectedCity}`
      );
      setShowLocationModal(false);
    }
  };

  const handleLoginClick = () => {
    setShowLocationModal(false);
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <>
      <div className="location">
        <div className="img-location">
          <img src="/location.png" alt="location" />
        </div>
        <h4 className="text-location1">Giao đến: </h4>
        <button onClick={handleLocationClick} className="location-link">
          {selectedAddress}
        </button>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="location-modal-overlay"
          onClick={() => setShowLocationModal(false)}
        >
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-content">
              <div className="location-modal-header">
                <h2>Địa chỉ giao hàng</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowLocationModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="location-modal-body">
                <p className="location-description">
                  Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng
                  cùng phí đóng gói, vận chuyển một cách chính xác nhất.
                </p>

                <button
                  className="btn-login-location"
                  onClick={handleLoginClick}
                >
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
                    <span>{selectedAddress}</span>
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
                        <div className="select-wrapper">
                          <select
                            value={selectedCity}
                            onChange={(e) => {
                              setSelectedCity(e.target.value);
                              setSelectedDistrict("");
                              setSelectedWard("");
                            }}
                            className={selectedCity ? "selected" : ""}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn tỉnh/thành phố
                            </option>
                            {cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          <div className="select-indicators">
                            <span className="pipe">|</span>
                            <div className="select-arrow">
                              <svg
                                height="20"
                                width="20"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="select-group">
                        <label>Quận/Huyện</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedDistrict}
                            onChange={(e) => {
                              setSelectedDistrict(e.target.value);
                              setSelectedWard("");
                            }}
                            className={selectedDistrict ? "selected" : ""}
                            disabled={!selectedCity}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn quận/huyện
                            </option>
                            <option value="Q. Hoàn Kiếm">Q. Hoàn Kiếm</option>
                            <option value="Q. Đống Đa">Q. Đống Đa</option>
                            <option value="Q. Cầu Giấy">Q. Cầu Giấy</option>
                            <option value="Q. Hai Bà Trưng">
                              Q. Hai Bà Trưng
                            </option>
                            <option value="Q. Hoàng Mai">Q. Hoàng Mai</option>
                            <option value="Q. Thanh Xuân">Q. Thanh Xuân</option>
                            <option value="Q. Ba Đình">Q. Ba Đình</option>
                            <option value="Q. Tây Hồ">Q. Tây Hồ</option>
                            <option value="Q. Long Biên">Q. Long Biên</option>
                            <option value="Q. Nam Từ Liêm">
                              Q. Nam Từ Liêm
                            </option>
                            <option value="Q. Hà Đông">Q. Hà Đông</option>
                          </select>
                          <div className="select-indicators">
                            <span className="pipe">|</span>
                            <div className="select-arrow">
                              <svg
                                height="20"
                                width="20"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="select-group">
                        <label>Phường/Xã</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                            className={selectedWard ? "selected" : ""}
                            disabled={!selectedDistrict}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn phường/xã
                            </option>
                            <option value="P. Hàng Trống">P. Hàng Trống</option>
                            <option value="P. Hàng Bạc">P. Hàng Bạc</option>
                            <option value="P. Hàng Gai">P. Hàng Gai</option>
                            <option value="P. Hàng Đào">P. Hàng Đào</option>
                            <option value="P. Cửa Đông">P. Cửa Đông</option>
                            <option value="P. Lý Thái Tổ">P. Lý Thái Tổ</option>
                            <option value="P. Tràng Tiền">P. Tràng Tiền</option>
                            <option value="P. Phan Chu Trinh">
                              P. Phan Chu Trinh
                            </option>
                          </select>
                          <div className="select-indicators">
                            <span className="pipe">|</span>
                            <div className="select-arrow">
                              <svg
                                height="20"
                                width="20"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn-save-location"
                  onClick={handleSaveLocation}
                >
                  GIAO ĐẾN ĐỊA CHỈ NÀY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSelector;
