# API Documentation - Giỏ hàng & Flash Sale

## 📦 API Giỏ hàng (Cart API)

### 1. Thêm/Cập nhật sản phẩm vào giỏ hàng

**Endpoint:** `POST /api-end-user/cart/cart-public/update-item`

**Redux Action:** `addItemToCart`

**Request Body:**

```json
{
  "ProductId": 123,
  "Quantity": 1,
  "Price": 150000
}
```

**Cách sử dụng:**

```javascript
import { addItemToCart } from "../store/cartSlice";

const handleAddToCart = async () => {
  await dispatch(
    addItemToCart({
      productId: product.id,
      quantity: 1,
      price: product.currentPrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      name: product.name,
      image: product.image,
    })
  ).unwrap();
};
```

---

### 2. Lấy chi tiết giỏ hàng

**Endpoint:** `GET /api-end-user/cart/cart-public/{id}`

**Redux Action:** `fetchCartDetail`

**Cách sử dụng:**

```javascript
import { fetchCartDetail } from "../store/cartSlice";

const handleFetchCart = async (cartId) => {
  const result = await dispatch(fetchCartDetail(cartId)).unwrap();
  console.log("Cart items:", result);
};
```

**Response:**

```json
{
  "Data": {
    "Items": [
      {
        "ProductId": 123,
        "ProductName": "Sản phẩm A",
        "ProductImage": "image.jpg",
        "Price": 150000,
        "OriginalPrice": 200000,
        "Discount": 25,
        "Quantity": 2
      }
    ]
  }
}
```

---

### 3. Xóa từng sản phẩm trong giỏ hàng

**Endpoint:** `PUT /api-end-user/cart/cart-public/remove-item`

**Redux Action:** `removeItemFromCart`

**Request Body:**

```json
{
  "ProductId": 123
}
```

**Cách sử dụng:**

```javascript
import { removeItemFromCart } from "../store/cartSlice";

const handleRemoveItem = async (productId) => {
  await dispatch(removeItemFromCart(productId)).unwrap();
  alert("Đã xóa sản phẩm!");
};
```

---

### 4. Xóa tất cả sản phẩm trong giỏ hàng

**Endpoint:** `PUT /api-end-user/cart/cart-public/clear-item`

**Redux Action:** `clearAllCartItems`

**Cách sử dụng:**

```javascript
import { clearAllCartItems } from "../store/cartSlice";

const handleClearCart = async () => {
  await dispatch(clearAllCartItems()).unwrap();
  alert("Đã xóa tất cả sản phẩm!");
};
```

---

### 5. Cập nhật số lượng sản phẩm

**Endpoint:** `PUT /api-end-user/cart/cart-public/update-item`

**Redux Action:** `updateCartItemQuantity`

**Request Body:**

```json
{
  "ProductId": 123,
  "Quantity": 3,
  "Price": 150000
}
```

**Cách sử dụng:**

```javascript
import { updateCartItemQuantity } from "../store/cartSlice";

const handleUpdateQuantity = async (productId, newQuantity, price) => {
  await dispatch(
    updateCartItemQuantity({
      productId,
      quantity: newQuantity,
      price,
    })
  ).unwrap();
};
```

---

## ⚡ API Flash Sale

### 1. Danh sách sản phẩm Flash Sale

**Endpoint:** `POST /api-end-user/listing/get-by-page`

**Redux Action:** `fetchFlashSaleProducts`

**Request Body:**

```json
{
  "PageIndex": 1,
  "PageSize": 18,
  "Orderby": "CreatedDate desc",
  "AId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
  "CurrencyCode": "VND",
  "Keyword": "",
  "IsFlashSale": true
}
```

**Cách sử dụng:**

```javascript
import { fetchFlashSaleProducts } from "../store/flashSaleSlice";

useEffect(() => {
  dispatch(
    fetchFlashSaleProducts({
      pageIndex: 1,
      pageSize: 18,
      keyword: "",
    })
  );
}, [dispatch]);
```

**Response:**

```json
{
  "Data": {
    "Result": [
      {
        "Id": "abc123",
        "Name": "Sản phẩm Flash Sale",
        "Price": 200000,
        "MinPromotionPrice": 150000,
        "MaxPrice": 200000,
        "MinHasPromotion": true,
        "Image": "image.jpg",
        "Rating": 4.5,
        "SoldPercent": 45,
        "Stock": 100,
        "Sold": 45,
        "FlashSaleStartTime": "2024-01-01T00:00:00",
        "FlashSaleEndTime": "2024-01-01T23:59:59"
      }
    ],
    "TotalCount": 50
  }
}
```

---

### 2. Chi tiết sản phẩm Flash Sale

**Endpoint:** `GET /api-end-user/listing/{id}`

**Redux Action:** `fetchFlashSaleProductById`

**Query Parameters:**

- `aid`: da1e0cd8-f73b-4da2-acf2-8ddc621bcf75

**Cách sử dụng:**

```javascript
import { fetchFlashSaleProductById } from "../store/flashSaleSlice";

useEffect(() => {
  if (productId) {
    dispatch(fetchFlashSaleProductById(productId));
  }
}, [dispatch, productId]);
```

**Response:**

```json
{
  "Data": {
    "Id": "abc123",
    "Name": "Sản phẩm Flash Sale",
    "Description": "Mô tả chi tiết",
    "ShortDescription": "Mô tả ngắn",
    "Price": 200000,
    "MinPromotionPrice": 150000,
    "MaxPrice": 200000,
    "MinHasPromotion": true,
    "Image": "image.jpg",
    "Rating": 4.5,
    "SoldPercent": 45,
    "Stock": 100,
    "Sold": 45,
    "FlashSaleStartTime": "2024-01-01T00:00:00",
    "FlashSaleEndTime": "2024-01-01T23:59:59"
  }
}
```

---

## 🔧 Redux Selectors

### Cart Selectors

```javascript
import {
  selectCartItems, // Lấy danh sách sản phẩm trong giỏ
  selectCartStatus, // Lấy trạng thái: idle, pending, succeeded, failed
  selectCartError, // Lấy thông báo lỗi
  selectTotalQuantity, // Lấy tổng số lượng sản phẩm
  selectCartTotal, // Lấy tổng tiền
  selectCartItemById, // Lấy sản phẩm theo ID
} from "../store/cartSlice";

// Sử dụng
const cartItems = useSelector(selectCartItems);
const totalQuantity = useSelector(selectTotalQuantity);
const cartTotal = useSelector(selectCartTotal);
```

### Flash Sale Selectors

```javascript
import {
  selectFlashSaleProducts, // Lấy danh sách sản phẩm
  selectFlashSaleStatus, // Lấy trạng thái
  selectFlashSaleError, // Lấy lỗi
  selectFlashSaleTotalCount, // Lấy tổng số sản phẩm
  selectFlashSalePageIndex, // Lấy trang hiện tại
  selectFlashSaleCurrentProduct, // Lấy sản phẩm đang xem
  selectFlashSaleProductDetailStatus, // Lấy trạng thái chi tiết
} from "../store/flashSaleSlice";

// Sử dụng
const products = useSelector(selectFlashSaleProducts);
const status = useSelector(selectFlashSaleStatus);
const currentProduct = useSelector(selectFlashSaleCurrentProduct);
```

---

## 📝 Cấu trúc dữ liệu

### CartItem Interface

```typescript
interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}
```

### FlashSaleProduct Interface

```typescript
interface FlashSaleProduct {
  id: string | number;
  title: string;
  name?: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  rating?: number;
  image: string;
  soldPercent?: number;
  stock?: number;
  sold?: number;
  startTime?: string;
  endTime?: string;
}
```

---

## 🎯 Ví dụ hoàn chỉnh

### Component sử dụng Cart API

```javascript
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  selectCartItems,
  selectCartStatus,
} from "../store/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const status = useSelector(selectCartStatus);

  const handleAddToCart = (product) => {
    dispatch(
      addItemToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        name: product.name,
        image: product.image,
      })
    );
  };

  const handleRemove = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleUpdateQuantity = (productId, quantity, price) => {
    dispatch(updateCartItemQuantity({ productId, quantity, price }));
  };

  return (
    <div>
      {status === "pending" && <p>Loading...</p>}
      {cartItems.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price}₫</p>
          <button onClick={() => handleRemove(item.id)}>Xóa</button>
          <button
            onClick={() =>
              handleUpdateQuantity(item.id, item.quantity + 1, item.price)
            }
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Component sử dụng Flash Sale API

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFlashSaleProducts,
  selectFlashSaleProducts,
  selectFlashSaleStatus,
} from "../store/flashSaleSlice";

const FlashSalePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFlashSaleProducts);
  const status = useSelector(selectFlashSaleStatus);

  useEffect(() => {
    dispatch(fetchFlashSaleProducts({ pageIndex: 1, pageSize: 18 }));
  }, [dispatch]);

  return (
    <div>
      {status === "pending" && <p>Loading...</p>}
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.currentPrice}₫</p>
          {product.discount > 0 && <span>-{product.discount}%</span>}
        </div>
      ))}
    </div>
  );
};
```

---

## 📚 Files đã tạo

1. **`src/store/cartSlice.ts`** - Redux slice cho giỏ hàng với API integration
2. **`src/store/flashSaleSlice.ts`** - Redux slice cho Flash Sale với API integration
3. **`src/examples/CartAPIExample.jsx`** - Ví dụ sử dụng Cart API
4. **`src/examples/FlashSaleAPIExample.jsx`** - Ví dụ sử dụng Flash Sale API
5. **`src/components/FlashSale/FlashSale.jsx`** - Component đã được cập nhật để sử dụng API

---

## ⚠️ Lưu ý

1. **API Base URL**: `http://192.168.2.112:9092`
2. **AId**: `da1e0cd8-f73b-4da2-acf2-8ddc621bcf75` (cần thiết cho các API listing)
3. **Error Handling**: Tất cả các API đều có try-catch và trả về error message
4. **Loading States**: Sử dụng `status` để hiển thị loading spinner
5. **Fallback Data**: FlashSale component sẽ fallback về static data nếu API fail

---

## 🚀 Cách test

1. Import và sử dụng các actions trong component
2. Kiểm tra Redux DevTools để xem state changes
3. Kiểm tra Network tab để xem API calls
4. Test error cases bằng cách tắt server hoặc sử dụng invalid data
