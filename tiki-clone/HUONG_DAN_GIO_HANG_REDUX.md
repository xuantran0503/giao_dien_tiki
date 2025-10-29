# HƯỚNG DẪN CHI TIẾT: CHỨC NĂNG GIỎ HÀNG BẰNG REDUX

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Bước 1: Cài đặt Redux Toolkit](#bước-1-cài-đặt-redux-toolkit)
3. [Bước 2: Tạo Redux Store và Cart Slice](#bước-2-tạo-redux-store-và-cart-slice)
4. [Bước 3: Tích hợp Redux Provider](#bước-3-tích-hợp-redux-provider)
5. [Bước 4: Tạo trang chi tiết sản phẩm](#bước-4-tạo-trang-chi-tiết-sản-phẩm)
6. [Bước 5: Tạo trang giỏ hàng](#bước-5-tạo-trang-giỏ-hàng)
7. [Bước 6: Cập nhật Header](#bước-6-cập-nhật-header)
8. [Bước 7: LocalStorage Persistence](#bước-7-localstorage-persistence)
9. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)

---

## TỔNG QUAN

Chức năng giỏ hàng được xây dựng bằng **Redux Toolkit** với các tính năng:
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Tăng/giảm số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Hiển thị badge số lượng sản phẩm trên icon giỏ hàng
- ✅ Lưu trữ giỏ hàng vào localStorage (không mất dữ liệu khi F5)
- ✅ Tự động cộng dồn số lượng khi thêm sản phẩm trùng

---

## BƯỚC 1: CÀI ĐẶT REDUX TOOLKIT

### 1.1. Mở Terminal trong project

```bash
# Di chuyển vào thư mục project (nếu chưa ở trong đó)
cd x:\code_cong_ty\test1-cartbage-redux\giao_dien_tiki-main\tiki-clone
```

### 1.2. Chạy lệnh cài đặt

```bash
npm install @reduxjs/toolkit react-redux
```

**Giải thích từng phần:**
- `npm install`: Lệnh cài đặt package trong Node.js
- `@reduxjs/toolkit`: Package Redux Toolkit chính thức
- `react-redux`: Package kết nối Redux với React

### 1.3. Packages được cài đặt:
- **@reduxjs/toolkit**: Thư viện Redux chính thức, đơn giản hóa việc setup Redux
  - Bao gồm: createSlice, configureStore, createAsyncThunk
  - Tự động setup Redux DevTools
  - Tích hợp Immer để mutate state an toàn
  
- **react-redux**: Kết nối Redux với React components
  - Provider: Cung cấp store cho toàn bộ app
  - useSelector: Hook để đọc state
  - useDispatch: Hook để dispatch actions

### 1.4. Kiểm tra đã cài đặt thành công

Mở file `package.json` và kiểm tra:

```json
"dependencies": {
  "@reduxjs/toolkit": "^2.x.x",
  "react-redux": "^9.x.x",
  // ... các package khác
}
```

---

## BƯỚC 2: TẠO REDUX STORE VÀ CART SLICE

### 2.1. Tạo thư mục `store`

```bash
# Tạo thư mục store trong src
mkdir src/store
```

### 2.2. Tạo file `src/store/cartSlice.js`

**CODE ĐẦY ĐỦ VỚI GIẢI THÍCH TỪNG DÒNG:**

```javascript
// ============================================
// IMPORT REDUX TOOLKIT
// ============================================
import { createSlice } from "@reduxjs/toolkit";
// createSlice: Function tạo slice (một phần của Redux store)
// Slice = state + reducers + actions


// ============================================
// FUNCTION LOAD GIỎ HÀNG TỪ LOCALSTORAGE
// ============================================
const loadCartFromStorage = () => {
  try {
    // Đọc dữ liệu từ localStorage với key "tikiCart"
    const savedCart = localStorage.getItem("tikiCart");
    
    // Nếu có dữ liệu đã lưu
    if (savedCart) {
      // Parse JSON string thành JavaScript object
      return JSON.parse(savedCart);
    }
  } catch (error) {
    // Nếu có lỗi (ví dụ: JSON không hợp lệ)
    console.error("Error loading cart from localStorage:", error);
  }
  
  // Nếu không có dữ liệu hoặc có lỗi, trả về state mặc định
  return {
    items: [],           // Mảng rỗng - chưa có sản phẩm
    totalQuantity: 0,    // Tổng số lượng = 0
  };
};


// ============================================
// FUNCTION LƯU GIỎ HÀNG VÀO LOCALSTORAGE
// ============================================
const saveCartToStorage = (state) => {
  try {
    // Chuyển đổi state (object) thành JSON string
    // Lưu vào localStorage với key "tikiCart"
    localStorage.setItem("tikiCart", JSON.stringify(state));
  } catch (error) {
    // Nếu có lỗi (ví dụ: localStorage đầy)
    console.error("Error saving cart to localStorage:", error);
  }
};


// ============================================
// TẠO CART SLICE
// ============================================
const cartSlice = createSlice({
  // Tên của slice - sẽ được dùng trong Redux DevTools
  name: "cart",
  
  // State khởi tạo - load từ localStorage
  initialState: loadCartFromStorage(),
  
  // Các reducers (functions xử lý actions)
  reducers: {
    
    // ========================================
    // ACTION: THÊM SẢN PHẨM VÀO GIỎ HÀNG
    // ========================================
    addToCart: (state, action) => {
      // action.payload = dữ liệu gửi kèm khi dispatch action
      // Ví dụ: { id: 1, name: "iPhone", price: 1000, quantity: 2 }
      const newItem = action.payload;
      
      // Tìm xem sản phẩm đã tồn tại trong giỏ chưa
      // find() trả về item đầu tiên có id trùng, hoặc undefined
      const existingItem = state.items.find(
        (item) => item.id === newItem.id
      );

      // Nếu sản phẩm ĐÃ CÓ trong giỏ
      if (existingItem) {
        // CỘNG THÊM số lượng vào sản phẩm đã có
        existingItem.quantity += newItem.quantity;
        
        // Cập nhật tổng số lượng
        state.totalQuantity += newItem.quantity;
      } 
      // Nếu sản phẩm CHƯA CÓ trong giỏ
      else {
        // THÊM MỚI sản phẩm vào mảng items
        state.items.push({
          id: newItem.id,                       // ID sản phẩm
          name: newItem.name,                   // Tên sản phẩm
          image: newItem.image,                 // URL hình ảnh
          price: newItem.price,                 // Giá sau giảm
          originalPrice: newItem.originalPrice, // Giá gốc
          discount: newItem.discount,           // % giảm giá
          quantity: newItem.quantity,           // Số lượng
        });
        
        // Cập nhật tổng số lượng
        state.totalQuantity += newItem.quantity;
      }
      
      // Lưu state mới vào localStorage
      saveCartToStorage(state);
    },
    
    
    // ========================================
    // ACTION: XÓA SẢN PHẨM KHỎI GIỎ HÀNG
    // ========================================
    removeFromCart: (state, action) => {
      // action.payload = id của sản phẩm cần xóa
      // Ví dụ: 5
      const id = action.payload;
      
      // Tìm sản phẩm cần xóa
      const existingItem = state.items.find((item) => item.id === id);

      // Nếu tìm thấy sản phẩm
      if (existingItem) {
        // TRỪ tổng số lượng đi số lượng của sản phẩm bị xóa
        state.totalQuantity -= existingItem.quantity;
        
        // LỌC BỎ sản phẩm khỏi mảng (giữ lại các item khác)
        // filter() tạo mảng mới không chứa item có id trùng
        state.items = state.items.filter((item) => item.id !== id);
      }
      
      // Lưu state mới vào localStorage
      saveCartToStorage(state);
    },
    
    
    // ========================================
    // ACTION: CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
    // ========================================
    updateQuantity: (state, action) => {
      // action.payload = { id: 5, quantity: 10 }
      const { id, quantity } = action.payload;
      
      // Tìm sản phẩm cần cập nhật
      const existingItem = state.items.find((item) => item.id === id);

      // Nếu tìm thấy sản phẩm
      if (existingItem) {
        // Tính CHÊNH LỆCH giữa số lượng mới và cũ
        // Ví dụ: quantity mới = 10, cũ = 3 → diff = 7
        const diff = quantity - existingItem.quantity;
        
        // CẬP NHẬT số lượng sản phẩm
        existingItem.quantity = quantity;
        
        // Cập nhật tổng số lượng theo chênh lệch
        state.totalQuantity += diff;
      }
      
      // Lưu state mới vào localStorage
      saveCartToStorage(state);
    },
    
    
    // ========================================
    // ACTION: XÓA TOÀN BỘ GIỎ HÀNG
    // ========================================
    clearCart: (state) => {
      // Reset mảng items về rỗng
      state.items = [];
      
      // Reset tổng số lượng về 0
      state.totalQuantity = 0;
      
      // Lưu state rỗng vào localStorage
      saveCartToStorage(state);
    },
  },
});


// ============================================
// EXPORT ACTIONS VÀ REDUCER
// ============================================

// Export các actions để dùng trong components
// Ví dụ: dispatch(addToCart({...}))
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Export reducer để đăng ký vào store
export default cartSlice.reducer;
```

### 2.3. Giải thích cấu trúc State

```javascript
// State của giỏ hàng có dạng:
{
  items: [
    {
      id: 1,                    // ID duy nhất của sản phẩm
      name: "iPhone 15",        // Tên sản phẩm
      image: "url_hinh_anh",    // URL hình ảnh
      price: 23490000,          // Giá sau giảm (VND)
      originalPrice: 33490000,  // Giá gốc (VND)
      discount: 30,             // % giảm giá
      quantity: 2               // Số lượng trong giỏ
    },
    {
      id: 5,
      name: "Sách Đắc Nhân Tâm",
      // ...
      quantity: 1
    }
  ],
  totalQuantity: 3  // Tổng: 2 + 1 = 3
}
```

#### **Cấu trúc State:**
```javascript
{
  items: [
    {
      id: 1,
      name: "Sản phẩm A",
      image: "url_hình_ảnh",
      price: 100000,
      originalPrice: 120000,
      discount: 17,
      quantity: 2
    }
  ],
  totalQuantity: 5  // Tổng số lượng của TẤT CẢ sản phẩm
}
```

#### **Các Actions (Reducers):**

##### 1. **addToCart** - Thêm sản phẩm vào giỏ
```javascript
addToCart: (state, action) => {
  const newItem = action.payload;
  const existingItem = state.items.find((item) => item.id === newItem.id);

  if (existingItem) {
    // Sản phẩm đã có → TĂNG SỐ LƯỢNG
    existingItem.quantity += newItem.quantity;
    state.totalQuantity += newItem.quantity;
  } else {
    // Sản phẩm chưa có → THÊM MỚI
    state.items.push({
      id: newItem.id,
      name: newItem.name,
      image: newItem.image,
      price: newItem.price,
      originalPrice: newItem.originalPrice,
      discount: newItem.discount,
      quantity: newItem.quantity,
    });
    state.totalQuantity += newItem.quantity;
  }
  
  saveCartToStorage(state); // Lưu vào localStorage
}
```

**Logic:**
- Kiểm tra sản phẩm đã tồn tại chưa (dựa vào `id`)
- Nếu **có rồi**: Cộng dồn số lượng
- Nếu **chưa có**: Thêm sản phẩm mới vào mảng `items`
- Cập nhật `totalQuantity`

##### 2. **removeFromCart** - Xóa sản phẩm khỏi giỏ
```javascript
removeFromCart: (state, action) => {
  const id = action.payload;
  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem) {
    state.totalQuantity -= existingItem.quantity;
    state.items = state.items.filter((item) => item.id !== id);
  }
  
  saveCartToStorage(state);
}
```

**Logic:**
- Tìm sản phẩm theo `id`
- Trừ `totalQuantity` đi số lượng của sản phẩm đó
- Loại bỏ sản phẩm khỏi mảng `items`

##### 3. **updateQuantity** - Cập nhật số lượng sản phẩm
```javascript
updateQuantity: (state, action) => {
  const { id, quantity } = action.payload;
  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem) {
    const diff = quantity - existingItem.quantity;
    existingItem.quantity = quantity;
    state.totalQuantity += diff;
  }
  
  saveCartToStorage(state);
}
```

**Logic:**
- Tính chênh lệch giữa số lượng mới và cũ
- Cập nhật số lượng sản phẩm
- Cập nhật `totalQuantity` theo chênh lệch

##### 4. **clearCart** - Xóa toàn bộ giỏ hàng
```javascript
clearCart: (state) => {
  state.items = [];
  state.totalQuantity = 0;
  
  saveCartToStorage(state);
}
```

### 2.4. Tạo file `src/store/store.js`

**CODE ĐẦY ĐỦ VỚI GIẢI THÍCH TỪNG DÒNG:**

```javascript
// ============================================
// IMPORT REDUX TOOLKIT
// ============================================
import { configureStore } from "@reduxjs/toolkit";
// configureStore: Function tạo Redux store
// Tự động setup Redux DevTools, middleware, v.v.

// Import reducer từ cartSlice
import cartReducer from "./cartSlice";


// ============================================
// TẠO REDUX STORE
// ============================================
const store = configureStore({
  // Đăng ký các reducers
  reducer: {
    // Key "cart" → State sẽ có dạng: { cart: {...} }
    // Value: cartReducer → Xử lý các actions liên quan đến giỏ hàng
    cart: cartReducer,
    
    // Có thể thêm các reducer khác ở đây:
    // user: userReducer,
    // products: productsReducer,
  },
});

// Export store để dùng trong Provider
export default store;
```

**Giải thích:**
- `configureStore`: 
  - Tạo Redux store với cấu hình tự động
  - Tự động thêm Redux Thunk middleware
  - Tự động kết nối với Redux DevTools Extension
  
- `cart: cartReducer`: 
  - Key `cart` → Truy cập state bằng `state.cart`
  - Value `cartReducer` → Xử lý các actions từ cartSlice
  
- State sẽ có dạng: 
  ```javascript
  {
    cart: {
      items: [...],
      totalQuantity: 0
    }
  }
  ```

### 2.5. Cấu trúc thư mục sau bước này

```
src/
├── store/
│   ├── cartSlice.js    ← Redux slice cho giỏ hàng
│   └── store.js        ← Redux store configuration
├── components/
├── pages/
└── ...
```

---

## BƯỚC 3: TÍCH HỢP REDUX PROVIDER

### 3.1. Mở file `src/index.js`

### 3.2. Cập nhật code với giải thích từng dòng

**CODE ĐẦY ĐỦ:**

```javascript
// ============================================
// IMPORT REACT
// ============================================
import React from "react";
// React: Thư viện React core

import ReactDOM from "react-dom/client";
// ReactDOM: Để render React app vào DOM


// ============================================
// IMPORT REDUX
// ============================================
import { Provider } from "react-redux";
// Provider: Component bọc app để cung cấp Redux store cho tất cả component con

import store from "./store/store";
// store: Redux store đã tạo ở bước 2


// ============================================
// IMPORT APP VÀ CSS
// ============================================
import App from "./App";
// App: Root component của ứng dụng

import "./index.css";
// CSS toàn cục


// ============================================
// TẠO ROOT VÀ RENDER APP
// ============================================

// Tạo root từ element có id="root" trong public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render ứng dụng
root.render(
  // Provider bọc App để cung cấp Redux store
  <Provider store={store}>
    {/* 
      Tất cả component bên trong Provider đều có thể:
      - Đọc state: useSelector(state => state.cart)
      - Dispatch actions: useDispatch()
    */}
    <App />
  </Provider>
);
```

### 3.3. Giải thích chi tiết

#### **Provider là gì?**
- `Provider` là một React component từ `react-redux`
- Nó sử dụng React Context để truyền `store` xuống tất cả component con
- **BẮT BUỘC** phải bọc `<Provider>` ở root level

#### **Cách hoạt động:**
```
┌─────────────────────────────┐
│   <Provider store={store}>  │  ← Cung cấp store
├─────────────────────────────┤
│         <App />             │
│           │                 │
│    ┌──────┴──────┐         │
│    │             │         │
│ <Header />  <HomePage />   │  ← Tất cả đều truy cập được store
│    │             │         │
│    │       <CartPage />    │
│    │                       │
└────┴───────────────────────┘
```

#### **Nếu không có Provider:**
```javascript
// ❌ LỖI - Không thể dùng useSelector hoặc useDispatch
function Header() {
  const cart = useSelector(state => state.cart); // ERROR!
}
```

#### **Với Provider:**
```javascript
// ✓ OK - Hoạt động bình thường
function Header() {
  const cart = useSelector(state => state.cart); // ✓ OK
}
```

### 3.4. Kiểm tra Redux DevTools

1. Cài extension **Redux DevTools** trong Chrome/Firefox
2. Chạy app: `npm start`
3. Mở DevTools (F12) → Tab "Redux"
4. Xem state hiện tại:
   ```json
   {
     "cart": {
       "items": [],
       "totalQuantity": 0
     }
   }
   ```

---

## BƯỚC 4: TẠO TRANG CHI TIẾT SẢN PHẨM

### 4.1. Tạo file `src/pages/ProductDetailPage.jsx`

### 4.2. Import các thư viện và dữ liệu cần thiết

**CODE ĐẦY ĐỦ VỚI GIẢI THÍCH:**

```javascript
// ============================================
// IMPORT REACT VÀ HOOKS
// ============================================
import React, { useState } from "react";
// React: Thư viện core
// useState: Hook quản lý state cục bộ (số lượng, notification)

import { useParams } from "react-router-dom";
// useParams: Hook lấy tham số từ URL
// Ví dụ: URL là /product/5 → useParams() trả về { productId: "5" }


// ============================================
// IMPORT REDUX HOOKS VÀ ACTIONS
// ============================================
import { useDispatch } from "react-redux";
// useDispatch: Hook để gửi actions đến Redux store

import { addToCart } from "../store/cartSlice";
// addToCart: Action creator từ cartSlice để thêm sản phẩm vào giỏ


// ============================================
// IMPORT CÁC DATA SOURCES
// ============================================
import suggestedProductsData from "../data/suggestedProductsData";
import topDealsData from "../data/topDealsData";
import flashSaleData from "../data/flashSaleData";
import hotInternationalData from "../data/hotInternationalData";
import youMayLikeData from "../data/youMayLikeData";
// Tất cả các nguồn dữ liệu sản phẩm có thể có


// ============================================
// IMPORT CSS
// ============================================
import "./ProductDetailPage.css";
```

### 4.3. Function tìm sản phẩm từ nhiều nguồn

```javascript
// ============================================
// FUNCTION TÌM SẢN PHẨM TỪ NHIỀU DATA SOURCES
// ============================================
const findProduct = (id) => {
  // Chuyển id từ string sang number
  // Vì URL params luôn là string, nhưng data dùng number
  const numId = parseInt(id);
  
  // ========================================
  // BƯỚC 1: Tìm trong Suggested Products
  // ========================================
  let product = suggestedProductsData.find((p) => p.id === numId);
  // find() trả về sản phẩm đầu tiên có id khớp, hoặc undefined
  
  // Nếu tìm thấy, return luôn (không cần tìm tiếp)
  if (product) return product;
  
  
  // ========================================
  // BƯỚC 2: Tìm trong Top Deals
  // ========================================
  const topDeal = topDealsData.find((p) => p.id === numId);
  if (topDeal) {
    // Top Deals có cấu trúc khác, cần MAP sang format chuẩn
    return {
      id: topDeal.id,                  // ID giữ nguyên
      name: topDeal.title,             // title → name
      image: topDeal.image,            // image giữ nguyên
      price: topDeal.price,            // price giữ nguyên
      originalPrice: topDeal.originalPrice,
      discount: topDeal.discount,
      rating: topDeal.rating,
      soldCount: topDeal.soldCount,
      badgeIcon: topDeal.imageBadges,  // imageBadges → badgeIcon
    };
  }
  
  
  // ========================================
  // BƯỚC 3: Tìm trong Flash Sale
  // ========================================
  const flashSale = flashSaleData.find((p) => p.id === numId);
  if (flashSale) {
    return {
      id: flashSale.id,
      name: flashSale.title,           // title → name
      image: flashSale.image,
      price: flashSale.price,
      originalPrice: flashSale.originalPrice,
      discount: flashSale.discount,
      progressBarPercentage: flashSale.progressBarPercentage,
    };
  }
  
  
  // ========================================
  // BƯỚC 4: Tìm trong Hot International
  // ========================================
  const hotInternational = hotInternationalData.find((p) => p.id === numId);
  if (hotInternational) {
    return {
      id: hotInternational.id,
      name: hotInternational.title,     // title → name
      image: hotInternational.image,
      price: hotInternational.price,
      originalPrice: hotInternational.originalPrice,
      discount: hotInternational.discount,
      rating: hotInternational.rating,
      soldCount: hotInternational.soldCount,
      freeShip: hotInternational.freeShip,
      badgeIcon: hotInternational.imageBadges,
    };
  }
  
  
  // ========================================
  // BƯỚC 5: Tìm trong You May Like
  // ========================================
  const youMayLike = youMayLikeData.find((p) => p.id === numId);
  if (youMayLike) {
    return {
      id: youMayLike.id,
      name: youMayLike.title,           // title → name
      image: youMayLike.image,
      price: youMayLike.price,
      originalPrice: youMayLike.originalPrice,
      discount: youMayLike.discount,
      rating: youMayLike.rating,
      soldCount: youMayLike.soldCount,
      badgeIcon: youMayLike.imageBadges,
    };
  }
  
  // Nếu không tìm thấy ở bất kỳ nguồn nào, return null
  return null;
};
```

**Lý do cần function này:**
- Mỗi data source có cấu trúc khác nhau (`name` vs `title`, `badgeIcon` vs `imageBadges`)
- Nhiều data sources có thể có cùng ID (ví dụ: ID 1 ở cả TopDeals và FlashSale)
- Cần tìm từ TẤT CẢ nguồn và chuẩn hóa về một format duy nhất

### 4.4. Component chính với Redux integration

```javascript
// ============================================
// PRODUCT DETAIL PAGE COMPONENT
// ============================================
function ProductDetailPage() {
  
  // ========================================
  // SETUP REDUX
  // ========================================
  const dispatch = useDispatch();
  // dispatch: Function để gửi actions đến Redux store
  // Ví dụ: dispatch(addToCart({...}))
  
  
  // ========================================
  // SETUP LOCAL STATE
  // ========================================
  const [quantity, setQuantity] = useState(1);
  // quantity: Số lượng sản phẩm người dùng muốn mua (mặc định = 1)
  // setQuantity: Function để cập nhật quantity
  
  const [notification, setNotification] = useState({
    show: false,      // Có hiển thị notification không?
    message: "",      // Nội dung thông báo
    type: "",         // "success" hoặc "warning"
  });
  
  
  // ========================================
  // LẤY PRODUCT ID TỪ URL
  // ========================================
  const { productId } = useParams();
  // URL: /product/5 → productId = "5"
  // URL: /product/123 → productId = "123"
  
  
  // ========================================
  // TÌM THÔNG TIN SẢN PHẨM
  // ========================================
  const product = findProduct(productId);
  // Gọi function findProduct để tìm sản phẩm từ tất cả data sources
  
  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  
  
  // ========================================
  // TÍNH GIÁ SAU GIẢM
  // ========================================
  const finalPrice = product.price || 
    (product.originalPrice * (100 - product.discount)) / 100;
  // Nếu đã có price → dùng luôn
  // Nếu chưa → tính từ originalPrice và discount
  // Ví dụ: originalPrice=1000, discount=20 → finalPrice = 1000*(100-20)/100 = 800
  
  
  // ========================================
  // HANDLER: GIẢM SỐ LƯỢNG
  // ========================================
  const handleDecrease = () => {
    // Chỉ giảm nếu quantity > 1 (không cho phép = 0)
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  
  // ========================================
  // HANDLER: TĂNG SỐ LƯỢNG
  // ========================================
  const handleIncrease = () => {
    setQuantity(quantity + 1);
    // Không giới hạn số lượng tối đa (có thể thêm giới hạn nếu cần)
  };
  
  
  // ========================================
  // HANDLER: THÊM VÀO GIỎ HÀNG
  // ========================================
  const handleAddToCart = () => {
    // Dispatch action addToCart với payload là thông tin sản phẩm
    dispatch(
      addToCart({
        id: product.id,                      // ID sản phẩm
        name: product.name,                  // Tên
        image: product.image,                // Hình ảnh
        price: finalPrice,                   // Giá sau giảm
        originalPrice: product.originalPrice,// Giá gốc
        discount: product.discount,          // % giảm giá
        quantity: quantity,                  // Số lượng đã chọn
      })
    );
    // Redux tự động:
    // 1. Nhận action này
    // 2. Chạy reducer addToCart trong cartSlice
    // 3. Cập nhật state
    // 4. Lưu vào localStorage
    // 5. Trigger re-render cho tất cả components subscribe
    
    
    // Hiển thị notification thành công
    setNotification({
      show: true,
      message: "Đã thêm sản phẩm vào giỏ hàng",
      type: "success",
    });
    
    // Tự động ẩn notification sau 2 giây
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 2000); // 2000ms = 2 giây
  };
  
  
  // ========================================
  // RENDER JSX
  // ========================================
  return (
    <div className="product-detail-page">
      {/* Notification popup */}
      {notification.show && (
        <div className={`add-to-cart-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success" ? "✓" : "ⓘ"}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Hình ảnh sản phẩm */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      
      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <h1>{product.name}</h1>
        
        {/* Giá */}
        <div className="product-price">
          <span className="current-price">
            {finalPrice.toLocaleString("vi-VN")}₫
          </span>
          {product.originalPrice && (
            <span className="original-price">
              {product.originalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
        
        {/* Chọn số lượng */}
        <div className="quantity-selector">
          <label>Số lượng:</label>
          <div className="quantity-controls">
            <button onClick={handleDecrease}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={handleIncrease}>+</button>
          </div>
        </div>
        
        {/* Nút thêm vào giỏ */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
```

### 4.5. Luồng hoạt động

```
1. User click vào sản phẩm → URL: /product/5
                ↓
2. useParams() lấy productId = "5"
                ↓
3. findProduct(5) tìm trong tất cả data sources
                ↓
4. Hiển thị thông tin sản phẩm
                ↓
5. User chọn số lượng = 3
                ↓
6. User click "Thêm vào giỏ"
                ↓
7. dispatch(addToCart({id:5, quantity:3, ...}))
                ↓
8. Redux reducer xử lý → Cập nhật state.cart.items
                ↓
9. Lưu vào localStorage
                ↓
10. Hiển thị notification "Đã thêm..."
                ↓
11. Tất cả components (Header badge) tự động re-render
```

---

## BƯỚC 5: TẠO TRANG GIỎ HÀNG

### 5.1. Tạo file `src/pages/CartPage.jsx`

### 5.2. Import các thư viện cần thiết

**CODE VỚI GIẢI THÍCH:**

```javascript
// ============================================
// IMPORT REACT
// ============================================
import React from "react";
// React: Thư viện core


// ============================================
// IMPORT REDUX HOOKS VÀ ACTIONS
// ============================================
import { useSelector, useDispatch } from "react-redux";
// useSelector: Hook để ĐỌC data từ Redux store
// useDispatch: Hook để GỬI actions đến Redux store

import { removeFromCart, updateQuantity } from "../store/cartSlice";
// removeFromCart: Action xóa sản phẩm khỏi giỏ
// updateQuantity: Action cập nhật số lượng sản phẩm


// ============================================
// IMPORT LINK ĐỂ ĐIỀU HƯỚNG
// ============================================
import { Link } from "react-router-dom";
// Link: Component để tạo liên kết SPA (không reload trang)


// ============================================
// IMPORT CSS
// ============================================
import "./CartPage.css";
```

### 5.3. Component CartPage với Redux integration

**CODE ĐẦY ĐỦ VỚI GIẢI THÍCH TỪNG DÒNG:**

```javascript
// ============================================
// CART PAGE COMPONENT
// ============================================
function CartPage() {
  
  // ========================================
  // SETUP REDUX
  // ========================================
  const dispatch = useDispatch();
  // dispatch: Function để gửi actions (removeFromCart, updateQuantity)
  
  
  // ========================================
  // LẤY DỮ LIỆU TỪ REDUX STORE
  // ========================================
  const cartItems = useSelector((state) => state.cart.items);
  // cartItems: Mảng các sản phẩm trong giỏ hàng
  // Lấy từ: state.cart.items
  // Ví dụ: [
  //   { id: 1, name: "iPhone", quantity: 2, price: 20000000 },
  //   { id: 5, name: "Sách", quantity: 1, price: 100000 }
  // ]
  
  // Component sẽ TỰ ĐỘNG RE-RENDER khi cartItems thay đổi
  // Không cần setState hay forceUpdate
  
  
  // ========================================
  // TÍNH TỔNG TIỀN GIỎ HÀNG
  // ========================================
  const totalPrice = cartItems.reduce((total, item) => {
    // reduce: Duyệt qua tất cả items và tính tổng
    // total: Tổng cộng dồn (bắt đầu từ 0)
    // item: Từng sản phẩm trong giỏ
    
    return total + item.price * item.quantity;
    // Cộng dồn: giá × số lượng
    // Ví dụ:
    //   Item 1: 20,000,000 × 2 = 40,000,000
    //   Item 2: 100,000 × 1 = 100,000
    //   Total = 40,100,000
    
  }, 0); // 0: Giá trị khởi tạo của total
  
  
  // ========================================
  // HANDLER: TĂNG SỐ LƯỢNG SẢN PHẨM
  // ========================================
  const handleIncrease = (item) => {
    // Dispatch action updateQuantity với số lượng mới (tăng 1)
    dispatch(
      updateQuantity({
        id: item.id,                  // ID sản phẩm cần cập nhật
        quantity: item.quantity + 1,  // Số lượng mới = số lượng cũ + 1
      })
    );
    // Redux tự động:
    // 1. Tìm item có id khớp
    // 2. Cập nhật quantity
    // 3. Cập nhật totalQuantity
    // 4. Lưu vào localStorage
    // 5. Component re-render
  };
  
  
  // ========================================
  // HANDLER: GIẢM SỐ LƯỢNG SẢN PHẨM
  // ========================================
  const handleDecrease = (item) => {
    // Nếu quantity > 1 → Giảm số lượng
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity - 1,  // Giảm 1
        })
      );
    } 
    // Nếu quantity = 1 → Xóa sản phẩm khỏi giỏ (không để quantity = 0)
    else {
      dispatch(removeFromCart(item.id));
      // Gửi action removeFromCart với id sản phẩm
    }
  };
  
  
  // ========================================
  // HANDLER: XÓA SẢN PHẨM
  // ========================================
  const handleRemove = (itemId) => {
    // Dispatch action removeFromCart
    dispatch(removeFromCart(itemId));
    // Redux tự động:
    // 1. Lọc bỏ item có id = itemId
    // 2. Cập nhật totalQuantity
    // 3. Lưu vào localStorage
    // 4. Component re-render
  };
  
  
  // ========================================
  // RENDER: TRƯỜNG HỢP GIỎ HÀNG TRỐNG
  // ========================================
  if (cartItems.length === 0) {
    // Nếu mảng cartItems rỗng (không có sản phẩm)
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <img
            src="/icons/empty-cart.png"
            alt="Giỏ hàng trống"
            onError={(e) => {
              // Nếu ảnh lỗi, thay bằng emoji
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div style={{ display: "none", fontSize: "80px" }}>🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng của bạn!</p>
          
          {/* Link quay về trang chủ */}
          <Link to="/" className="back-to-home-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }
  
  
  // ========================================
  // RENDER: TRƯỜNG HỢP CÓ SẢN PHẨM TRONG GIỎ
  // ========================================
  return (
    <div className="cart-page">
      <div className="cart-container">
        
        {/* ===== DANH SÁCH SẢN PHẨM ===== */}
        <div className="cart-items-section">
          <h2 className="cart-title">Giỏ hàng ({cartItems.length} sản phẩm)</h2>
          
          {/* Duyệt qua tất cả sản phẩm trong giỏ */}
          {cartItems.map((item) => (
            // key: React cần key duy nhất cho mỗi item trong list
            <div key={item.id} className="cart-item">
              
              {/* Hình ảnh sản phẩm */}
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                
                {/* Hiển thị giá */}
                <div className="cart-item-price">
                  <span className="current-price">
                    {/* toLocaleString: Format số theo chuẩn Việt Nam (có dấu phẩy) */}
                    {item.price.toLocaleString("vi-VN")}₫
                  </span>
                  
                  {/* Nếu có giá gốc (originalPrice), hiển thị và gạch ngang */}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="original-price">
                      {item.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
              </div>
              
              {/* Điều khiển số lượng */}
              <div className="cart-item-quantity">
                <div className="quantity-selector">
                  {/* Nút GIẢM số lượng */}
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </button>
                  
                  {/* Hiển thị số lượng hiện tại */}
                  <span className="quantity-value">{item.quantity}</span>
                  
                  {/* Nút TĂNG số lượng */}
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Tổng giá cho sản phẩm này */}
              <div className="cart-item-total">
                <span className="item-total-price">
                  {/* Giá × Số lượng */}
                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                </span>
              </div>
              
              {/* Nút XÓA sản phẩm */}
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.id)}
                title="Xóa sản phẩm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        
        {/* ===== TỔNG KẾT GIỎ HÀNG ===== */}
        <div className="cart-summary">
          <h3>Thông tin đơn hàng</h3>
          
          {/* Tổng số lượng sản phẩm */}
          <div className="summary-row">
            <span>Tổng sản phẩm:</span>
            <span>{cartItems.length}</span>
          </div>
          
          {/* Tổng tiền (tạm tính) */}
          <div className="summary-row total-row">
            <span>Tạm tính:</span>
            <span className="total-price">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
          
          {/* Nút thanh toán */}
          <button className="checkout-btn">
            Tiến hành thanh toán
          </button>
          
          {/* Link tiếp tục mua sắm */}
          <Link to="/" className="continue-shopping">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
```

### 5.4. Giải thích luồng hoạt động

#### **Khi component load:**
```
1. useSelector đọc state.cart.items từ Redux
                ↓
2. Kiểm tra cartItems.length
                ↓
3a. Nếu = 0 → Hiển thị "Giỏ hàng trống"
3b. Nếu > 0 → Hiển thị danh sách sản phẩm
```

#### **Khi user TĂNG số lượng:**
```
1. User click nút "+"
                ↓
2. handleIncrease(item) được gọi
                ↓
3. dispatch(updateQuantity({ id: 5, quantity: 4 }))
                ↓
4. Redux reducer cập nhật item.quantity = 4
                ↓
5. Lưu vào localStorage
                ↓
6. useSelector phát hiện state thay đổi
                ↓
7. Component re-render với data mới
                ↓
8. Số lượng và tổng tiền tự động cập nhật
```

#### **Khi user XÓA sản phẩm:**
```
1. User click nút "×"
                ↓
2. handleRemove(itemId) được gọi
                ↓
3. dispatch(removeFromCart(itemId))
                ↓
4. Redux reducer lọc bỏ item khỏi mảng
                ↓
5. Lưu vào localStorage
                ↓
6. Component re-render
                ↓
7. Sản phẩm biến mất khỏi giao diện
```

### 5.5. Đặc điểm quan trọng

1. **Tự động re-render:**
   - Không cần `useState` hay `forceUpdate`
   - `useSelector` tự động subscribe vào Redux store
   - Khi state thay đổi → Component re-render

2. **Single Source of Truth:**
   - Tất cả data lấy từ Redux (không duplicate state)
   - Không cần truyền props giữa components

3. **Tính toán realtime:**
   - `totalPrice` được tính lại mỗi lần render
   - Luôn đồng bộ với cartItems

4. **Persistence:**
   - Mọi thay đổi đều tự động lưu vào localStorage
   - F5 không mất dữ liệu

### 5.6. Thêm route trong `src/App.jsx`

**CODE CẬP NHẬT:**

```javascript
// ============================================
// IMPORT CART PAGE
// ============================================
import CartPage from "./pages/CartPage";
// Import component CartPage


// ============================================
// THÊM ROUTE CHO GIỎ HÀNG
// ============================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route trang chủ */}
        <Route path="/" element={<HomePage />} />
        
        {/* Route chi tiết sản phẩm */}
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        
        {/* Route giỏ hàng - MỚI THÊM */}
        <Route path="/cart" element={<CartPage />} />
        {/* 
          - URL: /cart
          - Component: CartPage
          - Khi user vào /cart → Hiển thị giỏ hàng
        */}
      </Routes>
    </BrowserRouter>
  );
}
```

**Giải thích:**
- `path="/cart"`: Định nghĩa URL path
- `element={<CartPage />}`: Component sẽ render
- Khi user click vào icon giỏ hàng trong Header → Điều hướng đến `/cart` → Hiển thị CartPage

---

## BƯỚC 6: CẬP NHẬT HEADER HIỂN THỊ BADGE GIỎ HÀNG

### 6.1. Mở file `src/components/Header/Header.jsx`

### 6.2. Thêm import Redux

**CODE:**

```javascript
// ============================================
// IMPORT REDUX HOOK
// ============================================
import { useSelector } from "react-redux";
// useSelector: Hook để đọc data từ Redux store

// Không cần useDispatch vì Header chỉ ĐỌC state, không GỬI action
```

### 6.3. Lấy số lượng sản phẩm trong giỏ

**CODE TRONG COMPONENT:**

```javascript
function Header() {
  // ========================================
  // LẤY SỐ LƯỢNG SẢN PHẨM TRONG GIỎ HÀNG
  // ========================================
  const cartItemsCount = useSelector((state) => state.cart.items.length);
  // cartItemsCount: Số lượng SẢN PHẨM KHÁC NHAU trong giỏ
  // Lấy từ: state.cart.items.length
  
  // Component tự động re-render khi cartItemsCount thay đổi
  
  
  // ... phần code còn lại của Header
}
```

### 6.4. Phân biệt `items.length` vs `totalQuantity`

**LƯU Ý QUAN TRỌNG:** Dùng `items.length` chứ **KHÔNG** phải `totalQuantity`

#### **Giải thích sự khác biệt:**

```javascript
// Giả sử giỏ hàng có:
{
  items: [
    { id: 1, name: "iPhone", quantity: 5 },    // 1 sản phẩm, số lượng 5
    { id: 2, name: "Sách", quantity: 3 },      // 1 sản phẩm, số lượng 3
    { id: 3, name: "Tai nghe", quantity: 1 }   // 1 sản phẩm, số lượng 1
  ],
  totalQuantity: 9  // 5 + 3 + 1 = 9
}

// ✓ ĐÚNG - Dùng items.length
state.cart.items.length  // = 3 (có 3 SẢN PHẨM KHÁC NHAU)
→ Badge hiển thị: 3

// ✗ SAI - Dùng totalQuantity
state.cart.totalQuantity  // = 9 (tổng SỐ LƯỢNG)
→ Badge hiển thị: 9 (GÂY HIỂU NHẦM!)
```

#### **Tại sao phải dùng `items.length`?**
- Giống Tiki, Shopee, Lazada → Badge hiển thị số LOẠI sản phẩm khác nhau
- Không hiển thị tổng số lượng (vì có thể rất lớn và gây hiểu nhầm)

**Ví dụ thực tế:**
```
Giỏ hàng có:
- 1 iPhone (số lượng: 5)
- 1 Sách (số lượng: 3)

→ Badge hiển thị: 2 ✓ (2 sản phẩm khác nhau)
→ KHÔNG hiển thị: 8 ✗ (tổng số lượng)
```

### 6.5. Hiển thị badge trên icon giỏ hàng

**CODE TRONG JSX:**

```javascript
// ============================================
// ICON GIỎ HÀNG VỚI BADGE
// ============================================
<Link to="/cart" className="cart-btn">
  {/* 
    Link: Điều hướng đến trang giỏ hàng (/cart)
    Không reload trang (SPA)
  */}
  
  {/* Icon giỏ hàng */}
  <div className="img-cart">
    <img src="/cart.png" alt="cart" />
  </div>
  
  {/* Badge hiển thị số lượng sản phẩm */}
  <span className="cart-badge">{cartItemsCount}</span>
  {/* 
    - Luôn hiển thị badge (kể cả khi = 0)
    - Không có điều kiện if (cartItemsCount > 0)
    - Hiển thị 0 khi giỏ hàng trống
  */}
</Link>
```

### 6.6. Các trường hợp hiển thị

| Tình huống | `items.length` | Badge hiển thị |
|-----------|---------------|----------------|
| Giỏ hàng trống | 0 | **0** |
| 1 sản phẩm (số lượng 5) | 1 | **1** |
| 3 sản phẩm khác nhau | 3 | **3** |
| 10 sản phẩm khác nhau | 10 | **10** |

### 6.7. Luồng cập nhật badge

```
1. User thêm sản phẩm vào giỏ (ở ProductDetailPage)
                ↓
2. dispatch(addToCart({...}))
                ↓
3. Redux reducer cập nhật state.cart.items
                ↓
4. state.cart.items.length thay đổi
                ↓
5. useSelector phát hiện thay đổi
                ↓
6. Header component TỰ ĐỘNG re-render
                ↓
7. Badge cập nhật với giá trị mới
```

**Ví dụ chi tiết:**
```
Giỏ hàng ban đầu: items = []
→ Badge: 0

User thêm iPhone:
→ items = [{id:1, name:"iPhone", ...}]
→ items.length = 1
→ Badge tự động cập nhật: 1

User thêm Sách:
→ items = [{id:1, ...}, {id:5, ...}]
→ items.length = 2
→ Badge tự động cập nhật: 2

User thêm iPhone lần 2 (trùng):
→ items = [{id:1, quantity:2}, {id:5, ...}]
→ items.length = 2 (vẫn 2 sản phẩm khác nhau)
→ Badge vẫn: 2 (KHÔNG thay đổi)
```

### 6.8. Styling CSS cho badge

**Trong `Header.css`:**

```css
.cart-badge {
  position: absolute;           /* Định vị tuyệt đối */
  top: -8px;                    /* Đặt ở góc trên bên phải */
  right: -8px;
  
  background-color: #ff424e;    /* Màu đỏ nổi bật */
  color: white;                 /* Chữ trắng */
  
  min-width: 20px;              /* Chiều rộng tối thiểu */
  height: 20px;                 /* Chiều cao cố định */
  
  border-radius: 50%;           /* Hình tròn */
  
  display: flex;                /* Flexbox để căn giữa */
  align-items: center;          /* Căn giữa theo chiều dọc */
  justify-content: center;      /* Căn giữa theo chiều ngang */
  
  font-size: 12px;              /* Cỡ chữ nhỏ */
  font-weight: bold;            /* Chữ đậm */
  
  padding: 0 4px;               /* Padding ngang */
}

/* Khi số lượng >= 100, badge rộng hơn */
.cart-badge {
  min-width: 20px;
  padding: 0 5px;
}
```

---

## BƯỚC 7: LOCALSTORAGE PERSISTENCE (Lưu trữ giỏ hàng)

### 7.1. Vấn đề cần giải quyết

**Vấn đề:**
```
1. User thêm sản phẩm vào giỏ hàng
2. User refresh trang (F5)
3. Redux state bị RESET về ban đầu
4. Giỏ hàng BỊ MẤT HẾT! ❌
```

**Nguyên nhân:**
- Redux state chỉ tồn tại trong **memory (RAM)**
- Khi refresh → Trang load lại → State bị khởi tạo lại
- Không có cơ chế lưu trữ lâu dài

### 7.2. Giải pháp: Lưu vào localStorage

**localStorage là gì?**
- API của trình duyệt để lưu dữ liệu dạng **key-value**
- Dữ liệu được lưu **vĩnh viễn** (không tự động xóa)
- Chỉ lưu được **string** (phải convert object → JSON string)

### 7.3. Function LOAD giỏ hàng từ localStorage

**CODE ĐÃ THÊM TRONG `cartSlice.js`:**

```javascript
// ============================================
// FUNCTION LOAD GIỎ HÀNG TỪ LOCALSTORAGE
// ============================================
const loadCartFromStorage = () => {
  try {
    // BƯỚC 1: ĐỌC DỮ LIỆU TỪ LOCALSTORAGE
    const savedCart = localStorage.getItem("tikiCart");
    // getItem("tikiCart"): Đọc dữ liệu với key "tikiCart"
    // Trả về: string (JSON) hoặc null (nếu chưa có data)
    
    // BƯỚC 2: KIỂM TRA VÀ PARSE JSON
    if (savedCart) {
      // Nếu có dữ liệu → Parse JSON string thành object
      return JSON.parse(savedCart);
      // Ví dụ:
      //   Input: '{"items":[...],"totalQuantity":3}'
      //   Output: { items: [...], totalQuantity: 3 }
    }
    
  } catch (error) {
    // XỬ LÝ LỖI nếu JSON không hợp lệ
    console.error("Error loading cart from localStorage:", error);
  }
  
  // BƯỚC 3: TRẢ VỀ STATE MẶC ĐỊNH nếu chưa có data
  return {
    items: [],           // Mảng sản phẩm rỗng
    totalQuantity: 0,    // Tổng = 0
  };
};
```

**Giải thích từng trường hợp:**

| Trường hợp | `savedCart` | Kết quả |
|-----------|-------------|---------|
| Lần đầu chạy app | `null` | `{ items: [], totalQuantity: 0 }` |
| Đã lưu data | `'{"items":[...]}'` | Parse → object |
| JSON lỗi | `'{invalid}'` | Catch error → state mặc định |

### 7.4. Function LƯU giỏ hàng vào localStorage

**CODE:**

```javascript
// ============================================
// FUNCTION LƯU GIỎ HÀNG VÀO LOCALSTORAGE
// ============================================
const saveCartToStorage = (state) => {
  // state: Redux state hiện tại
  // Ví dụ: { items: [...], totalQuantity: 5 }
  
  try {
    // BƯỚC 1: CHUYỂN OBJECT → JSON STRING
    const jsonString = JSON.stringify(state);
    // Ví dụ:
    //   Input: { items: [{id:1}], totalQuantity: 1 }
    //   Output: '{"items":[{"id":1}],"totalQuantity":1}'
    
    // BƯỚC 2: LƯU VÀO LOCALSTORAGE
    localStorage.setItem("tikiCart", jsonString);
    // Key: "tikiCart"
    // Value: JSON string
    // Dữ liệu lưu vĩnh viễn trong browser
    
  } catch (error) {
    // XỬ LÝ LỖI (localStorage đầy, privacy mode, etc.)
    console.error("Error saving cart to localStorage:", error);
  }
};
```

### 7.5. Tích hợp vào Redux Slice

**CODE:**

```javascript
const cartSlice = createSlice({
  name: "cart",
  
  // KHỞI TẠO STATE TỪ LOCALSTORAGE
  initialState: loadCartFromStorage(),
  // Thay vì: { items: [], totalQuantity: 0 }
  // → Gọi loadCartFromStorage() để load data đã lưu
  
  reducers: {
    addToCart: (state, action) => {
      // ... logic thêm sản phẩm ...
      
      // LƯU VÀO LOCALSTORAGE SAU KHI CẬP NHẬT
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      // ... logic xóa ...
      saveCartToStorage(state);  // Lưu
    },
    
    updateQuantity: (state, action) => {
      // ... logic cập nhật ...
      saveCartToStorage(state);  // Lưu
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      saveCartToStorage(state);  // Lưu state rỗng
    },
  },
});
```

### 7.6. Luồng hoạt động LOAD (Khôi phục giỏ hàng)

```
APP KHỞI ĐỘNG
      ↓
1. Redux store được tạo
      ↓
2. initialState: loadCartFromStorage() được gọi
      ↓
3. loadCartFromStorage() đọc localStorage.getItem("tikiCart")
      ↓
4a. Nếu có data → JSON.parse() → Return object
4b. Nếu không có → Return { items: [], totalQuantity: 0 }
      ↓
5. Redux state được khởi tạo với data từ localStorage
      ↓
6. Components render với dữ liệu đã lưu
      ↓
✅ GIỎ HÀNG HIỂN THỊ ĐÚNG DỮ LIỆU ĐÃ LƯU
```

### 7.7. Luồng hoạt động SAVE (Lưu giỏ hàng)

```
USER THÊM SẢN PHẨM VÀO GIỎ
      ↓
1. dispatch(addToCart({...}))
      ↓
2. Redux reducer xử lý → Cập nhật state
      ↓
3. saveCartToStorage(state) được gọi
      ↓
4. JSON.stringify(state) → Chuyển object thành string
      ↓
5. localStorage.setItem("tikiCart", jsonString)
      ↓
✅ DỮ LIỆU ĐÃ ĐƯỢC LƯU VÀO BROWSER

USER REFRESH TRANG (F5)
      ↓
→ Quay lại luồng LOAD ở trên
      ↓
✅ GIỎ HÀNG VẪN CÒN!
```

### 7.8. Kết quả đạt được

| Hành động | Trước (Không localStorage) | Sau (Có localStorage) |
|-----------|---------------------------|----------------------|
| **F5 (Refresh)** | ❌ Mất hết | ✅ Vẫn còn |
| **Đóng tab → Mở lại** | ❌ Mất hết | ✅ Vẫn còn |
| **Tắt browser → Mở lại** | ❌ Mất hết | ✅ Vẫn còn |
| **Sang ngày hôm sau** | ❌ Mất hết | ✅ Vẫn còn |

---

## KIẾN TRÚC TỔNG THỂ

### Flow Diagram:

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                          │
│  - ProductDetailPage: Click "Thêm vào giỏ"                  │
│  - CartPage: Tăng/Giảm/Xóa sản phẩm                         │
│  - Header: Hiển thị badge số lượng                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ dispatch(action)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      REDUX ACTIONS                           │
│  - addToCart({ id, name, price, quantity, ... })            │
│  - removeFromCart(id)                                        │
│  - updateQuantity({ id, quantity })                          │
│  - clearCart()                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ reducer xử lý
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     REDUX STORE (STATE)                      │
│  {                                                           │
│    cart: {                                                   │
│      items: [                                                │
│        { id: 1, name: "...", price: 100000, quantity: 2 }   │
│      ],                                                      │
│      totalQuantity: 2                                        │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ saveCartToStorage()
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      LOCALSTORAGE                            │
│  Key: "tikiCart"                                             │
│  Value: JSON.stringify(state)                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ loadCartFromStorage()
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    KHÔI PHỤC KHI F5                          │
│  - Load từ localStorage                                      │
│  - Parse JSON → Object                                       │
│  - Set làm initialState                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ useSelector()
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                COMPONENTS RE-RENDER                          │
│  - Header badge cập nhật                                     │
│  - CartPage hiển thị danh sách                              │
│  - UI tự động sync với state                                │
└─────────────────────────────────────────────────────────────┘
```

---

## CÁC FILE ĐÃ TẠO/SỬA

### Tạo mới:
1. `src/store/cartSlice.js` - Redux slice cho giỏ hàng
2. `src/store/store.js` - Redux store configuration
3. `src/pages/CartPage.jsx` - Trang giỏ hàng
4. `src/pages/CartPage.css` - CSS cho trang giỏ hàng

### Chỉnh sửa:
1. `src/index.js` - Thêm Redux Provider
2. `src/App.jsx` - Thêm route `/cart`
3. `src/pages/ProductDetailPage.jsx` - Thêm chức năng "Thêm vào giỏ"
4. `src/components/Header/Header.jsx` - Hiển thị badge số lượng

---

## TÓM TẮT TỪNG BƯỚC THỰC HIỆN

### 📋 **BƯỚC 1: Cài đặt Redux Toolkit**
```bash
cd tiki-clone
npm install @reduxjs/toolkit react-redux
```

### 📋 **BƯỚC 2.1: Tạo Cart Slice**
1. Tạo thư mục: `src/store/`
2. Tạo file: `src/store/cartSlice.js`
3. Code:
   - Function `loadCartFromStorage()`
   - Function `saveCartToStorage()`
   - `createSlice` với 4 reducers
   - Export actions và reducer

### 📋 **BƯỚC 2.2: Tạo Store**
1. Tạo file: `src/store/store.js`
2. Code:
   - Import `configureStore` và `cartReducer`
   - Tạo store với `reducer: { cart: cartReducer }`
   - Export store

### 📋 **BƯỚC 3: Setup Provider**
1. Mở file: `src/index.js`
2. Sửa:
   - Import `Provider` và `store`
   - Bọc `<App />` với `<Provider store={store}>`

### 📋 **BƯỚC 4: Tạo Product Detail Page**
1. Tạo file: `src/pages/ProductDetailPage.jsx`
2. Tạo file: `src/pages/ProductDetailPage.css`
3. Code:
   - Import hooks, actions, data sources
   - Function `findProduct()` tìm từ nhiều data sources
   - Quantity selector
   - Nút "Thêm vào giỏ" với dispatch
   - Notification popup

### 📋 **BƯỚC 5: Tạo Cart Page**
1. Tạo file: `src/pages/CartPage.jsx`
2. Tạo file: `src/pages/CartPage.css`
3. Code:
   - `useSelector` lấy cartItems
   - Handlers: increase, decrease, remove
   - Render danh sách với `.map()`
   - Empty cart state
4. Cập nhật: `src/App.jsx` thêm route `/cart`

### 📋 **BƯỚC 6: Cập nhật Header Badge**
1. Mở file: `src/components/Header/Header.jsx`
2. Sửa:
   - Import `useSelector`
   - Lấy `cartItemsCount = state.cart.items.length`
   - Hiển thị badge luôn (kể cả = 0)

### 📋 **BƯỚC 7: Fix lỗi product ID**
1. Mở file: `src/components/SuggestedProducts/SuggestedProducts.jsx`
2. Sửa:
   - Đổi `id: i + 1` → `displayKey: i + 1`
   - Đổi `key={product.id}` → `key={product.displayKey}`

---

## TESTING CHECKLIST

### ✅ Thêm sản phẩm:
- [ ] Click "Thêm vào giỏ" → Badge tăng lên
- [ ] Thêm sản phẩm trùng → Số lượng tăng, không tạo item mới
- [ ] Thêm nhiều sản phẩm khác nhau → Badge hiển thị số lượng item

### ✅ Trang giỏ hàng:
- [ ] Hiển thị đúng danh sách sản phẩm
- [ ] Tăng số lượng → Tổng tiền cập nhật
- [ ] Giảm số lượng (tối thiểu 1)
- [ ] Xóa sản phẩm → Item bị loại bỏ
- [ ] Chọn/bỏ chọn → Tổng tiền thay đổi

### ✅ LocalStorage:
- [ ] F5 trang → Giỏ hàng không mất
- [ ] Đóng trình duyệt → Mở lại vẫn còn
- [ ] Xóa sản phẩm → F5 → Sản phẩm không xuất hiện lại

### ✅ Header badge:
- [ ] Giỏ trống → Badge: 0
- [ ] 1 sản phẩm số lượng 5 → Badge: 1
- [ ] 3 sản phẩm khác nhau → Badge: 3

---

## DEBUGGING TIPS

### Xem Redux State:
```javascript
// Trong React component
const state = useSelector((state) => state);
console.log("Redux State:", state);
```

### Xem localStorage:
```javascript
// Trong Browser Console
localStorage.getItem("tikiCart");

// Hoặc: DevTools → Application → Local Storage
```

### Redux DevTools:
Cài extension **Redux DevTools** để xem:
- State hiện tại
- Lịch sử các actions
- Time-travel debugging

---

## KẾT LUẬN

Chức năng giỏ hàng đã hoàn thành với đầy đủ tính năng:
- ✅ Redux state management
- ✅ LocalStorage persistence
- ✅ UI/UX giống Tiki
- ✅ Tự động cộng dồn sản phẩm trùng
- ✅ Badge hiển thị số lượng sản phẩm khác nhau
- ✅ Không mất data khi F5

**Các công nghệ sử dụng:**
- React Hooks (useState, useSelector, useDispatch)
- Redux Toolkit (@reduxjs/toolkit)
- React Redux (react-redux)
- Browser LocalStorage API
- React Router (routing)

---

## TÀI LIỆU THAM KHẢO

- Redux Toolkit: https://redux-toolkit.js.org/
- React Redux: https://react-redux.js.org/
- Redux DevTools: https://github.com/reduxjs/redux-devtools

