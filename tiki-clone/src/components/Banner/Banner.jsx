import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroSlider from "../HeroSlider/HeroSlider";
import MiniCategories from "../MiniCategories/MiniCategories";
import TopDeals from "../TopDeals/TopDeals";
import FlashSale from "../FlashSale/FlashSale";
import FeaturedBrands from "../FeaturedBrands/FeaturedBrands";
import HotInternational from "../HotInternational/HotInternational";
import CategoryGrid from "../CategoryGrid/CategoryGrid";
import YouMayLike from "../YouMayLike/YouMayLike";
import SuggestedProducts from "../SuggestedProducts/SuggestedProducts";
import Footer from "../Footer/Footer";


const Banner = () => {
  return (
    <div className="banner-row">
      <div className="banner-container">
        <div className="banner-content">

          <div className="banner-left-categories">


            <div className="left-card">
              <h3 className="card-title">Danh mục</h3>
              <ul className="category-list-small">
                <li>
                  <Link to="/category/nha-sach-tiki">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/ed/20/60/afa9b3b474bf7ad70f10dd6443211d5f.png.webp"
                      alt="Nhà sách Tiki"
                    />
                    <span>Nhà Sách Tiki</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/nha-cua-doi-song">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/f6/22/46/7e2185d2cf1bca72d5aeac385a865b2b.png.webp"
                      alt="Nhà cửa đời sống"
                    />
                    <span>Nhà Cửa - Đời Sống</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/dien-thoai-may-tinh-bang">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png.webp"
                      alt="Điện thoại - Máy tính bảng"
                    />
                    <span>Điện Thoại - Máy Tính Bảng</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/do-choi-me-be">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/13/64/43/226301adcc7660ffcf44a61bb6df99b7.png.webp"
                      alt="Đồ Chơi - Mẹ & Bé"
                    />
                    <span>Đồ Chơi - Mẹ & Bé</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/thiet-bi-so">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/75/34/29/78e428fdd90408587181005f5cc3de32.png.webp"
                      alt="Thiết bị số"
                    />
                    <span>Thiết Bị Số - Phụ Kiện Số</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/dien-gia-dung">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Điện gia dụng</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/lam-dep-suc-khoe">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/73/0e/89/bf5095601d17f9971d7a08a1ffe98a42.png.webp"
                      alt="Làm đẹp"
                    />
                    <span>Làm Đẹp - Sức Khỏe</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/o-to-xe-may">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/69/f5/36/c6cd9e2849854630ed74ff1678db8f19.png.webp"
                      alt="Ô tô xe máy"
                    />
                    <span>Ô Tô - Xe Máy - Xe Đạp</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/thoi-trang-nu">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png.webp"
                      alt="Thời trang nữ"
                    />
                    <span>Thời trang nữ</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/bach-hoa-online">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/40/0f/9b/62a58fd19f540c70fce804e2a9bb5b2d.png.webp"
                      alt="Bách Hóa Online"
                    />
                    <span>Bách Hóa Online</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/the-thao">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/0b/5e/3d/00941c9eb338ea62a47d5b1e042843d8.png.webp"
                      alt="Thể Thao"
                    />
                    <span>Thể Thao - Dã Ngoại</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/thoi-trang-nam">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png.webp"
                      alt="Thời trang nam"
                    />
                    <span>Thời trang nam</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/hang-quoc-te">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/3c/e4/99/eeee1801c838468d94af9997ec2bbe42.png.webp"
                      alt="Hàng Quốc Tế"
                    />
                    <span>Cross Border - Hàng Quốc Tế</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/laptop-may-tinh">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/92/b5/c0/3ffdb7dbfafd5f8330783e1df20747f6.png.webp"
                      alt="Laptop"
                    />
                    <span>Laptop - Máy Vi Tính - Linh kiện</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/giay-dep-nam">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/d6/7f/6c/5d53b60efb9448b6a1609c825c29fa40.png.webp"
                      alt="Giày Dép nam"
                    />
                    <span>Giày - Dép nam</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/dien-tu-dien-lanh">

                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/c8/82/d4/64c561c4ced585c74b9c292208e4995a.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Điện Tử - Điện Lạnh</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/giay-dep-nu">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/cf/ed/e1/5a6b58f21fbcad0d201480c987f8defe.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Giày - Dép nữ</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/may-anh-may-quay-phim">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/2d/7c/45/e4976f3fa4061ab310c11d2a1b759e5b.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Máy Ảnh - Máy Quay Phim</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/phu-kien-thoi-trang">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/ca/53/64/49c6189a0e1c1bf7cb91b01ff6d3fe43.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Phụ kiện thời trang</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/ngon">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/1e/8c/08/d8b02f8a0d958c74539316e8cd437cbd.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>NGON</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/dong-ho-va-trang-suc">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/8b/d4/a8/5924758b5c36f3b1c43b6843f52d6dd2.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Đồng hồ và Trang sức</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/balo-va-vali">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/3e/c0/30/1110651bd36a3e0d9b962cf135c818ee.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Balo và Vali</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/voucher-dich-vu">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/0a/c9/7b/8e466bdf6d4a5f5e14665ce56e58631d.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Voucher - Dịch vụ</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/tui-thoi-trang-nu">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/31/a7/94/6524d2ecbec216816d91b6066452e3f2.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Túi thời trang nữ</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/tui-thoi-trang-nam">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/category/9b/31/af/669e6a133118e5439d6c175e27c1f963.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Túi thời trang nam</span>
                  </Link>
                </li>

                <li>
                  <Link to="/category/cham-soc-nha-cua">
                    <img
                      src="https://salt.tikicdn.com/cache/100x100/ts/product/62/d5/9d/6be83773e4836bcbcdaf99a1750b2a28.png.webp"
                      alt="Điện gia dụng"
                    />
                    <span>Chăm sóc nhà cửa</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="left-card small">
              <h4 className="card-title">Tiện ích</h4>
              <ul className="utility-list">
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/1e/27/a7/e2c0e40b6dc45a3b5b0a8e59e2536f23.png.webp"
                    alt="Ưu đãi thẻ"
                  />
                  <span>Ưu đãi thẻ, ví</span>
                </li>
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/4d/a3/cb/c86b6e4f17138195c026437458029d67.png.webp"
                    alt="Đóng tiền"
                  />
                  <span>Đóng tiền, nạp thẻ</span>
                </li>
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/tmp/6f/4e/41/93f72f323d5b42207ab851dfa39d44fb.png.webp"
                    alt="Mua trước"
                  />
                  <span>Mua trước trả sau</span>
                </li>
              </ul>
            </div>

            <div className="left-card small seller-card">
              <div className="seller-container">
                <a href="/ban-hang-cung-tiki" className="seller-link">
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/08/2f/14/fd9d34a8f9c4a76902649d04ccd9bbc5.png.webp"
                    alt="bán hàng"
                  />
                  <span>Bán hàng cùng Tiki</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-center-hero">
          <div className="hero-area">
            {/* Hero slider block (separate white card) */}
            <div className="hero-slider-card">
              <HeroSlider height={360} />
            </div>

            {/* Mini categories block (separate white card below slider) */}
            <div className="mini-categories-container">
              <MiniCategories />
            </div>

            {/* TopDeals Section */}
            <div className="top-deals-container">
              <TopDeals />
            </div>

            {/* FlashSale Section */}
            <div className="flash-sale-container">
              <FlashSale />
            </div>

            {/* FeaturedBrands Section */}
            <div className="featured-brands-container">
              <FeaturedBrands />
            </div>

            {/* HotInternational Section */}
            <div className="hot-international-container">
              <HotInternational />
            </div>

            {/* CategoryGrid Section */}
            <div className="category-grid-container">
              <CategoryGrid />
            </div>

            {/* YouMayLike Section */}
            <div className="you-may-like-container">
              <YouMayLike />
            </div>

            {/* SuggestedProducts Section */}
            <div className="suggested-products-container">
              <SuggestedProducts />
            </div>

            {/* Footer Section */}
            <div className="footer-container">
              <Footer />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
