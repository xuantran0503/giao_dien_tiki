# FILE PRIORITY & MIGRATION SAFETY GUIDE

## 🤔 HIỆN TẠI CHƯƠNG TRÌNH ĐANG DÙNG FILE NÀO?

### **CÂU TRẢ LỜI NGẮN GỌN:**
**Hiện tại chương trình đang dùng file `.js/.jsx`** vì:
1. **React Scripts** (Webpack) ưu tiên `.js` trước `.ts` theo mặc định
2. **Entry point** trong package.json không specify extension
3. **Module resolution** tìm `.js` trước `.ts`

---

## 📋 FILE RESOLUTION ORDER

### **Webpack/React Scripts Resolution Priority:**
```
1. index.js     ← ĐANG DÙNG
2. index.jsx    
3. index.ts     ← File mới tạo (chưa dùng)
4. index.tsx    ← File mới tạo (chưa dùng)
```

### **Import Resolution Priority:**
```javascript
// Khi code gọi: import store from './store'
// Webpack sẽ tìm theo thứ tự:

1. store.js     ← ĐANG DÙNG
2. store.jsx    
3. store.ts     ← File mới tạo (chưa dùng)
4. store.tsx    
```

---

## 🔍 KIỂM TRA HIỆN TẠI

### **Files đang được sử dụng:**
```
✅ src/index.js          ← ACTIVE
✅ src/App.jsx           ← ACTIVE  
✅ src/store/store.js    ← ACTIVE
✅ src/utils/priceUtils.js ← ACTIVE
✅ src/utils/syncTabs.js ← ACTIVE
```

### **Files TypeScript (chưa được sử dụng):**
```
⚠️ src/index.tsx         ← STANDBY
⚠️ src/App.tsx           ← STANDBY
⚠️ src/store/store.ts    ← STANDBY  
⚠️ src/utils/priceUtils.ts ← STANDBY
⚠️ src/utils/syncTabs.ts ← STANDBY
```

---

## ✅ CÓ THỂ XÓA FILE JS KHÔNG?

### **CÂU TRẢ LỜI: CÓ, NHƯNG CẦN LÀM ĐÚNG THỨ TỰ**

**Nếu xóa file JS, chương trình sẽ tự động chuyển sang dùng file TS!**

### **Lý do:**
1. **Webpack fallback**: Khi không tìm thấy `.js`, sẽ tìm `.ts`
2. **TypeScript compatibility**: React Scripts hỗ trợ TypeScript out-of-the-box
3. **Same functionality**: File TS có tất cả functionality của file JS

---

## 🚨 CÁCH XÓA AN TOÀN

### **OPTION 1: Xóa từng file một (KHUYẾN KHÍCH)**

#### **Bước 1: Test với 1 file trước**
```bash
# Backup file gốc
mv src/utils/priceUtils.js src/utils/priceUtils.js.backup

# Chạy app để test
npm start

# Nếu OK, xóa backup. Nếu lỗi, restore:
# mv src/utils/priceUtils.js.backup src/utils/priceUtils.js
```

#### **Bước 2: Xóa theo thứ tự ưu tiên**
```bash
# 1. Utils files (ít risk)
rm src/utils/priceUtils.js
rm src/utils/syncTabs.js

# 2. Store files  
rm src/store/store.js

# 3. App files (high risk)
rm src/App.jsx

# 4. Entry point (highest risk)
rm src/index.js
```

### **OPTION 2: Xóa tất cả cùng lúc (RỦI RO CAO)**
```bash
# ⚠️ Chỉ làm nếu đã backup toàn bộ project
rm src/index.js src/App.jsx src/store/store.js src/utils/*.js
```

---

## 🔧 SETTINGS CẦN THAY ĐỔI

### **KHÔNG CẦN THAY ĐỔI GÌ!** 

**Lý do:**
- ✅ `tsconfig.json` đã cấu hình đúng
- ✅ `package.json` có TypeScript dependencies
- ✅ React Scripts hỗ trợ TypeScript sẵn
- ✅ Webpack auto-resolve file extensions

### **Tuy nhiên, có thể tối ưu tsconfig.json:**

#### **Hiện tại:**
```json
{
  "compilerOptions": {
    "allowJs": true,     ← Cho phép JS files
    "checkJs": false,    ← Không check JS files
    // ...
  }
}
```

#### **Sau khi xóa JS files (tùy chọn):**
```json
{
  "compilerOptions": {
    "allowJs": false,    ← Chỉ cho phép TS files
    "checkJs": false,    ← Không cần nữa
    // ...
  }
}
```

---

## 🧪 TESTING STRATEGY

### **Trước khi xóa JS files:**

#### **1. Kiểm tra build:**
```bash
npm run build
# Phải thành công
```

#### **2. Kiểm tra TypeScript compilation:**
```bash
npx tsc --noEmit
# Không được có errors
```

#### **3. Test imports:**
```typescript
// Tạo file test.ts
import { formatPrice } from './utils/priceUtils';
import store from './store/store';
import App from './App';

console.log('All imports work!');
```

### **Sau khi xóa JS files:**

#### **1. Verify app starts:**
```bash
npm start
# App phải start không lỗi
```

#### **2. Test functionality:**
- ✅ Redux store hoạt động
- ✅ Components render đúng  
- ✅ Price formatting works
- ✅ Cross-tab sync works

---

## 📊 RISK ASSESSMENT

### **LOW RISK (Xóa được ngay):**
```
✅ src/utils/priceUtils.js    ← Utils functions
✅ src/utils/syncTabs.js      ← Helper functions
```

### **MEDIUM RISK (Cần test kỹ):**
```
⚠️ src/store/store.js         ← Redux store config
```

### **HIGH RISK (Xóa cuối cùng):**
```
🚨 src/App.jsx               ← Main component
🚨 src/index.js              ← Entry point
```

---

## 🎯 RECOMMENDED MIGRATION PLAN

### **Phase 1: Utils (5 phút)**
```bash
# Backup
cp src/utils/priceUtils.js src/utils/priceUtils.js.bak
cp src/utils/syncTabs.js src/utils/syncTabs.js.bak

# Test removal
rm src/utils/priceUtils.js src/utils/syncTabs.js
npm start  # Test

# If OK, remove backups
rm src/utils/*.bak
```

### **Phase 2: Store (10 phút)**
```bash
# Backup & test
cp src/store/store.js src/store/store.js.bak
rm src/store/store.js
npm start  # Test thoroughly

# Test Redux functionality:
# - Add to cart
# - Address selection  
# - Cross-tab sync

# If OK, remove backup
rm src/store/store.js.bak
```

### **Phase 3: App Components (15 phút)**
```bash
# Backup & test
cp src/App.jsx src/App.jsx.bak
rm src/App.jsx
npm start  # Test

# Test routing:
# - Navigate between pages
# - Check all routes work

# If OK, remove backup
rm src/App.jsx.bak
```

### **Phase 4: Entry Point (5 phút)**
```bash
# Backup & test
cp src/index.js src/index.js.bak
rm src/index.js
npm start  # Final test

# Test everything:
# - App starts
# - All functionality works
# - No console errors

# If OK, remove backup
rm src/index.js.bak
```

---

## 🚨 ROLLBACK PLAN

### **Nếu có lỗi sau khi xóa:**

#### **1. Restore từ backup:**
```bash
# Restore specific file
mv src/index.js.bak src/index.js

# Hoặc restore tất cả
git checkout HEAD -- src/index.js src/App.jsx src/store/store.js src/utils/
```

#### **2. Check imports:**
```bash
# Tìm imports có thể bị break
grep -r "from.*\\.js" src/
grep -r "import.*\\.js" src/
```

#### **3. Fix extension issues:**
```typescript
// Nếu có import explicit extensions, remove chúng:
// ❌ import store from './store/store.js';
// ✅ import store from './store/store';
```

---

## 📋 FINAL CHECKLIST

### **Trước khi xóa JS files:**
- [ ] Backup toàn bộ project
- [ ] `npm run build` thành công
- [ ] `npx tsc --noEmit` không có errors
- [ ] Test app functionality đầy đủ

### **Sau khi xóa JS files:**
- [ ] `npm start` thành công
- [ ] Không có console errors
- [ ] Redux store hoạt động
- [ ] Routing hoạt động
- [ ] Price formatting hoạt động
- [ ] Cross-tab sync hoạt động

### **Cleanup:**
- [ ] Remove backup files
- [ ] Update tsconfig.json (optional)
- [ ] Update documentation
- [ ] Commit changes

---

## 🎉 KẾT LUẬN

### **TÓM TẮT:**
1. **Hiện tại dùng JS files** (do Webpack resolution priority)
2. **Có thể xóa JS files** mà không cần settings gì
3. **App sẽ tự động chuyển sang TS files**
4. **Nên xóa từng file một** để test an toàn
5. **Không cần thay đổi config** gì cả

### **TIMELINE:**
- **Total time**: ~35 phút
- **Risk level**: Thấp (nếu làm đúng thứ tự)
- **Rollback time**: ~5 phút (nếu có backup)

**Sẵn sàng để migration! 🚀**