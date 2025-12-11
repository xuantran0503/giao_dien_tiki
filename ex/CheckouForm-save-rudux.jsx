import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { saveCheckout, selectCheckout } from '../../store/checkoutSlice';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, onCancel }) => {
    const dispatch = useDispatch();
    const persisted = useSelector(selectCheckout);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: persisted || undefined,
    });

    const onFormSubmit = (data) => {
        const payload = { ...data};
        // save to Redux
        dispatch(saveCheckout(payload));
        // call parent handler
        if (typeof onSubmit === 'function') onSubmit(payload);
        console.log('Thong tin nguoi mua hang:', payload);
    };

    return (
        <div className="checkout-form-overlay">
            <div className="checkout-form-container">
                <div className="checkout-form-header">
                    <h2>Thông tin người mua hàng</h2>
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
                        <label htmlFor="addressDetail">Địa chỉ chi tiết *</label>
                        <textarea
                            id="addressDetail"
                            placeholder="Nhập số nhà, tên đường..."
                            {...register('addressDetail', {
                                required: 'Vui lòng nhập địa chỉ chi tiết',
                                minLength: {
                                    value: 3,
                                    message: 'Địa chỉ chi tiết phải có ít nhất 3 ký tự'
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
 
