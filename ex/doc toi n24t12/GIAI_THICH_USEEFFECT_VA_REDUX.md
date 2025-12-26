# Giải Thích Chuyên Sâu: useEffect & Vấn Đề Redux State

Tài liệu này giải thích 2 thắc mắc lớn của bạn:
1. Bản chất của `useEffect` và Vòng đời Component.
2. Tại sao `currentProduct` trong Redux lại bị Null hoặc bị ghi đè khi mở nhiều tab.

---

## PHẦN 1: useEffect và Vòng Đời (Lifecycle)

### 1. Khi nào dùng useEffect?
Trong React, công việc chính của Component là **Render** (vẽ giao diện html từ dữ liệu). Bất cứ việc gì **không phải là vẽ giao diện** (gọi là "Side Effect" - Tác dụng phụ) thì phải vứt vào `useEffect`.

Ví dụ về Side Effect:
- Gọi API (fetch data).
- Đăng ký sự kiện (addEventListener).
- Thay đổi tiêu đề trang (document.title).
- Chạy setTimeout/setInterval.

### 2. Chu trình hoạt động (Vòng đời)
React Component có 3 giai đoạn chính:

1.  **Mounting (Sinh ra)**: Component xuất hiện lần đầu trên màn hình.
    *   React vẽ UI xong -> Chạy `useEffect`.
2.  **Updating (Cập nhật)**: Khi prop hoặc state thay đổi => Component vẽ lại (Re-render).
    *   React vẽ lại UI xong -> Chạy `useEffect` (nhưng chỉ chạy NẾU các biến trong mảng dependency `[]` thay đổi).
3.  **Unmounting (Chết đi)**: Khi chuyển sang trang khác hoặc component bị xóa.
    *   Chạy hàm `cleanup` (nếu có) trong useEffect.

### 3. Giải thích đoạn code của bạn
```javascript
useEffect(() => {
    // Logic: Nếu chưa có sản phẩm nào (length === 0) thì mới gọi API
    if (products.length === 0) {
      dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 18 }));
    }
}, [dispatch, products.length]); // Dependency Array
```

**Tại sao phải để trong useEffect?**
*   Nếu bạn để `dispatch` ở ngoài useEffect (thả rông trong body component), mỗi lần React vẽ lại UI (do gõ phím, do hover, do state khác đổi...), nó sẽ lại gọi API. => **Vòng lặp vô tận (Infinite Loop)** làm treo trình duyệt.
*   `useEffect` đảm bảo code này chỉ chạy **SAU KHI** giao diện đã hiện lên, và chỉ chạy lại khi điều kiện cần thiết thay đổi.

**Ý nghĩa Dependency Array `[dispatch, products.length]`:**
*   React sẽ canh chừng 2 biến này.
*   Nếu `products.length` đổi từ 0 -> 18 => React chạy lại useEffect. Lúc này code lọt vào `if` check thấy khác 0 => Không gọi API nữa. Đây là cách để **chặn gọi API thừa**.

---

## PHẦN 2: Bí ẩn về `currentProduct` (Lúc Null, lúc có, mở nhiều tab bị lỗi)

Đây là vấn đề kinh điển của **Global State (Redux)**.

### 1. Redux là "Cái Bảng Trắng Dùng Chung"
Hãy tưởng tượng Redux Store là một **cái bảng trắng duy nhất** trong phòng khách.
*   Biến `currentProduct` là một ô trên bảng đó.

### 2. Kịch bản lỗi "Race Condition" (Đua tranh dữ liệu)
Bạn mở trình duyệt với 2 tab (Tab A và Tab B):

1.  **Tab A (Xem sản phẩm X)**:
    *   Tab A xóa bảng (`currentProduct = null` để hiện loading).
    *   Tab A gọi API lấy sản phẩm X.
    *   Tab A viết thông tin X lên bảng. => **Redux đang lưu X**.

2.  **Bạn bấm sang Tab B (Xem sản phẩm Y)**:
    *   Tab B xóa bảng (`currentProduct = null`).
    *   **LÚC NÀY**: Nếu bạn quay lại Tab A ngay lập tức, bạn sẽ thấy Tab A hiển thị Null hoặc Loading quay quay. Tại sao? Vì Tab B vừa xóa bảng của Tab A rồi! Vì cả 2 dùng chung 1 cái bảng Redux!
    *   Tab B gọi API lấy Y và ghi Y lên bảng. => **Redux đang lưu Y**.

3.  **Quay lại Tab A**:
    *   Tab A nhìn lên bảng Redux thấy thông tin là Y.
    *   => **Lỗi**: Tab A (url là sản phẩm X) nhưng lại hiển thị thông tin của sản phẩm Y.

### 3. Tại sao vẫn "Thêm vào giỏ hàng" được dù Redux null/sai?
Khi bạn render component:
```javascript
const ProductDetail = () => {
    const reduxProduct = useSelector(state => state.currentProduct);
    
    // Biến localProduct này được tạo ra lúc render
    let localProduct = reduxProduct; 

    const handleAddToCart = () => {
        // Hàm này ghi nhớ giá trị của localProduct TẠI THỜI ĐIỂM NÓ ĐƯỢC TẠO (Closure)
        // Hoặc nó lấy ID từ URL (useParams) nên ID luôn đúng.
        addToCart(localProduct); 
    }
}
```
*   Nếu `currentProduct` bị null (do tab khác xóa), giao diện có thể vỡ hoặc hiện loading.
*   Nhưng nếu component chưa re-render kịp, hoặc logic `addToCart` lấy data từ biến cục bộ đã lưu trước đó, hoặc lấy ID từ URL (`useParams`), thì hành động thêm giỏ vẫn đúng ID, dù Redux Store đang bị loạn.

### 4. Cách khắc phục (Nâng cao)
Để Tab A và Tab B không đánh nhau, chúng ta không được dùng chung 1 biến `currentProduct` duy nhất trong Redux cho việc hiển thị chi tiết.
*   **Cách 1 (Clean up)**: Trong `useEffect` của trang chi tiết, khi `unmount` (rời trang), phải dispatch action `clearCurrentProduct()`. Điều này giúp khi vào trang mới nó luôn bắt đầu từ null (sạch sẽ), nhưng không fix được việc 2 tab mở cùng lúc.
*   **Cách 2 (Cache by ID)**: Thay vì lưu `currentProduct: Object`, hãy lưu dạng Dictionary:
    ```javascript
    productsById: {
        "id_san_pham_A": { ...data A... },
        "id_san_pham_B": { ...data B... }
    }
    ```
    Khi mở Tab A, nó chỉ lấy `productsById["id_san_pham_A"]`. Tab B lấy `productsById["id_san_pham_B"]`. Hai bên không đụng hàng nhau. Đây là cách các thư viện như **React Query** hoạt động.
*   **Cách 3 (Bỏ Redux cho Detail)**: Với trang chi tiết sản phẩm, fetch API trực tiếp trong component (`useState` + `useEffect`) thay vì đưa lên Redux. Data chỉ sống trong Tab đó, tắt Tab là mất. Đây là cách đơn giản và hiệu quả nhất để tránh xung đột tab.
