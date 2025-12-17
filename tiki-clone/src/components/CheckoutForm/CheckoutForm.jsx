import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addCheckout } from '../../store/checkoutSlice';
import { selectSelectedAddress } from '../../store/addressSlice';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, onCancel, onClose, meta }) => {
    const dispatch = useDispatch();
    const selectedAddress = useSelector(selectSelectedAddress);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm();
    const isSubmittingRef = useRef(false);
    
    const [notification, setNotification] = useState(null);
    
    // Watch addressDetail field for character count
    const addressDetailValue = watch('addressDetail', '');

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => {
            setNotification(null);
        }, 5000); // Hide after 5 seconds
    };

    const onFormSubmit = async (data) => {
        // Prevent double submission using ref
        // if (isSubmittingRef.current || isSubmitting) {
        //     console.log("Form is already submitting, ignoring...");
        //     return;
        // }

        // isSubmittingRef.current = true;
        // console.log("Starting form submission...");
        // console.log("Form data received:", data);
        // console.log("Address detail length:", data.addressDetail?.length);
        // console.log("Selected address:", selectedAddress);
        
        try {
            // Validate that all required fields are present
            // if (!data.fullName || !data.phone || !data.email || !data.addressDetail) {
            //     console.error("Missing required fields:", {
            //         fullName: !!data.fullName,
            //         phone: !!data.phone,
            //         email: !!data.email,
            //         addressDetail: !!data.addressDetail
            //     });
            //     showNotification('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
            //     isSubmittingRef.current = false; // Reset flag on validation error
            //     return;
            // }

            // Validate selected address
            // if (!selectedAddress || selectedAddress.trim() === '') {
            //     console.error("No address selected");
            //     showNotification('error', 'Vui lòng chọn địa chỉ giao hàng!');
            //     isSubmittingRef.current = false; // Reset flag on validation error
            //     return;
            // }

            // Lưu địa chỉ tại thời điểm mua hàng (snapshot)
            const addressSnapshot = {
                detailedAddress: data.addressDetail.trim(),
                generalAddress: selectedAddress.trim(),
                timestamp: new Date().toISOString()
            };

            // Tạo đúng cấu trúc CheckoutData theo interface
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 11);
            const checkoutData = {
                id: `order_${timestamp}_${randomId}`,
                items: meta.items || [], // Danh sách sản phẩm được mua
                totalAmount: meta.totalAmount || 0,
                deliveryAddress: `Địa chỉ chi tiết: ${data.addressDetail}\nĐịa chỉ: ${selectedAddress}`,
                paymentMethod: "COD", 
                orderDate: new Date().toISOString(),
                status: "pending",
                customerInfo: {
                    fullName: data.fullName,
                    phone: data.phone,
                    email: data.email,
                    note: data.note || ""
                },
                
                addressSnapshot: addressSnapshot
            };
            
            // console.log("Đơn hàng sẽ được tạo:", checkoutData);
            // console.log("Delivery address length:", checkoutData.deliveryAddress.length);
            
            // Lưu vào checkout history
            dispatch(addCheckout(checkoutData));
            console.log("Order added to checkout history");
            
            // Show success notification first
            showNotification('success', 'Đặt hàng thành công! ');
            
            // Gọi callback để xử lý logic khác (xóa khỏi cart, etc.)
            if (onSubmit && typeof onSubmit === 'function') {
                // console.log("Calling onSubmit callback with data:", checkoutData);
                try {
                    onSubmit(checkoutData);
                    // console.log("onSubmit callback completed successfully");
                } catch (callbackError) {
                    console.error("Error in onSubmit callback:", callbackError);
                }
            } else {
                console.warn("onSubmit callback is not a function or is undefined");
            }
            
            reset();
            console.log("Form submission completed!");
            
            // Close form after successful submission
            setTimeout(() => {
                if (onClose && typeof onClose === 'function') {
                    onClose();
                } else if (onCancel && typeof onCancel === 'function') {
                    onCancel();
                }
            }, 1000); // Close after 1 seconds
        } catch (error) {
            console.error("Error during form submission:", error);
            showNotification('error', 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        } finally {
            // Reset flag sau khi hoàn thành
            setTimeout(() => {
                isSubmittingRef.current = false;
            }, 1000); // Đợi 1 giây trước khi cho phép submit lại
        }
    };

    return (
        <div className="checkout-form-overlay">
            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        <span className="notification-icon">
                            {notification.type === 'success' ? '✓' : '✕'}
                        </span>
                        <span className="notification-message">{notification.message}</span>
                        <button 
                            className="notification-close"
                            onClick={() => setNotification(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="checkout-form-container">
                <div className="checkout-form-header">
                    <h2>Thông tin người mua hàng</h2>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="checkout-form">
                    {/* Debug form errors */}
                    {Object.keys(errors).length > 0 && (
                        <div style={{ background: '#ffebee', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                            <strong>Form Errors:</strong>
                            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field} style={{ color: '#d32f2f' }}>
                                        {field}: {error.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                
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
                                    value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                    message: 'Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 03, 05, 07, 08, 09)'
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
                        <label htmlFor="addressDetail">
                            Địa chỉ chi tiết * 
                            <span className={`character-count ${addressDetailValue.length > 250 ? 'warning' : ''} ${addressDetailValue.length >= 300 ? 'error' : ''}`}>
                                ({addressDetailValue.length}/300 ký tự)
                            </span>
                        </label>
                        <textarea
                            id="addressDetail"
                            placeholder="Nhập số nhà, tên đường..."
                            rows="3"
                            {...register('addressDetail', {
                                required: 'Vui lòng nhập địa chỉ chi tiết',
                                minLength: {
                                    value: 3,
                                    message: 'Địa chỉ chi tiết phải có ít nhất 3 ký tự'
                                },
                                maxLength: {
                                    value: 300,
                                    message: 'Địa chỉ chi tiết không được vượt quá 300 ký tự'
                                }
                            })}
                        />
                        {errors.addressDetail && <span className="error-message">{errors.addressDetail.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Ghi chú (tùy chọn)</label>
                        <textarea
                            id="note"
                            placeholder="Ghi chú thêm về đơn hàng của bạn"
                            {...register('note')}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Hủy
                        </button>

                        <button type="submit" className="btn-submit" disabled={isSubmitting || isSubmittingRef.current}>
                            {(isSubmitting || isSubmittingRef.current) ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
