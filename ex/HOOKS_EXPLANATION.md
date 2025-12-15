# HOOKS.TS - TYPED REDUX HOOKS EXPLANATION

## 🤔 FILE HOOKS.TS DÙNG ĐỂ LÀM GÌ?

### **MỤC ĐÍCH CHÍNH:**
File `hooks.ts` tạo ra **typed versions** của `useSelector` và `useDispatch` để sử dụng với Redux + TypeScript một cách **type-safe**.

### **NỘI DUNG FILE:**
```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ✅ Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ✅ Typed selector hook  
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 🎯 TẠI SAO CẦN HOOKS.TS?

### **VẤN ĐỀ VỚI CÁCH CŨ:**
```typescript
// ❌ Cách cũ - không type safe
import { useSelector, useDispatch } from 'react-redux';

const Component = () => {
  const dispatch = useDispatch(); // ❌ any type
  const data = useSelector(state => state.cart.items); // ❌ any type
  
  // ❌ Không có IntelliSense
  // ❌ Không có compile-time error checking
  // ❌ Có thể access sai field: state.cart.wrongField
};
```

### **GIẢI PHÁP VỚI HOOKS.TS:**
```typescript
// ✅ Cách mới - type safe
import { useAppSelector, useAppDispatch } from '../store/hooks';

const Component = () => {
  const dispatch = useAppDispatch(); // ✅ AppDispatch type
  const data = useAppSelector(state => state.cart.items); // ✅ CartItem[] type
  
  // ✅ Full IntelliSense support
  // ✅ Compile-time error checking
  // ✅ TypeScript báo lỗi nếu access sai field
};
```

---

## 📍 HIỆN TẠI ĐANG ĐƯỢC SỬ DỤNG Ở ĐÂU?

### **TRẠNG THÁI HIỆN TẠI:**
**CHƯA ĐƯỢC SỬ DỤNG!** Components vẫn đang dùng cách cũ:

```typescript
// ❌ AddressSelector.tsx vẫn dùng cách cũ
import { useDispatch, useSelector } from "react-redux";

const AddressSelector = () => {
  const dispatch = useDispatch<any>(); // ❌ Manual typing
  const addressData = useSelector(selectAddressData); // ❌ Không type safe
};
```

### **NÊN SỬ DỤNG:**
```typescript
// ✅ Nên chuyển sang dùng typed hooks
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const AddressSelector = () => {
  const dispatch = useAppDispatch(); // ✅ Auto-typed
  const addressData = useAppSelector(selectAddressData); // ✅ Type safe
};
```

---

## 🔄 CÁCH CHUYỂN ĐỔI SANG SỬ DỤNG HOOKS.TS

### **BƯỚC 1: Cập nhật AddressSelector.tsx**

#### **Trước:**
```typescript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddressSelector.css";

const AddressSelector = ({ onLoginClick, forceOpen = false, onClose }) => {
  const dispatch = useDispatch<any>(); 
  
  const addressData = useSelector(selectAddressData);
  const status = useSelector(selectAddressStatus);
  // ...
};
```

#### **Sau:**
```typescript
import React, { useEffect } from "react";
import "./AddressSelector.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const AddressSelector = ({ onLoginClick, forceOpen = false, onClose }) => {
  const dispatch = useAppDispatch(); // ✅ Auto-typed
  
  const addressData = useAppSelector(selectAddressData);
  const status = useAppSelector(selectAddressStatus);
  // ...
};
```

### **BƯỚC 2: Cập nhật các components khác**

#### **Pattern chung:**
```typescript
// ❌ Thay thế imports cũ
// import { useDispatch, useSelector } from "react-redux";

// ✅ Bằng imports mới
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Component = () => {
  // ❌ Thay thế
  // const dispatch = useDispatch();
  // const data = useSelector(selector);
  
  // ✅ Bằng
  const dispatch = useAppDispatch();
  const data = useAppSelector(selector);
};
```

---

## 💡 LỢI ÍCH KHI SỬ DỤNG HOOKS.TS

### **1. Type Safety:**
```typescript
// ✅ Dispatch actions với type checking
dispatch(addToCart(item)); // TypeScript kiểm tra item có đúng CartItem type
dispatch(setSelectedCity("Hà Nội")); // TypeScript kiểm tra parameter là string

// ❌ Lỗi sẽ được phát hiện compile-time
dispatch(addToCart("invalid")); // Error: string không phải CartItem
```

### **2. IntelliSense Support:**
```typescript
// ✅ Khi gõ useAppSelector, IDE sẽ gợi ý:
const data = useAppSelector(state => {
  // state. ← IDE hiển thị: cart, address, checkout
  return state.cart. // ← IDE hiển thị: items, totalQuantity
});
```

### **3. Refactoring Safety:**
```typescript
// Nếu thay đổi RootState structure
interface RootState {
  // cart: CartState; ← Remove this
  shopping: CartState; // ← Rename to this
  address: AddressState;
  checkout: CheckoutState;
}

// TypeScript sẽ báo lỗi ở TẤT CẢ nơi sử dụng state.cart
// Giúp refactor an toàn 100%
```

### **4. Better Error Messages:**
```typescript
// ❌ Cách cũ - error message khó hiểu
const data = useSelector(state => state.cart.wrongField); 
// Runtime error: Cannot read property 'wrongField' of undefined

// ✅ Cách mới - clear compile-time error
const data = useAppSelector(state => state.cart.wrongField);
// TypeScript error: Property 'wrongField' does not exist on type 'CartState'
```

---

## 🛠️ IMPLEMENTATION EXAMPLES

### **Cart Component Example:**
```typescript
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectCartItems, 
  selectTotalQuantity, 
  addToCart, 
  removeFromCart 
} from '../store/cartSlice';

const CartComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems); // ✅ CartItem[]
  const totalQuantity = useAppSelector(selectTotalQuantity); // ✅ number

  const handleAddToCart = (item: CartItem) => {
    dispatch(addToCart(item)); // ✅ Type safe
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id)); // ✅ Type safe
  };

  return (
    <div>
      <h2>Cart ({totalQuantity} items)</h2>
      {cartItems.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => handleRemoveFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
```

### **Address Component Example:**
```typescript
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectAddressData,
  selectSelectedCity,
  setSelectedCity,
  fetchAddressData 
} from '../store/addressSlice';

const AddressComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const addressData = useAppSelector(selectAddressData); // ✅ City[]
  const selectedCity = useAppSelector(selectSelectedCity); // ✅ string

  React.useEffect(() => {
    dispatch(fetchAddressData()); // ✅ Type safe async action
  }, [dispatch]);

  const handleCityChange = (cityCode: string) => {
    dispatch(setSelectedCity(cityCode)); // ✅ Type safe
  };

  return (
    <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
      {addressData.map(city => (
        <option key={city.code} value={city.code}>
          {city.name}
        </option>
      ))}
    </select>
  );
};
```

---

## 🔧 MIGRATION PLAN

### **Phase 1: Core Components (Ưu tiên cao)**
```
1. AddressSelector.tsx
2. Header.tsx (nếu có sử dụng Redux)
3. CartPage.tsx
4. CheckoutForm.tsx
```

### **Phase 2: Feature Components**
```
1. ProductCard components
2. Search components  
3. User profile components
```

### **Phase 3: Page Components**
```
1. HomePage.tsx
2. ProductDetailPage.tsx
3. CategoryPage.tsx
```

---

## 📋 MIGRATION CHECKLIST

### **Cho mỗi component:**
- [ ] Replace `import { useDispatch, useSelector } from "react-redux"`
- [ ] With `import { useAppDispatch, useAppSelector } from "../store/hooks"`
- [ ] Replace `useDispatch()` with `useAppDispatch()`
- [ ] Replace `useSelector()` with `useAppSelector()`
- [ ] Remove manual typing: `useDispatch<any>()`
- [ ] Test component functionality
- [ ] Verify TypeScript compilation

---

## 🎯 BEST PRACTICES

### **1. Consistent Import Path:**
```typescript
// ✅ Always use relative path to hooks
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
```

### **2. Use with Selectors:**
```typescript
// ✅ Combine với selectors để có type safety tối đa
import { selectCartItems } from "../store/cartSlice";

const cartItems = useAppSelector(selectCartItems); // ✅ Full type inference
```

### **3. Avoid Manual Typing:**
```typescript
// ❌ Không cần manual typing nữa
const dispatch = useAppDispatch<AppDispatch>(); // ❌ Redundant

// ✅ Auto-typed
const dispatch = useAppDispatch(); // ✅ Already typed
```

---

## 🚀 NEXT STEPS

### **Để bắt đầu sử dụng hooks.ts:**

1. **Update AddressSelector.tsx** (component đang mở):
   ```bash
   # Replace imports và hooks calls
   ```

2. **Test functionality**:
   ```bash
   npm start
   # Verify address selection vẫn hoạt động
   ```

3. **Gradually migrate other components**:
   ```bash
   # Migrate từng component một
   ```

4. **Remove old patterns**:
   ```bash
   # Sau khi migrate xong, có thể remove useDispatch<any>
   ```

---

## 🎉 CONCLUSION

### **hooks.ts là:**
- 🔧 **Utility file** tạo typed Redux hooks
- 🎯 **Best practice** cho Redux + TypeScript
- 💡 **Developer experience enhancer**
- 🛡️ **Type safety provider**

### **Hiện tại:**
- ✅ File đã được tạo và sẵn sàng sử dụng
- ⚠️ Chưa được sử dụng trong components
- 🎯 Cần migrate components để tận dụng benefits

### **Lợi ích khi sử dụng:**
- 🔒 Full type safety
- 💡 Better IntelliSense  
- 🔄 Safe refactoring
- 🐛 Fewer runtime errors

**Sẵn sàng để migration! 🚀**