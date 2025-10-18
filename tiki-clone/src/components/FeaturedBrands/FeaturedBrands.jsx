import React from "react";
import "./FeaturedBrands.css";

const FeaturedBrands = () => {
  const brands = [
    {
      id: 1,
      image: "im_jbl.jpg",
      title: "Công nghệ vượt thời Giá giảm đến 50%",
    },
    {
      id: 2,
      image: "tikivip.png",
      title: "X2 quyền lợi đốc quyền Đón chờ ngày 20.10",
      
    },
    {
      id: 3,
      image: "img_domakup.jpg",
      title: "Gửi trọn yêu thương Ưu đãi đến 50%",
      
    },
    {
      id: 4,
      image: "img_sachchamcon.png",
      title: "Xả kho cuối tuần Ưu đãi đến 50%",
    },
    {
      id: 5,
      image: "img_kemdanhrang.png",
      title: "Thơm mát dài lâu Giao nhanh 2H",
      
    },
    {
      id: 6,
      image: "img_tanguoigia.png",
      title: "Tã người lớn SunMate Coupon đến 100K",
      
    }
  ];

  return (
    <div className="featured-brands">
      <div className="brands-header">
        <h2 className="brands-title">Thương hiệu nổi bật</h2>
      </div>

      <div className="brands-grid">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-card">
            <div className="brand-image-wrapper">
              <img src={brand.image} alt={brand.title} className="brand-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrands;
