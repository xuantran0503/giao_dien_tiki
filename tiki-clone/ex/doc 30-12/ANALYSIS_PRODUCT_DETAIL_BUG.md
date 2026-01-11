# 🕵️ PHÂN TÍCH VÀ FIX LỖI CURRENTPRODUCT TRONG PRODUCTDETAILPAGE

Dưới đây là phân tích chi tiết về vấn đề bạn gặp phải: `currentProduct` trong Redux bằng `null` nhưng UI vẫn hiển thị, hoặc dữ liệu không khớp giữa Redux và UI.

---

## 1. Nguyên nhân gốc rễ (Root Cause)

Vấn đề nằm ở việc bạn đang **"nhân bản"** State từ Redux sang Local State (`useState`) và logic đồng bộ hóa bị thiếu trường hợp xóa dữ liệu.

### Phân tích code hiện tại:

Trong file `ProductDetailPage.jsx`, bạn có đoạn code sau:

```javascript
// 1. Lấy dữ liệu từ Redux
const { currentProduct: listingProduct } = useSelector(
  (state) => state.listing
);

// 2. Tạo một local state để lưu lại
const [product, setProduct] = useState(null);

// 3. Đồng bộ từ Redux sang Local
useEffect(() => {
  if (listingProduct) {
    // ⚠️ CHỈ CẬP NHẬT KHI CÓ DỮ LIỆU
    setProduct({ ...listingProduct });
  }
  // ⚠️ THIẾU: else { setProduct(null); }
}, [listingProduct]);
```

### Tại sao các hiện tượng sau xảy ra?

1.  **Redux = null nhưng UI vẫn hiển thị:**

    - Khi bạn chuyển trang hoặc Redux bị xóa (`clearCurrentProduct`), biến `listingProduct` trở thành `null`.
    - Tuy nhiên, `useEffect` của bạn chỉ thực hiện `setProduct` khi `listingProduct` có giá trị (truthy).
    - Khi `listingProduct` là `null`, nó bỏ qua khối `if`, dẫn đến **Local State `product` vẫn giữ giá trị cũ**. UI hiển thị theo Local State nên bạn vẫn thấy thông tin sản phẩm cũ.

2.  **F5 thì lại có dữ liệu đúng:**

    - Khi refresh trang, Component bị mount lại từ đầu.
    - `useEffect` gọi API `fetchProductById` được kích hoạt.
    - Dữ liệu mới đổ về Redux -> `listingProduct` có giá trị -> `setProduct` được gọi -> UI cập nhật đúng.

3.  **Dữ liệu không khớp nhưng Add to Cart vẫn thành công:**
    - Bạn đang dùng `product.id` (từ local state) để add vào giỏ hàng.
    - Vì local state vẫn đang giữ dữ liệu của sản phẩm trước đó (do chưa bị xóa), nên nó vẫn lấy ID đó gửi đi. Nếu ID đó vẫn tồn tại trên server/hệ thống, việc thêm vào giỏ vẫn "thành công" về mặt kỹ thuật, nhưng sai về mặt logic người dùng.

---

## 2. Giải pháp khắc phục

Bạn có 2 cách để giải quyết vấn đề này. Tôi khuyên bạn nên dùng **Cách 1** để code gọn sạch và tránh lỗi đồng bộ.

### Cách 1: Sử dụng trực tiếp dữ liệu từ Redux (Khuyên dùng)

Đừng dùng `useState` để lưu lại sản phẩm nữa. Hãy dùng trực tiếp `listingProduct` từ Redux. Điều này đảm bảo "Single Source of Truth" (Duy nhất một nguồn sự thật).

```javascript
const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  // Dùng trực tiếp từ Redux
  const { currentProduct, productDetailStatus } = useSelector(
    (state) => state.listing
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, productId]);

  // Nếu muốn xử lý dữ liệu (ví dụ thêm default name)
  const product = currentProduct
    ? {
        ...currentProduct,
        name: currentProduct.name || currentProduct.title || "Sản phẩm",
        originalPrice:
          currentProduct.originalPrice || currentProduct.price || 0,
      }
    : null;

  // Render dựa trên biến product này...
};
```

### Cách 2: Sửa lại logic đồng bộ (Nếu vẫn muốn dùng Local State)

Nếu bạn vẫn cần dùng Local State vì một lý do nào đó, hãy đảm bảo bạn xóa nó khi Redux xóa.

```javascript
useEffect(() => {
  if (listingProduct) {
    setProduct({
      ...listingProduct,
      name: listingProduct.name || listingProduct.title || "Sản phẩm",
      originalPrice: listingProduct.originalPrice || listingProduct.price || 0,
    });
  } else {
    // QUAN TRỌNG: Xóa local state nếu Redux null
    setProduct(null);
  }
  setStatus(listingStatus);
}, [listingProduct, listingStatus]);
```

---

## 3. Tại sao Add to Cart vẫn thành công khi dữ liệu không khớp?

Hãy kiểm tra hàm `handleAddToCart`:

```javascript
const handleAddToCart = () => {
  dispatch(
    addToCart({
      id: product.id, // Đang lấy từ local state cũ
      name: product.name,
      // ...
    })
  );
};
```

**Nguy hiểm:** Nếu bạn đang xem Sản phẩm B, nhưng UI chưa cập nhật và vẫn hiện Sản phẩm A. Khi bạn nhấn "Thêm vào giỏ", bạn thực chất đang thêm Sản phẩm A vào giỏ. Khách hàng sẽ rất bực mình nếu họ đặt mua một đằng nhưng trong giỏ hàng hiện một nẻo!

**Lời khuyên:**

1.  Luôn hiển thị **Loading Overlay** khi `status === 'pending'`.
2.  Không cho phép tương tác với nút "Mua ngay/Thêm vào giỏ" nếu dữ liệu đang bị lệch hoặc chưa load xong.
3.  Sử dụng **Cách 1** ở trên để triệt tiêu hoàn toàn sự lệch pha dữ liệu.

---

## 4. Tóm tắt Checklist cần làm ngay:

- [ ] **Bước 1:** Xóa `const [product, setProduct] = useState(null);`.
- [ ] **Bước 2:** Tạo một biến `const product = listingProduct` (hoặc tính toán trực tiếp từ `listingProduct`).
- [ ] **Bước 3:** Kiểm tra điều kiện `if (!product)` để hiển thị Loading hoặc Thông báo không tìm thấy.
- [ ] **Bước 4:** Đảm bảo `useEffect` cleanup luôn gọi `clearCurrentProduct()`.

Việc này sẽ giúp dự án Tiki của bạn chuyên nghiệp và ổn định hơn rất nhiều! 🚀
