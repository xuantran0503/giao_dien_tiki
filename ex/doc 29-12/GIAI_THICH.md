
# Giải thích chi tiết về useEffect và Phân tích lỗi

## 1. useEffect là gì và tại sao cần dùng nó?

`useEffect` là một Hook trong React cho phép bạn thực hiện các "side effects" (tác vụ phụ) trong functional components.

**Side effects** bao gồm:
*   Gọi API (fetching data).
*   Tương tác trực tiếp với DOM.
*   Thiết lập subscriptions (đăng ký sự kiện).
*   Thay đổi tiêu đề trang (document.title), v.v.

### Tại sao dùng `useEffect`?
React component về cơ bản là các hàm render ra giao diện dựa trên `props` và `state`. Logic render phải "tinh khiết" (pure), tức là không được gây ra thay đổi bên ngoài trong quá trình render. `useEffect` giúp tách biệt các tác vụ phụ này để chúng chạy **sau khi** giao diện đã được render/cập nhật, tránh chặn (block) việc hiển thị UI.

### Vòng đời (Lifecycle) của useEffect
`useEffect(callback, dependencies)` hoạt động dựa trên mảng phụ thuộc (`dependencies`):

1.  **Mounting (Chạy lần đầu)**:
    *   Khi component được tạo và đưa vào DOM.
    *   `callback` sẽ chạy sau khi render lần đầu.
2.  **Updating (Cập nhật)**:
    *   Khi giá trị trong `dependencies` thay đổi.
    *   `callback` sẽ chạy lại sau khi render.
3.  **Unmounting (Hủy bỏ)**:
    *   Khi component bị xóa khỏi DOM.
    *   Hàm `cleanup` (hàm return trong callback) sẽ được gọi để dọn dẹp (ví dụ: hủy API, xóa timer).

---

## 2. Phân tích trong code của bạn

### Trong `ProductDetailPage.jsx`:
```javascript
useEffect(() => {
  if (productId) {
    // 1. Reset dữ liệu cũ để tránh hiện sai sản phẩm
    dispatch(clearCurrentProduct()); 
    // 2. Gọi API lấy sản phẩm mới
    dispatch(fetchProductById(productId));
  }

  // 3. Cleanup function: Chạy khi component unmount hoặc productId đổi
  return () => {
    dispatch(clearCurrentProduct());
  };
}, [dispatch, productId]);
```
*   **Tác dụng**: Đảm bảo mỗi khi bạn vào một trang sản phẩm mới, dữ liệu cũ bị xóa sạch (`currentProduct = null`) và dữ liệu mới được tải về.
*   **Cleanup**: Hàm `return` cực kỳ quan trọng. Nếu không có nó, khi bạn chuyển từ sản phẩm A sang B, người dùng có thể thấy thông tin của A trong tích tắc trước khi B tải xong.

### Trong `listingSlice.ts` và `TopDeals` / `FlashSale`:
*   `useEffect` được dùng để kiểm tra xem dữ liệu đã có chưa (`products.length === 0`). Nếu chưa thì mới gọi API `dispatch(fetchProductsByPage)`. Điều này giúp tránh gọi API lặp lại không cần thiết khi người dùng quay lại trang chủ.

---

## 3. Tại sao mở 2 tab: Một trang có dữ liệu, một trang Null?

Dựa trên hình ảnh bạn cung cấp:
*   **Trường hợp Null (Ảnh 1)**: Redux DevTools đang hiển thị state tại action `listing/fetchProductsByPage/fulfilled`. Đây là action lấy danh sách sản phẩm (cho trang chủ), **không phải** action lấy chi tiết sản phẩm. Tại thời điểm này, `currentProduct` dĩ nhiên là `null` vì chưa gọi API chi tiết.
    *   **Lý do**: Có thể bạn đang chọn sai dòng Action trong Redux DevTools để xem, hoặc Action `fetchProductById` chưa được bắn ra (hoặc bị lỗi mạng). Tuy nhiên, vì giao diện vẫn hiện "Đĩa vuông Hagi", chứng tỏ API **đã chạy thành công** và UI đã có data, chỉ là Redux DevTools bạn đang nhìn không phản ánh trạng thái cuối cùng (có thể do bạn đang click vào một action cũ trong lịch sử).
*   **Trường hợp Có dữ liệu (Ảnh 2)**: Bạn đang xem đúng sau khi action `listing/fetchProductById/fulfilled` đã chạy xong.

**Giải thích về "khi F5 thì lại có dữ liệu"**: Khi F5, ứng dụng tải lại từ đầu, quy trình chạy lại chuẩn: Mount -> useEffect -> Fetch API -> Redux Update -> Render. Mọi thứ hoạt động trơn tru.


1. Tại sao giao diện một đằng, State (Redux) một nẻo?
Nguyên nhân chính: Bạn đang sử dụng redux-persist với localStorage.

LocalStorage là vùng nhớ dùng chung: Khi bạn mở nhiều tab của cùng một trang web (localhost:3000), tất cả các tab này đều truy cập vào chung một kho localStorage.
Xung đột dữ liệu:
Bạn mở Tab 1 (Đĩa vuông): Redux gọi API lấy Đĩa vuông và lưu vào State, redux-persist lập tức ghi Đĩa vuông vào localStorage.
Bạn mở Tab 2 (Đĩa tròn): Redux gọi API lấy Đĩa tròn, ghi đè vào State. redux-persist lại ghi đè Đĩa tròn vào localStorage.
Hậu quả: Vì dùng chung "cái túi" localStorage, khi Tab 2 thay đổi dữ liệu, Tab 1 (nếu có cơ chế rehydrate/sync) sẽ thấy dữ liệu trong túi đã đổi thành Đĩa tròn.
Tại sao UI vẫn là Đĩa vuông? Vì UI của Tab 1 đã render xong từ trước khi Tab 2 ghi đè dữ liệu. Nó chỉ hiển thị cái nó đã nhận được. Nhưng khi bạn nhìn vào Redux DevTools, bạn đang nhìn vào State "hiện tại" đã bị ghi đè.
2. Tại sao mở cùng lúc thì lại bị null hết?
Nguyên nhân: Do hàm cleanup trong useEffect của bạn.

Trong file 
ProductDetailPage.jsx
, bạn có đoạn code:

javascript
useEffect(() => {
  // ... fetch data ...
  return () => {
    dispatch(clearCurrentProduct()); // <--- Hàm cleanup
  };
}, [productId]);
Khi bạn mở Tab 2, hoặc chuyển trang, Component cũ bị "hủy" (Unmount). Lúc này hàm cleanup chạy và bắn ra action 
clearCurrentProduct()
.
Vì bạn đang dùng Persist, action Clear này không chỉ xóa trên tab đó mà còn xóa luôn dữ liệu trong localStorage dùng chung.
Kết quả là "ông" Tab 1 đang mở cũng bị mất dữ liệu theo vì cái túi dùng chung đã bị xóa sạch về null.
3. Đây là Lỗi hay Đúng?
Đây là Lỗi Về Kiến Trúc Dữ Liệu.

Giải thích: Những dữ liệu mang tính chất trạng thái tạm thời (như: sản phẩm đang xem, trang hiện tại, trạng thái loading) KHÔNG ĐƯỢC lưu vào localStorage (Persist).
Tại sao? Vì localStorage dùng để lưu những thứ cần tồn tại vĩnh viễn (như Token đăng nhập, Giỏ hàng). Còn sản phẩm đang xem thì mỗi tab phải có một giá trị riêng, không được dùng chung.
4. Cách sửa (Quan trọng)
Bạn cần cấu hình để Redux Persist bỏ qua (blacklist) cái listingSlice hoặc ít nhất là bỏ qua biến currentProduct.

Bước 1: Tìm file cấu hình Store (thường là src/store/index.ts hoặc store.ts) Bạn tìm chỗ có persistConfig, thêm listing vào blacklist.

javascript
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['listing', 'flashSale'] // <--- Thêm listing vào đây để nó không lưu vào localStorage nữa
};
Bước 2: Nếu không muốn dùng blacklist toàn bộ: Bạn có thể dùng sessionStorage thay vì localStorage cho riêng slice đó, nhưng cách nhanh nhất và đúng nhất cho "Product Detail" là không persist nó. Mỗi lần vào trang/F5 thì chịu khó gọi API lấy lại dữ liệu mới, điều này đảm bảo dữ liệu luôn mới nhất và các tab không cắn xé nhau.

Tóm lại:
Hiện tượng khác nhau: Do các tab ghi đè lên nhau trong localStorage.
Hiện tượng Null: Do tab này "dọn dẹp" (cleanup) làm tab kia mất dữ liệu theo.
Giải pháp: Xóa listing khỏi cấu hình Persist. Sản phẩm chi tiết nên để nó sống chết theo từng Tab (memory), không nên "vĩnh cửu hóa" nó vào ổ cứng.

---

## 4. Vấn đề "Top Deal và Flash Sale bị ảnh hưởng lẫn nhau"

**Nguyên nhân**:
Bạn nói "khi dùng cùng data". Nếu cả hai component `TopDeals` và `FlashSale` cùng sử dụng chung biến `pageIndex` từ `listingSlice` (Redux) để điều khiển việc chuyển trang (Next/Prev), thì khi bạn bấm Next ở Top Deal, giá trị `pageIndex` trong Redux thay đổi. Vì Flash Sale cũng lắng nghe `pageIndex` đó, nó cũng sẽ bị chuyển trang theo.

**Cách khắc phục (Best Practice)**:
Không nên dùng Redux (`pageIndex` global) để quản lý trạng thái phân trang cho các carousel/list riêng biệt trên giao diện. Hãy dùng **Local State** (`useState`) cho từng component.

**Giải pháp**:
Sửa `TopDeals.jsx` (và `FlashSale.jsx` nếu cần) để quản lý trang hiện tại bằng `useState` thay vì `dispatch` lên Redux.

### Sửa file `TopDeals.jsx`:
Tôi sẽ thực hiện sửa đổi này cho bạn ngay sau đây. Chuyển `pageIndex` từ Redux về `useState` nội bộ.
