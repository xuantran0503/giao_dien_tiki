# STORE TYPESCRIPT UPGRADE - CHUẨN HÓA CẤU TRÚC

## TỔNG QUAN THAY ĐỔI

Đã nâng cấp toàn bộ Redux store sang TypeScript chuẩn với:
- ✅ Centralized RootState definition
- ✅ Proper type exports
- ✅ Typed hooks
- ✅ Consistent selector patterns
- ✅ Redux-persist integration

---

## 1. STORE.TS - CẤU TRÚC CHÍNH

### Trước (store.js):
```javascript
// ❌ Không có type definitions
import cartReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";
import addressReducer from "./addressSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  address: addressReducer,
});

// ❌ Không export types
export default store;
```

### Sau (store.ts):
```typescript
// ✅ Import với state types
import cartReducer, { CartState } from "./cartSlice";
import checkoutReducer, { CheckoutState } from "./checkoutSlice";
import addressReducer, { AddressState } from "./addressSlice";

// ✅ Centralized RootState definition
export interface RootState {
  cart: CartState;
  checkout: CheckoutState;
  address: AddressState;
}

// ✅ Export typed dispatch và store
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
```

---

## 2. TYPED HOOKS (hooks.ts)

### Tạo typed hooks để sử dụng trong components:
```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ✅ Typed hooks thay thế useDispatch và useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Lợi ích:
- **Type Safety**: Tự động infer types cho state và actions
- **IntelliSense**: IDE gợi ý đầy đủ
- **Error Prevention**: Compile-time error checking

---

## 3. SELECTORS PATTERN CHUẨN HÓA

### Trước (Mỗi slice định nghĩa RootState riêng):
```typescript
// ❌ Conflict - mỗi slice có RootState khác nhau
// cartSlice.ts
interface RootState {
  cart: CartState;
}

// addressSlice.ts  
interface RootState {
  address: AddressState;
}
```

### Sau (Selectors sử dụng partial state):
```typescript
// ✅ Consistent - sử dụng partial state typing
// cartSlice.ts
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

// addressSlice.ts
export const selectAddressData = (state: { address: AddressState }) => state.address.addressData;

// checkoutSlice.ts
export const selectCheckoutHistory = (state: { checkout: CheckoutState }) => state.checkout.history;
```

---

## 4. REDUX-PERSIST INTEGRATION

### Proper TypeScript configuration:
```typescript
import { PersistConfig } from "redux-persist";

// ✅ Typed persist config
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["cart", "address", "checkout"], // Specify which slices to persist
};

// ✅ Typed persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
```

---

## 5. CÁCH SỬ DỤNG TRONG COMPONENTS

### Trước (Không type safe):
```typescript
// ❌ Cách cũ - không type safe
import { useSelector, useDispatch } from 'react-redux';

const Component = () => {
  const dispatch = useDispatch(); // any type
  const cartItems = useSelector(state => state.cart.items); // any type
  
  // Không có IntelliSense, có thể lỗi runtime
};
```

### Sau (Type safe):
```typescript
// ✅ Cách mới - type safe
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartItems, addToCart } from '../store/cartSlice';
import type { CartItem } from '../store/cartSlice';

const Component: React.FC = () => {
  const dispatch = useAppDispatch(); // AppDispatch type
  const cartItems = useAppSelector(selectCartItems); // CartItem[] type
  
  const handleAddToCart = (item: CartItem) => {
    dispatch(addToCart(item)); // Type safe dispatch
  };
  
  // ✅ Full IntelliSense support
  // ✅ Compile-time error checking
};
```

---

## 6. SELECTOR USAGE PATTERNS

### Basic Selectors:
```typescript
// ✅ Simple state selection
const cartItems = useAppSelector(selectCartItems);
const totalQuantity = useAppSelector(selectTotalQuantity);
const addressData = useAppSelector(selectAddressData);
```

### Parameterized Selectors:
```typescript
// ✅ Selectors with parameters
const cartItem = useAppSelector(state => selectCartItemById(state, itemId));
const checkout = useAppSelector(state => selectCheckoutById(state, orderId));
```

### Computed Selectors:
```typescript
// ✅ Computed values
const cartTotal = useAppSelector(selectCartTotal);
const districts = useAppSelector(selectDistrictsByCity);
const wards = useAppSelector(selectWardsByDistrict);
```

---

## 7. TYPE EXPORTS STRUCTURE

### Từ store.ts:
```typescript
export type { RootState, AppDispatch, AppStore };
```

### Từ các slices:
```typescript
// cartSlice.ts
export type { CartItem, CartState };

// addressSlice.ts  
export type { Ward, District, City, AddressState };

// checkoutSlice.ts
export type { CheckoutData, CheckoutState };
```

---

## 8. MIGRATION BENEFITS

### Type Safety:
```typescript
// ✅ Compile-time error prevention
dispatch(addToCart({
  id: 1,
  name: "Product",
  // price: "invalid" // ❌ Error: Type 'string' is not assignable to type 'number'
  price: 100 // ✅ Correct
}));
```

### IntelliSense:
```typescript
// ✅ Full autocomplete support
const cartItems = useAppSelector(selectCartItems);
cartItems.forEach(item => {
  console.log(item.name); // ✅ IDE suggests: id, name, price, quantity, etc.
});
```

### Refactoring Safety:
```typescript
// Nếu thay đổi CartItem interface
interface CartItem {
  id: number;
  // name: string; ← Remove this
  title: string; // ← Add this
  price: number;
}

// TypeScript sẽ báo lỗi ở TẤT CẢ nơi sử dụng item.name
// Giúp refactor an toàn 100%
```

---

## 9. BEST PRACTICES ĐÃ ÁP DỤNG

### 1. Centralized Type Definitions:
- ✅ RootState định nghĩa tại store.ts
- ✅ Mỗi slice export own state type
- ✅ Không duplicate RootState definitions

### 2. Consistent Selector Patterns:
- ✅ Selectors sử dụng partial state typing
- ✅ Parameterized selectors cho dynamic data
- ✅ Computed selectors cho derived state

### 3. Typed Hooks:
- ✅ useAppDispatch thay vì useDispatch
- ✅ useAppSelector thay vì useSelector
- ✅ Full type inference

### 4. Proper Exports:
- ✅ Export types và interfaces
- ✅ Export selectors và actions
- ✅ Clear separation of concerns

---

## 10. TESTING COMPATIBILITY

### Store configuration hỗ trợ testing:
```typescript
// store.ts có thể được sử dụng trong tests
import store, { RootState } from '../store/store';

// Mock store for testing
const mockState: RootState = {
  cart: { items: [], totalQuantity: 0 },
  address: { /* mock address state */ },
  checkout: { history: [], data: null }
};
```

---

## 11. PERFORMANCE CONSIDERATIONS

### Selector Optimization:
```typescript
// ✅ Memoized selectors (có thể thêm reselect sau này)
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

// ✅ Efficient filtering
export const selectDistrictsByCity = (state: { address: AddressState }) => {
  const { addressData, selectedCity } = state.address;
  if (!selectedCity) return [];
  
  const city = addressData.find((c) => c.code === Number(selectedCity));
  return city?.districts || [];
};
```

---

## 12. FUTURE ENHANCEMENTS

### Có thể thêm sau này:
1. **Reselect**: Memoized selectors cho performance
2. **RTK Query**: API state management
3. **DevTools**: Enhanced debugging
4. **Middleware**: Custom middleware với proper typing

---

## 📋 CHECKLIST HOÀN THÀNH

- ✅ store.js → store.ts với proper typing
- ✅ Centralized RootState definition
- ✅ Typed hooks (useAppDispatch, useAppSelector)
- ✅ Consistent selector patterns across slices
- ✅ Redux-persist integration với TypeScript
- ✅ Export proper types cho components
- ✅ Không có TypeScript errors
- ✅ Backward compatibility maintained

## 🎯 KẾT QUẢ

Store hiện tại đã **100% type-safe** và tuân thủ best practices của Redux Toolkit + TypeScript. Components có thể sử dụng typed hooks để có full IntelliSense và compile-time error checking!