# Giải thích chi tiết: hooks.ts

## Tổng quan
File `hooks.ts` là một file tiện ích (utility file) nhỏ nhưng cực kỳ quan trọng trong việc sử dụng Redux Toolkit với TypeScript. File này cung cấp các custom hooks đã được typed-safe để sử dụng trong toàn bộ ứng dụng React.

---

## Phân tích từng dòng code

### Dòng 1: Import các dependencies

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
```

**Giải thích:**
- `useDispatch`: Hook cơ bản của React-Redux để gửi (dispatch) các actions đến Redux store
- `useSelector`: Hook cơ bản để đọc dữ liệu từ Redux store
- `TypedUseSelectorHook`: Một type helper từ React-Redux giúp tạo ra một selector hook với type an toàn

**Tại sao cần import?**
- Chúng ta sẽ wrap các hooks này để thêm TypeScript type safety

---

### Dòng 2: Import types từ store

```typescript
import type { RootState, AppDispatch } from './store';
```

**Giải thích:**
- `RootState`: Type đại diện cho toàn bộ state tree của Redux store (chứa cart, checkout, address, etc.)
- `AppDispatch`: Type đại diện cho dispatch function của store, bao gồm cả middleware (như redux-thunk)
- Từ khóa `type` trước `import` cho TypeScript biết đây là import chỉ để type checking, sẽ được xóa khi compile

**Ví dụ về RootState:**
```typescript
// RootState sẽ có dạng:
{
  cart: CartState,
  checkout: CheckoutState,
  address: AddressState
}
```

---

### Dòng 4: Export useAppDispatch hook

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

**Giải thích chi tiết:**

**1. Mục đích:**
- Tạo một custom hook để dispatch actions với type safety
- Thay vì dùng `useDispatch()` thông thường, ta dùng `useAppDispatch()` để có type hints

**2. Cách hoạt động:**
- `useDispatch<AppDispatch>()`: Thêm generic type `AppDispatch` vào hook gốc
- Return về một dispatch function đã được typed

**3. Lợi ích:**
```typescript
// ❌ KHÔNG TỐT: Dùng useDispatch thông thường
const dispatch = useDispatch();
dispatch(addToCart(item)); // TypeScript không biết addToCart có đúng không

// ✅ TỐT: Dùng useAppDispatch
const dispatch = useAppDispatch();
dispatch(addToCart(item)); // TypeScript check type của action và payload
```

**4. Ví dụ sử dụng:**
```typescript
function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = () => {
    // TypeScript sẽ autocomplete và check type
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      // ... TypeScript sẽ yêu cầu đúng các field của CartItem
    }));
  };
}
```

---

### Dòng 5: Export useAppSelector hook

```typescript
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Giải thích chi tiết:**

**1. Mục đích:**
- Tạo một custom hook để select data từ store với type safety
- TypeScript sẽ biết chính xác cấu trúc của state

**2. Cách hoạt động:**
- `TypedUseSelectorHook<RootState>`: Type helper giúp bind RootState type vào useSelector
- Assignment trực tiếp `= useSelector`: Tạo alias với type đã được specify

**3. Lợi ích:**
```typescript
// ❌ KHÔNG TỐT: Dùng useSelector thông thường
const items = useSelector(state => state.cart.items); 
// state có type any, không có autocomplete

// ✅ TỐT: Dùng useAppSelector
const items = useAppSelector(state => state.cart.items);
// state có type RootState, có full autocomplete
// TypeScript biết state.cart.items là CartItem[]
```

**4. Ví dụ sử dụng:**
```typescript
function CartSummary() {
  // TypeScript biết chính xác:
  // - state.cart tồn tại
  // - items là CartItem[]
  // - totalQuantity là number
  const items = useAppSelector(state => state.cart.items);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  
  // Autocomplete hoạt động hoàn hảo
  return (
    <div>
      <p>Tổng sản phẩm: {totalQuantity}</p>
      {items.map(item => (
        // TypeScript biết item có các properties: id, name, price, etc.
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

**5. So sánh hai cách khai báo:**
```typescript
// Cách 1: Như trong code (type annotation)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Cách 2: Dùng as (type assertion)
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;

// Cả hai đều đúng, nhưng cách 1 an toàn hơn vì TypeScript check chặt chẽ hơn
```

---

## Tại sao cần file hooks.ts?

### 1. **Type Safety (An toàn kiểu dữ liệu)**
```typescript
// Không có hooks.ts:
const items = useSelector(state => state.cart.items); 
// state: any - dễ gây lỗi typo

// Có hooks.ts:
const items = useAppSelector(state => state.cart.items);
// state: RootState - TypeScript bắt lỗi ngay
```

### 2. **Autocomplete tốt hơn**
- IDE sẽ gợi ý tất cả các properties của state
- Giảm lỗi chính tả
- Code nhanh hơn

### 3. **Dễ maintain**
- Nếu cấu trúc state thay đổi, TypeScript sẽ báo lỗi ở tất cả nơi cần sửa
- Không cần đoán mò kiểu dữ liệu

### 4. **Best practice**
- Đây là pattern được Redux Toolkit recommend chính thức
- Tất cả app TypeScript + Redux nên có file này

---

## Cách sử dụng trong components

### Ví dụ 1: Đọc data từ store
```typescript
import { useAppSelector } from '../store/hooks';
import { selectCartItems, selectTotalQuantity } from '../store/cartSlice';

function CartIcon() {
  // Cách 1: Dùng inline selector
  const totalQty = useAppSelector(state => state.cart.totalQuantity);
  
  // Cách 2: Dùng selector function (recommend)
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectTotalQuantity);
  
  return (
    <div className="cart-icon">
      <Icon name="cart" />
      <span className="badge">{totalQty}</span>
    </div>
  );
}
```

### Ví dụ 2: Dispatch actions
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, removeFromCart } from '../store/cartSlice';

function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => 
    state.cart.items.find(item => item.id === product.id)
  );
  
  const handleAdd = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      quantity: 1
    }));
  };
  
  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}đ</p>
      {cartItem ? (
        <button onClick={handleRemove}>Xóa khỏi giỏ</button>
      ) : (
        <button onClick={handleAdd}>Thêm vào giỏ</button>
      )}
    </div>
  );
}
```

### Ví dụ 3: Kết hợp cả hai
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuantity, selectCartItemById } from '../store/cartSlice';

function CartItemRow({ itemId }: { itemId: number }) {
  const dispatch = useAppDispatch();
  
  // Selector với parameter
  const item = useAppSelector(state => 
    selectCartItemById(state, itemId)
  );
  
  if (!item) return null;
  
  const handleQuantityChange = (newQty: number) => {
    dispatch(updateQuantity({ 
      id: itemId, 
      quantity: newQty 
    }));
  };
  
  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <input 
          type="number" 
          value={item.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
        />
      </td>
      <td>{item.price * item.quantity}đ</td>
    </tr>
  );
}
```

---

## Lưu ý quan trọng

### 1. **LUÔN sử dụng hooks này thay vì hooks gốc**
```typescript
// ❌ KHÔNG làm thế này
import { useDispatch, useSelector } from 'react-redux';

// ✅ Luôn làm thế này
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

### 2. **File nhỏ nhưng cực kỳ quan trọng**
- Chỉ 5 dòng code
- Nhưng ảnh hưởng đến toàn bộ app
- Nếu thiếu file này, bạn mất hết type safety của TypeScript

### 3. **Vị trí file**
- Đặt trong thư mục `store/` hoặc `app/`
- Cùng cấp với `store.ts`
- Import dễ dàng từ mọi nơi

---

## Kết luận

File `hooks.ts` là một phần thiết yếu của Redux Toolkit với TypeScript. Nó:
- ✅ Cung cấp type safety cho toàn bộ ứng dụng
- ✅ Cải thiện developer experience (autocomplete, error checking)
- ✅ Giảm bugs do lỗi kiểu dữ liệu
- ✅ Là best practice được recommend chính thức

**Quy tắc vàng:** Luôn luôn sử dụng `useAppDispatch` và `useAppSelector` thay vì `useDispatch` và `useSelector` trong toàn bộ ứng dụng TypeScript + Redux!
