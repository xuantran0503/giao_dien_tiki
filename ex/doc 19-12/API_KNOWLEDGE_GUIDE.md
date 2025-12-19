# Hướng Dẫn Kiến Thức Về HTTPS, RESTful API và Cách Gọi API

Tài liệu này cung cấp các kiến thức cơ bản về giao thức HTTPS, kiến trúc RESTful API, khái niệm Request/Response và hướng dẫn cụ thể cách gọi API lấy danh sách sản phẩm.

---

## 1. HTTPS (Hypertext Transfer Protocol Secure)

**HTTPS** là phiên bản bảo mật của HTTP, giao thức được sử dụng để truyền tải dữ liệu giữa trình duyệt web và trang web.

- **Cơ chế:** HTTPS mã hóa dữ liệu truyền đi bằng giao thức **SSL/TLS** (Secure Sockets Layer/Transport Layer Security).
- **Tại sao cần HTTPS?**
  - **Bảo mật:** Ngăn chặn tin tặc nghe lén hoặc đánh cắp thông tin nhạy cảm (mật khẩu, thẻ tín dụng).
  - **Toàn vẹn dữ liệu:** Đảm bảo dữ liệu không bị thay đổi trên đường truyền.
  - **Xác thực:** Đảm bảo bạn đang kết nối đúng với máy chủ mong muốn chứ không phải một trang web giả mạo.

---

## 2. RESTful API

**REST (Representational State Transfer)** là một kiểu kiến trúc phần mềm cho các hệ thống phân tán như World Wide Web. Một API tuân theo các nguyên tắc của REST được gọi là **RESTful API**.

- **Resource (Tài nguyên):** Trong REST, mọi thứ đều là tài nguyên (Sản phẩm, Người dùng, Đơn hàng...) và được định danh bằng một URL (ví dụ: `/products`, `/users`).
- **Stateless:** Mỗi request từ client lên server phải chứa đầy đủ thông tin để server hiểu và xử lý, server không lưu trữ trạng thái của client giữa các lần gọi.
- **Các phương thức (Methods) phổ biến:**
  - `GET`: Lấy dữ liệu.
  - `POST`: Tạo mới dữ liệu.
  - `PUT`: Cập nhật toàn bộ dữ liệu.
  - `PATCH`: Cập nhật một phần dữ liệu.
  - `DELETE`: Xóa dữ liệu.

---

## 3. Request và Response

Đây là mô hình giao tiếp cơ bản giữa Client (Ứng dụng của bạn) và Server.

### Request (Yêu cầu)

Khi bạn muốn lấy dữ liệu hoặc gửi dữ liệu, bạn gửi một Request. Một Request bao gồm:

- **URL (Endpoint):** Địa chỉ của API (ví dụ: `https://api.example.com/v1/products`).
- **Method:** Phương thức (GET, POST, ...).
- **Headers:** Thông tin bổ sung (ví dụ: `Content-Type: application/json`, `Authorization: Bearer <token>`).
- **Body (Payload):** Dữ liệu gửi kèm (thường dùng cho POST/PUT).

### Response (Phản hồi)

Server nhận Request, xử lý và trả về Response:

- **Status Code:** Mã trạng thái (ví dụ: `200 OK` cho thành công, `404 Not Found` cho lỗi không tìm thấy, `500` lỗi server).
- **Headers:** Thông tin phản hồi từ server.
- **Body:** Dữ liệu server trả về (thường là định dạng JSON).

---

## 4. Hướng dẫn gọi API lấy danh sách sản phẩm

Bạn cần sử dụng endpoint `/api-end-user/listing/get-by-page` để lấy danh sách sản phẩm.

### Thông tin Request

- **Endpoint:** `/api-end-user/listing/get-by-page`
- **Method:** `POST` (Dựa trên cấu trúc payload phức tạp, thông thường các API lấy dữ liệu theo trang có lọc sẽ dùng POST).
- **AId:** `da1e0cd8-f73b-4da2-acf2-8ddc621bcf75`

### Cấu trúc dữ liệu gửi đi (Payload)

```json
{
  "PageIndex": 1,
  "PageSize": 10,
  "FieldName": "",
  "Orderby": "",
  "Filter": [],
  "Keyword": "",
  "LanguageCode": "vi-VN",
  "CurrencyCode": "VND",
  "ProductsId": null,
  "AId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
  "WareHouseId": null,
  "ListingPropertyCode": "",
  "CustomerId": null
}
```

### Ví dụ code sử dụng Axios trong JavaScript/React

Dưới đây là cách bạn có thể triển khai hàm gọi API này:

```javascript
import axios from "axios";

const fetchProducts = async () => {
  const url = "https://YOUR_API_DOMAIN/api-end-user/listing/get-by-page";

  const payload = {
    PageIndex: 1,
    PageSize: 20,
    FieldName: "",
    Orderby: "",
    Filter: [],
    Keyword: "",
    LanguageCode: "vi",
    CurrencyCode: "VND",
    AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
  };

  try {
    const response = await axios.post(url, payload);
    console.log("Danh sách sản phẩm:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
};
```

**Lưu ý:**

- Thay `https://YOUR_API_DOMAIN` bằng domain thật của API bạn đang dùng.
- Đảm bảo bạn đã cài đặt thư viện axios (`npm install axios`).

---

## 5. Lỗi CORS (Cross-Origin Resource Sharing)

Khi bạn chạy ở `localhost:3000` và gọi API tới `tiki.vn`, trình duyệt sẽ chặn yêu cầu này vì lý do bảo mật. Đây gọi là lỗi CORS.

### Tại sao bị lỗi?

Trình duyệt không cho phép mã nguồn từ domain này (`localhost`) lấy dữ liệu từ domain khác (`tiki.vn`) nếu server đó không cho phép cụ thể.

### Cách khắc phục khi phát triển (Development)

#### Cách 1: Sử dụng Proxy trong `package.json` (Khuyên dùng cho React)

Mở file `package.json` và thêm dòng sau vào cuối (trước dấu đóng ngoặc nhọn cuối cùng):

```json
"proxy": "https://tiki.vn"
```

Sau đó trong code, bạn không dùng URL tuyệt đối nữa mà dùng URL tương đối:

- Thay: `https://tiki.vn/api-end-user/...`
- Thành: `/api-end-user/...`

**Lưu ý:** Bạn cần khởi động lại server (`npm start`) sau khi sửa `package.json`.

#### Cách 2: Sử dụng Extension trình duyệt

Cài đặt extension như **"Allow CORS: Access-Control-Allow-Origin"** trên Chrome để tạm thời bỏ qua kiểm tra này. (Chỉ dùng để test nhanh).

#### Cách 3: Thiết lập Proxy nâng cao (nếu cần xử lý nhiều domain)

Sử dụng thư viện `http-proxy-middleware` để tạo file `src/setupProxy.js`.

```

```
