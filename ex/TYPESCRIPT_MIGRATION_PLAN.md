# TYPESCRIPT MIGRATION PLAN - DANH SÁCH ĐẦY ĐỦ

## TÌNH TRẠNG HIỆN TẠI

### ✅ ĐÃ CHUYỂN SANG TYPESCRIPT:
```
✅ src/store/addressSlice.ts
✅ src/store/cartSlice.ts  
✅ src/store/checkoutSlice.ts
✅ src/components/AddressSelector/AddressSelector.tsx
✅ src/types/css-modules.d.ts
```

## DANH SÁCH CẦN CHUYỂN THEO THỨ TỰ ƯU TIÊN

---

## 🔥 PRIORITY 1: CORE FILES (BẮT BUỘC)

### 1. Entry Points & Main App
```
📁 Root Level
├── src/index.js → src/index.tsx
├── src/App.jsx → src/App.tsx

🎯 Lý do: Entry points của ứng dụng, ảnh hưởng toàn bộ app
```

### 2. Store Configuration
```
📁 src/store/
├── store.js → store.ts

🎯 Lý do: Cấu hình Redux store, cần type cho RootState
```

### 3. Utilities (High Impact)
```
📁 src/utils/
├── priceUtils.js → priceUtils.ts
├── syncTabs.js → syncTabs.ts

🎯 Lý do: Functions được sử dụng nhiều nơi, cần type safety
```

---

## 🔶 PRIORITY 2: COMPLEX COMPONENTS (QUAN TRỌNG)

### 4. Form & Interactive Components
```
📁 src/components/
├── CheckoutForm/CheckoutForm.jsx → CheckoutForm.tsx
├── Login/Login.jsx → Login.tsx
├── SearchBar/SearchBar.jsx → SearchBar.tsx
├── Header/Header.jsx → Header.tsx

🎯 Lý do: Components phức tạp, có state management, form handling
```

### 5. Business Logic Components
```
📁 src/components/
├── FlashSale/FlashSale.jsx → FlashSale.tsx
├── TopDeals/TopDeals.jsx → TopDeals.tsx
├── SuggestedProducts/SuggestedProducts.jsx → SuggestedProducts.tsx

🎯 Lý do: Có business logic, tính toán giá, discount
```

---

## 🔷 PRIORITY 3: PAGES (TRUNG BÌNH)

### 6. Main Pages
```
📁 src/pages/
├── Home.jsx → Home.tsx
├── HomePage.jsx → HomePage.tsx
├── CartPage.jsx → CartPage.tsx
├── ProductDetailPage.jsx → ProductDetailPage.tsx
├── BuyerInfo.jsx → BuyerInfo.tsx

🎯 Lý do: Pages chính, có nhiều props và state
```

### 7. Feature Pages
```
📁 src/pages/
├── CategoryPage.jsx → CategoryPage.tsx
├── FlashSalePage.jsx → FlashSalePage.tsx
├── BrandPage.jsx → BrandPage.tsx
├── AboutPage.jsx → AboutPage.tsx
├── CommitmentPage.jsx → CommitmentPage.tsx
├── PromotionPage.jsx → PromotionPage.tsx

🎯 Lý do: Feature pages, có thể có complex logic
```

---

## 🔹 PRIORITY 4: UI COMPONENTS (THẤP)

### 8. Layout Components
```
📁 src/components/
├── Banner/Banner.jsx → Banner.tsx
├── Footer/Footer.jsx → Footer.tsx
├── HeroSlider/HeroSlider.jsx → HeroSlider.tsx
├── CategoryGrid/CategoryGrid.jsx → CategoryGrid.tsx

🎯 Lý do: UI components, ít logic nhưng có props
```

### 9. Feature Components
```
📁 src/components/
├── FeaturedBrands/FeaturedBrands.jsx → FeaturedBrands.tsx
├── HotInternational/HotInternational.jsx → HotInternational.tsx
├── MiniCategories/MiniCategories.jsx → MiniCategories.tsx
├── YouMayLike/YouMayLike.jsx → YouMayLike.tsx
├── FloatingButtons/FloatingButtons.jsx → FloatingButtons.tsx

🎯 Lý do: Feature components, display data
```

### 10. Shared Components
```
📁 src/components/
├── shared/NavigationArrows.jsx → NavigationArrows.tsx
├── ScrollToTop.jsx → ScrollToTop.tsx

🎯 Lý do: Shared utilities, reusable components
```

---

## 🔸 PRIORITY 5: DATA FILES (TÙY CHỌN)

### 11. Data Files
```
📁 src/data/
├── featuredBrandsData.js → featuredBrandsData.ts
├── flashSaleData.js → flashSaleData.ts
├── hotInternationalData.js → hotInternationalData.ts
├── suggestedProductsData.js → suggestedProductsData.ts
├── topDealsData.js → topDealsData.ts
├── youMayLikeData.js → youMayLikeData.ts

🎯 Lý do: Static data, có thể define types cho data structure
```

---

## 📋 MIGRATION ROADMAP

### WEEK 1: Core Infrastructure
```
Day 1-2: 
- ✅ src/index.js → src/index.tsx
- ✅ src/App.jsx → src/App.tsx
- ✅ src/store/store.js → src/store.ts

Day 3-5:
- ✅ src/utils/priceUtils.js → src/utils/priceUtils.ts
- ✅ src/utils/syncTabs.js → src/utils/syncTabs.ts
```

### WEEK 2: Complex Components
```
Day 1-3:
- ✅ CheckoutForm.jsx → CheckoutForm.tsx
- ✅ Login.jsx → Login.tsx
- ✅ SearchBar.jsx → SearchBar.tsx

Day 4-5:
- ✅ Header.jsx → Header.tsx
- ✅ FlashSale.jsx → FlashSale.tsx
```

### WEEK 3: Pages
```
Day 1-3:
- ✅ Main pages (Home, Cart, ProductDetail, BuyerInfo)

Day 4-5:
- ✅ Feature pages (Category, FlashSale, Brand, etc.)
```

### WEEK 4: UI Components
```
Day 1-3:
- ✅ Layout components (Banner, Footer, HeroSlider, etc.)

Day 4-5:
- ✅ Feature components (FeaturedBrands, HotInternational, etc.)
- ✅ Shared components
```

### WEEK 5: Data & Polish
```
Day 1-2:
- ✅ Data files migration

Day 3-5:
- ✅ Testing & bug fixes
- ✅ Type definitions refinement
- ✅ Documentation update
```

---

## 🎯 MIGRATION STRATEGY CHO TỪNG LOẠI FILE

### 1. Entry Points (index.js, App.jsx)
```typescript
// Trước
import React from 'react';
import ReactDOM from 'react-dom/client';

// Sau  
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RootState } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
```

### 2. Store Configuration
```typescript
// store.js → store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { CartState } from './cartSlice';
import addressReducer, { AddressState } from './addressSlice';
import checkoutReducer, { CheckoutState } from './checkoutSlice';

export interface RootState {
  cart: CartState;
  address: AddressState;
  checkout: CheckoutState;
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
    address: addressReducer,
    checkout: checkoutReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
```

### 3. Components Migration Pattern
```typescript
// Component.jsx → Component.tsx
import React from 'react';

interface ComponentProps {
  title: string;
  items: Item[];
  onItemClick?: (item: Item) => void;
}

const Component: React.FC<ComponentProps> = ({ title, items, onItemClick }) => {
  // Component logic
};

export default Component;
```

### 4. Utils Migration Pattern
```typescript
// utils.js → utils.ts
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export interface SyncData {
  key: string;
  value: any;
}

export const syncTabs = (data: SyncData): void => {
  // Sync logic
};
```

### 5. Data Files Migration Pattern
```typescript
// data.js → data.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

export const flashSaleData: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100000,
    image: "/images/product1.jpg",
    discount: 20
  }
];
```

---

## 🚨 LƯU Ý QUAN TRỌNG

### Files KHÔNG NÊN chuyển:
```
❌ CSS files (.css)
❌ Image files 
❌ Config files (package.json, etc.)
❌ Old/backup files (*-old.jsx, *_old.js)
❌ Test files (nếu có)
```

### Files CÓ THỂ BỎ QUA tạm thời:
```
⚠️ src/pages/TestPage.css (chỉ là CSS)
⚠️ Các file backup (*-old.jsx, *_new.jsx)
⚠️ Các file không được sử dụng
```

---

## 📊 THỐNG KÊ MIGRATION

### Tổng số files cần chuyển: **47 files**

#### Breakdown theo category:
- **Core files**: 4 files (index.js, App.jsx, store.js, utils)
- **Components**: 18 files 
- **Pages**: 13 files
- **Data files**: 6 files
- **Shared**: 2 files
- **Backup/Old files**: 4 files (có thể bỏ qua)

#### Ước tính thời gian:
- **Core files**: 1-2 ngày
- **Components**: 2-3 tuần  
- **Pages**: 1-2 tuần
- **Data files**: 2-3 ngày
- **Testing & Polish**: 3-5 ngày

**Tổng thời gian ước tính: 5-6 tuần**

---

## 🎯 RECOMMENDATION

### Bắt đầu với Priority 1 (Core Files):
1. `src/index.js` → `src/index.tsx`
2. `src/App.jsx` → `src/App.tsx` 
3. `src/store/store.js` → `src/store.ts`
4. `src/utils/priceUtils.js` → `src/utils/priceUtils.ts`

### Sau đó tiếp tục với Priority 2 (Complex Components):
1. `CheckoutForm.jsx` → `CheckoutForm.tsx`
2. `Header.jsx` → `Header.tsx`
3. `SearchBar.jsx` → `SearchBar.tsx`

Việc migration nên thực hiện **từ từ và test kỹ** sau mỗi file để đảm bảo không break functionality!