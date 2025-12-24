import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MiniCategories.css";

const MiniCategories = () => {
  const { categories, status, error } = useSelector((state) => state.category);

  // Danh sách khuyến mãi cố định (từ mã cũ)
  const promoItems = [
    { name: "Deal riêng 50% TikiVIP", image: "/img-tikivip.png", path: "/promotion/tiki-vip" },
    { name: "Tiki sáng nay rẻ", image: "/img-sangnayre.png", path: "/promotion/sang-nay-re" },
    { name: "Combo siêu tiết kiệm", image: "/img-sieutietkiem.png", path: "/promotion/combo-tiet-kiem" },
    { name: "Tiki Trading", image: "/img-trading.png", path: "/promotion/tiki-trading" },
    { name: "Coupon siêu hot", image: "/img-coupon.png", path: "/promotion/coupon-hot" },
    // {name: "Noel Rộn Ràng Giảm 50%", image: "https://salt.tikicdn.com/ts/upload/b2/fb/48/4eb753a8871c7438846a602ecbfbad1c.jpg", path: "/promotion/noel-ron-rang-giam-50" },
    { name: "Xả kho", image: "/img_xa_kho.png", path: "/promotion/xakho" },
     { name: "Đổi trả miễn phí", image: "/img_doitra.png", path: "/promotion/doitra" },
      { name: "Giá siêu rẻ", image: "/img_giare.png", path: "/promotion/gia-sieu-re" },
      { name: "Hallowin", image: "/img_hallowin.png", path: "/promotion/hallowin" },
       { name: "Hoàn tiền 100%", image: "/img_hoantien.png", path: "/promotion/hoan-tien-100" },


  ];

  if (status === "pending" && categories.length === 0) {
    return <div className="mini-categories">Loading categories...</div>;
  }

  // Kết hợp promo items với categories từ API
  // Ưu tiên hiển thị promo items trước, sau đó đến các danh mục từ API
  // const allItems = [
  //   ...promoItems,
  //   ...categories.map(cat => ({
  //     name: cat.name,
  //     image: cat.image,
  //     path: `/category/${cat.id}`,
  //     id: cat.id
  //   }))
  // ];

  return (
    <div className="mini-categories">
      <div className="hero-mini-icons">
        <ul className="mini-icons-list">
          {promoItems.map((item, index) => (
            <li key={item.id || index}>
              <Link to={item.path}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23f5f5f5' width='48' height='48'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' dy='3.5' x='50%25' y='50%25' text-anchor='middle'%3ECategory%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MiniCategories;
