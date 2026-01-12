import React from 'react';
import { useForm } from 'react-hook-form';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [selectedCity, setSelectedCity] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [selectedWard, setSelectedWard] = React.useState('');

    const addressData = {
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
        "TP. Hồ Chí Minh": {
            "Q. 1": [
                "P. Bến Nghé",
                "P. Bến Thành",
                "P. Cầu Kho",
                "P. Cầu Ông Lãnh",
                "P. Cô Giang",
            ],
            "Q. 3": [
                "P. 1",
                "P. 2",
                "P. 3",
                "P. 4",
                "P. 5",
            ],
            "Q. Bình Thạnh": [
                "P. 1",
                "P. 2",
                "P. 3",
                "P. 13",
                "P. 14",
            ],
        },
        "Đà Nẵng": {
            "Q. Hải Châu": [
                "P. Hải Châu 1",
                "P. Hải Châu 2",
                "P. Thanh Bình",
                "P. Thuận Phước",
                "P. Thạch Thang",
            ],
            "Q. Thanh Khê": [
                "P. An Khê",
                "P. Chính Gián",
                "P. Hòa Khê",
                "P. Tam Thuận",
                "P. Thanh Khê Đông",
            ],
        },
        "Hải Phòng": {
            "Q. Hồng Bàng": [
                "P. Cầu Đất",
                "P. Dư Hàng Kênh",
                "P. Hoàng Văn Thụ",
                "P. Minh Khai",
                "P. Nam Sơn",
            ],
            "Q. Ngô Quyền": [
                "P. Cầu Đỏ",
                "P. Cầu Tre",
                "P. Đồng Khôi",
                "P. Lạc Viên",
                "P. Máy Tơ",
            ],
        },
        "Cần Thơ": {
            "Q. Ninh Kiều": [
                "P. An Bình",
                "P. An Cư",
                "P. An Hòa",
                "P. An Khánh",
                "P. An Nghiệp",
            ],
            "Q. Bình Thủy": [
                "P. An Thới",
                "P. Bình Thủy",
                "P. Bình Thới",
                "P. Cái Khế",
                "P. Long Hòa",
            ],
        },
    };

    const cities = Object.keys(addressData);

    const getDistrictsByCity = (city) => {
        if (!city || !addressData[city]) return [];
        const districts = Object.keys(addressData[city]);
        // console.log('Districts for', city, ':', districts);
        return districts;
    };

    const getWardsByDistrict = (city, district) => {
        if (!city || !district || !addressData[city] || !addressData[city][district])
            return [];
        return addressData[city][district];
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        console.log('City changed to:', city);
        setSelectedCity(city);
        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e) => {
        const district = e.target.value;
        console.log('District changed to:', district);
        setSelectedDistrict(district);
        setSelectedWard('');
    };

    const handleWardChange = (e) => {
        const ward = e.target.value;
        console.log('Ward changed to:', ward);
        setSelectedWard(ward);
    };

    // const handleCheckoutSubmit = (Data) => {
    //     // console.log('Thông tin người mua:', Data);
        
    //     // console.log('Sản phẩm đã chọn:', selectedItems);
    
    //     // Xóa các sản phẩm đã chọn khỏi giỏ hàng
    //     // selectedItems.forEach(itemId => {
    //     //   dispatch(removeFromCart(itemId));
    //     // });
    
    //     // Reset selected items
    //     // setSelectedItems([]);
    
    //     // Xử lý logic đặt hàng ở đây
    //     // alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    //     // setShowCheckoutForm(false);
    // };

    const onFormSubmit = (data) => {
        // Validate address fields manually
        // if (!selectedCity) {
        //     alert('Vui lòng chọn tỉnh/thành phố');
        //     return;
        // }
        // if (!selectedDistrict) {
        //     alert('Vui lòng chọn quận/huyện');
        //     return;
        // }
        // if (!selectedWard) {
        //     alert('Vui lòng chọn phường/xã');
        //     return;
        // }

        // const fullAddress = `${data.addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedCity}`;
        // onSubmit({ ...data, address: fullAddress });


        // onSubmit(data);
        // const fullAddress =  `${data.fullName}, ${data.phone}, ${data.email}, ${selectedWard}, ${selectedDistrict},${selectedCity},${data.addressDetail}`;

        onSubmit(data);
    };

    return (
        <div className="checkout-form-overlay">
            <div className="checkout-form-container">
                <div className="checkout-form-header">
                    <h2>Thông tin người mua hàng</h2>
                    {/* <button className="close-btn" onClick={onCancel}>×</button> */}
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="checkout-form">   
                    <div className="form-group">
                        <label htmlFor="fullName">Họ và tên *</label>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="Nhập họ và tên của bạn"
                            {...register('fullName', {
                                required: 'Vui lòng nhập họ và tên',
                                minLength: {
                                    value: 2,
                                    message: 'Họ và tên phải có ít nhất 2 ký tự'
                                }
                            })}
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại *</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Nhập số điện thoại của bạn"
                            {...register('phone', {
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: /(0[3-9])+([0-9]{8})\b/,
                                    message: 'Số điện thoại không hợp lệ'
                                }
                            })}
                        />
                        {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            {...register('email', {
                                required: 'Vui lòng nhập email',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email không hợp lệ'
                                }
                            })}
                        />
                        {errors.email && <span className="error-message">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">Tỉnh/Thành phố *</label>
                        <select
                            id="city"
                            {...register("city", {
                                required: "Vui lòng chọn tỉnh/thành phố",
                            })}
                            value={selectedCity}
                            onChange={handleCityChange}
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
                        {errors.city && <span className="error-message">{errors.city.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="district">Quận/Huyện *</label>
                        <select
                            id="district"
                            {...register("district", {
                                required: "Vui lòng chọn quận/huyện",
                            })}
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            disabled={!selectedCity}
                            className={selectedDistrict ? "selected" : ""}
                        >
                            <option value="" disabled hidden>
                                Vui lòng chọn quận/huyện
                            </option>

                            {(() => {
                                const districts = getDistrictsByCity(selectedCity);
                                // console.log('Rendering districts for', selectedCity, ':', districts);
                                return districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ));
                            })()}

                        </select>
                        {errors.district && <span className="error-message">{errors.district.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="ward">Phường/Xã *</label>
                        <select
                            id="ward"
                            {...register("ward", {
                                required: "Vui lòng chọn phường/xã",
                            })}
                            value={selectedWard}
                            onChange={handleWardChange}
                            disabled={!selectedDistrict}
                            className={selectedWard ? "selected" : ""}
                        >
                            <option value="" disabled hidden>
                                Vui lòng chọn phường/xã
                            </option>

                            {getWardsByDistrict(selectedCity, selectedDistrict).map((ward) => (
                                <option key={ward} value={ward}>
                                    {ward}
                                </option>
                            ))}

                        </select>
                        {errors.ward && <span className="error-message">{errors.ward.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="addressDetail">Địa chỉ chi tiết *</label>
                        <textarea
                            id="addressDetail"
                            // rows="2"
                            placeholder="Nhập số nhà, tên đường..."
                            {...register('addressDetail', {
                                required: 'Vui lòng nhập địa chỉ chi tiết',
                                minLength: {
                                    value: 5,
                                    message: 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'
                                }
                            })}
                        />
                        {errors.addressDetail && <span className="error-message">{errors.addressDetail.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Ghi chú (tùy chọn)</label>
                        <textarea
                            id="note"
                            // rows="2"
                            placeholder="Ghi chú thêm về đơn hàng của bạn"
                            {...register('note')}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-submit">
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
