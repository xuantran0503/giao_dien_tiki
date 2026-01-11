# Giải thích chi tiết file `src/components/CheckoutForm/CheckoutForm.jsx`

File này là component hiển thị form nhập thông tin người mua hàng khi thanh toán.

## 1. Import thư viện và tài nguyên

```javascript
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { saveCheckout } from "../../store/checkoutSlice";
import "./CheckoutForm.css";
```

- `React`: Thư viện cốt lõi để xây dựng giao diện.
- `useForm`: Hook từ thư viện `react-hook-form`, giúp quản lý form (nhập liệu, validate lỗi, xử lý submit) dễ dàng và hiệu quả hơn.
- `useDispatch`: Hook của Redux, dùng để gửi (dispatch) các hành động (actions) lên store để cập nhật dữ liệu chung.
- `saveCheckout`: Action được import từ `checkoutSlice`, dùng để lưu thông tin đơn hàng vào Redux store.
- `./CheckoutForm.css`: File CSS chứa các style giao diện cho form này.

## 2. Khai báo Component và Props

```javascript
const CheckoutForm = ({ onSubmit, onCancel, meta }) => {
```

- `CheckoutForm`: Tên component.
- Nhận vào 3 props (tham số):
  - `onSubmit`: Hàm callback sẽ được gọi khi form submit thành công (thường dùng để xử lý logic sau khi lưu, ví dụ: chuyển trang, thông báo).
  - `onCancel`: Hàm callback được gọi khi người dùng nhấn nút "Hủy" (thường để đóng form).
  - `meta`: Dữ liệu bổ sung (metadata) về đơn hàng, ví dụ: danh sách sản phẩm trong giỏ hàng, tổng tiền... để lưu kèm với thông tin người mua.

## 3. Khởi tạo Hooks

```javascript
const dispatch = useDispatch();
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm();
```

- `dispatch`: Hàm để gửi action lên Redux.
- `useForm()`: Khởi tạo form management.
  - `register`: Hàm dùng để đăng ký các ô input vào hook form (để theo dõi giá trị và validate).
  - `handleSubmit`: Hàm bọc logic xử lý khi submit form. Nó sẽ chạy validate trước, nếu ok mới gọi hàm `onFormSubmit` của mình.
  - `errors`: Đối tượng chứa các lỗi validate (nếu có).
  - `reset`: Hàm để reset form về trạng thái ban đầu (trống).

## 4. Hàm xử lý Submit Form

```javascript
const onFormSubmit = async (data) => {
  const payload = { ...data, meta: meta || null };

  dispatch(saveCheckout(payload));

  if (onSubmit) {
    await onSubmit(payload);
  }
  reset();
  console.log("thông tin người mua hàng", payload);
};
```

- `data`: Dữ liệu từ các ô input (họ tên, sđt, email...) do `react-hook-form` gom lại.
- `payload`: Tạo một object mới gộp `data` (thông tin người mua) và `meta` (thông tin giỏ hàng/sản phẩm).
- `dispatch(saveCheckout(payload))`: Gửi action `saveCheckout` kèm dữ liệu `payload` lên Redux store để lưu lại đơn hàng.
- `if (onSubmit)`: Kiểm tra xem component cha có truyền hàm `onSubmit` xuống không. Nếu có thì gọi nó.
- `reset()`: Xóa trắng các ô input sau khi gửi thành công.
- `console.log(...)`: In ra console để debug.

## 5. Giao diện (JSX)

```javascript
    return (
        <div className="checkout-form-overlay">
            <div className="checkout-form-container">
                <div className="checkout-form-header">
                    <h2>Thông tin người mua hàng</h2>
                </div>
```

- `checkout-form-overlay`: Lớp phủ mờ nền (thường dùng cho modal/popup).
- `checkout-form-container`: Khung chứa chính của form.
- `checkout-form-header`: Tiêu đề form.

## 6. Thẻ Form và Input

```javascript
                <form onSubmit={handleSubmit(onFormSubmit)} className="checkout-form">
```

- `onSubmit={handleSubmit(onFormSubmit)}`: Khi nhấn nút submit, `react-hook-form` sẽ chạy `handleSubmit`. Nếu validate thành công, nó sẽ gọi `onFormSubmit` đã định nghĩa ở trên.

### 6.1. Input Họ và tên

```javascript
<div className="form-group">
  <label htmlFor="fullName">Họ và tên *</label>
  <input
    id="fullName"
    type="text"
    placeholder="Nhập họ và tên của bạn"
    {...register("fullName", {
      required: "Vui lòng nhập họ và tên",
      minLength: {
        value: 2,
        message: "Họ và tên phải có ít nhất 2 ký tự",
      },
    })}
  />
  {errors.fullName && (
    <span className="error-message">{errors.fullName.message}</span>
  )}
</div>
```

- `{...register('fullName', ...)}`: Đăng ký input này với tên là `fullName`.
- Validate:
  - `required`: Bắt buộc nhập.
  - `minLength`: Tối thiểu 2 ký tự.
- `errors.fullName`: Nếu có lỗi ở trường `fullName`, hiển thị thông báo lỗi.

### 6.2. Input Số điện thoại

```javascript
<div className="form-group">
  <label htmlFor="phone">Số điện thoại *</label>
  <input
    // ...
    {...register("phone", {
      required: "Vui lòng nhập số điện thoại",
      pattern: {
        value: /(0[3-9])+([0-9]{8})\b/,
        message: "Số điện thoại không hợp lệ",
      },
    })}
  />
  {errors.phone && (
    <span className="error-message">{errors.phone.message}</span>
  )}
</div>
```

- `pattern`: Sử dụng Regular Expression (Regex) để kiểm tra định dạng số điện thoại Việt Nam (bắt đầu bằng 03-09, theo sau là 8 số).

### 6.3. Input Email

```javascript
<div className="form-group">
  <label htmlFor="email">Email *</label>
  <input
    // ...
    {...register("email", {
      required: "Vui lòng nhập email",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email không hợp lệ",
      },
    })}
  />
  {errors.email && (
    <span className="error-message">{errors.email.message}</span>
  )}
</div>
```

- `pattern`: Regex kiểm tra định dạng email chuẩn (có @, có dấu chấm domain...).

### 6.4. Input Địa chỉ

```javascript
<div className="form-group">
  <label htmlFor="addressDetail">Địa chỉ chi tiết *</label>
  <textarea
    // ...
    {...register("addressDetail", {
      required: "Vui lòng nhập địa chỉ chi tiết",
      minLength: {
        value: 3,
        message: "Địa chỉ chi tiết phải có ít nhất 3 ký tự",
      },
    })}
  />
  {errors.addressDetail && (
    <span className="error-message">{errors.addressDetail.message}</span>
  )}
</div>
```

- Dùng thẻ `textarea` để nhập được nhiều dòng.
- Validate độ dài tối thiểu 3 ký tự.

### 6.5. Input Ghi chú

```javascript
<div className="form-group">
  <label htmlFor="note">Ghi chú (tùy chọn)</label>
  <textarea
    id="note"
    placeholder="Ghi chú thêm về đơn hàng của bạn"
    {...register("note")}
  />
</div>
```

- Trường này không có validate `required`, người dùng có thể bỏ trống.

## 7. Các nút hành động (Actions)

```javascript
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
```

- Nút "Hủy": `type="button"` (để không kích hoạt submit form), gọi hàm `onCancel` khi click.
- Nút "Xác nhận đặt hàng": `type="submit"`, khi click sẽ kích hoạt sự kiện `onSubmit` của form.

## 8. Export

```javascript
export default CheckoutForm;
```

- Xuất component để các file khác có thể import và sử dụng.
