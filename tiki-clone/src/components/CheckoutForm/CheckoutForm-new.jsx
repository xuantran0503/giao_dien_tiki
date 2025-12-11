import React from 'react';
import { useForm } from 'react-hook-form';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [selectedCity, setSelectedCity] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [selectedWard, setSelectedWard] = React.useState('');
    const [addressData, setAddressData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // Gọi API để lấy dữ liệu địa chỉ thực
    React.useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=3")
            .then(res => res.json())
            .then(data => {
                setAddressData(data);
                setLoading(false);
                console.log('API data loaded:', data);
            })
            .catch(err => {
                console.log("Lỗi API:", err);
                setLoading(false);
            });
    }, []);

    // Lấy danh sách districts theo city code
    const getDistrictsByCity = (cityCode) => {
        const city = addressData.find(c => c.code === Number(cityCode));
        return city ? city.districts : [];
    };

    // Lấy danh sách wards theo city code và district code
    const getWardsByDistrict = (cityCode, districtCode) => {
        const city = addressData.find(c => c.code === Number(cityCode));
        if (!city) return [];

        const district = city.districts.find(d => d.code === Number(districtCode));
        return district ? district.wards : [];
    };

    const handleCityChange = (e) => {
        const cityCode = e.target.value;
        console.log('City changed to:', cityCode);
        setSelectedCity(cityCode);
        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        console.log('District changed to:', districtCode);
        setSelectedDistrict(districtCode);
        setSelectedWard('');
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        console.log('Ward changed to:', wardCode);
        setSelectedWard(wardCode);
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
        // Tìm tên city, district, ward từ code
        const city = addressData.find(c => c.code === Number(data.city));
        const district = getDistrictsByCity(data.city).find(d => d.code === Number(data.district));
        const ward = getWardsByDistrict(data.city, data.district).find(w => w.code === Number(data.ward));

        // Tạo địa chỉ đầy đủ
        const fullAddress = `${data.addressDetail}, ${ward?.name || ''}, ${district?.name || ''}, ${city?.name || ''}`;

        console.log('Thông tin người mua :', { ...data, fullAddress });
        onSubmit({ ...data, fullAddress });
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
                            disabled={loading}
                        >
                            <option value="" disabled hidden>
                                {loading ? "Đang tải..." : "Vui lòng chọn tỉnh/thành phố"}
                            </option>

                            {addressData.map((city) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
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

                            {getDistrictsByCity(selectedCity).map((district) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}

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
                                <option key={ward.code} value={ward.code}>
                                    {ward.name}
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
