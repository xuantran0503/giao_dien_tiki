# Giải thích chi tiết CheckoutForm.jsx

## Tổng quan
File này là một React component dùng để hiển thị form nhập thông tin người mua hàng. Component sử dụng `react-hook-form` để quản lý form và Redux để lưu trữ dữ liệu.

---

## Giải thích từng dòng code

### Import các thư viện (Dòng 1-5)
```javascript
import React from 'react';
```
- Import thư viện React để tạo component

```javascript
import { useForm } from 'react-hook-form';
```
- Import hook `useForm` từ thư viện `react-hook-form`
- Dùng để quản lý form: validation, submit, reset...

```javascript
import { useDispatch } from 'react-redux';
```
- Import hook `useDispatch` từ Redux
- Dùng để gửi (dispatch) các action đến Redux store

```javascript
import { saveCheckout } from '../../store/checkoutSlice';
```
- Import action `saveCheckout` từ Redux slice
- Action này dùng để lưu thông tin đơn hàng vào Redux store

```javascript
import './CheckoutForm.css';
```
- Import file CSS để style cho component

---

### Khai báo Component (Dòng 7)
```javascript
const CheckoutForm = ({ onSubmit, onCancel, meta }) => {
```
- Tạo functional component tên `CheckoutForm`
- Nhận 3 props:
  - `onSubmit`: Hàm callback được gọi khi submit form thành công
  - `onCancel`: Hàm callback được gọi khi người dùng hủy
  - `meta`: Dữ liệu bổ sung (ví dụ: danh sách sản phẩm đã chọn)

---

### Khởi tạo hooks (Dòng 8-9)
```javascript
const dispatch = useDispatch();
```
- Tạo hàm `dispatch` để gửi action đến Redux store

```javascript
const { register, handleSubmit, formState: { errors }, reset } = useForm();
```
- Khởi tạo `react-hook-form` và lấy ra các hàm/object cần thiết:
  - `register`: Đăng ký input field với validation
  - `handleSubmit`: Xử lý submit form
  - `formState.errors`: Object chứa các lỗi validation
  - `reset`: Hàm reset form về trạng thái ban đầu

---

### Hàm xử lý submit (Dòng 11-27)
```javascript
const onFormSubmit = async (data) => {
```
- Hàm xử lý khi form được submit
- `data`: Object chứa dữ liệu từ tất cả các input field

```javascript
const payload = { ...data, meta: meta || null, createdAt: Date.now() };
```
- Tạo object `payload` bao gồm:
  - `...data`: Spread toàn bộ dữ liệu form (fullName, phone, email, addressDetail, note)
  - `meta`: Dữ liệu bổ sung (danh sách sản phẩm)
  - `createdAt`: Timestamp thời điểm tạo đơn hàng

```javascript
dispatch(saveCheckout(payload));
```
- Gửi action `saveCheckout` với payload đến Redux store
- Lưu thông tin đơn hàng vào Redux để component BuyerInfo có thể đọc

```javascript
if (typeof onSubmit === 'function') {
```
- Kiểm tra xem prop `onSubmit` có phải là function không

```javascript
const res = onSubmit(payload);
```
- Gọi hàm callback `onSubmit` từ component cha
- Truyền `payload` vào để component cha xử lý (ví dụ: xóa sản phẩm khỏi giỏ hàng)

```javascript
if (res && typeof res.then === 'function') {
    await res;
}
```
- Kiểm tra xem `onSubmit` có trả về Promise không
- Nếu có, đợi Promise hoàn thành (hỗ trợ async function)

```javascript
reset();
```
- Reset form về trạng thái ban đầu (xóa sạch các input)
- Dữ liệu vẫn được lưu trong Redux

```javascript
console.log('Thông tin người mua :', payload);
```
- In thông tin đơn hàng ra console để debug

---

### Render JSX (Dòng 30-126)

#### Overlay và Container (Dòng 31-32)
```javascript
<div className="checkout-form-overlay">
    <div className="checkout-form-container">
```
- `checkout-form-overlay`: Lớp phủ mờ toàn màn hình
- `checkout-form-container`: Container chứa form, hiển thị ở giữa màn hình

#### Header (Dòng 33-35)
```javascript
<div className="checkout-form-header">
    <h2>Thông tin người mua hàng</h2>
</div>
```
- Tiêu đề của form

#### Form Element (Dòng 37)
```javascript
<form onSubmit={handleSubmit(onFormSubmit)} className="checkout-form">
```
- Thẻ `<form>` với event `onSubmit`
- `handleSubmit(onFormSubmit)`: `react-hook-form` sẽ validate trước, nếu pass mới gọi `onFormSubmit`

#### Input Họ và tên (Dòng 38-53)
```javascript
<div className="form-group">
    <label htmlFor="fullName">Họ và tên *</label>
```
- Label cho input, `*` nghĩa là bắt buộc

```javascript
<input
    id="fullName"
    type="text"
    placeholder="Nhập họ và tên của bạn"
    {...register('fullName', {
```
- Input field với id và placeholder
- `{...register('fullName', {...})}`: Đăng ký field với `react-hook-form`

```javascript
required: 'Vui lòng nhập họ và tên',
```
- Validation: Bắt buộc nhập, nếu không sẽ hiện message này

```javascript
minLength: {
    value: 2,
    message: 'Họ và tên phải có ít nhất 2 ký tự'
}
```
- Validation: Tối thiểu 2 ký tự

```javascript
{errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
```
- Nếu có lỗi validation, hiển thị message lỗi

#### Input Số điện thoại (Dòng 55-70)
```javascript
<input
    id="phone"
    type="tel"
    {...register('phone', {
        required: 'Vui lòng nhập số điện thoại',
        pattern: {
            value: /(0[3-9])+([0-9]{8})\b/,
            message: 'Số điện thoại không hợp lệ'
        }
    })}
/>
```
- Input type `tel` cho số điện thoại
- Validation:
  - Bắt buộc nhập
  - Phải khớp với regex: Bắt đầu bằng 0[3-9], theo sau là 8 chữ số

#### Input Email (Dòng 72-87)
```javascript
<input
    id="email"
    type="email"
    {...register('email', {
        required: 'Vui lòng nhập email',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email không hợp lệ'
        }
    })}
/>
```
- Input type `email`
- Validation:
  - Bắt buộc nhập
  - Phải khớp với regex email chuẩn

#### Textarea Địa chỉ (Dòng 89-103)
```javascript
<textarea
    id="addressDetail"
    {...register('addressDetail', {
        required: 'Vui lòng nhập địa chỉ chi tiết',
        minLength: {
            value: 3,
            message: 'Địa chỉ chi tiết phải có ít nhất 3 ký tự'
        }
    })}
/>
```
- Textarea cho địa chỉ chi tiết
- Validation: Bắt buộc, tối thiểu 3 ký tự

#### Textarea Ghi chú (Dòng 105-112)
```javascript
<textarea
    id="note"
    {...register('note')}
/>
```
- Textarea cho ghi chú
- Không có validation (tùy chọn)

#### Nút hành động (Dòng 114-122)
```javascript
<button type="button" className="btn-cancel" onClick={onCancel}>
    Hủy
</button>
```
- Nút Hủy: type `button` (không submit form)
- Gọi hàm `onCancel` khi click

```javascript
<button type="submit" className="btn-submit">
    Xác nhận đặt hàng
</button>
```
- Nút Submit: type `submit` sẽ trigger form submit
- Khi click, `handleSubmit` sẽ validate và gọi `onFormSubmit`

---

### Export Component (Dòng 129)
```javascript
export default CheckoutForm;
```
- Export component để sử dụng ở file khác

---

## Luồng hoạt động

1. **User nhập thông tin** vào các input field
2. **User click "Xác nhận đặt hàng"**
3. **react-hook-form validate** tất cả các field
4. **Nếu validation pass**:
   - Gọi `onFormSubmit` với dữ liệu form
   - Tạo `payload` (data + meta + createdAt)
   - Dispatch action `saveCheckout` → Lưu vào Redux
   - Gọi callback `onSubmit` từ component cha
   - Reset form
5. **Nếu validation fail**: Hiển thị lỗi dưới input tương ứng

---

## Tóm tắt

- **Mục đích**: Form thu thập thông tin người mua hàng
- **Công nghệ**: React + react-hook-form + Redux
- **Validation**: Họ tên, SĐT, Email, Địa chỉ (bắt buộc), Ghi chú (tùy chọn)
- **Lưu trữ**: Redux store (để BuyerInfo đọc được)
- **Callback**: Gọi `onSubmit` để component cha xử lý (xóa giỏ hàng, đóng form...)
