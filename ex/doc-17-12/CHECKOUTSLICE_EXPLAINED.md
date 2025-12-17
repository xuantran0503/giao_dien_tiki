# Giải thích chi tiết: checkoutSlice.ts

## Tổng quan
File `checkoutSlice.ts` quản lý toàn bộ state và logic liên quan đến việc **đặt hàng** (checkout) và **lịch sử đơn hàng** trong ứng dụng Tiki Clone. Đây là slice lưu trữ thông tin các đơn hàng đã được tạo, cho phép:
- Lưu thông tin đơn hàng mới
- Xem lịch sử đơn hàng
- Cập nhật trạng thái đơn hàng
- Xóa lịch sử
- Đồng bộ giữa các tabs

---

## Phần 1: Imports và Interfaces

### Dòng 1-2: Import dependencies

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartSlice";
```

**Giải thích:**
- `createSlice`, `PayloadAction`: Từ Redux Toolkit (giống cartSlice)
- `CartItem`: Import từ cartSlice vì đơn hàng cần lưu thông tin sản phẩm

**Tại sao import CartItem?**
- Đơn hàng chứa danh sách các sản phẩm đã mua
- Tái sử dụng type thay vì định nghĩa lại
- Đảm bảo consistency giữa cart và checkout

---

### Dòng 5-9: Interface AddressSnapshot

```typescript
export interface AddressSnapshot {
  detailedAddress: string;
  generalAddress: string;
  timestamp: string;
}
```

**Giải thích chi tiết:**

**Mục đích:** Lưu "ảnh chụp" địa chỉ tại thời điểm đặt hàng

**Tại sao cần AddressSnapshot?**

Hãy tưởng tượng tình huống này:
```typescript
// Ngày 1/1/2025: User đặt hàng
- Địa chỉ: "123 Lê Lợi, Q1, TP.HCM"
- Tạo đơn hàng #1234

// Ngày 5/1/2025: User đổi địa chỉ mặc định
- Địa chỉ mới: "456 Nguyễn Huệ, Q1, TP.HCM"

// Vấn đề: Xem lại đơn hàng #1234
- Hiển thị địa chỉ nào? 🤔
```

**Giải pháp:**
```typescript
// Lưu snapshot tại thời điểm đặt hàng
addressSnapshot: {
  detailedAddress: "123 Lê Lợi",
  generalAddress: "Q1, TP.HCM", 
  timestamp: "2025-01-01T10:30:00Z"
}
// Đơn hàng luôn hiển thị đúng địa chỉ giao hàng ban đầu ✅
```

**Chi tiết các fields:**

| Field | Type | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `detailedAddress` | string | Địa chỉ chi tiết (số nhà, đường) | "123 Lê Lợi, Phường Bến Nghé" |
| `generalAddress` | string | Địa chỉ tổng quát (quận, thành phố) | "Quận 1, TP. Hồ Chí Minh" |
| `timestamp` | string | Thời gian lưu snapshot | "2025-01-01T10:30:00.000Z" |

**Tại sao tách ra 2 fields (detailed + general)?**
- `detailedAddress`: Hiển thị đầy đủ cho shipper
- `generalAddress`: Hiển thị ngắn gọn trong danh sách đơn hàng
- Dễ format và styling riêng

---

### Dòng 11-26: Interface CheckoutData

```typescript
export interface CheckoutData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  orderDate: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  customerInfo?: {
    fullName: string;
    phone: string;
    email: string;
    note?: string;
  };
  addressSnapshot?: AddressSnapshot;
}
```

**Giải thích từng field:**

#### 1. `id: string`
```typescript
id: "ORDER_1734368880123"
```
- ID duy nhất của đơn hàng
- Thường generate bằng: `ORDER_${Date.now()}`
- Dùng để tra cứu, update status

#### 2. `items: CartItem[]`
```typescript
items: [
  { id: 1, name: "iPhone 15", price: 29990000, quantity: 1, ... },
  { id: 2, name: "AirPods Pro", price: 5990000, quantity: 2, ... }
]
```
- Danh sách sản phẩm trong đơn hàng
- Lưu snapshot tại thời điểm checkout (không tham chiếu cart)
- Nếu giá sản phẩm thay đổi sau, đơn hàng cũ vẫn giữ nguyên giá cũ

**Tại sao lưu cả CartItem thay vì chỉ lưu ID?**
```typescript
// ❌ KHÔNG TỐT: Chỉ lưu ID
items: [1, 2, 5]
// Vấn đề: Nếu sản phẩm bị xóa khỏi database, không xem được đơn hàng

// ✅ TỐT: Lưu toàn bộ thông tin
items: [{ id: 1, name: "iPhone", price: 29990000, ... }]
// Luôn có đủ thông tin để hiển thị
```

#### 3. `totalAmount: number`
```typescript
totalAmount: 41970000  // 29,990,000 + (5,990,000 * 2)
```
- Tổng tiền đơn hàng
- Tính sẵn và lưu cố định
- Không thay đổi khi giá sản phẩm update

**Tính toán:**
```typescript
const totalAmount = items.reduce(
  (sum, item) => sum + (item.price * item.quantity), 
  0
);
```

#### 4. `deliveryAddress: string`
```typescript
deliveryAddress: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
```
- Địa chỉ giao hàng (dạng text đầy đủ)
- Hiển thị đơn giản, dễ đọc
- **Khác với `addressSnapshot`:** 
  - `deliveryAddress`: String đơn giản
  - `addressSnapshot`: Object có cấu trúc + timestamp

#### 5. `paymentMethod: string`
```typescript
paymentMethod: "Thanh toán khi nhận hàng (COD)"
// Hoặc: "Thẻ tín dụng/ghi nợ"
// Hoặc: "Ví điện tử Momo"
```
- Phương thức thanh toán
- Lưu dạng text để dễ hiển thị

#### 6. `orderDate: string`
```typescript
orderDate: "2025-01-01T10:30:00.000Z"
```
- Ngày giờ đặt hàng
- Format: ISO 8601 string
- Dùng để sắp xếp, filter đơn hàng

**Hiển thị:**
```typescript
const formattedDate = new Date(orderDate).toLocaleString('vi-VN');
// "01/01/2025, 10:30:00"
```

#### 7. `status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"`

**String Literal Union Type** - Chỉ cho phép 5 giá trị cụ thể

```typescript
// ✅ Hợp lệ
status: "pending"
status: "confirmed"
status: "shipping"
status: "delivered" 
status: "cancelled"

// ❌ TypeScript báo lỗi
status: "processing"  // Không có trong union type
status: "refunded"    // Không có trong union type
```

**Ý nghĩa từng status:**

| Status | Màu | Mô tả | Ví dụ |
|--------|-----|-------|-------|
| `pending` | 🟡 Vàng | Đơn hàng mới, chờ xác nhận | Vừa đặt, chưa xử lý |
| `confirmed` | 🔵 Xanh dương | Đã xác nhận, chuẩn bị hàng | Shop đã nhận đơn |
| `shipping` | 🟠 Cam | Đang vận chuyển | Shipper đang giao |
| `delivered` | 🟢 Xanh lá | Đã giao thành công | Khách đã nhận hàng |
| `cancelled` | 🔴 Đỏ | Đã hủy | Khách hoặc shop hủy |

**Flow thông thường:**
```
pending → confirmed → shipping → delivered
         ↓
      cancelled (có thể hủy ở bất kỳ bước nào)
```

**Sử dụng:**
```typescript
function OrderStatusBadge({ status }: { status: CheckoutData['status'] }) {
  const config = {
    pending: { label: 'Chờ xác nhận', color: 'yellow' },
    confirmed: { label: 'Đã xác nhận', color: 'blue' },
    shipping: { label: 'Đang giao', color: 'orange' },
    delivered: { label: 'Đã giao', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'red' },
  };
  
  const { label, color } = config[status];
  
  return <Badge color={color}>{label}</Badge>;
}
```

#### 8. `customerInfo?: { ... }`

**Dấu `?` = Optional field** (có thể có hoặc không)

```typescript
customerInfo: {
  fullName: "Nguyễn Văn A",
  phone: "0901234567",
  email: "nguyenvana@gmail.com",
  note: "Gọi trước khi giao"  // Optional
}
```

**Tại sao optional?**
- Nếu user đã đăng nhập: Lấy từ profile
- Nếu guest checkout: Nhập thủ công
- Một số đơn hàng cũ có thể chưa có field này

**Sub-fields:**

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `fullName` | string | ✅ | Họ tên người nhận |
| `phone` | string | ✅ | SĐT liên hệ |
| `email` | string | ✅ | Email (gửi xác nhận) |
| `note` | string | ❌ Optional | Ghi chú cho shipper |

#### 9. `addressSnapshot?: AddressSnapshot`

**Optional** - Lưu snapshot địa chỉ chi tiết

```typescript
addressSnapshot: {
  detailedAddress: "123 Lê Lợi, Phường Bến Nghé",
  generalAddress: "Quận 1, TP. Hồ Chí Minh",
  timestamp: "2025-01-01T10:30:00.000Z"
}
```

**So sánh với `deliveryAddress`:**

```typescript
// deliveryAddress: Địa chỉ đầy đủ dạng text
deliveryAddress: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"

// addressSnapshot: Có cấu trúc + timestamp
addressSnapshot: {
  detailedAddress: "123 Lê Lợi, Phường Bến Nghé",
  generalAddress: "Quận 1, TP. Hồ Chí Minh",
  timestamp: "2025-01-01T10:30:00.000Z"
}
```

**Khi nào dùng cái nào?**
- `deliveryAddress`: Hiển thị đơn giản trong order summary
- `addressSnapshot`: Tracking lịch sử thay đổi địa chỉ, analytics

---

### Dòng 29-32: Interface CheckoutState

```typescript
export interface CheckoutState {
  history: CheckoutData[];
  data: CheckoutData | null;
}
```

**Giải thích:**

**1. `history: CheckoutData[]`**
```typescript
history: [
  { id: "ORDER_001", status: "delivered", ... },
  { id: "ORDER_002", status: "shipping", ... },
  { id: "ORDER_003", status: "pending", ... }
]
```
- **Mảng chứa TẤT CẢ đơn hàng** đã tạo
- Mới nhất thường ở cuối (push vào sau)
- Dùng để hiển thị trang "Đơn hàng của tôi"

**2. `data: CheckoutData | null`**
```typescript
// Có đơn hàng hiện tại
data: { id: "ORDER_003", status: "pending", ... }

// Chưa có đơn hàng nào / đã clear
data: null
```
- **Đơn hàng hiện tại** (vừa mới tạo)
- Dùng để hiển thị trang "Đặt hàng thành công"
- `null` khi chưa checkout hoặc đã xem xong

**Tại sao cần cả `history` VÀ `data`?**

```typescript
// Kịch bản 1: Vừa checkout xong
{
  data: { id: "ORDER_003", ... },     // Đơn hàng vừa tạo
  history: [ORDER_001, ORDER_002, ORDER_003]  // Đã thêm vào history
}
// → Hiển thị trang "Cảm ơn bạn đã đặt hàng #ORDER_003"

// Kịch bản 2: Xem lịch sử đơn hàng
{
  data: null,  // Không có đơn hiện tại
  history: [ORDER_001, ORDER_002, ORDER_003]
}
// → Hiển thị danh sách tất cả đơn hàng

// Kịch bản 3: User mới, chưa mua gì
{
  data: null,
  history: []
}
// → "Bạn chưa có đơn hàng nào"
```

---

### Dòng 34-37: Initial State

```typescript
const initialState: CheckoutState = {
  history: [],
  data: null,
};
```

**Giải thích:**
- State ban đầu: Chưa có đơn hàng nào
- Redux-persist sẽ override nếu có data trong localStorage

---

## Phần 2: Reducers

### REDUCER 1: addCheckout (Dòng 43-64)

```typescript
addCheckout: (state, action: PayloadAction<CheckoutData>) => {
  const newOrder = action.payload;
  
  // Simple duplicate check based on ID only
  const isDuplicate = state.history.some(existingOrder => existingOrder.id === newOrder.id);

  if (!isDuplicate) {
    state.history.push(newOrder);
    state.data = newOrder;
  } else {
    console.log("Duplicate order detected, skipping:", newOrder.id);
  }
},
```

**Giải thích chi tiết:**

#### Mục đích
Thêm đơn hàng mới vào history và set làm đơn hàng hiện tại

#### Bước 1: Nhận data
```typescript
const newOrder = action.payload;
// newOrder = {
//   id: "ORDER_1734368880123",
//   items: [...],
//   totalAmount: 41970000,
//   status: "pending",
//   ...
// }
```

#### Bước 2: Kiểm tra trùng lặp
```typescript
const isDuplicate = state.history.some(
  existingOrder => existingOrder.id === newOrder.id
);
```

**Tại sao cần check duplicate?**

**Vấn đề:** Double click hoặc network retry
```typescript
// User click "Đặt hàng" 2 lần nhanh
dispatch(addCheckout(orderData));  // Lần 1
dispatch(addCheckout(orderData));  // Lần 2 (cùng ID)

// Không check → Có 2 đơn hàng giống nhau trong history ❌
```

**Giải pháp:**
```typescript
// Chỉ thêm nếu ID chưa tồn tại
if (!isDuplicate) {
  state.history.push(newOrder);  // ✅
}
```

**`.some()` là gì?**
```typescript
// Trả về true nếu TỒN TẠI ít nhất 1 phần tử thỏa điều kiện
[1, 2, 3].some(x => x > 2)  // true (vì có 3 > 2)
[1, 2, 3].some(x => x > 5)  // false (không có phần tử nào > 5)

// Trong code:
state.history.some(order => order.id === newOrder.id)
// → true nếu có order nào có cùng ID
```

#### Bước 3: Thêm vào history và data
```typescript
if (!isDuplicate) {
  state.history.push(newOrder);    // Thêm vào danh sách
  state.data = newOrder;            // Set làm đơn hiện tại
}
```

**Ví dụ:**
```typescript
// State trước:
{
  history: [
    { id: "ORDER_001", status: "delivered" },
    { id: "ORDER_002", status: "shipping" }
  ],
  data: null
}

// Action: addCheckout({ id: "ORDER_003", status: "pending", ... })

// State sau:
{
  history: [
    { id: "ORDER_001", status: "delivered" },
    { id: "ORDER_002", status: "shipping" },
    { id: "ORDER_003", status: "pending" }  // ← Mới
  ],
  data: { id: "ORDER_003", status: "pending", ... }  // ← Set làm current
}
```

#### Bước 4: Error handling
```typescript
else {
  console.log("Duplicate order detected, skipping:", newOrder.id);
}
```
- Log để debug
- Không thêm vào history
- Không show error cho user (silent fail)

#### Code đã comment
```typescript
// console.log("Processing new order:", {
//   id: newOrder.id,
//   itemCount: newOrder.items.length,
//   totalAmount: newOrder.totalAmount,
//   items: newOrder.items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))
// });
```
- Debugging logs (tắt trong production)
- Dùng khi cần trace flow checkout

---

### REDUCER 2: syncCheckout (Dòng 66-69)

```typescript
syncCheckout: (state, action: PayloadAction<{ history: CheckoutData[]; data: CheckoutData | null }>) => {
  state.history = action.payload.history;
  state.data = action.payload.data;
},
```

**Giải thích:**

#### Mục đích
Đồng bộ checkout state giữa nhiều tabs

#### Payload structure
```typescript
{
  history: [ ... all orders ... ],
  data: { ... current order ... } | null
}
```

#### Khi nào dùng?

**Tình huống:** User mở 2 tabs
```
Tab 1: User đặt hàng → history có đơn mới
Tab 2: history vẫn cũ ❌
```

**Giải pháp:**
```typescript
// File: syncTabs.ts
window.addEventListener('storage', (event) => {
  if (event.key === 'persist:root') {
    const data = JSON.parse(event.newValue);
    const checkoutData = JSON.parse(data.checkout);
    
    // Sync sang tab khác
    store.dispatch(syncCheckout({
      history: checkoutData.history,
      data: checkoutData.data
    }));
  }
});
```

**Ví dụ:**
```typescript
// Tab 1: Đặt hàng
dispatch(addCheckout(newOrder));
// State Tab 1: { history: [ORDER_001, ORDER_002], data: ORDER_002 }

// localStorage update → trigger event

// Tab 2: Nhận event → sync
dispatch(syncCheckout({
  history: [ORDER_001, ORDER_002],
  data: ORDER_002
}));
// State Tab 2: { history: [ORDER_001, ORDER_002], data: ORDER_002 } ✅
```

---

### REDUCER 3: updateCheckoutStatus (Dòng 71-83)

```typescript
updateCheckoutStatus: (state, action: PayloadAction<{ id: string; status: CheckoutData["status"] }>) => {
  const { id, status } = action.payload;

  const historyItem = state.history.find(item => item.id === id);
  if (historyItem) {
    historyItem.status = status;
  }

  // Update current data if it matches
  if (state.data && state.data.id === id) {
    state.data.status = status;
  }
},
```

**Giải thích chi tiết:**

#### Mục đích
Cập nhật trạng thái đơn hàng (pending → confirmed → shipping → delivered)

#### Payload
```typescript
{
  id: "ORDER_003",
  status: "shipping"
}
```

#### Bước 1: Tìm đơn hàng trong history
```typescript
const historyItem = state.history.find(item => item.id === id);
if (historyItem) {
  historyItem.status = status;
}
```

**`.find()` vs `.some()`:**
```typescript
// .find() → Trả về phần tử tìm được (hoặc undefined)
const item = [1, 2, 3].find(x => x > 1);  // 2

// .some() → Trả về boolean
const exists = [1, 2, 3].some(x => x > 1);  // true
```

#### Bước 2: Update current data nếu match
```typescript
if (state.data && state.data.id === id) {
  state.data.status = status;
}
```

**Tại sao phải update cả 2 chỗ?**

```typescript
// Đơn hàng vừa tạo tồn tại ở 2 nơi:
{
  history: [..., { id: "ORDER_003", status: "pending" }],
  data: { id: "ORDER_003", status: "pending" }
}

// Nếu chỉ update history:
history[2].status = "confirmed"  // ✅ Updated
data.status = "pending"          // ❌ Vẫn cũ

// Phải update cả 2 để consistent
```

#### Ví dụ sử dụng

**Kịch bản 1: Admin xác nhận đơn**
```typescript
function AdminOrderPanel({ orderId }) {
  const dispatch = useAppDispatch();
  
  const handleConfirm = () => {
    dispatch(updateCheckoutStatus({
      id: orderId,
      status: "confirmed"
    }));
    
    // Call API update backend
    api.updateOrder(orderId, { status: "confirmed" });
  };
}
```

**Kịch bản 2: Tracking realtime**
```typescript
// WebSocket nhận update từ server
socket.on('order-status-changed', (data) => {
  dispatch(updateCheckoutStatus({
    id: data.orderId,
    status: data.newStatus
  }));
});
```

**Kịch bản 3: Auto-update sau thời gian**
```typescript
// Sau 2 phút tự động confirm
setTimeout(() => {
  dispatch(updateCheckoutStatus({
    id: orderId,
    status: "confirmed"
  }));
}, 2 * 60 * 1000);
```

---

### REDUCER 4: clearCheckoutHistory (Dòng 85-110)

```typescript
clearCheckoutHistory: (state) => {
  console.log("Clearing checkout history...");
  console.log("History length before clear:", state.history.length);

  state.history = [];
  state.data = null;

  console.log("History length after clear:", state.history.length);
  console.log("Checkout history cleared successfully");

  // Force clear from localStorage to prevent redux-persist from restoring
  try {
    const persistKey = "persist:root";
    const persistedData = localStorage.getItem(persistKey);
    if (persistedData) {
      const parsed = JSON.parse(persistedData);
      if (parsed.checkout) {
        parsed.checkout = JSON.stringify({ history: [], data: null });
        localStorage.setItem(persistKey, JSON.stringify(parsed));
        console.log("Cleared checkout from localStorage");
      }
    }
  } catch (error) {
    console.error("Error clearing checkout from localStorage:", error);
  }
},
```

**Giải thích chi tiết:**

#### Mục đích
Xóa toàn bộ lịch sử đơn hàng (thường dùng cho testing hoặc "Clear all")

#### Bước 1: Reset state
```typescript
state.history = [];
state.data = null;
```
- Xóa tất cả đơn hàng
- Reset current data

#### Bước 2: Clear localStorage

**Vấn đề với redux-persist:**
```typescript
// Chỉ reset state trong Redux
state.history = [];

// Nhưng redux-persist vẫn giữ data cũ trong localStorage
localStorage: { checkout: { history: [...old data...] } }

// Khi refresh page → redux-persist restore lại data cũ ❌
```

**Giải pháp: Clear trực tiếp localStorage**

```typescript
const persistKey = "persist:root";
const persistedData = localStorage.getItem(persistKey);
```
- `"persist:root"`: Key mà redux-persist dùng để lưu data
- Get toàn bộ persisted state

```typescript
if (persistedData) {
  const parsed = JSON.parse(persistedData);
  // parsed = {
  //   cart: "{ items: [...] }",
  //   checkout: "{ history: [...] }",
  //   address: "{ ... }"
  // }
```
- Parse JSON string thành object
- Mỗi slice được lưu dạng stringified JSON

```typescript
  if (parsed.checkout) {
    parsed.checkout = JSON.stringify({ history: [], data: null });
    localStorage.setItem(persistKey, JSON.stringify(parsed));
  }
```
- Override checkout với state rỗng
- Stringify lại và lưu vào localStorage

**Tại sao phải stringify 2 lần?**
```typescript
// Level 1: Mỗi slice là string
{
  checkout: '"{ history: [], data: null }"'  // ← String
}

// Level 2: Toàn bộ object cũng là string
'{ "checkout": "{ history: [], data: null }" }'  // ← String

// Vì vậy cần:
JSON.stringify({ history: [], data: null })    // → String cho slice
JSON.stringify(parsed)                         // → String cho whole object
```

#### Bước 3: Error handling
```typescript
} catch (error) {
  console.error("Error clearing checkout from localStorage:", error);
}
```
- Catch lỗi nếu localStorage không khả dụng
- Không crash app nếu clear fail

#### Ví dụ sử dụng

**UI Component:**
```typescript
function OrderHistoryPage() {
  const dispatch = useAppDispatch();
  const history = useAppSelector(selectCheckoutHistory);
  
  const handleClearAll = () => {
    if (window.confirm('Xóa toàn bộ lịch sử đơn hàng?')) {
      dispatch(clearCheckoutHistory());
      toast.success('Đã xóa lịch sử đơn hàng');
    }
  };
  
  return (
    <div>
      <h2>Đơn hàng của tôi ({history.length})</h2>
      <button onClick={handleClearAll}>Xóa tất cả</button>
      {/* ... */}
    </div>
  );
}
```

**Testing:**
```typescript
// Reset state giữa các tests
beforeEach(() => {
  store.dispatch(clearCheckoutHistory());
});
```

---

## Phần 3: Selectors (Dòng 115-120)

### Selector 1: selectCheckoutHistory

```typescript
export const selectCheckoutHistory = (state: { checkout: CheckoutState }) => state.checkout.history;
```

**Mục đích:** Lấy toàn bộ lịch sử đơn hàng

**Sử dụng:**
```typescript
function OrderListPage() {
  const orders = useAppSelector(selectCheckoutHistory);
  
  return (
    <div>
      <h2>Đơn hàng của tôi ({orders.length})</h2>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

---

### Selector 2: selectCurrentCheckout

```typescript
export const selectCurrentCheckout = (state: { checkout: CheckoutState }) => state.checkout.data;
```

**Mục đích:** Lấy đơn hàng hiện tại (vừa mới tạo)

**Sử dụng:**
```typescript
function OrderSuccessPage() {
  const currentOrder = useAppSelector(selectCurrentCheckout);
  
  if (!currentOrder) {
    return <Redirect to="/cart" />;
  }
  
  return (
    <div className="success-page">
      <h2>Đặt hàng thành công!</h2>
      <p>Mã đơn hàng: {currentOrder.id}</p>
      <p>Tổng tiền: {currentOrder.totalAmount.toLocaleString()}đ</p>
      <p>Trạng thái: {currentOrder.status}</p>
    </div>
  );
}
```

---

### Selector 3: selectCheckoutById

```typescript
export const selectCheckoutById = (state: { checkout: CheckoutState }, id: string) =>
  state.checkout.history.find(item => item.id === id);
```

**Mục đích:** Tìm đơn hàng theo ID

**Parameters:**
- `state`: Redux state
- `id`: ID đơn hàng cần tìm

**Return:** `CheckoutData | undefined`

**Sử dụng:**
```typescript
function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = useAppSelector(state => 
    selectCheckoutById(state, orderId)
  );
  
  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }
  
  return (
    <div className="order-detail">
      <h2>Chi tiết đơn hàng #{order.id}</h2>
      <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
      <p>Trạng thái: <StatusBadge status={order.status} /></p>
      
      <h3>Sản phẩm:</h3>
      {order.items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity} = {(item.price * item.quantity).toLocaleString()}đ
        </div>
      ))}
      
      <h3>Tổng: {order.totalAmount.toLocaleString()}đ</h3>
    </div>
  );
}
```

---

### Selector 4: selectCheckoutsByStatus

```typescript
export const selectCheckoutsByStatus = (state: { checkout: CheckoutState }, status: CheckoutData["status"]) =>
  state.checkout.history.filter(item => item.status === status);
```

**Mục đích:** Filter đơn hàng theo trạng thái

**Parameters:**
- `state`: Redux state  
- `status`: Trạng thái cần filter (`"pending"`, `"shipping"`, etc.)

**Return:** `CheckoutData[]` - Mảng các đơn hàng match status

**Sử dụng:**

**Ví dụ 1: Tab filters**
```typescript
function OrderTabs() {
  const [activeTab, setActiveTab] = useState<CheckoutData['status']>('pending');
  
  const orders = useAppSelector(state => 
    selectCheckoutsByStatus(state, activeTab)
  );
  
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('pending')}>
          Chờ xác nhận
        </button>
        <button onClick={() => setActiveTab('shipping')}>
          Đang giao
        </button>
        <button onClick={() => setActiveTab('delivered')}>
          Đã giao
        </button>
      </div>
      
      <div className="tab-content">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
```

**Ví dụ 2: Badge counts**
```typescript
function OrderSidebar() {
  const pendingCount = useAppSelector(state => 
    selectCheckoutsByStatus(state, 'pending').length
  );
  const shippingCount = useAppSelector(state =>
    selectCheckoutsByStatus(state, 'shipping').length
  );
  
  return (
    <nav>
      <a href="/orders/pending">
        Chờ xác nhận <Badge>{pendingCount}</Badge>
      </a>
      <a href="/orders/shipping">
        Đang giao <Badge>{shippingCount}</Badge>
      </a>
    </nav>
  );
}
```

**Performance tip:**
Nếu cần nhiều status counts, nên tính 1 lần:
```typescript
const orderCounts = useMemo(() => {
  const history = selectCheckoutHistory(state);
  return {
    pending: history.filter(o => o.status === 'pending').length,
    confirmed: history.filter(o => o.status === 'confirmed').length,
    shipping: history.filter(o => o.status === 'shipping').length,
    delivered: history.filter(o => o.status === 'delivered').length,
    cancelled: history.filter(o => o.status === 'cancelled').length,
  };
}, [history]);
```

---

## Phần 4: Export Actions và Reducer

### Dòng 122-127: Export actions

```typescript
export const {
  addCheckout,
  syncCheckout,
  updateCheckoutStatus,
  clearCheckoutHistory
} = checkoutSlice.actions;
```

**Action types tự động:**
- `addCheckout()` → `{ type: 'checkout/addCheckout', payload: {...} }`
- `syncCheckout()` → `{ type: 'checkout/syncCheckout', payload: {...} }`
- `updateCheckoutStatus()` → `{ type: 'checkout/updateCheckoutStatus', payload: {...} }`
- `clearCheckoutHistory()` → `{ type: 'checkout/clearCheckoutHistory' }`

---

### Dòng 128: Export reducer

```typescript
export default checkoutSlice.reducer;
```

**Sử dụng trong store.ts:**
```typescript
import checkoutReducer from './checkoutSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,  // ← Đây
    address: addressReducer,
  }
});
```

---

## Tổng kết

### Flow hoàn chỉnh: Đặt hàng

```typescript
// 1. User ở trang Cart, click "Mua hàng"
<button onClick={handleCheckout}>Mua hàng</button>

// 2. Component tạo CheckoutData
const handleCheckout = () => {
  const orderData: CheckoutData = {
    id: `ORDER_${Date.now()}`,
    items: selectedItems,
    totalAmount: calculateTotal(selectedItems),
    deliveryAddress: currentAddress,
    paymentMethod: "COD",
    orderDate: new Date().toISOString(),
    status: "pending",
    customerInfo: {
      fullName: user.name,
      phone: user.phone,
      email: user.email
    },
    addressSnapshot: {
      detailedAddress: address.detailed,
      generalAddress: address.general,
      timestamp: new Date().toISOString()
    }
  };
  
  // 3. Dispatch action
  dispatch(addCheckout(orderData));
  
  // 4. Xóa items đã mua khỏi cart
  dispatch(removeSelectBuysFromCart(selectedItems.map(i => i.id)));
  
  // 5. Navigate đến success page
  navigate('/order-success');
};

// 6. Redux lưu vào state
{
  checkout: {
    history: [...oldOrders, newOrder],
    data: newOrder
  }
}

// 7. Redux-persist lưu vào localStorage
localStorage.setItem('persist:root', JSON.stringify(state));

// 8. Success page hiển thị
function OrderSuccessPage() {
  const order = useAppSelector(selectCurrentCheckout);
  return <div>Đặt hàng thành công #{order.id}</div>;
}

// 9. Sau đó user có thể xem lại trong "Đơn hàng của tôi"
function MyOrdersPage() {
  const orders = useAppSelector(selectCheckoutHistory);
  // Hiển thị tất cả đơn hàng
}
```

### So sánh với cartSlice

| Aspect | cartSlice | checkoutSlice |
|--------|-----------|---------------|
| **Mục đích** | Quản lý giỏ hàng (tạm thời) | Quản lý đơn hàng (đã đặt) |
| **State** | items[], totalQuantity | history[], data |
| **Thao tác** | add, remove, update quantity | add order, update status |
| **Lifecycle** | Thay đổi liên tục | Immutable sau khi tạo (trừ status) |
| **Persistence** | Có (redux-persist) | Có (redux-persist) |

### Best Practices

✅ **DO:**
- Luôn generate unique ID cho mỗi đơn hàng
- Lưu snapshot đầy đủ thông tin sản phẩm (không chỉ ID)
- Check duplicate trước khi thêm
- Clear localStorage khi cần reset hoàn toàn

❌ **DON'T:**
- Không sửa items[] sau khi đơn hàng đã tạo
- Không rely vào data từ cart (phải snapshot)
- Không lưu objects nested quá sâu (khó serialize)

### Kết luận

File `checkoutSlice.ts` quản lý:
- ✅ Tạo và lưu trữ đơn hàng
- ✅ Tracking trạng thái đơn hàng
- ✅ Đồng bộ đa tabs
- ✅ Lịch sử mua hàng lâu dài
- ✅ Snapshot đầy đủ thông tin tại thời điểm checkout

**Quy tắc vàng:** Mỗi checkout phải lưu snapshot đầy đủ, không depend vào external state!
