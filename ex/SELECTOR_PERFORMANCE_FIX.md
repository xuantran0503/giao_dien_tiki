# SELECTOR PERFORMANCE FIX - SỬA LỖI UNNECESSARY RE-RENDERS

## 🚨 VẤN ĐỀ

Redux selectors gây ra unnecessary re-renders với warning:

```
Selector selectDistrictsByCity returned a different result when called with the same parameters. 
This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized
```

## 🔍 ROOT CAUSE ANALYSIS

### **Vấn đề với selectors cũ:**
```typescript
// ❌ Problematic selectors
export const selectDistrictsByCity = (state: { address: AddressState }) => {
  const { addressData, selectedCity } = state.address;
  if (!selectedCity) return []; // ← Luôn trả về array mới!

  const city = addressData.find((c) => c.code === Number(selectedCity));
  return city && city.districts ? city.districts : []; // ← Array mới mỗi lần!
};
```

### **Tại sao gây re-render:**
1. **New array reference**: Mỗi lần gọi selector trả về array mới `[]`
2. **React shallow comparison**: `[] !== []` → Component re-render
3. **Cascade effect**: Re-render lan truyền xuống child components
4. **Performance impact**: Unnecessary DOM updates

## 🔧 GIẢI PHÁP ĐÃ ÁP DỤNG

### **1. Thêm reselect dependency:**
```json
"dependencies": {
  "reselect": "^5.1.1"
}
```

### **2. Import createSelector:**
```typescript
import { createSelector } from "reselect";
```

### **3. Tạo memoized selectors:**
```typescript
// ✅ Memoized selectors với reselect
const EMPTY_ARRAY: never[] = []; // Shared empty array reference

export const selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity],
  (addressData, selectedCity) => {
    if (!selectedCity) return EMPTY_ARRAY; // ✅ Same reference
    
    const city = addressData.find((c) => c.code === Number(selectedCity));
    return city?.districts || EMPTY_ARRAY; // ✅ Cached result
  }
);

export const selectWardsByDistrict = createSelector(
  [selectAddressData, selectSelectedCity, selectSelectedDistrict],
  (addressData, selectedCity, selectedDistrict) => {
    if (!selectedCity || !selectedDistrict) return EMPTY_ARRAY;

    const city = addressData.find((c) => c.code === Number(selectedCity));
    if (!city?.districts) return EMPTY_ARRAY;

    const district = city.districts.find(
      (d) => d.code === Number(selectedDistrict)
    );
    return district?.wards || EMPTY_ARRAY;
  }
);
```

## ✅ LỢI ÍCH CỦA MEMOIZATION

### **1. Performance Optimization:**
```typescript
// Trước: Mỗi lần gọi selector
selectDistrictsByCity(state) // → New array []
selectDistrictsByCity(state) // → New array [] (different reference)

// Sau: Với memoization
selectDistrictsByCity(state) // → Cached result
selectDistrictsByCity(state) // → Same cached result (same reference)
```

### **2. Reduced Re-renders:**
```typescript
// Component sẽ chỉ re-render khi:
// - selectedCity thay đổi
// - addressData thay đổi
// Không re-render khi state khác thay đổi
```

### **3. Better Developer Experience:**
```typescript
// Không còn warning trong console
// Smoother UI interactions
// Better performance metrics
```

## 🎯 CÁCH HOẠT ĐỘNG CỦA RESELECT

### **Input Selectors:**
```typescript
// Các selectors cơ bản để lấy data
selectAddressData     // → addressData array
selectSelectedCity    // → selectedCity string
selectSelectedDistrict // → selectedDistrict string
```

### **Output Selector:**
```typescript
// Selector được memoize dựa trên input selectors
selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity], // Input selectors
  (addressData, selectedCity) => {         // Result function
    // Chỉ chạy khi addressData hoặc selectedCity thay đổi
    // Kết quả được cache cho lần gọi tiếp theo
  }
);
```

### **Memoization Logic:**
```typescript
// Lần 1: addressData=[...], selectedCity="1"
selectDistrictsByCity(state) // → Tính toán và cache kết quả

// Lần 2: addressData=[...], selectedCity="1" (same values)
selectDistrictsByCity(state) // → Trả về cached result (same reference)

// Lần 3: addressData=[...], selectedCity="2" (different selectedCity)
selectDistrictsByCity(state) // → Tính toán lại và cache kết quả mới
```

## 📊 PERFORMANCE COMPARISON

### **Trước khi sử dụng reselect:**
```
- Mỗi state change → All selectors re-run
- Mỗi selector call → New array reference
- Component re-render → Cascade to children
- DOM updates → Unnecessary repaints
```

### **Sau khi sử dụng reselect:**
```
- State change → Only affected selectors re-run
- Same inputs → Cached result (same reference)
- Component re-render → Only when data actually changes
- DOM updates → Only necessary updates
```

## 🔍 DEBUGGING MEMOIZATION

### **Check selector calls:**
```typescript
export const selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity],
  (addressData, selectedCity) => {
    console.log('selectDistrictsByCity recomputed:', { selectedCity });
    // Chỉ log khi selector thực sự tính toán lại
    
    if (!selectedCity) return EMPTY_ARRAY;
    const city = addressData.find((c) => c.code === Number(selectedCity));
    return city?.districts || EMPTY_ARRAY;
  }
);
```

### **Monitor re-renders:**
```typescript
// Trong component
const districts = useSelector(selectDistrictsByCity);

useEffect(() => {
  console.log('Districts changed:', districts.length);
}, [districts]); // Chỉ trigger khi districts thực sự thay đổi
```

## 📋 BEST PRACTICES

### **1. Always use EMPTY_ARRAY constant:**
```typescript
const EMPTY_ARRAY: never[] = [];

// ✅ Good
return city?.districts || EMPTY_ARRAY;

// ❌ Bad
return city?.districts || [];
```

### **2. Keep input selectors simple:**
```typescript
// ✅ Good - simple selectors
const selectAddressData = (state) => state.address.addressData;
const selectSelectedCity = (state) => state.address.selectedCity;

// ❌ Bad - complex logic in input selector
const selectComplexData = (state) => {
  // Complex computation here
};
```

### **3. Use createSelector for derived data:**
```typescript
// ✅ Good - derived data with memoization
export const selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity],
  (addressData, selectedCity) => {
    // Derived computation
  }
);

// ❌ Bad - direct computation in component
const Component = () => {
  const addressData = useSelector(selectAddressData);
  const selectedCity = useSelector(selectSelectedCity);
  
  // Computation in component - will run on every render
  const districts = addressData.find(c => c.code === Number(selectedCity))?.districts || [];
};
```

## 🚀 NEXT STEPS

### **After installing reselect:**
```bash
npm install
```

### **Expected results:**
- ✅ No more selector warnings in console
- ✅ Improved performance in AddressSelector
- ✅ Smoother dropdown interactions
- ✅ Reduced unnecessary re-renders

## 🎉 CONCLUSION

**Problem:** Selectors returning new array references causing unnecessary re-renders.

**Solution:** Memoized selectors using reselect with shared EMPTY_ARRAY reference.

**Result:** Better performance, no warnings, smoother user experience.

**Status:** ✅ OPTIMIZED - Selectors now properly memoized!