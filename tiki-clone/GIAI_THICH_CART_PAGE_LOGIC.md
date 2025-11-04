# GIẢI THÍCH CHI TIẾT LOGIC CỦA CartPage.jsx

## Phần 1: Khai báo Component và Import

```javascript
const CartPage = () => {
```
- **Giải thích**: Khai báo một functional component React tên là `CartPage` sử dụng arrow function syntax. Component này không nhận props nào từ component cha.

---

## Phần 2: Redux Setup

```javascript
const dispatch = useDispatch();
```
- **Giải thích**: `useDispatch()` là hook của Redux Toolkit/React-Redux, trả về hàm `dispatch` để gửi các action đến Redux store. 
- **Mục đích**: Dùng để cập nhật state trong Redux store (ví dụ: xóa sản phẩm, cập nhật số lượng).

---

```javascript
const cartItems = useSelector((state) => state.cart.items);
```
- **Giải thích**: `useSelector()` là hook của Redux để lấy dữ liệu từ store. 
- **Cách hoạt động**: 
  - `state` là toàn bộ Redux store state
  - `state.cart.items` truy cập vào mảng `items` trong slice `cart`
  - Component sẽ tự động re-render khi `cart.items` thay đổi
- **Kết quả**: `cartItems` là một mảng chứa tất cả các sản phẩm trong giỏ hàng

---

```javascript
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
```
- **Giải thích**: Lấy tổng số lượng sản phẩm trong giỏ hàng từ Redux store.
- **Mục đích**: Có thể dùng để hiển thị badge số lượng trên icon giỏ hàng (không được sử dụng trong đoạn code này nhưng có thể dùng sau).

---

## Phần 3: State Management cho Selection

```javascript
const [selectedItems, setSelectedItems] = useState(
  cartItems.map((item) => item.id)
);
```
- **Giải thích**: 
  - `useState()` là React hook để quản lý local state
  - `selectedItems` là state chứa mảng các ID của sản phẩm được chọn
  - `setSelectedItems` là hàm để cập nhật state này
  - Giá trị khởi tạo: `cartItems.map((item) => item.id)` tạo mảng chứa tất cả ID của sản phẩm trong giỏ hàng
- **Mục đích**: Mặc định chọn tất cả sản phẩm khi component mount lần đầu

---

## Phần 4: Hàm xử lý chọn/bỏ chọn tất cả

```javascript
const handleSelectAll = (e) => {
```
- **Giải thích**: Khai báo hàm xử lý sự kiện khi người dùng click checkbox "Chọn tất cả"
- **Tham số**: `e` là event object từ checkbox input

---

```javascript
if (e.target.checked) {
```
- **Giải thích**: Kiểm tra xem checkbox có được check hay không
- **`e.target`**: Tham chiếu đến element DOM đã trigger event (checkbox)
- **`.checked`**: Property boolean của checkbox, `true` nếu được check, `false` nếu không

---

```javascript
setSelectedItems(cartItems.map((item) => item.id));
```
- **Giải thích**: Nếu checkbox được check:
  - `cartItems.map((item) => item.id)` tạo mảng mới chứa tất cả ID từ `cartItems`
  - `setSelectedItems()` cập nhật state để chọn tất cả sản phẩm
- **Kết quả**: Tất cả sản phẩm trong giỏ hàng được đánh dấu là đã chọn

---

```javascript
} else {
```
- **Giải thích**: Trường hợp checkbox không được check (bỏ chọn)

---

```javascript
setSelectedItems([]);
```
- **Giải thích**: Cập nhật state `selectedItems` thành mảng rỗng
- **Kết quả**: Tất cả sản phẩm bị bỏ chọn

---

## Phần 5: Hàm xử lý chọn/bỏ chọn từng sản phẩm

```javascript
const handleSelectItem = (id) => {
```
- **Giải thích**: Khai báo hàm xử lý khi người dùng click checkbox của một sản phẩm cụ thể
- **Tham số**: `id` là ID của sản phẩm cần chọn/bỏ chọn

---

```javascript
if (selectedItems.includes(id)) {
```
- **Giải thích**: Kiểm tra xem sản phẩm có ID này đã được chọn hay chưa
- **`.includes(id)`**: Phương thức của Array, trả về `true` nếu mảng `selectedItems` chứa `id`, `false` nếu không

---

```javascript
setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
```
- **Giải thích**: Nếu sản phẩm đã được chọn (đang bỏ chọn):
  - `selectedItems.filter((itemId) => itemId !== id)` tạo mảng mới loại bỏ `id` khỏi `selectedItems`
  - `filter()` tạo mảng mới chỉ chứa các phần tử thỏa điều kiện `itemId !== id`
  - `setSelectedItems()` cập nhật state với mảng mới
- **Kết quả**: Sản phẩm bị bỏ chọn

---

```javascript
} else {
```
- **Giải thích**: Trường hợp sản phẩm chưa được chọn (đang chọn)

---

```javascript
setSelectedItems([...selectedItems, id]);
```
- **Giải thích**: Nếu sản phẩm chưa được chọn:
  - `...selectedItems` là spread operator, copy tất cả phần tử hiện có trong `selectedItems`
  - `, id` thêm `id` mới vào cuối mảng
  - `setSelectedItems()` cập nhật state với mảng mới
- **Kết quả**: Sản phẩm được chọn

---

## Phần 6: Hàm tăng số lượng sản phẩm

```javascript
const handleIncrease = (id, currentQuantity) => {
```
- **Giải thích**: Khai báo hàm xử lý khi người dùng click nút tăng số lượng (+)
- **Tham số**: 
  - `id`: ID của sản phẩm cần tăng số lượng
  - `currentQuantity`: Số lượng hiện tại của sản phẩm

---

```javascript
dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
```
- **Giải thích**: 
  - `dispatch()` gửi action đến Redux store
  - `updateQuantity()` là action creator từ `cartSlice`
  - `{ id, quantity: currentQuantity + 1 }` là payload chứa:
    - `id`: ID sản phẩm cần cập nhật
    - `quantity`: Số lượng mới (tăng thêm 1)
- **Kết quả**: Số lượng sản phẩm trong Redux store được tăng lên 1

---

## Phần 7: Hàm giảm số lượng sản phẩm

```javascript
const handleDecrease = (id, currentQuantity) => {
```
- **Giải thích**: Khai báo hàm xử lý khi người dùng click nút giảm số lượng (-)
- **Tham số**: Tương tự `handleIncrease`

---

```javascript
if (currentQuantity > 1) {
```
- **Giải thích**: Kiểm tra số lượng hiện tại có lớn hơn 1 không
- **Mục đích**: Đảm bảo số lượng không thể giảm xuống dưới 1 (ít nhất phải có 1 sản phẩm)

---

```javascript
dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
```
- **Giải thích**: 
  - Chỉ thực hiện khi `currentQuantity > 1`
  - `dispatch()` gửi action để cập nhật số lượng
  - `quantity: currentQuantity - 1` giảm số lượng đi 1
- **Kết quả**: Số lượng sản phẩm trong Redux store được giảm đi 1 (nếu > 1)

---

## Phần 8: Hàm xóa sản phẩm

```javascript
const handleRemove = (id) => {
```
- **Giải thích**: Khai báo hàm xử lý khi người dùng click nút xóa sản phẩm
- **Tham số**: `id` là ID của sản phẩm cần xóa

---

```javascript
dispatch(removeFromCart(id));
```
- **Giải thích**: 
  - `dispatch()` gửi action `removeFromCart` đến Redux store
  - `removeFromCart(id)` là action creator, nhận `id` làm tham số
- **Kết quả**: Sản phẩm có ID này bị xóa khỏi `cart.items` trong Redux store

---

```javascript
setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
```
- **Giải thích**: 
  - Đồng bộ state local `selectedItems` sau khi xóa sản phẩm
  - Loại bỏ `id` của sản phẩm vừa xóa khỏi mảng `selectedItems`
- **Mục đích**: Tránh lỗi khi tính toán tổng tiền nếu vẫn còn ID của sản phẩm đã xóa trong `selectedItems`

---

## Phần 9: Hàm tính tổng tiền hàng (sau giảm giá)

```javascript
const calculateTotal = () => {
```
- **Giải thích**: Khai báo hàm tính tổng tiền phải thanh toán (đã áp dụng giảm giá)
- **Trả về**: Số tiền (number)

---

```javascript
return cartItems
```
- **Giải thích**: Bắt đầu với mảng `cartItems` (tất cả sản phẩm trong giỏ hàng)

---

```javascript
.filter((item) => selectedItems.includes(item.id))
```
- **Giải thích**: 
  - `.filter()` lọc chỉ các sản phẩm được chọn
  - `selectedItems.includes(item.id)` kiểm tra xem `item.id` có trong `selectedItems` không
  - Chỉ giữ lại các sản phẩm có ID nằm trong `selectedItems`
- **Kết quả**: Mảng mới chỉ chứa các sản phẩm được chọn

---

```javascript
.reduce((total, item) => total + item.price * item.quantity, 0);
```
- **Giải thích**: 
  - `.reduce()` tính tổng từ mảng các sản phẩm đã lọc
  - `(total, item) => total + item.price * item.quantity` là callback:
    - `total`: Giá trị tích lũy (bắt đầu từ 0)
    - `item`: Phần tử hiện tại trong mảng
    - `item.price * item.quantity`: Giá tiền của sản phẩm nhân với số lượng
    - `total + ...`: Cộng dồn vào tổng
  - `0`: Giá trị khởi tạo của `total`
- **Kết quả**: Tổng tiền của tất cả sản phẩm được chọn (đã áp dụng giá giảm)

---

## Phần 10: Hàm tính tổng tiền tạm tính (trước giảm giá)

```javascript
const calculateSubtotal = () => {
```
- **Giải thích**: Khai báo hàm tính tổng tiền tạm tính (giá gốc, chưa giảm giá)
- **Mục đích**: Dùng để tính số tiền giảm giá

---

```javascript
return cartItems
```
- **Giải thích**: Tương tự `calculateTotal()`, bắt đầu với mảng `cartItems`

---

```javascript
.filter((item) => selectedItems.includes(item.id))
```
- **Giải thích**: Lọc chỉ các sản phẩm được chọn (tương tự như trên)

---

```javascript
.reduce((total, item) => {
```
- **Giải thích**: Bắt đầu hàm reduce với callback phức tạp hơn (cần xử lý logic)

---

```javascript
const originalPrice = item.originalPrice || item.price;
```
- **Giải thích**: 
  - `item.originalPrice || item.price`: Sử dụng toán tử OR logic (`||`)
  - Nếu `item.originalPrice` tồn tại và không phải `null`, `undefined`, `0`, `false`, `""` → dùng `item.originalPrice`
  - Nếu không → dùng `item.price` làm giá gốc
- **Mục đích**: Một số sản phẩm có thể không có `originalPrice`, nên dùng `price` làm giá gốc

---

```javascript
return total + originalPrice * item.quantity;
```
- **Giải thích**: 
  - Tính tiền theo giá gốc: `originalPrice * item.quantity`
  - Cộng vào tổng: `total + ...`
  - Trả về giá trị mới cho lần lặp tiếp theo

---

```javascript
}, 0);
```
- **Giải thích**: 
  - Kết thúc hàm `reduce()`
  - `0`: Giá trị khởi tạo của `total`

---

## Phần 11: Tính toán các giá trị cuối cùng

```javascript
const subtotal = calculateSubtotal();
```
- **Giải thích**: 
  - Gọi hàm `calculateSubtotal()` để tính tổng tiền tạm tính
  - Lưu kết quả vào biến `subtotal`
- **Kết quả**: Tổng tiền hàng trước giảm giá

---

```javascript
const total = calculateTotal();
```
- **Giải thích**: 
  - Gọi hàm `calculateTotal()` để tính tổng tiền thanh toán
  - Lưu kết quả vào biến `total`
- **Kết quả**: Tổng tiền hàng sau giảm giá (tiền phải thanh toán)

---

```javascript
const discount = subtotal - total;
```
- **Giải thích**: 
  - Tính số tiền giảm giá
  - `subtotal - total`: Lấy tổng tiền trước giảm trừ đi tổng tiền sau giảm
- **Kết quả**: Số tiền được giảm (nếu `subtotal > total` thì có giảm giá, nếu bằng nhau thì không có)

---

## TÓM TẮT LUỒNG HOẠT ĐỘNG

1. **Khởi tạo**: Component mount, lấy dữ liệu từ Redux store, mặc định chọn tất cả sản phẩm
2. **Chọn sản phẩm**: Người dùng có thể chọn/bỏ chọn từng sản phẩm hoặc chọn tất cả
3. **Thay đổi số lượng**: Có thể tăng/giảm số lượng, Redux store được cập nhật
4. **Xóa sản phẩm**: Xóa khỏi Redux store và đồng bộ state local
5. **Tính toán**: Dựa trên các sản phẩm được chọn, tính:
   - `subtotal`: Tổng tiền trước giảm (giá gốc)
   - `total`: Tổng tiền sau giảm (giá đã giảm)
   - `discount`: Số tiền được giảm = `subtotal - total`

## LƯU Ý QUAN TRỌNG

- **State Management**: Sử dụng Redux cho dữ liệu giỏ hàng (global state) và React `useState` cho trạng thái chọn sản phẩm (local state)
- **Immutable Updates**: Tất cả cập nhật state đều tạo mảng/object mới, không thay đổi trực tiếp
- **Performance**: `useSelector` chỉ re-render khi dữ liệu liên quan thay đổi
- **Tính toán**: Các hàm `calculateTotal()` và `calculateSubtotal()` được gọi mỗi lần render, có thể tối ưu bằng `useMemo()` nếu cần

