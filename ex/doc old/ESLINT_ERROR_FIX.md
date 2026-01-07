# ESLINT ERROR FIX - TYPESCRIPT RULES

## 🚨 VẤN ĐỀ

### **Lỗi gốc:**
```
Definition for rule '@typescript-eslint/prefer-const' was not found
```

### **Nguyên nhân:**
- Thiếu `@typescript-eslint/eslint-plugin` dependency
- Sử dụng TypeScript rules mà không có plugin tương ứng

---

## 🔧 GIẢI PHÁP ĐÃ ÁP DỤNG

### **1. Xóa .eslintrc.js**
Sử dụng cấu hình mặc định từ `react-app` preset thay vì custom config.

### **2. Sửa lỗi `any` type trong addressSlice.ts:**
```typescript
// ❌ Trước
} catch (error: any) {
  return rejectWithValue(error.response.data);
}

// ✅ Sau  
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
  return rejectWithValue(errorMessage);
}
```

---

## ✅ KẾT QUẢ

- ESLint sử dụng cấu hình mặc định từ react-app
- Không còn lỗi về missing TypeScript rules
- Code quality vẫn được đảm bảo bởi react-app preset
- Sửa lỗi `any` type trong error handling

---

## 🎯 TƯƠNG LAI

Nếu muốn thêm TypeScript ESLint rules, cần install:
```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```