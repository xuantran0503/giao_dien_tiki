import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

interface PopularSearch {
    id: number;
    text: string;
    image: string;
}

interface FeaturedCategory {
    id: number;
    name: string;
    image: string;
}

const SearchBar: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const searchRef = useRef<HTMLDivElement>(null);

    const popularSearches: PopularSearch[] = [
        {
            id: 1,
            text: "máy cạo râu philips",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/a0/34/4c/54b71b44120b4ee9c7659fedeab864b0.jpg",
        },
        {
            id: 2,
            text: "đầm nữ",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/8f/c1/9f/39488ea2efd63d5796c371928cffa81e.jpg",
        },
        {
            id: 3,
            text: "boot nữ",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/55/55/77/41e3243e86064979f5fcee112e0c70ff.jpg",
        },
        {
            id: 4,
            text: "lego",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/6f/bb/47/1821149c9e781c3ac537de028c56f96a.jpg",
        },
        {
            id: 5,
            text: "tai heo",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/e9/04/37/17cb2ae8fd0e819aa962bf057625594c.jpg",
        },
        {
            id: 6,
            text: "bộ quần áo nam",
            image:
                "https://salt.tikicdn.com/cache/100x100/ts/product/d4/72/15/fe3b18d47e449abcdcef42612bfcc5be.jpg",
        },
    ];

    const featuredCategories: FeaturedCategory[] = [
        {
            id: 1,
            name: "Đồ Chơi - Mẹ & Bé",
            image:
                "https://salt.tikicdn.com/ts/category/13/64/43/226301adcc7660ffcf44a61bb6df99b7.png",
        },
        {
            id: 2,
            name: "Điện Thoại - Máy Tính Bảng",
            image:
                "https://salt.tikicdn.com/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png",
        },
        {
            id: 3,
            name: "NGON",
            image:
                "https://salt.tikicdn.com/ts/category/1e/8c/08/d8b02f8a0d958c74539316e8cd437cbd.png",
        },
        {
            id: 4,
            name: "Làm Đẹp - Sức Khỏe",
            image:
                "https://salt.tikicdn.com/ts/category/73/0e/89/bf5095601d17f9971d7a08a1ffe98a42.png",
        },
        {
            id: 5,
            name: "Điện Gia Dụng",
            image:
                "https://salt.tikicdn.com/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png",
        },
        {
            id: 6,
            name: "Thời trang nữ",
            image:
                "https://salt.tikicdn.com/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png",
        },
        {
            id: 7,
            name: "Thời trang nam",
            image:
                "https://salt.tikicdn.com/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png",
        },
        {
            id: 8,
            name: "Giày - Dép nữ",
            image:
                "https://salt.tikicdn.com/ts/category/cf/ed/e1/5a6b58f21fbcad0d201480c987f8defe.png",
        },
    ];

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

    // Handle click outside to close dropdown
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

    const handleSearchFocus = (): void => {
        setShowDropdown(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchValue(e.target.value);
    };

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleHistoryClick = (text: string): void => {
        setSearchValue(text);
        setShowDropdown(false);

        // TODO: Implement actual search functionality
        // console.log("Searching for:", text);
    };

    const handlePopularSearchClick = (text: string): void => {
        // setSearchValue(text);
        // setShowDropdown(false);

        // // TODO: Implement actual search functionality
        // console.log("Searching for:", text);
    };

    const handleCategoryClick = (categoryName: string): void => {
        // setShowDropdown(false);

        // // TODO: Navigate to category page
        // console.log("Navigate to category:", categoryName);
    };

    return (
        <>
            {/* Overlay backdrop */}
            {showDropdown && (
                <div
                    className="search-overlay"
                    onClick={() => setShowDropdown(false)}
                />
            )}

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

                {/* Search Dropdown */}
                {showDropdown && (
                    <div className="search-dropdown">
                        {/* Search History */}
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

                        {/* Popular Searches */}
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

                        {/* Featured Categories */}
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
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchBar;