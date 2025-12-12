import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddressSelector.css";

import {
  fetchAddressData,
  setLocationType,
  setSelectedCity,
  setSelectedDistrict,
  setSelectedWard,
  setSelectedAddress,
  setShowLocationModal,
  resetSelection,
  loadAddressFromStorage,
  selectAddressData,
  selectAddressStatus,
  selectAddressError,
  selectSelectedAddress,
  selectLocationType,
  selectSelectedCity,
  selectSelectedDistrict,
  selectSelectedWard,
  selectShowLocationModal,
  selectDistrictsByCity,
  selectWardsByDistrict,
  // Import types
  City,
  District,
  Ward
} from "../../store/addressSlice";


interface AddressSelectorProps {
  onLoginClick?: () => void;
  forceOpen?: boolean;
  onClose?: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onLoginClick, forceOpen = false, onClose }) => {
  const dispatch = useDispatch<any>(); 
  
  const addressData = useSelector(selectAddressData);
  const status = useSelector(selectAddressStatus);
  const error = useSelector(selectAddressError);

  const selectedAddress = useSelector(selectSelectedAddress);
  const locationType = useSelector(selectLocationType);

  const selectedCity = useSelector(selectSelectedCity);
  const selectedDistrict = useSelector(selectSelectedDistrict);
  const selectedWard = useSelector(selectSelectedWard);

  const showLocationModal = useSelector(selectShowLocationModal);
  
  // Lấy danh sách districts và wards từ selectors
  const districts = useSelector(selectDistrictsByCity);
  const wards = useSelector(selectWardsByDistrict);

  // Fetch dữ liệu địa chỉ khi component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddressData());
    }
    
    dispatch(loadAddressFromStorage());
  }, [dispatch, status]);

  //  Xử lý forceOpen từ props
  useEffect(() => {
    if (forceOpen) {
      dispatch(setShowLocationModal(true));
    }
  }, [forceOpen, dispatch]);
  
  
  useEffect(() => {
    if (selectedAddress) {
        window.localStorage.setItem("selectedAddress", selectedAddress);
    }
  }, [selectedAddress]);


  const handleLocationClick = () => {
    dispatch(resetSelection());
    dispatch(setShowLocationModal(true));
  };

  const handleSaveLocation = () => {
    if (locationType === "default") {
      dispatch(setShowLocationModal(false));
      if (onClose) onClose();
    } else if (
      locationType === "custom" &&
      selectedCity &&
      selectedDistrict &&
      selectedWard
    ) {
      const cityObj = addressData.find((c: City) => c.code === Number(selectedCity));
      const districtObj = cityObj?.districts?.find(
        (d: District) => d.code === Number(selectedDistrict)
      );
      const wardObj = districtObj?.wards?.find(
        (w: Ward) => w.code === Number(selectedWard)
      );

      const newAddr = `${wardObj?.name || ""}, ${districtObj?.name || ""}, ${
        cityObj?.name || ""
      }`;

      dispatch(setSelectedAddress(newAddr));
      
      dispatch(setShowLocationModal(false));
      if (onClose) onClose();
    }
  };

  const handleLoginClick = () => {
    dispatch(setShowLocationModal(false));
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleCloseModal = () => {
    dispatch(setShowLocationModal(false));
    if (onClose) onClose();
  };

  //  Hiển thị trạng thái loading và error
  
  // const renderLoadingState = () => {
  //   if (status === "pending") {
  //     return <div className="loading-message">Đang tải dữ liệu địa chỉ...</div>;
  //   }
  //   if (status === "failed") {
  //     return <div className="error-message">Lỗi: {error}</div>;
  //   }
  //   return null;
  // };

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
        <div className="location-modal-overlay" onClick={handleCloseModal}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-content">
              <div className="location-modal-header">
                <h2>Địa chỉ giao hàng</h2>
                <button className="close-btn" onClick={handleCloseModal}>
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

                {/* Hiển thị loading/error state */}
                {/* {renderLoadingState()} */}

                <div className="location-options">
                  <label className="location-option">
                    <input
                      type="radio"
                      name="location-type"
                      value="default"
                      checked={locationType === "default"}
                      onChange={(e) => dispatch(setLocationType(e.target.value as "default" | "custom"))}
                    />
                    <span>{selectedAddress}</span>
                  </label>

                  <label className="location-option">
                    <input
                      type="radio"
                      name="location-type"
                      value="custom"
                      checked={locationType === "custom"}
                      onChange={(e) => dispatch(setLocationType(e.target.value as "default" | "custom"))}
                    />
                    <span>Chọn khu vực giao hàng khác</span>
                  </label>

                  {locationType === "custom" && (
                    <div className="location-selects">
                      {/* Tỉnh/Thành phố */}
                      <div className="select-group">
                        <label>Tỉnh/Thành phố</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedCity}
                            onChange={(e) =>
                              dispatch(setSelectedCity(e.target.value))
                            }
                            className={selectedCity ? "selected" : ""}
                            disabled={status === "pending"}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn tỉnh/thành phố
                            </option>
                            {addressData.map((city: City) => (
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

                      {/* Quận/Huyện */}
                      <div className="select-group">
                        <label>Quận/Huyện</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedDistrict}
                            onChange={(e) =>
                              dispatch(setSelectedDistrict(e.target.value))
                            }
                            className={selectedDistrict ? "selected" : ""}
                            disabled={!selectedCity || status === "pending"}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn quận/huyện
                            </option>
                            {districts.map((district: District) => (
                              <option key={district.code} value={district.code}>
                                {district.name}
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

                      {/* Phường/Xã */}
                      <div className="select-group">
                        <label>Phường/Xã</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedWard}
                            onChange={(e) =>
                              dispatch(setSelectedWard(e.target.value))
                            }
                            className={selectedWard ? "selected" : ""}
                            disabled={!selectedDistrict || status === "pending"}
                          >
                            <option value="" disabled hidden>
                              Vui lòng chọn phường/xã
                            </option>
                            {wards.map((ward: Ward) => (
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
