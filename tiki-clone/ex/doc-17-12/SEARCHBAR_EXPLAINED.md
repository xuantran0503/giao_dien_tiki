# Giải thích chi tiết: SearchBar.tsx

## Tổng quan
File `SearchBar.tsx` là một React component phức tạp tạo ra thanh tìm kiếm giống Tiki, bao gồm:
- Input tìm kiếm với autocomplete dropdown
- Lịch sử tìm kiếm (lưu trong localStorage)
- Các từ khóa tìm kiếm phổ biến
- Danh mục nổi bật
- Click outside để đóng dropdown
- Overlay backdrop

---

## Phần 1: Imports và TypeScript Interfaces

### Dòng 1-2: Import dependencies

```typescript
import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";
```

**Giải thích:**

**1. React Hooks:**
- `useState`: Quản lý state (searchValue, showDropdown, searchHistory)
- `useEffect`: Side effects (load localStorage, event listeners)
- `useRef`: Reference đến DOM element (để detect click outside)

**2. CSS:**
- Import styles riêng cho component

---

### Dòng 4-8: Interface PopularSearch

```typescript
interface PopularSearch {
    id: number;
    text: string;
    image: string;
}
```

**Giải thích:**

Định nghĩa structure cho các **từ khóa phổ biến**

| Field | Type | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `id` | number | ID duy nhất | 1, 2, 3 |
| `text` | string | Từ khóa tìm kiếm | "máy cạo râu philips" |
| `image` | string | URL hình thumbnail | "https://salt.tikicdn.com/..." |

**Ví dụ object:**
```typescript
{
    id: 1,
    text: "máy cạo râu philips",
    image: "https://salt.tikicdn.com/cache/100x100/ts/product/..."
}
```

**Mục đích:** Type-safe khi map qua popularSearches array

---

### Dòng 10-14: Interface FeaturedCategory

```typescript
interface FeaturedCategory {
    id: number;
    name: string;
    image: string;
}
```

**Giải thích:**

Định nghĩa structure cho **danh mục nổi bật**

| Field | Type | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `id` | number | ID danh mục | 1, 2, 3 |
| `name` | string | Tên danh mục | "Đồ Chơi - Mẹ & Bé" |
| `image` | string | URL icon danh mục | "https://salt.tikicdn.com/..." |

**Ví dụ object:**
```typescript
{
    id: 1,
    name: "Đồ Chơi - Mẹ & Bé",
    image: "https://salt.tikicdn.com/ts/category/13/64/43/..."
}
```

---

## Phần 2: Component Definition và State

### Dòng 16: Component declaration

```typescript
const SearchBar: React.FC = () => {
```

**Giải thích:**
- `React.FC`: Type cho Functional Component
- Không nhận props (empty props)

---

### Dòng 17-19: State declarations

```typescript
const [searchValue, setSearchValue] = useState<string>("");
const [showDropdown, setShowDropdown] = useState<boolean>(false);
const [searchHistory, setSearchHistory] = useState<string[]>([]);
```

**Giải thích chi tiết:**

#### 1. `searchValue: string`
```typescript
const [searchValue, setSearchValue] = useState<string>("");
```

**Mục đích:** Lưu nội dung user đang gõ

**Ví dụ:**
```typescript
// User gõ "iphone"
searchValue = "iphone"

// User xóa hết
searchValue = ""
```

**Controlled input:**
```typescript
<input 
    value={searchValue}           // ← Bind với state
    onChange={handleSearchChange} // ← Update state khi gõ
/>
```

#### 2. `showDropdown: boolean`
```typescript
const [showDropdown, setShowDropdown] = useState<boolean>(false);
```

**Mục đích:** Điều khiển hiển thị dropdown (autocomplete panel)

**Ví dụ:**
```typescript
// User click vào search input
setShowDropdown(true)   // → Hiển thị dropdown

// User click ra ngoài
setShowDropdown(false)  // → Ẩn dropdown
```

**Conditional rendering:**
```typescript
{showDropdown && (
    <div className="search-dropdown">
        {/* Dropdown content */}
    </div>
)}
```

#### 3. `searchHistory: string[]`
```typescript
const [searchHistory, setSearchHistory] = useState<string[]>([]);
```

**Mục đích:** Lưu lịch sử tìm kiếm của user

**Ví dụ:**
```typescript
searchHistory = [
    "iphone 15 pro max",
    "tai nghe bluetooth",
    "macbook air m2",
    "áo khoác nam",
    "giày thể thao"
]
```

**Giới hạn:** Tối đa 5 items (xem dòng 152)

---

### Dòng 21: useRef for DOM reference

```typescript
const searchRef = useRef<HTMLDivElement>(null);
```

**Giải thích chi tiết:**

**Mục đích:** Tham chiếu đến DOM element chứa search bar

**Tại sao cần?**
- Để detect click **outside** search bar
- Đóng dropdown khi user click ra ngoài

**Type:**
- `HTMLDivElement`: Type của DOM element
- `null`: Initial value (chưa render)

**Gắn vào element:**
```typescript
<div className="search" ref={searchRef}>
    {/* Khi render, searchRef.current = this div */}
</div>
```

**Sử dụng:**
```typescript
// Check nếu click nằm trong search bar
if (searchRef.current && !searchRef.current.contains(event.target)) {
    // Click ở ngoài → Đóng dropdown
    setShowDropdown(false);
}
```

**So sánh với useState:**
```typescript
// ❌ useState: Trigger re-render khi thay đổi
const [element, setElement] = useState(null);

// ✅ useRef: KHÔNG trigger re-render, chỉ lưu reference
const elementRef = useRef(null);
```

---

## Phần 3: Static Data Arrays

### Dòng 23-60: popularSearches array

```typescript
const popularSearches: PopularSearch[] = [
    {
        id: 1,
        text: "máy cạo râu philips",
        image: "https://salt.tikicdn.com/cache/100x100/ts/product/a0/34/4c/..."
    },
    // ... 5 items khác
];
```

**Giải thích:**

**Mục đích:** Hiển thị các từ khóa tìm kiếm đang HOT

**Hardcoded data:**
- 6 items cố định
- Trong production thực tế: Fetch từ API
- Có thể update theo trend realtime

**Cấu trúc:**
```typescript
{
    id: 1,                          // Unique key
    text: "máy cạo râu philips",    // Keyword
    image: "https://..."            // Product thumbnail
}
```

**Rendering:**
```typescript
{popularSearches.map((item) => (
    <div key={item.id} onClick={() => handlePopularSearchClick(item.text)}>
        <img src={item.image} alt={item.text} />
        <span>{item.text}</span>
    </div>
))}
```

**Có thể cải tiến:**
```typescript
// Fetch từ API
useEffect(() => {
    fetch('/api/trending-searches')
        .then(res => res.json())
        .then(data => setPopularSearches(data));
}, []);
```

---

### Dòng 62-111: featuredCategories array

```typescript
const featuredCategories: FeaturedCategory[] = [
    {
        id: 1,
        name: "Đồ Chơi - Mẹ & Bé",
        image: "https://salt.tikicdn.com/ts/category/13/64/43/..."
    },
    // ... 7 items khác
];
```

**Giải thích:**

**Mục đích:** Hiển thị các danh mục nổi bật

**Hardcoded data:**
- 8 danh mục cố định
- Trong production: Có thể fetch từ API hoặc Redux store

**Rendering:**
```typescript
{featuredCategories.map((category) => (
    <div key={category.id} onClick={() => handleCategoryClick(category.name)}>
        <img src={category.image} alt={category.name} />
        <span>{category.name}</span>
    </div>
))}
```

---

## Phần 4: useEffect - Load Search History

### Dòng 113-123: Load từ localStorage

```typescript
useEffect(() => {
    try {
        const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        if (Array.isArray(history)) {
            setSearchHistory(history);
        }
    } catch (error) {
        console.error("Error loading search history:", error);
        setSearchHistory([]);
    }
}, []);
```

**Giải thích chi tiết:**

#### Dependency array: `[]`
```typescript
}, []);  // ← Chạy 1 LẦN duy nhất khi component mount
```

#### Bước 1: Get data từ localStorage
```typescript
const history = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
);
```

**Break down:**
```typescript
// 1. Đọc từ localStorage
localStorage.getItem("searchHistory")
// → Nếu có: '["iphone", "macbook"]'
// → Nếu không: null

// 2. Fallback về "[]" nếu null
... || "[]"
// → Nếu null: dùng "[]"

// 3. Parse JSON string thành array
JSON.parse(...)
// → ["iphone", "macbook"]
```

#### Bước 2: Validate array
```typescript
if (Array.isArray(history)) {
    setSearchHistory(history);
}
```

**Tại sao cần validate?**
- User có thể edit localStorage thủ công
- Data corrupt
- Đảm bảo luôn là array

**Ví dụ:**
```typescript
// Valid
localStorage: '["iphone", "macbook"]'  
→ setSearchHistory(["iphone", "macbook"]) ✅

// Invalid (object thay vì array)
localStorage: '{"keyword": "iphone"}'  
→ Không set (vì không phải array) ✅

// Invalid (string thay vì array)
localStorage: '"iphone"'  
→ Không set ✅
```

#### Bước 3: Error handling
```typescript
} catch (error) {
    console.error("Error loading search history:", error);
    setSearchHistory([]);
}
```

**Các lỗi có thể xảy ra:**
```typescript
// 1. JSON.parse() fail (invalid JSON)
localStorage: '[iphone, macbook'  // Missing bracket
→ Catch error, set []

// 2. localStorage không available (private mode)
→ Catch error, set []

// 3. Quota exceeded
→ Catch error, set []
```

---

## Phần 5: useEffect - Click Outside Detection

### Dòng 126-137: Event listener setup

```typescript
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);
```

**Giải thích chi tiết:**

#### Mục đích
Đóng dropdown khi user click **bên ngoài** search bar

#### handleClickOutside function

```typescript
const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
    }
};
```

**Break down logic:**

**1. `searchRef.current`**
```typescript
if (searchRef.current && ...)
```
- Check ref đã được gắn vào DOM chưa
- Tránh lỗi null reference

**2. `!searchRef.current.contains(event.target as Node)`**
```typescript
!searchRef.current.contains(event.target as Node)
```

**`.contains()` method:**
- Check xem element A có chứa element B không
- Return true nếu B nằm trong A (kể cả nested)

**Ví dụ:**
```html
<div ref={searchRef}>              <!-- searchRef.current -->
    <input />                       <!-- Trong searchRef -->
    <div class="dropdown">          <!-- Trong searchRef -->
        <div class="item">          <!-- Trong searchRef (nested) -->
            Click me
        </div>
    </div>
</div>
<div class="outside">               <!-- NGOÀI searchRef -->
    Outside
</div>
```

```typescript
// Click vào input
searchRef.current.contains(event.target) → true
// → KHÔNG đóng dropdown ✅

// Click vào .item (nested)
searchRef.current.contains(event.target) → true
// → KHÔNG đóng dropdown ✅

// Click vào .outside
searchRef.current.contains(event.target) → false
// → Đóng dropdown ✅
```

**3. `as Node`**
```typescript
event.target as Node
```
- Type casting để satisfy TypeScript
- `event.target` có type `EventTarget`
- `.contains()` cần `Node` type

#### Add event listener
```typescript
document.addEventListener("mousedown", handleClickOutside);
```

**Tại sao `mousedown` thay vì `click`?**
- `mousedown`: Trigger NGAY khi nhấn chuột
- `click`: Trigger khi nhả chuột (chậm hơn)
- UX tốt hơn với `mousedown`

**Tại sao `document` thay vì `searchRef.current`?**
- Phải listen trên `document` để catch clicks **ở ngoài**
- Nếu listen trên `searchRef`: Chỉ catch clicks **bên trong**

#### Cleanup function
```typescript
return () => {
    document.removeEventListener("mousedown", handleClickOutside);
};
```

**Tại sao cần cleanup?**

**Vấn đề nếu không cleanup:**
```typescript
// Component mount → Add listener
document.addEventListener("mousedown", handleClickOutside);

// Component unmount → Listener vẫn còn ❌
// Click anywhere → handleClickOutside vẫn chạy
// → Error: Cannot update unmounted component
```

**Với cleanup:**
```typescript
// Component unmount → Remove listener ✅
document.removeEventListener("mousedown", handleClickOutside);
// → Không còn memory leak
```

**Flow đầy đủ:**
```typescript
1. Component mount
   → useEffect chạy
   → Add event listener

2. User click outside
   → handleClickOutside chạy
   → setShowDropdown(false)

3. Component unmount
   → Cleanup function chạy
   → Remove event listener
   → Tránh memory leak
```

---

## Phần 6: Event Handlers

### Handler 1: handleSearchFocus (Dòng 139-141)

```typescript
const handleSearchFocus = (): void => {
    setShowDropdown(true);
};
```

**Mục đích:** Hiển thị dropdown khi user focus vào input

**Khi nào trigger:**
```typescript
<input 
    onFocus={handleSearchFocus}  // ← User click vào input
/>
```

**Flow:**
```
1. User click vào search input
2. onFocus event trigger
3. handleSearchFocus() chạy
4. setShowDropdown(true)
5. Dropdown xuất hiện ✅
```

---

### Handler 2: handleSearchChange (Dòng 143-145)

```typescript
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
};
```

**Mục đích:** Update state khi user gõ vào input

**Type annotation:**
- `e: React.ChangeEvent<HTMLInputElement>`: Event type cho input change
- `: void`: Function không return gì

**Cách hoạt động:**
```typescript
<input 
    value={searchValue}
    onChange={handleSearchChange}  // ← Mỗi lần gõ
/>

// User gõ "i" → searchValue = "i"
// User gõ "p" → searchValue = "ip"
// User gõ "h" → searchValue = "iph"
// → Real-time update
```

**Controlled component pattern:**
```typescript
// State là single source of truth
value={searchValue}           // ← Read from state
onChange={handleSearchChange} // ← Write to state

// Không dùng uncontrolled:
// <input defaultValue="..." />  ❌
```

---

### Handler 3: handleSearch (Dòng 147-167)

```typescript
const handleSearch = (): void => {
    if (searchValue.trim()) {
        const newHistory = [
            searchValue,
            ...searchHistory.filter((item) => item !== searchValue),
        ].slice(0, 5);

        setSearchHistory(newHistory);

        try {
            localStorage.setItem("searchHistory", JSON.stringify(newHistory));
        } catch (error) {
            console.error("Error saving search history:", error);
        }

        setShowDropdown(false);

        // TODO: Implement actual search functionality
        // console.log("Searching for:", searchValue);
    }
};
```

**Giải thích chi tiết:**

#### Bước 1: Validate input
```typescript
if (searchValue.trim()) {
```

**`.trim()`:**
- Xóa khoảng trắng đầu/cuối
- Validate không empty

**Ví dụ:**
```typescript
"   iphone   ".trim()  → "iphone"
"   ".trim()           → ""
"".trim()              → ""

// Check:
if ("iphone")    → true  ✅ Search
if ("   ")       → false ❌ Không search
if ("")          → false ❌ Không search
```

#### Bước 2: Tạo newHistory (logic thông minh)

```typescript
const newHistory = [
    searchValue,
    ...searchHistory.filter((item) => item !== searchValue),
].slice(0, 5);
```

**Break down từng bước:**

**Step 1: Filter duplicate**
```typescript
searchHistory.filter((item) => item !== searchValue)
```

**Mục đích:** Xóa `searchValue` khỏi history cũ (nếu có)

**Ví dụ:**
```typescript
// History cũ
searchHistory = ["macbook", "iphone", "airpods"]

// User search "iphone" (đã có trong history)
searchHistory.filter(item => item !== "iphone")
// → ["macbook", "airpods"]  // Xóa "iphone" cũ
```

**Step 2: Thêm searchValue lên đầu**
```typescript
[
    searchValue,           // Mới nhất lên đầu
    ...filteredHistory     // History cũ (đã xóa duplicate)
]
```

**Step 3: Limit 5 items**
```typescript
.slice(0, 5)  // Chỉ giữ 5 items đầu tiên
```

**Ví dụ đầy đủ:**

```typescript
// Case 1: Search từ MỚI
searchHistory = ["macbook", "airpods", "watch"]
searchValue = "iphone"

newHistory = [
    "iphone",           // Mới
    "macbook",          // Cũ
    "airpods",          // Cũ
    "watch"             // Cũ
].slice(0, 5)
// → ["iphone", "macbook", "airpods", "watch"]

// Case 2: Search từ ĐÃ CÓ (move to top)
searchHistory = ["macbook", "iphone", "airpods"]
searchValue = "iphone"

newHistory = [
    "iphone",           // Move to top
    "macbook",          // Giữ nguyên
    "airpods"           // Giữ nguyên
].slice(0, 5)
// → ["iphone", "macbook", "airpods"]

// Case 3: History đầy (6+ items)
searchHistory = ["a", "b", "c", "d", "e", "f"]
searchValue = "new"

newHistory = [
    "new",              // Mới
    "a", "b", "c", "d", "e", "f"
].slice(0, 5)
// → ["new", "a", "b", "c", "d"]  // "e" và "f" bị cắt
```

#### Bước 3: Update state
```typescript
setSearchHistory(newHistory);
```

#### Bước 4: Save to localStorage
```typescript
try {
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
} catch (error) {
    console.error("Error saving search history:", error);
}
```

**Stringify array:**
```typescript
JSON.stringify(["iphone", "macbook"])
// → '["iphone","macbook"]'
```

**Error cases:**
- localStorage full (quota exceeded)
- localStorage disabled (private mode)
- Catch error nhưng không fail app

#### Bước 5: Close dropdown
```typescript
setShowDropdown(false);
```

#### Bước 6: TODO - Actual search
```typescript
// TODO: Implement actual search functionality
// console.log("Searching for:", searchValue);
```

**Trong production:**
```typescript
// Navigate to search results page
navigate(`/search?q=${encodeURIComponent(searchValue)}`);

// Hoặc dispatch Redux action
dispatch(searchProducts(searchValue));
```

---

### Handler 4: handleKeyDown (Dòng 169-173)

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
        handleSearch();
    }
};
```

**Mục đích:** Cho phép search bằng phím Enter

**Type:**
- `React.KeyboardEvent<HTMLInputElement>`: Type cho keyboard events trên input

**Logic:**
```typescript
// User gõ "iphone" rồi nhấn Enter
e.key === "Enter"  → true
→ handleSearch() chạy
→ Giống như click nút "Tìm kiếm"
```

**Bind vào input:**
```typescript
<input 
    onKeyDown={handleKeyDown}  // ← Listen các phím
/>
```

**Có thể mở rộng:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
        handleSearch();
    } else if (e.key === "Escape") {
        setShowDropdown(false);  // Esc để đóng dropdown
    } else if (e.key === "ArrowDown") {
        // Navigate suggestions với arrow keys
    }
};
```

---

### Handler 5: handleHistoryClick (Dòng 175-181)

```typescript
const handleHistoryClick = (text: string): void => {
    setSearchValue(text);
    setShowDropdown(false);

    // TODO: Implement actual search functionality
    // console.log("Searching for:", text);
};
```

**Mục đích:** Khi user click vào item trong search history

**Flow:**
```
1. User click "iphone" trong history
2. handleHistoryClick("iphone") chạy
3. setSearchValue("iphone") → Input hiển thị "iphone"
4. setShowDropdown(false) → Đóng dropdown
5. TODO: Navigate to search results
```

**Trigger:**
```typescript
{searchHistory.map((item, index) => (
    <div onClick={() => handleHistoryClick(item)}>
        {item}
    </div>
))}
```

---

### Handler 6: handlePopularSearchClick (Dòng 183-189)

```typescript
const handlePopularSearchClick = (text: string): void => {
    // setSearchValue(text);
    // setShowDropdown(false);

    // // TODO: Implement actual search functionality
    // console.log("Searching for:", text);
};
```

**Hiện tại:** Đã comment toàn bộ (không làm gì)

**Mục đích ban đầu:** Click vào popular search → Tìm kiếm

**Tại sao comment?**
- Có thể muốn navigate trực tiếp thay vì fill input
- Hoặc chưa implement xong logic

**Nếu uncomment:**
```typescript
const handlePopularSearchClick = (text: string): void => {
    setSearchValue(text);       // Fill vào input
    setShowDropdown(false);     // Đóng dropdown
    // Sau đó user có thể edit hoặc search
};
```

**Hoặc navigate trực tiếp:**
```typescript
const handlePopularSearchClick = (text: string): void => {
    navigate(`/search?q=${encodeURIComponent(text)}`);
};
```

---

### Handler 7: handleCategoryClick (Dòng 191-196)

```typescript
const handleCategoryClick = (categoryName: string): void => {
    // setShowDropdown(false);

    // // TODO: Navigate to category page
    // console.log("Navigate to category:", categoryName);
};
```

**Hiện tại:** Đã comment

**Mục đích:** Click vào category → Navigate to category page

**Production implementation:**
```typescript
const handleCategoryClick = (categoryName: string): void => {
    setShowDropdown(false);
    
    // Option 1: Direct navigation
    navigate(`/category/${categoryName}`);
    
    // Option 2: Với category ID
    const category = featuredCategories.find(c => c.name === categoryName);
    navigate(`/category/${category.id}`);
};
```

---

## Phần 7: JSX Rendering

### Dòng 198-206: Overlay backdrop

```typescript
{showDropdown && (
    <div
        className="search-overlay"
        onClick={() => setShowDropdown(false)}
    />
)}
```

**Mục đích:** Tạo overlay tối phía sau dropdown (như modal)

**Conditional rendering:**
```typescript
{showDropdown && ...}
// Chỉ hiển thị khi dropdown mở
```

**Click to close:**
```typescript
onClick={() => setShowDropdown(false)}
// Click vào overlay → Đóng dropdown
```

**CSS (SearchBar.css):**
```css
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);  /* Semi-transparent */
    z-index: 998;  /* Under dropdown (999) but over other content */
}
```

---

### Dòng 208-225: Search input wrapper

```typescript
<div className="search" ref={searchRef}>
    <div className="search-wrapper">
        <div className="img-search">
            <img src="/search.png" alt="search" />
        </div>
        <input
            type="text"
            placeholder="Túi rác Inochi 79k/8 cuộn"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleKeyDown}
        />
        <span className="search-divider" />
        <button className="search-btn" onClick={handleSearch}>
            Tìm kiếm
        </button>
    </div>
```

**Giải thích structure:**

#### 1. Outer container với ref
```typescript
<div className="search" ref={searchRef}>
```
- Container chính
- `ref={searchRef}`: Để detect click outside

#### 2. Search icon
```typescript
<div className="img-search">
    <img src="/search.png" alt="search" />
</div>
```
- Icon kính lúp bên trái input

#### 3. Input element
```typescript
<input
    type="text"
    placeholder="Túi rác Inochi 79k/8 cuộn"
    value={searchValue}
    onChange={handleSearchChange}
    onFocus={handleSearchFocus}
    onKeyDown={handleKeyDown}
/>
```

**Event bindings:**
- `value={searchValue}`: Controlled component
- `onChange={handleSearchChange}`: Update khi gõ
- `onFocus={handleSearchFocus}`: Mở dropdown khi focus
- `onKeyDown={handleKeyDown}`: Enter để search

#### 4. Divider
```typescript
<span className="search-divider" />
```
- Vertical line ngăn cách input và button

#### 5. Search button
```typescript
<button className="search-btn" onClick={handleSearch}>
    Tìm kiếm
</button>
```
- Nút tìm kiếm
- Click → `handleSearch()`

---

### Dòng 228-306: Search Dropdown

#### Structure Overview
```typescript
{showDropdown && (
    <div className="search-dropdown">
        {/* 1. Search History */}
        {/* 2. Popular Searches */}
        {/* 3. Featured Categories */}
    </div>
)}
```

---

#### Section 1: Search History (Dòng 231-254)

```typescript
{searchHistory.length > 0 && (
    <div className="search-section search-history-section">
        <div className="search-history-list">
            {searchHistory.map((item, index) => (
                <div
                    key={index}
                    className="search-history-item"
                    onClick={() => handleHistoryClick(item)}
                >
                    <img
                        src="https://salt.tikicdn.com/ts/upload/e8/aa/26/42a11360f906c4e769a0ff144d04bfe1.png"
                        alt="search"
                        className="history-icon"
                    />
                    <span className="history-text">{item}</span>
                </div>
            ))}
        </div>
        <div className="view-all">
            <span>Xem thêm</span>
            <span className="arrow-down">▼</span>
        </div>
    </div>
)}
```

**Conditional rendering:**
```typescript
{searchHistory.length > 0 && ...}
// Chỉ hiển thị nếu có history
```

**Map qua history:**
```typescript
{searchHistory.map((item, index) => (
    <div key={index} onClick={() => handleHistoryClick(item)}>
        <img src="..." />          {/* Clock icon */}
        <span>{item}</span>         {/* Keyword */}
    </div>
))}
```

**Ví dụ render:**
```
🕐 iphone 15 pro max
🕐 macbook air m2
🕐 tai nghe bluetooth
```

**View all button:**
```typescript
<div className="view-all">
    <span>Xem thêm</span>
    <span className="arrow-down">▼</span>
</div>
```
- Hiện chưa có functionality
- Có thể implement để show thêm history

---

#### Section 2: Popular Searches (Dòng 257-281)

```typescript
<div className="search-section">
    <div className="section-header">
        <img
            src="https://salt.tikicdn.com/ts/upload/4f/03/a0/2455cd7c0f3aef0c4fd58aa7ff93545a.png"
            alt="trending"
            className="section-icon-img"
        />
        <h3>Tìm Kiếm Phổ Biến</h3>
    </div>

    <div className="popular-search-list">
        {popularSearches.map((item) => (
            <div
                key={item.id}
                className="popular-search-item-horizontal"
                onClick={() => handlePopularSearchClick(item.text)}
            >
                <div className="popular-item-thumbnail">
                    <img src={item.image} alt={item.text} />
                </div>
                <span className="popular-item-label">{item.text}</span>
            </div>
        ))}
    </div>
</div>
```

**Section header:**
```typescript
<div className="section-header">
    <img src="..." />              {/* Fire icon */}
    <h3>Tìm Kiếm Phổ Biến</h3>
</div>
```

**Map qua popularSearches:**
```typescript
{popularSearches.map((item) => (
    <div key={item.id} onClick={...}>
        <img src={item.image} />    {/* Product thumbnail */}
        <span>{item.text}</span>     {/* Keyword */}
    </div>
))}
```

**Layout:** Horizontal list với thumbnail + text

---

#### Section 3: Featured Categories (Dòng 284-305)

```typescript
<div className="search-section">
    <div className="section-header">
        <div>
            <h3>Danh Mục Nổi Bật</h3>
        </div>
    </div>

    <div className="featured-categories-grid">
        {featuredCategories.map((category) => (
            <div
                key={category.id}
                className="featured-category-item"
                onClick={() => handleCategoryClick(category.name)}
            >
                <div className="category-image">
                    <img src={category.image} alt={category.name} />
                </div>
                <span className="category-name">{category.name}</span>
            </div>
        ))}
    </div>
</div>
```

**Grid layout:**
```typescript
<div className="featured-categories-grid">
    {/* 8 items in grid layout */}
</div>
```

**Each category item:**
```typescript
<div className="featured-category-item">
    <img src={category.image} />     {/* Category icon */}
    <span>{category.name}</span>      {/* Category name */}
</div>
```

**Example render:**
```
[Icon] Đồ Chơi - Mẹ & Bé    [Icon] Điện Thoại
[Icon] NGON                   [Icon] Làm Đẹp
...
```

---

## Tổng kết

### Component Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                  SearchBar Component                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [🔍]  [___Input___________________]  [Tìm kiếm]   │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Dropdown (showDropdown = true)             │    │
│  ├────────────────────────────────────────────┤    │
│  │ 🕐 Lịch sử tìm kiếm                        │    │
│  │   - iphone 15                              │    │
│  │   - macbook air                            │    │
│  ├────────────────────────────────────────────┤    │
│  │ 🔥 Tìm kiếm phổ biến                       │    │
│  │   [img] máy cạo râu  [img] đầm nữ          │    │
│  ├────────────────────────────────────────────┤    │
│  │ 📁 Danh mục nổi bật                        │    │
│  │   [icon] Đồ chơi    [icon] Điện thoại      │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### State Management

```typescript
┌─────────────────────────────────────┐
│ Component State                     │
├─────────────────────────────────────┤
│ searchValue: ""                     │  ← User input
│ showDropdown: false                 │  ← Dropdown visibility
│ searchHistory: []                   │  ← From localStorage
└─────────────────────────────────────┘
         ↕
┌─────────────────────────────────────┐
│ localStorage                         │
├─────────────────────────────────────┤
│ key: "searchHistory"                │
│ value: '["iphone","macbook",...]'   │
└─────────────────────────────────────┘
```

### Event Flow

**1. User focus input:**
```
Click input → onFocus → handleSearchFocus() → setShowDropdown(true)
```

**2. User gõ text:**
```
Type "i" → onChange → handleSearchChange() → setSearchValue("i")
Type "p" → onChange → handleSearchChange() → setSearchValue("ip")
...
```

**3. User nhấn Enter:**
```
Press Enter → onKeyDown → handleKeyDown() → handleSearch()
→ Update history
→ Save localStorage
→ Close dropdown
→ (TODO: Navigate to results)
```

**4. User click outside:**
```
Click outside → mousedown event → handleClickOutside()
→ Check !contains() → setShowDropdown(false)
```

### Best Practices trong code này

✅ **TypeScript types:** Interfaces cho data structures
✅ **Error handling:** try-catch cho localStorage
✅ **Validation:** Array.isArray() check
✅ **Cleanup:** removeEventListener trong useEffect
✅ **Controlled components:** value + onChange pattern
✅ **Smart history:** No duplicates, max 5 items, newest first
✅ **UX:** Click outside, Enter to search, focus to open

### Có thể cải tiến

🔧 **Debounce search:** Tránh quá nhiều API calls
```typescript
const debouncedSearch = useDebounce(searchValue, 300);
```

🔧 **Autocomplete suggestions:** Fetch từ API khi gõ
```typescript
useEffect(() => {
    if (searchValue) {
        fetchSuggestions(searchValue);
    }
}, [searchValue]);
```

🔧 **Highlight matching text:** Trong suggestions
```typescript
<span>{highlightMatch(item, searchValue)}</span>
```

🔧 **Keyboard navigation:** Arrow keys để navigate suggestions
```typescript
const [selectedIndex, setSelectedIndex] = useState(-1);
// ArrowDown → selectedIndex++
// ArrowUp → selectedIndex--
// Enter → Search selected item
```

🔧 **Clear history:** Button để xóa từng item hoặc tất cả
```typescript
const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
};
```

### Kết luận

Component `SearchBar.tsx` là một ví dụ tốt về:
- ✅ Complex interactive UI
- ✅ State management với hooks
- ✅ localStorage integration
- ✅ Event handling (click, keyboard, focus)
- ✅ TypeScript best practices
- ✅ Accessibility considerations

**Quy tắc vàng:** Luôn cleanup event listeners và handle edge cases (empty state, localStorage errors, etc.)!
