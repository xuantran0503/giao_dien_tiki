import React, { useState } from "react";
import "./AddressSelector.css";

const AddressSelector = ({ onLoginClick, forceOpen = false, onClose }) => {
  const [locationType, setLocationType] = useState("default");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [showLocationModal, setShowLocationModal] = useState(false);

  React.useEffect(() => {
    if (forceOpen) {
      setShowLocationModal(true);
    }
  }, [forceOpen]);

  // Đồng bộ địa chỉ với localStorage + event listener
  React.useEffect(() => {
    const saved = window.localStorage.getItem("selectedAddress");
    if (saved && typeof saved === "string") {
      setSelectedAddress(saved);
    }

    const handleAddressChange = (e) => {
      const addr = e && e.detail && e.detail.address;
      if (addr) {
        setSelectedAddress(addr);
      }
    };

    window.addEventListener("addressChange", handleAddressChange);

    //  CLEANUP: Hủy đăng ký khi component unmount
    return () => {
      window.removeEventListener("addressChange", handleAddressChange);
    };
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(
    "P. Minh Khai, Q. Hoàng Mai, Hà Nội"
  );

  const addressData = {
    "Hà Nội": {
      "Q. Hoàng Mai": [
        "P. Minh Khai",
        "P. Đại Kim",
        "P. Hoàng Văn Thụ",
        "P. Giáp Bát",
        "P. Thịnh Liệt",
      ],
      "Q. Cầu Giấy": [
        "P. Mai Dịch",
        "P. Dịch Vọng",
        "P. Nghĩa Đô",
        "P. Yên Hòa",
        "P. Trung Hòa",
      ],
      "Q. Ba Đình": [
        "P. Liễu Giai",
        "P. Ngọc Hà",
        "P. Đội Cấn",
        "P. Kim Mã",
        "P. Thành Công",
      ],
      "Q. Hai Bà Trưng": [
        "P. Minh Khai",
        "P. Bạch Mai",
        "P. Đồng Nhân",
        "P. Lê Đại Hành",
        "P. Bạch Đằng",
      ],
      "Q. Đống Đa": [
        "P. Khâm Thiên",
        "P. Nam Đồng",
        "P. Văn Chương",
        "P. Hàng Bột",
        "P. Láng Hạ",
      ],
    },
    "Nam Định": {
      "H. Vụ Bản": [
        "X. Liên Bảo",
        "X. Kim Thái",
        "X. Đại An",
        "X. Đại Thắng",
        "X. Quang Trung",
      ],
      "H. Mỹ Lộc": [
        "X. Mỹ Thịnh",
        "X. Mỹ Hà",
        "X. Mỹ Thành",
        "X. Mỹ Phúc",
        "X. Mỹ Tân",
      ],
      "H. Trực Ninh": [
        "X. Trực Đại",
        "X. Trực Phương",
        "X. Trực Định",
        "X. Trực Thanh",
        "X. Trực Cường",
      ],
      "H. Xuân Trường": [
        "X. Xuân Bắc",
        "X. Xuân Phương",
        "X. Xuân Thượng",
        "X. Xuân Thủy",
        "X. Xuân Hồng",
      ],
      "H. Giao Thủy": [
        "X. Giao Hải",
        "X. Giao Hương",
        "X. Giao Long",
        "X. Giao Xuân",
      ],
      "H. Hải Hậu ": [
        "X. Hải Sơn",
        "X. Hải Phú",
        "X. Hải An",
        "X. Hải Bắc",
        "X. Hải Châu",
        "X. Hải Đông",
        "X. Hải Giang",
        "X. Hải Hà",
        "X. Hải Phong",
        "X. Hải Hòa",
        "X. Hải Hưng",
        "X. Hải Quang",
        "X. Hải Chính",
        "X. Hải Lộc",
        "X. Hải Lý",
      ],
    },
    "Thái Bình": {
      "H. Đông Hưng": [
        "X. An Châu",
        "X. Bạch Đằng",
        "X. Chương Dương",
        "X. Đông La",
        "X. Đông Sơn",
      ],
      "H. Hưng Hà": [
        "X. Bắc Sơn",
        "X. Độc Lập",
        "X. Đông Đô",
        "X. Hồng Đức",
        "X. Hùng Dũng",
      ],
      "H. Kiến Xương": [
        "X. Bình Định",
        "X. Bình Minh",
        "X. Bình Nguyên",
        "X. Bình Thanh",
        "X. Bình Định",
      ],
      "H. Quỳnh Phụ": [
        "X. An Ấp",
        "X. An Cầu",
        "X. An Dục",
        "X. An Hiệp",
        "X. An Khê",
      ],
      "H. Vũ Thư": [
        "X. Hiệp Hòa",
        "X. Hòa Bình",
        "X. Minh Khai",
        "X. Minh Quang",
        "X. Nguyên Xá",
      ],
    },
    "Hà Giang": {
      "H. Bắc Quang": [
        "X. Bằng Hành",
        "X. Đồng Tâm",
        "X. Đông Thành",
        "X. Minh Khai",
        "X. Quang Minh",
      ],
      "H. Quản Bạ": [
        "X. Cán Tỷ",
        "X. Cao Mã Pờ",
        "X. Lùng Tám",
        "X. Nghĩa Thuận",
        "X. Quản Bạ",
      ],
      "H. Vị Xuyên": [
        "X. Bạch Ngọc",
        "X. Cao Bồ",
        "X. Đạo Đức",
        "X. Kim Linh",
        "X. Kim Thạch",
      ],
      "H. Yên Minh": [
        "X. Bạch Đích",
        "X. Đông Minh",
        "X. Du Già",
        "X. Du Tiến",
        "X. Lao Và Chải",
      ],
      "H. Đồng Văn": [
        "X. Đồng Văn",
        "X. Hố Quáng Phìn",
        "X. Lũng Cú",
        "X. Lũng Phìn",
        "X. Má Lé",
      ],
    },
    "Hưng Yên": {
      "H. Kim Động": [
        "X. Đồng Thanh",
        "X. Hiệp Cường",
        "X. Hùng An",
        "X. Lương Bằng",
        "X. Nghĩa Dân",
      ],
      "H. Mỹ Hào": [
        "X. Bạch Sam",
        "X. Minh Đức",
        "X. Phùng Chí Kiên",
        "X. Xuân Dục",
        "X. Ngọc Lâm",
      ],
      "H. Phù Cừ": [
        "X. Đình Cao",
        "X. Đoàn Đào",
        "X. Minh Hoàng",
        "X. Nhật Quang",
        "X. Tiền Tiến",
      ],
      "H. Tiên Lữ": [
        "X. An Viên",
        "X. Dị Chế",
        "X. Đức Thắng",
        "X. Hải Triều",
        "X. Hưng Đạo",
      ],
      "H. Văn Lâm": [
        "X. Chỉ Đạo",
        "X. Đại Đồng",
        "X. Lạc Đạo",
        "X. Lạc Hồng",
        "X. Việt Hưng",
      ],
    },
  };

  const cities = Object.keys(addressData);

  const getDistrictsByCity = (city) => {
    if (!city || !addressData[city]) return [];
    return Object.keys(addressData[city]);
  };

  const getWardsByDistrict = (city, district) => {
    if (
      !city ||
      !district ||
      !addressData[city] ||
      !addressData[city][district]
    )
      return [];
    return addressData[city][district];
  };

  const handleLocationClick = (e) => {
    // e.preventDefault();

    setLocationType("default");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedWard("");
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    if (locationType === "default") {
      setShowLocationModal(false);

      window.localStorage.setItem("selectedAddress", selectedAddress);

      window.dispatchEvent(
        new CustomEvent("addressChange", {
          detail: { address: selectedAddress },
        })
      );
      if (onClose) onClose();
    } else if (
      locationType === "custom" &&
      selectedCity &&
      selectedDistrict &&
      selectedWard
    ) {
      const newAddr = `${selectedWard}, ${selectedDistrict}, ${selectedCity}`;
      setSelectedAddress(newAddr);
      setShowLocationModal(false);

      window.localStorage.setItem("selectedAddress", newAddr);

      window.dispatchEvent(
        new CustomEvent("addressChange", {
          detail: { address: newAddr },
        })
      );
      // if (onClose) onClose();
    }
  };

  const handleLoginClick = () => {
    setShowLocationModal(false);
    // if (onClose) onClose();
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
          onClick={() => {
            setShowLocationModal(false);
            if (onClose) onClose();
          }}
        >
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-content">
              <div className="location-modal-header">
                <h2>Địa chỉ giao hàng</h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowLocationModal(false);
                    if (onClose) onClose();
                  }}
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
                            {getDistrictsByCity(selectedCity).map(
                              (district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              )
                            )}
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
                            {getWardsByDistrict(
                              selectedCity,
                              selectedDistrict
                            ).map((ward) => (
                              <option key={ward} value={ward}>
                                {ward}
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
