# Luồng dữ liệu từ Cart đến BuyerInfo

## 📌 Câu hỏi
**Dữ liệu khi mua hàng thành công ở `/cart` được lưu vào đâu và lấy từ đâu để hiển thị ở `/buyer-info`?**

---

## 🔄 Luồng dữ liệu chi tiết

### Bước 1: User ở trang Cart (http://localhost:3000/cart)

**File:** `CartPage.jsx`

```javascript
// Dòng ~77: User nhấn nút "Đặt hàng"
const handleCheckoutClick = () => {
    setShowCheckoutForm(true);  // Hiện form nhập thông tin
};
```

**Dữ liệu được truyền vào CheckoutForm:**
```javascript
// Dòng ~470: Render CheckoutForm
<CheckoutForm
    onSubmit={handleCheckoutSubmit}
    onCancel={handleCheckoutCancel}
    meta={{ products: cartItems.filter(item => selectedItems.includes(item.id)) }}
/>
```

- `meta.products`: Danh sách sản phẩm đã chọn mua (từ giỏ hàng)

---

### Bước 2: User nhập thông tin trong CheckoutForm

**File:** `CheckoutForm.jsx`

```javascript
// Dòng 11-27: Xử lý khi submit form
const onFormSubmit = async (data) => {
    // 1. Tạo payload chứa đầy đủ thông tin
    const payload = { 
        ...data,              // fullName, phone, email, addressDetail, note
        meta: meta || null,   // Danh sách sản phẩm từ CartPage
        createdAt: Date.now() // Timestamp tạo đơn hàng
    };
    
    // 2. ⭐ LƯU VÀO REDUX STORE
    dispatch(saveCheckout(payload));
    
    // 3. Gọi callback để CartPage xử lý (xóa sản phẩm khỏi giỏ)
    if (typeof onSubmit === 'function') {
        const res = onSubmit(payload);
        if (res && typeof res.then === 'function') {
            await res;
        }
    }
    
    // 4. Reset form
    reset();
};
```

**Cấu trúc payload:**
```javascript
{
    fullName: "Nguyễn Văn A",
    phone: "0911111111",
    email: "a@gmail.com",
    addressDetail: "123 Đường ABC",
    note: "Giao hàng buổi sáng",
    meta: {
        products: [
            { id: 1, name: "Sản phẩm A", price: 100000, quantity: 2, image: "..." },
            { id: 2, name: "Sản phẩm B", price: 200000, quantity: 1, image: "..." }
        ]
    },
    createdAt: 1732368145000
}
```

---

### Bước 3: Redux Reducer xử lý action saveCheckout

**File:** `checkoutSlice.js`

```javascript
// Dòng 15-20: Reducer saveCheckout
saveCheckout: (state, action) => {
    const entry = action.payload;
    
    // ⭐ Thêm đơn hàng vào mảng history
    state.history.push(entry);
    
    // Lưu đơn hàng mới nhất vào data
    state.data = entry;
    
    // Cập nhật timestamp để đồng bộ cross-tab
    state.lastUpdated = Date.now();
}
```

**Redux State sau khi lưu:**
```javascript
{
    checkout: {
        data: {
            fullName: "Nguyễn Văn A",
            phone: "0911111111",
            // ... thông tin đơn hàng mới nhất
        },
        history: [
            { fullName: "Nguyễn Văn A", createdAt: 1732368145000, ... },
            { fullName: "Trần Thị B", createdAt: 1732368100000, ... },
            // ... các đơn hàng cũ hơn
        ],
        lastUpdated: 1732368145000,
        lastReset: 0
    }
}
```

---

### Bước 4: Redux-Persist tự động lưu vào LocalStorage

**File:** `store.js`

```javascript
// Dòng 22-26: Cấu hình persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["cart", "checkout"],  // ⭐ Lưu cả checkout slice
};
```

**Quá trình tự động:**
1. Redux-persist theo dõi Redux store
2. Khi `checkout` state thay đổi
3. Tự động serialize thành JSON string
4. Lưu vào `localStorage` với key `"persist:root"`

**LocalStorage sau khi lưu:**
```
Key: "persist:root"
Value: {
    "checkout": "{\"data\":{\"fullName\":\"Nguyễn Văn A\",...},\"history\":[...],\"lastUpdated\":1732368145000,\"lastReset\":0}"
}
```

---

### Bước 5: BuyerInfo đọc dữ liệu từ Redux Store

**File:** `BuyerInfo.jsx`

```javascript
// Dòng 10: Đọc history từ Redux
const history = useSelector(selectCheckoutHistory);
```

**File:** `checkoutSlice.js`

```javascript
// Dòng 64-72: Selector lấy history (có filter)
export const selectCheckoutHistory = createSelector(
    [selectCheckoutState],
    (checkout) => {
        const { history, lastReset } = checkout;
        
        // Trả về mảng rỗng nếu không có history
        if (!history || !Array.isArray(history)) return [];
        
        // Nếu chưa xóa lịch sử, trả về toàn bộ
        if (!lastReset) return history;
        
        // ⭐ Filter ra các đơn hàng cũ (đã bị xóa)
        return history.filter((item) => (item.createdAt || 0) > lastReset);
    }
);
```

**Dữ liệu `history` nhận được:**
```javascript
[
    { fullName: "Nguyễn Văn A", createdAt: 1732368145000, meta: {...}, ... },
    { fullName: "Trần Thị B", createdAt: 1732368100000, meta: {...}, ... },
    // ... các đơn hàng khác
]
```

---

### Bước 6: Hiển thị lên UI

**File:** `BuyerInfo.jsx`

```javascript
// Dòng 70-130: Render danh sách đơn hàng
{history.slice().reverse().map((entry, idx) => {
    // Lấy danh sách sản phẩm
    const products = entry.meta?.products || [];
    
    // Tính tổng tiền
    const totalOrderValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    return (
        <div key={idx} className="order-card">
            {/* Hiển thị ngày đặt */}
            <span>{new Date(entry.createdAt).toLocaleString()}</span>
            
            {/* Hiển thị tổng tiền */}
            <span>{formatPrice(totalOrderValue)}₫</span>
            
            {/* Hiển thị thông tin người nhận */}
            <div>Họ tên: {entry.fullName}</div>
            <div>SĐT: {entry.phone}</div>
            <div>Email: {entry.email}</div>
            
            {/* Hiển thị danh sách sản phẩm */}
            {products.map((product, pIdx) => (
                <div key={pIdx}>
                    <img src={product.image} />
                    <div>{product.name}</div>
                    <div>Số lượng: {product.quantity}</div>
                    <div>{formatPrice(product.price)}₫</div>
                </div>
            ))}
        </div>
    );
})}
```

---

## 📊 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 1: CartPage                                               │
│  User chọn sản phẩm → Nhấn "Đặt hàng"                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 2: CheckoutForm                                           │
│  User nhập: fullName, phone, email, addressDetail, note         │
│  Nhấn "Xác nhận đặt hàng"                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 3: Redux Action                                           │
│  dispatch(saveCheckout(payload))                                │
│  ↓                                                               │
│  Reducer: state.history.push(entry)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 4: Redux-Persist                                          │
│  Tự động lưu Redux state vào LocalStorage                       │
│  Key: "persist:root"                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 5: BuyerInfo                                              │
│  const history = useSelector(selectCheckoutHistory)             │
│  ↓                                                               │
│  Đọc từ Redux Store (đã restore từ LocalStorage)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  BƯỚC 6: UI Rendering                                           │
│  Hiển thị danh sách đơn hàng với đầy đủ thông tin              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Nơi lưu trữ dữ liệu

### 1. Redux Store (RAM - Bộ nhớ tạm)
- **Vị trí:** Trong bộ nhớ của trình duyệt
- **Thời gian sống:** Chỉ tồn tại khi app đang chạy
- **Mất khi:** Reload trang, đóng tab
- **Cấu trúc:**
```javascript
{
    checkout: {
        data: {...},      // Đơn hàng mới nhất
        history: [...],   // Tất cả đơn hàng
        lastUpdated: 0,
        lastReset: 0
    }
}
```

### 2. LocalStorage (Disk - Lưu trữ vĩnh viễn)
- **Vị trí:** Ổ cứng của máy tính
- **Thời gian sống:** Vĩnh viễn (cho đến khi xóa)
- **Không mất khi:** Reload trang, đóng tab, tắt máy
- **Key:** `"persist:root"`
- **Value:** JSON string của Redux state

**Xem LocalStorage:**
1. Mở DevTools (F12)
2. Tab "Application"
3. Sidebar "Storage" → "Local Storage"
4. Chọn `http://localhost:3000`
5. Tìm key `persist:root`

---

## 🔄 Khi reload trang

### Quá trình restore:
```
1. User reload trang
   ↓
2. Redux-persist đọc từ LocalStorage
   ↓
3. Parse JSON string → Object
   ↓
4. Restore vào Redux Store
   ↓
5. BuyerInfo đọc từ Redux Store
   ↓
6. Hiển thị dữ liệu cũ (không bị mất)
```

---

## 🌐 Đồng bộ giữa nhiều tab

### Khi mở 2 tab cùng lúc:

**Tab A:**
```
1. User đặt hàng mới
   ↓
2. Redux Store cập nhật
   ↓
3. Redux-persist lưu vào LocalStorage
   ↓
4. LocalStorage thay đổi
```

**Tab B:**
```
1. Nhận sự kiện 'storage' (từ window)
   ↓
2. BuyerInfo.jsx: useEffect lắng nghe
   ↓
3. Parse dữ liệu mới từ LocalStorage
   ↓
4. dispatch(syncFromStorage(checkoutState))
   ↓
5. Redux Store cập nhật
   ↓
6. UI tự động re-render với dữ liệu mới
```

**Code xử lý:**
```javascript
// BuyerInfo.jsx - Dòng 13-33
useEffect(() => {
    const handleStorageChange = (e) => {
        if (e.key === 'persist:root') {
            const rootState = JSON.parse(e.newValue);
            if (rootState && rootState.checkout) {
                const checkoutState = JSON.parse(rootState.checkout);
                dispatch(syncFromStorage(checkoutState));
            }
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
}, [dispatch]);
```

---

## ❓ Câu hỏi thường gặp

### Q1: Tại sao cần lưu vào cả Redux Store và LocalStorage?
**A:** 
- **Redux Store:** Để component đọc nhanh (trong RAM)
- **LocalStorage:** Để không mất dữ liệu khi reload trang

### Q2: Dữ liệu có được gửi lên server không?
**A:** Không. Hiện tại chỉ lưu ở client (trình duyệt). Nếu muốn lưu vào database, cần:
1. Tạo API endpoint (backend)
2. Gọi API trong `onFormSubmit` của CheckoutForm
3. Lưu vào database

### Q3: Nếu xóa LocalStorage thì sao?
**A:** 
- Dữ liệu trong Redux Store vẫn còn (cho đến khi reload)
- Sau khi reload, dữ liệu sẽ mất hoàn toàn

### Q4: Dữ liệu có bị mất khi đóng trình duyệt không?
**A:** Không. LocalStorage lưu vĩnh viễn, chỉ mất khi:
- User xóa cache/cookies
- User xóa LocalStorage thủ công
- Code gọi `localStorage.clear()`

---

## 📝 Tóm tắt

| Câu hỏi | Trả lời |
|---------|---------|
| **Dữ liệu lưu ở đâu?** | Redux Store (RAM) + LocalStorage (Disk) |
| **Ai lưu vào LocalStorage?** | Redux-persist (tự động) |
| **BuyerInfo lấy từ đâu?** | Redux Store qua `useSelector(selectCheckoutHistory)` |
| **Reload có mất dữ liệu không?** | Không, redux-persist restore từ LocalStorage |
| **Đồng bộ nhiều tab?** | Có, qua sự kiện `storage` |

---

## 🔗 Các file liên quan

1. **CartPage.jsx**: Truyền dữ liệu sản phẩm vào CheckoutForm
2. **CheckoutForm.jsx**: Thu thập thông tin user, dispatch action
3. **checkoutSlice.js**: Định nghĩa reducer, selector
4. **store.js**: Cấu hình redux-persist
5. **BuyerInfo.jsx**: Đọc và hiển thị dữ liệu
