# GIẢI THÍCH CHI TIẾT LOGIC TRANG CHI TIẾT SẢN PHẨM (ProductDetailPage)

Tư duy cốt lõi của đoạn code này là: **"Luôn có phương án dự phòng"**. Nếu dữ liệu chính thức từ API chưa về hoặc lỗi, ứng dụng sẽ lục lọi trong Giỏ hàng hoặc Bộ nhớ máy để hiển thị thông tin cho người dùng ngay lập tức.

---

### 1. Lấy dữ liệu từ Redux Store

```javascript
const { currentProduct: listingProduct, productDetailStatus: listingStatus } = useSelector(
  (state) => state.listing
);
const currentProduct = listingProduct;
```

- `useSelector`: Kết nối tới kho dữ liệu `listing`.
- `currentProduct: listingProduct`: Lấy dữ liệu sản phẩm chi tiết vừa tải xong từ API, đổi tên thành `listingProduct`.
- `productDetailStatus: listingStatus`: Lấy trạng thái tải (loading, success, failed).

### 2. Xử lý trạng thái hiển thị

```javascript
const productDetailStatus =
  listingStatus === 'pending' ? 'pending' : listingStatus === 'succeeded' ? 'succeeded' : 'idle';
```

- Chuẩn hóa các trạng thái để component biết khi nào nên hiện vòng quay Loading, khi nào hiện nội dung.

### 3. Thu thập thông tin định danh (ID) và nguồn dữ liệu phụ

```javascript
const { productId } = useParams(); // Lấy ID từ trên thanh địa chỉ URL
const { items: cartItems } = useSelector((state) => state.cart); // Lấy danh sách sản phẩm trong giỏ
const { products: allProducts } = useSelector((state) => state.listing); // Lấy danh sách sản phẩm từ Trang chủ
```

### 4. Tìm kiếm dữ liệu dự phòng (Optimistic Data)

```javascript
const location = useLocation();
const cartItemFromState = location.state?.cartItem; // Dữ liệu được truyền trực tiếp từ trang trước (nếu có)

// Tìm xem sản phẩm này có sẵn trong giỏ hàng không
const cartItemFromStore = cartItems.find(
  (item) => item.productId === productId || item.id === productId || item.listingId === productId
);

// cartItem là dữ liệu dự phòng tốt nhất có thể lấy được từ Giỏ hàng
const cartItem = cartItemFromState || cartItemFromStore;

// productFromListing là dữ liệu dự phòng lấy từ danh sách Trang chủ (thường chỉ có Ảnh và Tên)
const productFromListing = allProducts.find((p) => p.productId === productId || p.id === productId);
```

### 5. Tổng hợp đối tượng hiển thị (The Ultimate Product Object)

Đây là phần quan trọng nhất, nó quyết định người dùng thấy gì trên màn hình:

```javascript
const product = currentProduct
  ? { ... } // ƯU TIÊN 1: Dữ liệu đầy đủ nhất từ API chi tiết
  : cartItem
  ? { ... } // ƯU TIÊN 2: Nếu API chưa về, dùng dữ liệu trong Giỏ hàng
  : productFromListing
  ? { ... } // ƯU TIÊN 3: Nếu giỏ hàng không có, dùng dữ liệu từ Trang chủ
  : null;    // Cuối cùng: Nếu không có gì cả thì mới báo lỗi
```

- **Tại sao làm vậy?** Để người dùng thấy được Tên, Ảnh và Giá ngay lập tức khi vừa bấm vào, không phải nhìn màn hình trắng chờ API tải.

---

### 6. Cơ chế phân giải ID thông minh (useEffect 1)

Giúp khắc phục lỗi 400 khi ID trên URL là "Mã mua hàng" (Service ID) thay vì "Mã xem hàng" (Listing ID).

```javascript
useEffect(() => {
  if (productId) {
    const mappedIds = JSON.parse(localStorage.getItem('product_mapping') || '{}');

    // Tìm xem có ID nào "chuẩn" để gọi API không?
    const resolvedId =
      mappedIds[productId] || // 1. Tìm trong "từ điển" đã lưu ở máy
      cartListingId || // 2. Lấy listingId bóc tách từ Uri trong giỏ hàng
      listingStoreId || // 3. Lấy Id từ danh sách trang chủ
      productId; // 4. Nếu chịu hết cách thì dùng chính ID trên URL

    dispatch(fetchProductById(resolvedId)); // Gọi API với ID chuẩn nhất
    dispatch(fetchCartDetail());
  }
}, [dispatch, productId, cartListingId, listingStoreId]);
```

### 7. Cơ chế tự học - Self Correction (useEffect 2)

Sau khi API trả về thành công, ứng dụng sẽ "học" cách ánh xạ ID để lần sau không bị lạc đường.

```javascript
useEffect(() => {
  if (currentProduct && currentProduct.productId && currentProduct.id) {
    const mappedIds = JSON.parse(localStorage.getItem('product_mapping') || '{}');

    // Lưu lại: "Sản phẩm có mã MUA là X thì mã XEM là Y"
    if (mappedIds[currentProduct.productId] !== currentProduct.id) {
      mappedIds[currentProduct.productId] = currentProduct.id;
      localStorage.setItem('product_mapping', JSON.stringify(mappedIds));
    }
  }
}, [currentProduct]);
```

### TỔNG KẾT

Toàn bộ đoạn code này giải quyết bài toán: **Làm sao để trang web chạy mượt, không bao giờ chết link, và hiển thị thông tin cực nhanh dù ID đầu vào có thể bị sai hoặc API phản hồi chậm.**
