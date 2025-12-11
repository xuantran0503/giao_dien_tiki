import React from "react";
import { Link } from "react-router-dom";
import "./MiniCategories.css";

const MiniCategories = () => {
  return <div className="mini-categories">
    <div className="hero-mini-icons">
      <ul className="mini-icons-list">
        <li>
          <Link to="/promotion/tiki-vip">
            <img src="/img-tikivip.png" alt="Tiki VIP" />
            <span>Deal riêng 50% TikiVIP</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/sang-nay-re">
            <img src="/img-sangnayre.png" alt="Sáng nay rẻ" />
            <span>Tiki sáng nay rẻ</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/combo-tiet-kiem">
            <img src="/img-sieutietkiem.png" alt="Siêu tiết kiệm" />
            <span>Combo siêu tiết kiệm</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/tiki-trading">
            <img src="/img-trading.png" alt="Tiki Trading" />
            <span>Tiki Trading</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/coupon-hot">
            <img src="/img-coupon.png" alt="Coupon" />
            <span>Coupon siêu hot</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/tri-an-phu-nu">
            <img
              src="/img_tri_an_phu_nu.png"
              alt="Tri ân Phụ nữ Việt Nam"
            />
            <span>Tri ân Phụ nữ Việt Nam</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/halloween">
            <img src="/img_hallowin.png" alt="Rộn ràng Halloween" />
            <span>Rộn ràng Halloween</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/xa-kho">
            <img src="/img_xa_kho.png" alt="Xả kho giảm nửa giá" />
            <span>Xả kho giảm nửa giá</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/sach-ban-chay">
            <img src="/img_sach_ban_chay.png" alt="Top sách bán chạy" />
            <span>Top sách bán chạy</span>
          </Link>
        </li>
        <li>
          <Link to="/promotion/dien-may-50">
            <img
              src="/img_dien_may_giamgia.png"
              alt="Điện máy giảm 50%"
            />
            <span>Điện máy giảm 50%</span>
          </Link>
        </li>
      </ul>
    </div>

  </div>;
};

export default MiniCategories;
