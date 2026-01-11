# 🚀 LỘ TRÌNH HOÀN THIỆN DỰ ÁN TIKI CLONE

> **Dành cho người mới học - Sau khi đã ghép API xong**

---

## 📌 Tổng Quan

Sau khi đã hoàn thành việc ghép API vào dự án, đây là lộ trình chi tiết để hoàn thiện dự án Tiki Clone của bạn. Lộ trình được sắp xếp theo thứ tự ưu tiên từ cao đến thấp.

---

## 1️⃣ TESTING & BUG FIXING (1-2 tuần)

### ✅ Kiểm tra tất cả các luồng chính

#### **Authentication Flow**

- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản đã có
- [ ] Đăng xuất
- [ ] Quên mật khẩu (nếu có)
- [ ] Kiểm tra token expiration
- [ ] Protected routes (redirect về login nếu chưa đăng nhập)

#### **Product Flow**

- [ ] Hiển thị danh sách sản phẩm
- [ ] Phân trang hoặc infinite scroll
- [ ] Xem chi tiết sản phẩm
- [ ] Lọc sản phẩm theo danh mục
- [ ] Tìm kiếm sản phẩm
- [ ] Sắp xếp sản phẩm (giá, tên, mới nhất)

#### **Cart Flow**

- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Cập nhật số lượng sản phẩm
- [ ] Xóa sản phẩm khỏi giỏ hàng
- [ ] Tính tổng tiền chính xác
- [ ] Giỏ hàng đồng bộ giữa các tab (cross-tab sync)
- [ ] Giỏ hàng persist sau khi refresh

#### **Checkout Flow**

- [ ] Chọn địa chỉ giao hàng
- [ ] Nhập thông tin người nhận
- [ ] Xác nhận đơn hàng
- [ ] Đặt hàng thành công
- [ ] Xóa giỏ hàng sau khi đặt hàng
- [ ] Lưu lịch sử đơn hàng

#### **Order History**

- [ ] Hiển thị danh sách đơn hàng
- [ ] Xem chi tiết đơn hàng
- [ ] Xóa lịch sử đơn hàng
- [ ] Persist sau khi refresh

#### **Flash Sale**

- [ ] Hiển thị sản phẩm flash sale
- [ ] Đếm ngược thời gian
- [ ] Cập nhật khi hết thời gian
- [ ] Thêm sản phẩm flash sale vào giỏ hàng

---

### 🐛 Fix các lỗi thường gặp

#### **Loading States**

```javascript
// Ví dụ: Hiển thị loading spinner
{
  isLoading ? (
    <div className="loading-spinner">
      <span>Đang tải...</span>
    </div>
  ) : (
    <ProductList products={products} />
  );
}
```

**Checklist:**

- [ ] Thêm loading state cho tất cả API calls
- [ ] Hiển thị skeleton loader thay vì spinner (tốt hơn cho UX)
- [ ] Disable buttons khi đang loading
- [ ] Hiển thị progress bar cho upload files

#### **Error Handling**

```javascript
// Ví dụ: Xử lý lỗi API
try {
  const response = await api.getProducts();
  setProducts(response.data);
} catch (error) {
  toast.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại!");
  console.error("Error fetching products:", error);
}
```

**Checklist:**

- [ ] Bắt lỗi cho tất cả API calls
- [ ] Hiển thị thông báo lỗi thân thiện với người dùng
- [ ] Xử lý lỗi 401 (Unauthorized) - redirect về login
- [ ] Xử lý lỗi 404 (Not Found)
- [ ] Xử lý lỗi 500 (Server Error)
- [ ] Retry mechanism cho failed requests

#### **Form Validation**

```javascript
// Ví dụ: Validate email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate trước khi submit
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError("Email không hợp lệ");
    return;
  }

  // Submit form...
};
```

**Checklist:**

- [ ] Validate email format
- [ ] Validate số điện thoại
- [ ] Validate password strength
- [ ] Required fields
- [ ] Min/max length
- [ ] Hiển thị error messages rõ ràng
- [ ] Disable submit button nếu form invalid

#### **Edge Cases**

**Checklist:**

- [ ] Giỏ hàng rỗng - hiển thị empty state
- [ ] Không có sản phẩm - hiển thị "Không tìm thấy sản phẩm"
- [ ] Không có kết quả tìm kiếm
- [ ] Sản phẩm hết hàng
- [ ] Số lượng sản phẩm = 0
- [ ] Hình ảnh bị lỗi - hiển thị placeholder
- [ ] Slow network - timeout handling
- [ ] Offline mode - hiển thị thông báo

---

## 2️⃣ TỐI ƯU PERFORMANCE (1 tuần)

### ⚡ Code Optimization

#### **React.memo - Tránh re-render không cần thiết**

```javascript
// Trước khi optimize
const ProductCard = ({ product }) => {
  return <div>{product.name}</div>;
};

// Sau khi optimize
const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>;
});
```

#### **useMemo - Cache giá trị tính toán phức tạp**

```javascript
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);

  // Tính tổng tiền chỉ khi cartItems thay đổi
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  return <div>Tổng: {totalPrice}</div>;
};
```

#### **useCallback - Cache function**

```javascript
const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Cache function để tránh tạo lại mỗi lần render
  const handleAddToCart = useCallback(
    (productId) => {
      dispatch(addToCart(productId));
    },
    [dispatch]
  );

  return products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      onAddToCart={handleAddToCart}
    />
  ));
};
```

#### **Lazy Loading Components**

```javascript
// App.jsx
import { lazy, Suspense } from "react";

// Lazy load các page lớn
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Suspense>
  );
}
```

#### **Redux Optimization**

```javascript
// Sử dụng selector với reselect để tránh re-render
import { createSelector } from "@reduxjs/toolkit";

// Selector cơ bản
const selectCartItems = (state) => state.cart.items;

// Memoized selector
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Sử dụng trong component
const total = useSelector(selectCartTotal);
```

**Checklist:**

- [ ] Wrap components với React.memo
- [ ] Sử dụng useMemo cho calculations
- [ ] Sử dụng useCallback cho event handlers
- [ ] Lazy load routes
- [ ] Code splitting
- [ ] Tối ưu Redux selectors

---

### 🖼️ Asset Optimization

#### **Image Optimization**

```javascript
// Lazy load images
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductImage = ({ src, alt }) => (
  <LazyLoadImage
    src={src}
    alt={alt}
    effect="blur"
    placeholderSrc="/placeholder.jpg"
  />
);
```

**Checklist:**

- [ ] Nén hình ảnh (TinyPNG, ImageOptim)
- [ ] Sử dụng WebP format
- [ ] Lazy load images
- [ ] Responsive images (srcset)
- [ ] Image placeholder khi loading
- [ ] CDN cho static assets

#### **Bundle Size Optimization**

```bash
# Phân tích bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

**Checklist:**

- [ ] Remove unused dependencies
- [ ] Tree shaking
- [ ] Code splitting
- [ ] Minify CSS/JS
- [ ] Gzip compression

---

## 3️⃣ RESPONSIVE DESIGN (1 tuần)

### 📱 Breakpoints

```css
/* Mobile First Approach */

/* Mobile (< 768px) - Default */
.container {
  padding: 16px;
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 🎨 Responsive Components

#### **Responsive Grid**

```css
.product-grid {
  display: grid;
  gap: 16px;

  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .product-grid {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    /* Desktop: 4 columns */
    grid-template-columns: repeat(4, 1fr);
  }
}
```

#### **Mobile Navigation**

```javascript
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* Desktop Menu */}
      <nav className="desktop-menu">
        <Link to="/">Trang chủ</Link>
        <Link to="/products">Sản phẩm</Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu">
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
        </nav>
      )}
    </header>
  );
};
```

**Checklist:**

- [ ] Test trên mobile (< 768px)
- [ ] Test trên tablet (768px - 1024px)
- [ ] Test trên desktop (> 1024px)
- [ ] Touch-friendly buttons (min 44px)
- [ ] Responsive images
- [ ] Responsive typography
- [ ] Mobile navigation menu
- [ ] Responsive tables (scroll hoặc stack)

---

## 4️⃣ UX/UI IMPROVEMENTS (1 tuần)

### ✨ Loading Skeletons

```javascript
// ProductSkeleton.jsx
const ProductSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-price"></div>
  </div>
);

// Sử dụng
{
  isLoading ? <ProductSkeleton /> : <ProductCard product={product} />;
}
```

```css
/* Skeleton CSS */
.skeleton-image,
.skeleton-title,
.skeleton-price {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

### 🔔 Toast Notifications

```bash
# Cài đặt react-toastify
npm install react-toastify
```

```javascript
// App.jsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>...</Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}

// Sử dụng trong component
import { toast } from "react-toastify";

const handleAddToCart = () => {
  dispatch(addToCart(product));
  toast.success("Đã thêm vào giỏ hàng!");
};
```

---

### 🎭 Animations & Transitions

```css
/* Smooth transitions */
.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.product-card {
  animation: fadeIn 0.5s ease;
}
```

---

### 📭 Empty States

```javascript
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <img src="/empty-cart.svg" alt="Giỏ hàng trống" />
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <Link to="/products">
          <button>Tiếp tục mua sắm</button>
        </Link>
      </div>
    );
  }

  return <div>...</div>;
};
```

**Checklist:**

- [ ] Loading skeletons cho tất cả data fetching
- [ ] Toast notifications cho actions
- [ ] Smooth transitions
- [ ] Hover effects
- [ ] Empty states cho giỏ hàng, đơn hàng, tìm kiếm
- [ ] Confirmation dialogs (xóa sản phẩm, đăng xuất)
- [ ] Progress indicators

---

## 5️⃣ SECURITY & VALIDATION (3-5 ngày)

### 🔒 Client-side Validation

```javascript
// Validation utilities
export const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : "Email không hợp lệ";
  },

  phone: (value) => {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return regex.test(value) ? null : "Số điện thoại không hợp lệ";
  },

  required: (value) => {
    return value && value.trim() ? null : "Trường này là bắt buộc";
  },

  minLength: (min) => (value) => {
    return value.length >= min ? null : `Tối thiểu ${min} ký tự`;
  },

  maxLength: (max) => (value) => {
    return value.length <= max ? null : `Tối đa ${max} ký tự`;
  },
};
```

---

### 🛡️ Token Management

```javascript
// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});
```

```javascript
// axios interceptor
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

### 🚪 Protected Routes

```javascript
// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />

  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    }
  />
</Routes>;
```

---

### 🛡️ XSS Prevention

```javascript
// Sanitize user input
import DOMPurify from "dompurify";

const ProductDescription = ({ description }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />;
};
```

**Checklist:**

- [ ] Validate tất cả form inputs
- [ ] Sanitize user-generated content
- [ ] Secure token storage
- [ ] Auto-logout khi token expired
- [ ] Protected routes
- [ ] HTTPS only (trong production)
- [ ] Environment variables cho sensitive data

---

## 6️⃣ SEO & ACCESSIBILITY (2-3 ngày)

### 🔍 SEO Basics

```javascript
// Sử dụng react-helmet
import { Helmet } from "react-helmet";

const ProductDetailPage = ({ product }) => {
  return (
    <>
      <Helmet>
        <title>{product.name} | Tiki Clone</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
      </Helmet>

      <div>...</div>
    </>
  );
};
```

---

### ♿ Accessibility

```javascript
// Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Trang chủ</a></li>
    <li><a href="/products">Sản phẩm</a></li>
  </ul>
</nav>

// ARIA labels
<button
  aria-label="Thêm vào giỏ hàng"
  onClick={handleAddToCart}
>
  <ShoppingCartIcon />
</button>

// Alt text cho images
<img
  src={product.image}
  alt={`Hình ảnh sản phẩm ${product.name}`}
/>

// Keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

**Checklist:**

- [ ] Meta tags cho mỗi page
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] Alt text cho tất cả images
- [ ] ARIA labels cho icons
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Color contrast ratio >= 4.5:1
- [ ] Screen reader friendly

---

## 7️⃣ DOCUMENTATION (2-3 ngày)

### 📝 README.md

````markdown
# Tiki Clone

Dự án clone website Tiki.vn được xây dựng với React, Redux Toolkit, và TypeScript.

## 🚀 Tính năng

- ✅ Đăng nhập/Đăng ký
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Giỏ hàng
- ✅ Thanh toán
- ✅ Lịch sử đơn hàng
- ✅ Flash sale

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** CSS Modules
- **API Client:** Axios
- **Build Tool:** Vite

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/yourusername/tiki-clone.git

# Di chuyển vào thư mục dự án
cd tiki-clone

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env với thông tin API của bạn
REACT_APP_API_URL=http://localhost:3000/api
```
````

## 🚀 Chạy dự án

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
tiki-clone/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── store/          # Redux slices
│   ├── utils/          # Utility functions
│   ├── api/            # API calls
│   └── App.jsx
├── public/
└── package.json
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Pull Request.

## 📄 License

MIT License

````

---

### 💬 Code Comments

```javascript
/**
 * Tính tổng giá trị giỏ hàng
 * @param {Array} items - Danh sách sản phẩm trong giỏ hàng
 * @returns {number} Tổng giá trị
 */
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + (item.currentPrice * item.quantity);
  }, 0);
};

/**
 * Component hiển thị thông tin sản phẩm
 * @param {Object} props
 * @param {Object} props.product - Thông tin sản phẩm
 * @param {Function} props.onAddToCart - Callback khi thêm vào giỏ hàng
 */
const ProductCard = ({ product, onAddToCart }) => {
  // ...
};
````

**Checklist:**

- [ ] README.md chi tiết
- [ ] Hướng dẫn cài đặt
- [ ] Hướng dẫn chạy project
- [ ] Cấu trúc thư mục
- [ ] Tech stack
- [ ] Environment variables
- [ ] Comment code phức tạp
- [ ] API documentation

---

## 8️⃣ DEPLOYMENT (2-3 ngày)

### 🚀 Frontend Deployment

#### **Vercel (Recommended)**

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### **Netlify**

```bash
# Build project
npm run build

# Deploy folder 'dist' hoặc 'build' lên Netlify
# Hoặc connect GitHub repo trên Netlify dashboard
```

---

### 🔧 Environment Variables

```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

**Vercel:**

- Settings → Environment Variables
- Add variables: `REACT_APP_API_URL`, etc.

**Netlify:**

- Site settings → Build & deploy → Environment
- Add variables

---

### 📊 CI/CD với GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

**Checklist:**

- [ ] Deploy frontend lên Vercel/Netlify
- [ ] Setup custom domain (nếu có)
- [ ] Configure environment variables
- [ ] Setup CI/CD
- [ ] Test production build
- [ ] Monitor errors (Sentry)

---

## 9️⃣ ADVANCED FEATURES (Tùy chọn)

### 🎯 Wishlist

```javascript
// wishlistSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});
```

---

### ⭐ Reviews & Ratings

```javascript
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async () => {
    await api.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    });
    // Refresh reviews
  };

  return (
    <div>
      <h3>Đánh giá sản phẩm</h3>

      {/* Rating input */}
      <StarRating value={rating} onChange={setRating} />

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Nhận xét của bạn..."
      />

      <button onClick={handleSubmitReview}>Gửi đánh giá</button>

      {/* Display reviews */}
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
```

---

### 💳 Payment Gateway Integration

```javascript
// VNPay integration example
const handleVNPayCheckout = async (orderData) => {
  try {
    const response = await api.post("/payment/vnpay/create", {
      amount: orderData.total,
      orderId: orderData.id,
      orderInfo: "Thanh toán đơn hàng",
      returnUrl: `${window.location.origin}/payment/result`,
    });

    // Redirect to VNPay
    window.location.href = response.data.paymentUrl;
  } catch (error) {
    toast.error("Không thể tạo thanh toán");
  }
};
```

---

### 📧 Email Notifications

```javascript
// Backend: Send email after order
const sendOrderConfirmationEmail = async (order) => {
  await emailService.send({
    to: order.customerEmail,
    subject: "Xác nhận đơn hàng",
    template: "order-confirmation",
    data: {
      orderNumber: order.id,
      items: order.items,
      total: order.total,
    },
  });
};
```

---

### 👨‍💼 Admin Dashboard

```javascript
// Admin routes
<Routes>
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route path="products" element={<ProductManagement />} />
    <Route path="orders" element={<OrderManagement />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>
</Routes>
```

**Tính năng Admin:**

- [ ] Quản lý sản phẩm (CRUD)
- [ ] Quản lý đơn hàng
- [ ] Quản lý người dùng
- [ ] Thống kê doanh thu
- [ ] Quản lý danh mục
- [ ] Quản lý flash sale

---

## 🔟 PORTFOLIO & SHOWCASE

### 💼 Chuẩn bị để show

#### **1. Live Demo**

- Deploy lên Vercel/Netlify
- Có domain đẹp (tùy chọn)
- Đảm bảo hoạt động tốt

#### **2. Video Demo**

- Quay video demo 2-3 phút
- Showcase các tính năng chính
- Upload lên YouTube

#### **3. GitHub Repository**

- README.md chi tiết
- Code sạch, có comments
- Commit messages rõ ràng
- Add screenshots

#### **4. Case Study**

Viết blog post về dự án:

- Vấn đề cần giải quyết
- Tech stack đã chọn và lý do
- Challenges và cách giải quyết
- Kết quả đạt được
- Bài học rút ra

#### **5. CV/Portfolio**

```markdown
## Tiki Clone - E-commerce Platform

**Tech Stack:** React, Redux Toolkit, TypeScript, Vite

**Features:**

- Implemented full e-commerce flow with cart, checkout, and order history
- Integrated RESTful APIs with error handling and loading states
- Optimized performance with React.memo, useMemo, and code splitting
- Responsive design for mobile, tablet, and desktop
- Cross-tab synchronization using localStorage events

**Live Demo:** https://tiki-clone.vercel.app
**GitHub:** https://github.com/yourusername/tiki-clone
```

---

## 📊 CHECKLIST TỔNG HỢP

### Phase 1: Core Functionality (Tuần 1-2)

- [ ] Testing tất cả flows
- [ ] Fix bugs
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation

### Phase 2: Optimization (Tuần 3)

- [ ] Performance optimization
- [ ] Responsive design
- [ ] UX improvements

### Phase 3: Polish (Tuần 4)

- [ ] Security
- [ ] SEO & Accessibility
- [ ] Documentation

### Phase 4: Launch (Tuần 5)

- [ ] Deployment
- [ ] Testing production
- [ ] Portfolio preparation

---

## 🎯 LỘ TRÌNH ƯU TIÊN CHO NGƯỜI MỚI

### Tháng 1: Foundation

1. **Testing & Bug Fixing** (1-2 tuần)
2. **Responsive Design** (1 tuần)

### Tháng 2: Enhancement

3. **UX/UI Improvements** (1 tuần)
4. **Documentation** (2-3 ngày)
5. **Deployment** (2-3 ngày)

### Tháng 3: Advanced (Tùy chọn)

6. **Performance Optimization**
7. **Advanced Features**
8. **Portfolio & Showcase**

---

## 📚 TÀI LIỆU THAM KHẢO

### React & Redux

- [React Official Docs](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)

### Performance

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

### Accessibility

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)

### Deployment

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

## 💡 TIPS & TRICKS

### 1. Làm từng bước một

Đừng cố làm tất cả cùng lúc. Tập trung vào 1 task, hoàn thành rồi mới chuyển sang task tiếp theo.

### 2. Test thường xuyên

Sau mỗi feature, test ngay để phát hiện bug sớm.

### 3. Git commit thường xuyên

Commit sau mỗi feature hoàn thành với message rõ ràng.

### 4. Đọc error messages

Error messages thường cho biết chính xác vấn đề ở đâu.

### 5. Google & Stack Overflow

Đừng ngại search khi gặp vấn đề. 99% vấn đề đã có người gặp và giải quyết.

### 6. Code review

Nhờ người khác review code để học hỏi và cải thiện.

### 7. Refactor code

Sau khi feature hoạt động, refactor để code sạch hơn.

### 8. Document ngay

Viết documentation ngay khi làm, đừng để sau.

---

## 🎉 KẾT LUẬN

Hoàn thiện một dự án clone Tiki là một hành trình dài, nhưng mỗi bước đều giúp bạn học được điều mới. Đừng vội vàng, hãy tập trung vào chất lượng hơn là tốc độ.

**Chúc bạn thành công! 🚀**

---

_Tài liệu này được tạo ngày: 30/12/2024_
_Phiên bản: 1.0_
