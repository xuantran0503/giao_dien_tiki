# Giải Thích Tại Sao useRef(null) và Tại Sao Dùng Nó

## ❓ Câu Hỏi Chính

1. **Tại sao `useRef(null)` - Tại sao là `null`?**
2. **Tại sao phải dùng `useRef` thay vì biến thông thường?**

Hãy cùng đi sâu vào từng câu hỏi!

---

## 📝 PHẦN 1: Tại Sao Là `null`?

### Cú pháp:
```javascript
const searchRef = useRef(null);
```

### Giải Thích:

#### 1. `null` là Giá Trị Khởi Tạo (Initial Value)

```javascript
const searchRef = useRef(null);
//                       ^^^^
//                       Giá trị ban đầu
```

**Ý nghĩa:**
- Khi component **vừa được tạo**, `searchRef.current` = `null`
- Khi component **render xong** và gắn ref vào DOM, `searchRef.current` = phần tử DOM thực tế
- `null` có nghĩa là "chưa có gì" hoặc "trống"

#### 2. Vòng Đời Của `searchRef.current`

```javascript
// ===== THỜI ĐIỂM 1: Component khởi tạo =====
const searchRef = useRef(null);
console.log(searchRef.current);  // null ← Chưa có DOM element

// ===== THỜI ĐIỂM 2: React render JSX =====
return <div className="search" ref={searchRef}>...</div>;
// React đang chuẩn bị tạo DOM...

// ===== THỜI ĐIỂM 3: DOM được tạo và gắn vào trang =====
console.log(searchRef.current);  // <div className="search">...</div> ← Đã có!

// ===== THỜI ĐIỂM 4: Component unmount (bị xóa) =====
console.log(searchRef.current);  // null ← Lại thành null
```

#### 3. Tại Sao Không Dùng Giá Trị Khác?

```javascript
// ❌ SAI - Không có ý nghĩa
const searchRef = useRef(0);
const searchRef = useRef("");
const searchRef = useRef({});

// ✅ ĐÚNG - Dùng null cho DOM reference
const searchRef = useRef(null);

// 🤔 CÓ THỂ - Nếu muốn giá trị mặc định khác
const countRef = useRef(0);      // OK nếu dùng cho counter
const prevValueRef = useRef(""); // OK nếu dùng để lưu giá trị trước
```

**Lý do dùng `null` cho DOM reference:**
- `null` là giá trị chuẩn để biểu thị "không có object"
- Convention trong React: DOM refs khởi tạo với `null`
- Khi check `if (searchRef.current)` → Dễ hiểu là "nếu đã có DOM element"

---

## 🔍 PHẦN 2: Tại Sao Phải Dùng `useRef`?

### So Sánh Với Biến Thông Thường

#### ❌ Cách SAI: Dùng Biến Thông Thường

```javascript
function SearchBar() {
  // Cách SAI
  let searchElement = null;

  return (
    <div 
      ref={(el) => { searchElement = el; }}
      className="search"
    >
      <input type="text" />
    </div>
  );
}
```

**Vấn đề:** Mỗi lần component **re-render**, biến `searchElement` bị **RESET** về `null`!

```javascript
// ===== Render lần 1 =====
let searchElement = null;           // null
// ... set searchElement = <div>
console.log(searchElement);         // <div> ✓

// ===== Re-render (khi state thay đổi) =====
let searchElement = null;           // null LẠI! ❌
console.log(searchElement);         // null ← MẤT RỒI!
```

#### ✅ Cách ĐÚNG: Dùng `useRef`

```javascript
function SearchBar() {
  // Cách ĐÚNG
  const searchRef = useRef(null);

  return (
    <div ref={searchRef} className="search">
      <input type="text" />
    </div>
  );
}
```

**Lợi ích:** `searchRef.current` **GIỮ NGUYÊN** giữa các lần re-render!

```javascript
// ===== Render lần 1 =====
const searchRef = useRef(null);     // { current: null }
// ... React set searchRef.current = <div>
console.log(searchRef.current);     // <div> ✓

// ===== Re-render (khi state thay đổi) =====
const searchRef = useRef(null);     // VẪN LÀ { current: <div> } ✓
console.log(searchRef.current);     // <div> ← VẪN CÒN!
```

---

## 🎯 So Sánh Chi Tiết: useRef vs Biến Thông Thường

### Ví Dụ Thực Tế

```javascript
import React, { useState, useRef } from 'react';

function ComparisonExample() {
  // Biến thông thường
  let normalVar = "Hello";
  
  // useRef
  const refVar = useRef("Hello");
  
  // State để trigger re-render
  const [count, setCount] = useState(0);

  console.log("=== RENDER ===");
  console.log("normalVar:", normalVar);           // Luôn là "Hello"
  console.log("refVar.current:", refVar.current); // Giữ nguyên giá trị

  const handleChange = () => {
    // Thay đổi giá trị
    normalVar = "World";              // Thay đổi biến thông thường
    refVar.current = "World";         // Thay đổi ref
    
    console.log("=== AFTER CHANGE ===");
    console.log("normalVar:", normalVar);           // "World"
    console.log("refVar.current:", refVar.current); // "World"
    
    // Trigger re-render
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleChange}>Change & Re-render</button>
    </div>
  );
}
```

**Kết quả khi click button:**

```
=== RENDER === (Lần 1)
normalVar: Hello
refVar.current: Hello

=== AFTER CHANGE ===
normalVar: World
refVar.current: World

=== RENDER === (Lần 2 - sau khi re-render)
normalVar: Hello          ← BỊ RESET!
refVar.current: World     ← GIỮ NGUYÊN!
```

---

## 📊 Bảng So Sánh

| Đặc Điểm | Biến Thông Thường | useRef | useState |
|----------|-------------------|--------|----------|
| **Giữ giá trị giữa re-renders** | ❌ Không | ✅ Có | ✅ Có |
| **Gây re-render khi thay đổi** | ❌ Không | ❌ Không | ✅ Có |
| **Truy cập DOM trực tiếp** | ❌ Không | ✅ Có | ❌ Không |
| **Performance** | ⚡ Nhanh | ⚡ Nhanh | 🐌 Chậm (re-render) |
| **Use case** | Giá trị tạm | DOM refs, giá trị persist | UI state |

---

## 🔬 Phân Tích Sâu: useRef Hoạt Động Như Thế Nào?

### 1. Cấu Trúc Của useRef

```javascript
const searchRef = useRef(null);

// useRef trả về một object như sau:
{
  current: null  // Giá trị thực tế được lưu trong property 'current'
}
```

**Điều kỳ diệu:** Object này **KHÔNG BỊ TẠO LẠI** giữa các lần render!

### 2. React Lưu Trữ Ref Như Thế Nào?

```javascript
// Đơn giản hóa cách React hoạt động bên trong:

// Render lần 1
function SearchBar() {
  const searchRef = useRef(null);
  // React: "Ồ, lần đầu gọi useRef, tạo object mới!"
  // React lưu: { current: null } vào bộ nhớ nội bộ
  // React trả về: reference đến object đó
}

// Render lần 2 (re-render)
function SearchBar() {
  const searchRef = useRef(null);
  // React: "Ồ, lại gọi useRef, nhưng đã có rồi!"
  // React KHÔNG tạo object mới
  // React trả về: CÙNG reference như lần 1
}
```

### 3. Tại Sao Không Gây Re-render?

```javascript
const searchRef = useRef(null);

// Thay đổi ref
searchRef.current = document.getElementById('search');

// React: "Hmm, chỉ thay đổi property của object, không phải state"
// React: "Không cần re-render!"
```

**So sánh với useState:**

```javascript
const [value, setValue] = useState(null);

// Thay đổi state
setValue(document.getElementById('search'));

// React: "Ồ! State thay đổi!"
// React: "RE-RENDER component!"
```

---

## 🎨 Các Trường Hợp Sử Dụng useRef

### Use Case 1: DOM References (Như SearchBar)

```javascript
function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    // Truy cập DOM trực tiếp
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
    </>
  );
}
```

### Use Case 2: Lưu Giá Trị Trước Đó

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    // Lưu giá trị trước đó
    prevCountRef.current = count;
  });

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### Use Case 3: Timer/Interval IDs

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

### Use Case 4: Tránh Stale Closure

```javascript
function ChatRoom() {
  const [message, setMessage] = useState("");
  const latestMessageRef = useRef("");

  // Luôn update ref với giá trị mới nhất
  useEffect(() => {
    latestMessageRef.current = message;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // latestMessageRef.current luôn có giá trị mới nhất
      console.log("Latest message:", latestMessageRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps - không có stale closure!

  return <input value={message} onChange={e => setMessage(e.target.value)} />;
}
```

---

## 🚫 Khi KHÔNG Nên Dùng useRef

### ❌ Sai: Dùng ref cho UI state

```javascript
// SAI - Không re-render khi thay đổi
function BadCounter() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // Component KHÔNG re-render → UI không cập nhật!
  };

  return (
    <div>
      <p>Count: {countRef.current}</p> {/* Không cập nhật! */}
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

### ✅ Đúng: Dùng useState cho UI state

```javascript
// ĐÚNG - Re-render và cập nhật UI
function GoodCounter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    // Component re-render → UI cập nhật!
  };

  return (
    <div>
      <p>Count: {count}</p> {/* Cập nhật đúng! */}
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

---

## 💡 Tại Sao SearchBar Dùng useRef(null)?

Quay lại ví dụ SearchBar:

```javascript
const searchRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

return <div ref={searchRef} className="search">...</div>;
```

### Lý Do Cần useRef:

#### 1. **Truy cập DOM element**
```javascript
searchRef.current.contains(event.target)
//        ^^^^^^^
//        Truy cập DOM element để kiểm tra
```

#### 2. **Giữ reference giữa các re-render**
```javascript
// Khi user type vào input → state thay đổi → re-render
// Nhưng searchRef.current vẫn trỏ đúng element!
```

#### 3. **Không gây re-render không cần thiết**
```javascript
// Khi DOM được mount, searchRef.current được set
// Nhưng KHÔNG gây re-render (vì không cần thiết)
```

#### 4. **Event listener cần reference ổn định**
```javascript
// handleClickOutside được tạo 1 lần khi mount
// Nó cần access searchRef.current
// searchRef phải stable giữa các renders
```

---

## 🎓 Tóm Tắt

### Câu Trả Lời Ngắn Gọn:

#### 1. Tại sao `useRef(null)`?
- **`useRef`**: Hook để tạo reference giữ nguyên giữa re-renders
- **`(null)`**: Giá trị khởi tạo, có nghĩa "chưa có DOM element"
- Khi React render xong, `null` → DOM element thực tế

#### 2. Tại sao dùng useRef thay vì biến thông thường?
- **Biến thông thường**: BỊ RESET mỗi lần re-render
- **useRef**: GIỮ NGUYÊN giá trị giữa re-renders
- **useRef**: Không gây re-render khi thay đổi
- **useRef**: Được React quản lý và tối ưu

### Công Thức:

```javascript
// Khởi tạo
const ref = useRef(initialValue);
//                 ^^^^^^^^^^^^^
//                 Giá trị ban đầu của ref.current

// Truy cập/Thay đổi
ref.current = newValue;  // Không gây re-render
console.log(ref.current);

// Gắn vào DOM
<div ref={ref}>...</div>  // React tự động set ref.current = DOM element
```

### Nguyên Tắc Vàng:

```javascript
// ✅ Dùng useRef khi:
// - Cần truy cập DOM trực tiếp
// - Cần lưu giá trị KHÔNG liên quan đến UI
// - Cần giữ reference ổn định giữa renders
// - KHÔNG muốn trigger re-render

// ✅ Dùng useState khi:
// - Giá trị ảnh hưởng đến UI
// - Cần re-render khi giá trị thay đổi
// - Là state của component

// ❌ Dùng biến thông thường:
// - KHÔNG BAO GIỜ cho values cần persist giữa renders
```

---

## 🔥 Câu Hỏi Thường Gặp

### Q1: Có thể dùng `useRef(undefined)` thay vì `useRef(null)`?
**A:** Có thể, nhưng `null` là convention. `null` rõ ràng hơn là "không có giá trị".

### Q2: `searchRef.current` có thể thay đổi tự động?
**A:** Có! Khi gắn `ref={searchRef}`, React tự động set `searchRef.current` khi DOM mount/unmount.

### Q3: Có thể gọi `searchRef.current.focus()` ngay trong render?
**A:** KHÔNG! Phải gọi trong `useEffect` hoặc event handler, vì DOM chưa sẵn sàng lúc render.

### Q4: `useRef` có chậm hơn biến thông thường?
**A:** Không đáng kể. useRef chỉ là một object với property `current`.

### Q5: Có giới hạn số lượng useRef?
**A:** Không, nhưng nên dùng đúng mục đích để code dễ đọc.

---

**Hy vọng giải thích này giúp bạn hiểu rõ về `useRef(null)`!** 🎯

