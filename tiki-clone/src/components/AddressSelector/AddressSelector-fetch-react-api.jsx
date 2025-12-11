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

  // đồng bộ địa chỉ đã chọn với localStorage và các tab/ component khác
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
    return () => {
      window.removeEventListener("addressChange", handleAddressChange);
    };
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(
    "P. Minh Khai, Q. Hoàng Mai, Hà Nội"
  );
  
  const [addressData, setAddressData] = useState([]);

  React.useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => setAddressData(data || []))
      .catch((err) => console.log("Lỗi API địa chỉ:", err));
  }, []);

  const cities = addressData; // array of { code, name, districts }

  const getDistrictsByCity = (cityCode) => {
    if (!cityCode) return [];

    const city = addressData.find((c) => c.code === Number(cityCode));
    return city && city.districts ? city.districts : [];
  };

  const getWardsByDistrict = (cityCode, districtCode) => {
    if (!cityCode || !districtCode) return [];

    const city = addressData.find((c) => c.code === Number(cityCode));

    if (!city || !city.districts) return [];

    const district = city.districts.find((d) => d.code === Number(districtCode));
    
    return district && district.wards ? district.wards : [];
  };

  const handleLocationClick = (e) => {
    
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
      const cityObj = addressData.find((c) => c.code === Number(selectedCity));
      const districtObj = cityObj?.districts?.find(
        (d) => d.code === Number(selectedDistrict)
      );
      const wardObj = districtObj?.wards?.find(
        (w) => w.code === Number(selectedWard)
      );

      const newAddr = `${wardObj?.name || ""}, ${districtObj?.name || ""}, ${
        cityObj?.name || ""
      }`;

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
                              <option key={city.code} value={city.code}>
                                {city.name}
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
                                <option key={district.code} value={district.code}>
                                  {district.name}
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
                              <option key={ward.code} value={ward.code}>
                                {ward.name}
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
