# TYPESCRIPT MIGRATION SUMMARY - CARTSLICE & CHECKOUTSLICE

## TỔNG QUAN CÁC THAY ĐỔI

Đã chuyển đổi cartSlice.js và checkoutSlice.js sang TypeScript với cú pháp chuẩn, bao gồm:
- Định nghĩa interfaces cho state và data types
- Sử dụng PayloadAction cho type safety
- Thêm selectors với proper typing
- Loại bỏ any types

## 1. CARTSLICE.TS - NHỮNG THAY ĐỔI

### Trước (JavaScript/TypeScript không chuẩn):
```typescript
// ❌ Không có interface
const initialState = {
  items: [] as { id: number; name: string; ... }[],
  totalQuantity: 0,
};

// ❌ Không có PayloadAction
addToCart: (state, action) => {
  const newItem = action.payload; // any type
}

// ❌ Không có selectors
```

### Sau (TypeScript chuẩn):
```typescript
// ✅ Có interface rõ ràng
export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

// ✅ Sử dụng PayloadAction
addToCart: (state, action: PayloadAction<CartItem>) => {
  const newItem = action.payload; // CartItem type
}

// ✅ Có selectors với type safety
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalQuantity = (state: RootState) => state.cart.totalQuantity;
```

### Chi tiết các reducer đã sửa:

#### 1. addToCart
```typescript
// Trước: action: any
// Sau: action: PayloadAction<CartItem>
addToCart: (state, action: PayloadAction<CartItem>) => {
  const newItem = action.payload; // Type: CartItem
  // Logic không đổi, nhưng type safe
}
```

#### 2. removeFromCart
```typescript
// Trước: action: any
// Sau: action: PayloadAction<number>
removeFromCart: (state, action: PayloadAction<number>) => {
  const id = action.payload; // Type: number
  // Logic không đổi
}
```

#### 3. removeManyFromCart
```typescript
// Trước: action: any
// Sau: action: PayloadAction<number[]>
removeManyFromCart: (state, action: PayloadAction<number[]>) => {
  const idsToRemove = action.payload; // Type: number[]
  // Logic không đổi
}
```

#### 4. updateQuantity
```typescript
// Trước: action: any
// Sau: action: PayloadAction<{ id: number; quantity: number }>
updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
  const { id, quantity } = action.payload; // Type safe destructuring
  // Logic không đổi
}
```

#### 5. syncCart
```typescript
// Trước: return action.payload (có thể gây lỗi)
// Sau: Proper state update
syncCart: (state, action: PayloadAction<CartState>) => {
  state.items = action.payload.items;
  state.totalQuantity = action.payload.totalQuantity;
}
```

### Selectors mới thêm:
```typescript
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalQuantity = (state: RootState) => state.cart.totalQuantity;
export const selectCartTotal = (state: RootState) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemById = (state: RootState, id: number) => 
  state.cart.items.find(item => item.id === id);
```

## 2. CHECKOUTSLICE.TS - NHỮNG THAY ĐỔI

### Trước (JavaScript/TypeScript không chuẩn):
```typescript
// ❌ Sử dụng any types
const initialState = {
  history: [] as any[],
  data: null,
};

// ❌ PayloadAction<any>
addCheckout: (state, action: PayloadAction<any>) => {
  // any type - không type safe
}
```

### Sau (TypeScript chuẩn):
```typescript
// ✅ Interface chi tiết
export interface CheckoutData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  orderDate: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
}

export interface CheckoutState {
  history: CheckoutData[];
  data: CheckoutData | null;
}

// ✅ Type safe PayloadAction
addCheckout: (state, action: PayloadAction<CheckoutData>) => {
  // CheckoutData type - type safe
}
```

### Chi tiết các reducer đã sửa:

#### 1. addCheckout
```typescript
// Trước: PayloadAction<any>
// Sau: PayloadAction<CheckoutData>
addCheckout: (state, action: PayloadAction<CheckoutData>) => {
  state.history.push(action.payload); // Type: CheckoutData
  state.data = action.payload;
}
```

#### 2. syncCheckout
```typescript
// Trước: PayloadAction<{ history: any[]; data: any }>
// Sau: PayloadAction<{ history: CheckoutData[]; data: CheckoutData | null }>
syncCheckout: (state, action: PayloadAction<{ history: CheckoutData[]; data: CheckoutData | null }>) => {
  state.history = action.payload.history; // Type: CheckoutData[]
  state.data = action.payload.data; // Type: CheckoutData | null
}
```

#### 3. updateCheckoutStatus (Mới thêm)
```typescript
// Reducer mới để update status của order
updateCheckoutStatus: (state, action: PayloadAction<{ id: string; status: CheckoutData["status"] }>) => {
  const { id, status } = action.payload;
  
  // Update in history
  const historyItem = state.history.find(item => item.id === id);
  if (historyItem) {
    historyItem.status = status;
  }
  
  // Update current data if it matches
  if (state.data && state.data.id === id) {
    state.data.status = status;
  }
}
```

### Selectors mới thêm:
```typescript
export const selectCheckoutHistory = (state: RootState) => state.checkout.history;
export const selectCurrentCheckout = (state: RootState) => state.checkout.data;
export const selectCheckoutById = (state: RootState, id: string) => 
  state.checkout.history.find(item => item.id === id);
export const selectCheckoutsByStatus = (state: RootState, status: CheckoutData["status"]) => 
  state.checkout.history.filter(item => item.status === status);
```

## 3. LỢI ÍCH CỦA VIỆC MIGRATION

### Type Safety:
```typescript
// ✅ Compile-time error checking
dispatch(addToCart({
  id: 1,
  name: "Product",
  // price: "invalid" // ❌ Error: string không assign được cho number
  price: 100 // ✅ Đúng
}));

// ✅ IntelliSense support
const cartItems = useSelector(selectCartItems); // Type: CartItem[]
cartItems.forEach(item => {
  console.log(item.name); // ✅ IntelliSense gợi ý properties
});
```

### Better Developer Experience:
```typescript
// ✅ Autocomplete khi destructuring
const { id, quantity } = action.payload; // IDE biết chính xác structure

// ✅ Error prevention
dispatch(updateQuantity({ id: 1 })); // ❌ Error: thiếu quantity
dispatch(updateQuantity({ id: 1, quantity: 2 })); // ✅ Đúng
```

### Refactoring Safety:
```typescript
// Nếu thay đổi CartItem interface
interface CartItem {
  id: number;
  // name: string; ← Xóa field này
  title: string; // ← Thêm field mới
  // ...
}

// TypeScript sẽ báo lỗi ở TẤT CẢ nơi sử dụng item.name
// Giúp refactor an toàn và không bỏ sót
```

## 4. CÁCH SỬ DỤNG TRONG COMPONENT

### Cart Component:
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectTotalQuantity, 
  selectCartTotal,
  addToCart, 
  removeFromCart,
  CartItem 
} from './store/cartSlice';

const CartComponent: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems); // Type: CartItem[]
  const totalQuantity = useSelector(selectTotalQuantity); // Type: number
  const cartTotal = useSelector(selectCartTotal); // Type: number

  const handleAddToCart = (product: CartItem) => {
    dispatch(addToCart(product)); // Type safe
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id)); // Type safe
  };

  return (
    <div>
      <h2>Cart ({totalQuantity} items)</h2>
      <p>Total: ${cartTotal}</p>
      {cartItems.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>${item.price}</span>
          <button onClick={() => handleRemoveFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Checkout Component:
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCheckoutHistory, 
  selectCurrentCheckout,
  addCheckout,
  updateCheckoutStatus,
  CheckoutData 
} from './store/checkoutSlice';

const CheckoutComponent: React.FC = () => {
  const dispatch = useDispatch();
  const checkoutHistory = useSelector(selectCheckoutHistory); // Type: CheckoutData[]
  const currentCheckout = useSelector(selectCurrentCheckout); // Type: CheckoutData | null

  const handleCheckout = (orderData: CheckoutData) => {
    dispatch(addCheckout(orderData)); // Type safe
  };

  const handleUpdateStatus = (id: string, status: CheckoutData["status"]) => {
    dispatch(updateCheckoutStatus({ id, status })); // Type safe
  };

  return (
    <div>
      <h2>Order History</h2>
      {checkoutHistory.map(order => (
        <div key={order.id}>
          <span>Order #{order.id}</span>
          <span>Status: {order.status}</span>
          <span>Total: ${order.totalAmount}</span>
          <button onClick={() => handleUpdateStatus(order.id, "delivered")}>
            Mark as Delivered
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 5. BEST PRACTICES ĐÃ ÁP DỤNG

### 1. Interface Naming:
- `CartItem` - Đại diện cho 1 item trong giỏ hàng
- `CartState` - State của cart slice
- `CheckoutData` - Dữ liệu của 1 order
- `CheckoutState` - State của checkout slice

### 2. PayloadAction Usage:
- Luôn specify type cho payload
- Sử dụng union types cho status: `"pending" | "confirmed" | ...`
- Object payload với destructuring: `{ id: number; quantity: number }`

### 3. Selectors:
- Tách riêng selectors để reuse
- Type return value rõ ràng
- Computed selectors (như `selectCartTotal`)

### 4. State Updates:
- Không return new state, sử dụng Immer mutations
- Proper error handling
- Consistent naming conventions

## 6. MIGRATION CHECKLIST

- ✅ Định nghĩa interfaces cho tất cả data types
- ✅ Thay thế `any` bằng specific types
- ✅ Sử dụng `PayloadAction<T>` cho tất cả reducers
- ✅ Thêm selectors với proper typing
- ✅ Export interfaces để sử dụng trong components
- ✅ Kiểm tra không có TypeScript errors
- ✅ Test functionality vẫn hoạt động đúng

Việc migration này đảm bảo code base type-safe, maintainable và scalable hơn!