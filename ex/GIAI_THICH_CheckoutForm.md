# 📄 Giải Thích Chi Tiết: CheckoutForm.jsx

## 📌 Tổng Quan
File `CheckoutForm.jsx` là một component React dùng để tạo form nhập thông tin người mua hàng. Nó sử dụng `react-hook-form` để quản lý form validation và Redux để lưu dữ liệu.

---

## 📝 Chi Tiết Từng Dòng Code

### 1️⃣ Import Modules
```javascript
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { saveCheckout } from '../../store/checkoutSlice';
import './CheckoutForm.css';
```
**Giải thích:**
- `React`: Thư viện React core
- `useForm`: Hook từ react-hook-form để quản lý form (register, handleSubmit, formState, reset)
- `useDispatch`: Hook Redux để gửi actions đến store
- `saveCheckout`: Action creator từ Redux để lưu dữ liệu checkout
- `./CheckoutForm.css`: Import CSS styling cho component

---

### 2️⃣ Component Function
```javascript
const CheckoutForm = ({ onSubmit, onCancel, meta }) => {
```
**Giải thích:**
- `CheckoutForm`: Functional component React
- `{ onSubmit, onCancel, meta }`: Props được truyền vào:
  - `onSubmit`: Function callback khi form được submit
  - `onCancel`: Function callback khi click nút Hủy
  - `meta`: Dữ liệu metadata (ví dụ: danh sách sản phẩm)

---

### 3️⃣ Khai Báo Hooks
```javascript
const dispatch = useDispatch();
const { register, handleSubmit, formState: { errors }, reset } = useForm();
```
**Giải thích:**
- `dispatch`: Gửi actions đến Redux store
- `register`: Hàm để kết nối input fields với react-hook-form
- `handleSubmit`: Wrapper cho form submission, validate và gọi callback
- `formState: { errors }`: Object chứa validation errors
- `reset`: Hàm để reset form về trạng thái ban đầu

---

### 4️⃣ Function onFormSubmit
```javascript
const onFormSubmit = async (data) => {
    const payload = { ...data, meta: meta || null, createdAt: Date.now() };
```
**Giải thích:**
- `data`: Object chứa tất cả dữ liệu input từ form
- `payload`: Tạo object mới gồm:
  - `...data`: Spread tất cả data input (fullName, phone, email, addressDetail, note)
  - `meta`: Metadata được truyền vào (nếu có)
  - `createdAt`: Timestamp lúc form submit

#### Lưu vào Redux
```javascript
dispatch(saveCheckout(payload));
```
**Giải thích:** Gửi action `saveCheckout` với payload để lưu dữ liệu vào Redux store (để BuyerInfo page có thể đọc)

#### Gọi Parent Callback
```javascript
if (typeof onSubmit === 'function') {
    const res = onSubmit(payload);
    if (res && typeof res.then === 'function') {
        await res;
    }
}
```
**Giải thích:**
- Kiểm tra `onSubmit` có phải function không
- Nếu có, gọi `onSubmit(payload)` 
- Nếu kết quả là Promise (có method `.then`), `await` để chờ
- Điều này cho phép parent component thực hiện async operations (như gọi API)

#### Reset Form
```javascript
reset();
```
**Giải thích:** Xóa hết giá trị input trong form (nhưng dữ liệu vẫn lưu ở Redux)

---

### 5️⃣ Return JSX - Structure Chính
```javascript
return (
    <div className="checkout-form-overlay">
        <div className="checkout-form-container">
            <div className="checkout-form-header">
                <h2>Thông tin người mua hàng</h2>
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} className="checkout-form">
```
**Giải thích:**
- `checkout-form-overlay`: Lớp ngoài (background overlay)
- `checkout-form-container`: Container chứa form
- `onSubmit={handleSubmit(onFormSubmit)}`: Gắn form handler - khi submit sẽ validate rồi gọi `onFormSubmit`

---

### 6️⃣ Fullname Input Field
```javascript
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
```
**Giải thích:**
- `register('fullName', {...})`: Đăng ký field này với react-hook-form
- **Validation rules:**
  - `required`: Bắt buộc nhập, lỗi: "Vui lòng nhập họ và tên"
  - `minLength: { value: 2, message: '...' }`: Tối thiểu 2 ký tự
- `errors.fullName` kiểm tra có lỗi không, nếu có hiển thị message

---

### 7️⃣ Phone Input Field
```javascript
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
```
**Giải thích:**
- `type="tel"`: Input type điện thoại
- **Validation rules:**
  - `required`: Bắt buộc
  - `pattern: { value: /(0[3-9])+([0-9]{8})\b/, ... }`: Regex để kiểm tra:
    - `0[3-9]`: Bắt đầu bằng 0 + (1 chữ số từ 3-9)
    - `[0-9]{8}`: Theo sau 8 chữ số
    - Ví dụ hợp lệ: 0383477786, 0912345678

---

### 8️⃣ Email Input Field
```javascript
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
```
**Giải thích:**
- `type="email"`: HTML5 email input
- **Pattern validation:** Regex email tiêu chuẩn
  - `^[A-Z0-9._%+-]+`: Phần local (trước @)
  - `@[A-Z0-9.-]+`: Domain
  - `\.[A-Z]{2,}$`: TLD (ít nhất 2 ký tự)
  - `/i`: Case-insensitive flag

---

### 9️⃣ Address Input - Textarea
```javascript
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
```
**Giải thích:**
- `textarea`: Cho phép nhập nhiều dòng
- **Validation:** Bắt buộc + tối thiểu 3 ký tự

---

### 🔟 Note Field (Optional)
```javascript
<div className="form-group">
    <label htmlFor="note">Ghi chú (tùy chọn)</label>
    <textarea
        id="note"
        placeholder="Ghi chú thêm về đơn hàng của bạn"
        {...register('note')}
    />
</div>
```
**Giải thích:**
- `register('note')` mà **không có validation rules** = field này không bắt buộc
- Người dùng có thể bỏ trống

---

### 1️⃣1️⃣ Form Actions - Buttons
```javascript
<div className="form-actions">
    <button type="button" className="btn-cancel" onClick={onCancel}>
        Hủy
    </button>

    <button type="submit" className="btn-submit">
        Xác nhận đặt hàng
    </button>
</div>
```
**Giải thích:**
- `type="button"` + `onClick={onCancel}`: Nút Hủy gọi callback `onCancel` từ parent
- `type="submit"`: Nút gửi form, trigger `handleSubmit(onFormSubmit)`

---

### 1️⃣2️⃣ Export Component
```javascript
export default CheckoutForm;
```
**Giải thích:** Export component để dùng ở nơi khác (CartPage)

---

## 🔄 Flow Tóm Tắt
1. User nhập thông tin vào form
2. Click "Xác nhận đặt hàng"
3. `handleSubmit` validate tất cả fields
4. Nếu valid → gọi `onFormSubmit(data)`
5. `onFormSubmit`:
   - Tạo payload với metadata
   - Dispatch `saveCheckout(payload)` → lưu Redux + localStorage
   - Gọi `onSubmit` callback từ CartPage
   - Reset form input
6. CartPage nhận callback → xóa items khỏi cart, hiển thị alert

---

## 🎯 Redux Integration
- **saveCheckout**: Lưu dữ liệu checkout vào Redux store
- Dữ liệu sẽ được đọc bởi **BuyerInfo.jsx** để hiển thị lịch sử đơn hàng
- Dữ liệu cũng được lưu vào `localStorage` để persist khi reload page
