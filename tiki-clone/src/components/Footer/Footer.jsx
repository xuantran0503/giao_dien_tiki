import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            
            
            <div className="footer-info">
                <div className="footer-container">
                    <div className="footer-info-grid">

                        <div className="footer-info-column">
                            <h4>Hỗ trợ khách hàng</h4>
                            <p>Hotline: <strong>1900-6035</strong></p>
                            <p>(1000 đ/phút, 8-21h cả T7, CN)</p>
                            <a href="#">Các câu hỏi thường gặp</a>
                            <a href="#">Gửi yêu cầu hỗ trợ</a>
                            <a href="#">Hướng dẫn đặt hàng</a>
                            <a href="#">Phương thức vận chuyển</a>
                            <a href="#">Chính sách kiểm hàng</a>
                            <a href="#">Chính sách đổi trả</a>
                            <a href="#">Hướng dẫn trả góp</a>
                            <a href="#">Chính sách hàng nhập khẩu</a>
                            <a href="#">Hỗ trợ khách hàng: hotro@tiki.vn</a>
                            <a href="#">Báo lỗi bảo mật: security@tiki.vn</a>
                        </div>

                        <div className="footer-info-column">
                            <h4>Về Tiki</h4>
                            <a href="#">Giới thiệu Tiki</a>
                            <a href="#">Tiki Blog</a>
                            <a href="#">Tuyển dụng</a>
                            <a href="#">Chính sách bảo mật thanh toán</a>
                            <a href="#">Chính sách bảo mật thông tin cá nhân</a>
                            <a href="#">Chính sách giải quyết khiếu nại</a>
                            <a href="#">Điều khoản sử dụng</a>
                            <a href="#">Giới thiệu Tiki Xu</a>
                            <a href="#">Bán hàng doanh nghiệp</a>
                            <a href="#">Điều kiện vận chuyển</a>
                        </div>

                        <div className="footer-info-column">
                            <h4>Hợp tác và liên kết</h4>
                            <a href="#">Quy chế hoạt động Sàn GDTMĐT</a>
                            <a href="#">Bán hàng cùng Tiki</a>
                            <br />
                            <h4 className="mt-20">Chứng nhận bởi</h4>
                            <div className="certification-logos">
                                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png" alt="Bộ Công Thương" />
                                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg" alt="Đã thông báo" />
                                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120y.png?ID=388d758c-6722-4245-a2b0-1d2415e70127" alt="DMCA" />
                            </div>
                        </div>

                        <div className="footer-info-column">
                            <h4>Phương thức thanh toán</h4>
                            <div className="payment-methods">
                                <img src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png" alt="VISA" />
                                <img src="https://salt.tikicdn.com/ts/upload/1e/27/a7/e2c0c2c25c7f2b000e7b0a0f5f0c40fe.png" alt="Mastercard" />
                                <img src="https://salt.tikicdn.com/ts/upload/b8/5e/2e/5d34f8e9f0e6c6e0e1e5e5e5e5e5e5e5.png" alt="JCB" />
                                <img src="https://salt.tikicdn.com/ts/upload/5b/10/e8/f44a6df9e5c77e8c494c514f72c24b87.png" alt="ATM" />
                                <img src="https://salt.tikicdn.com/ts/upload/ea/e4/c5/c5d5deb55f3a8f542a8a4f4c1b17182c.png" alt="Momo" />
                                <img src="https://salt.tikicdn.com/ts/upload/d4/c0/f4/e2b3c7d8d0c6a39b8523a8e05c7e7e7e.png" alt="ZaloPay" />
                            </div>

                            <h4 className="mt-20">Dịch vụ giao hàng</h4>
                            <div className="shipping-services">
                                <img src="https://salt.tikicdn.com/ts/upload/74/56/ab/e71563afb23e3f34a148fe1b7d3413c5.png" alt="TikiNOW" />
                            </div>
                        </div>

                        <div className="footer-info-column">
                            <h4>Kết nối với chúng tôi</h4>
                            <div className="social-links">
                                <a href="#" className="social-icon facebook">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="#" className="social-icon youtube">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="#" className="social-icon zalo">
                                    <i className="fab fa-zalo"></i>
                                </a>
                            </div>

                            <h4 className="mt-20">Tải ứng dụng trên điện thoại</h4>
                            <div className="app-download">
                                <div className="qr-code">
                                    <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/qrcode.png" alt="QR Code" />
                                </div>
                                <div className="app-buttons">
                                    <a href="#" className="app-store">
                                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png" alt="App Store" />
                                    </a>
                                    <a href="#" className="google-play">
                                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png" alt="Google Play" />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>




            
            <div className="footer-company-bottom">
                <div className="footer-container">
                    <div className="company-info-section">
                        <h4>Công ty TNHH TI KI</h4>
                        <p>52 Út Tịch, Phường Tân Sơn Nhất, Thành phố Hồ Chí Minh, Việt Nam</p>
                        <p>Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.</p>
                        <p>Hotline: <a href="tel:19006035">1900 6035</a></p>
                    </div>

                    <div className="tiki-description-section">
                        <h4>Tiki - Thật nhanh, thật chất lượng, thật rẻ</h4>
                        <p><strong>Tiki có tất cả</strong></p>
                        <p>Với hàng triệu sản phẩm từ các thương hiệu, cửa hàng uy tín, những nghìn loại mặt hàng từ Điện thoại smartphone tới Rau củ quả tươi, tâm trọc đến vụ giảo hàng siêu tốc TikiNOW, Tiki mang đến cho bạn một trải nghiệm mua sắm online bắt đầu bằng chữ tín. Thêm vào đó, ở Tiki bạn có thể dễ dàng sử dụng vô vàn các tiện ích khác như: mua thẻ cào, thanh toán hóa đơn điện nước, các dịch vụ bảo hiểm.</p>
                        
                        <p><strong>Khuyến mãi, ưu đãi trăn ngập</strong></p>
                        <p>Bạn muốn săn giá tốt, Tiki có giảm giá mỗi ngày cho bạn! Bạn là tín đồ của các thương hiệu, các cửa hàng Official chính hãng đang chờ bạn. Không cần săn mã freeship, vì Tiki đã có hàng triệu sản phẩm trong chương trình Freeship+, không giới hạn lượt đặt, tiết kiệm thêm giá trị bạc cửa bạn. Mua thêm gói TikiNOW tiết kiệm tới 100% chi phí & trong ngày, hoặc mua gói TikiPRO để được giảm giá độc quyền, giao hàng ưu tiên & miễn phí trả hàng 365 ngày. Bạn muốn mua hàng trả góp 0%, Tiki có hỗ trợ 100% tính năng Việt Nam. Bạn muốn tiết kiệm hơn nữa? Mở thẻ tín dụng TikiCARD, thẻ tín dụng Tiki hoàn tiền 15% trên mọi giao dịch (tối đa hoàn 600k/tháng)</p>
                    </div>
                </div>
            </div>



            <div className="footer-middle">
                <div className="footer-container">

                    <div className="footer-section">
                        <h4>Thương Hiệu Nổi Bật</h4>
                        <div className="footer-links">
                            <a href="#">vaccarm</a>
                            <a href="#">dior</a>
                            <a href="#">esteedauder</a>
                            <a href="#">jm truemilk</a>
                            <a href="#">barbie</a>
                            <a href="#">owen</a>
                            <a href="#">ensure</a>
                            <a href="#">durex</a>
                            <a href="#">bioderma</a>
                            <a href="#">elly</a>
                            <a href="#">milo</a>
                            <a href="#">skechers</a>
                            <a href="#">aldo</a>
                            <a href="#">triumph</a>
                            <a href="#">nutifood</a>
                            <a href="#">kindle</a>
                            <a href="#">neiman</a>
                            <a href="#">wacom</a>
                            <a href="#">anessa</a>
                            <a href="#">yoosee</a>
                            <a href="#">olay</a>
                            <a href="#">similac</a>
                            <a href="#">comfort</a>
                            <a href="#">bliss</a>
                            <a href="#">shiseido</a>
                            <a href="#">langherm</a>
                            <a href="#">hukan</a>
                            <a href="#">vichy</a>
                            <a href="#">fila</a>
                            <a href="#">tsubaki</a>
                        </div>
                    </div>




                     {/* --- Danh Mục Sản Phẩm --- */}
                    <div className="footer-categories">
                        <h3 className="footer-categories-title">Danh Mục Sản Phẩm</h3>
                        
                        <div className="footer-categories-grid">
                        <div className="footer-category">
                            <div>
                                <h5>Đồ Chơi - Mẹ & Bé</h5>
                                <a href="#">Thời Trang Cho Mẹ Và Bé</a>
                                <a href="#">Đồ chơi</a>
                                <a href="#">Đồ dùng cho bé</a>
                                <a href="#">Chăm sóc nhà cửa</a>
                                <a href="#">Chăm sóc sức khỏe</a>
                                <a href="#">Đồ dùng du lịch</a>
                                <a href="#">Tã, bỉm</a>
                                <a href="#">Dinh dưỡng cho người lớn</a>
                                <a href="#">Dinh dưỡng cho Trẻ</a>
                                <a href="#">Phụm tín dụng</a>
                                <a href="#">Chuẩn bị mang thai</a>
                            </div>

                            <div>
                                <h5>Thực Phẩm Tươi Sống</h5>
                                <a href="#">Trái Cây</a>
                                <a href="#">Thịt, Trứng</a>
                                <a href="#">Cá, thủy hải sản</a>
                                <a href="#">Rau củ quả</a>
                                <a href="#">Thực phẩm Việt</a>
                                <a href="#">Sữa, bơ, phô mai</a>
                                <a href="#">Đông lạnh, mát</a>
                                <a href="#">Dầu ăn, gia vị</a>
                                <a href="#">Gạo, mì</a>
                                <a href="#">Đồ uống</a>
                                <a href="#">Bia, đồ uống</a>
                            </div>

                            <div>
                                <h5>Điện Thoại - Máy Tính Bảng</h5>
                                <a href="#">Điện thoại Smartphone</a>
                                <a href="#">Điện thoai bàn</a>
                                <a href="#">Máy tính bảng</a>
                                <a href="#">Phụ kiện điện thoại</a>
                                <a href="#">Máy tính bảng</a>
                            </div>

                            <div>
                                <h5>Làm Đẹp - Sức Khỏe</h5>
                                <a href="#">Chăm sóc da mặt</a>
                                <a href="#">Dụng cụ làm đẹp</a>
                                <a href="#">Thực phẩm chức năng</a>
                                <a href="#">Trang điểm</a>
                                <a href="#">Chăm sóc sức khỏe</a>
                                <a href="#">Chăm sóc cơ thể</a>
                                <a href="#">Massage & Thiết bị chăm sóc sức khỏe</a>
                                <a href="#">Sản phẩm thiên nhiên & Khoa học</a>
                                <a href="#">Chăm sóc tóc và da đầu</a>
                                <a href="#">Chăm sóc cá nhân</a>
                                <a href="#">Nước hoa</a>
                                <a href="#">Hỗ trợ tình dục</a>
                                <a href="#">Bộ sản phẩm làm đẹp</a>
                                <a href="#">Dược mỹ phẩm</a>
                            </div>

                            <div>
                                <h5>Điện Gia Dụng</h5>
                                <a href="#">Đồ dùng nhà bếp</a>
                                <a href="#">Thiết bị gia đình</a>
                            </div>
                        </div>

                        <div className="footer-category">
                            <div>
                                <h4>Thời trang nữ</h4>
                                <a href="#">Áo nữ</a>
                                <a href="#">Đầm / Váy</a>
                                <a href="#">Quần nữ</a>
                                <a href="#">Áo liền quần</a>
                                <a href="#">Bộ trang phục</a>
                                <a href="#">Áo khoác</a>
                                <a href="#">Chân váy</a>
                                <a href="#">Trang phục bời</a>
                                <a href="#">Đồ ngủ</a>
                                <a href="#">Thời trang trung niên</a>
                            </div>

                            <div>
                                <h4>Thời trang nam</h4>
                                <a href="#">Áo thun</a>
                                <a href="#">Quần nam</a>
                                <a href="#">Áo khoác nam</a>
                                <a href="#">Áo sơ mi</a>
                                <a href="#">Đồ mặc nhà nam</a>
                                <a href="#">Đồ đôi</a>
                                <a href="#">Áo len</a>
                                <a href="#">Đồ bơi - Đồ già đình</a>
                                <a href="#">Quần áo nam</a>
                                <a href="#">Áo giô - Áo phông</a>
                                <a href="#">Đồ lót nam</a>
                                <a href="#">Quần áo nam</a>
                                <a href="#">Quần kaki cỡ lớn</a>
                            </div>

                            <div>
                                <h4>Giày - Dép nữ</h4>
                                <a href="#">Giày cao gót</a>
                                <a href="#">Dép</a>
                                <a href="#">Guốc nữ</a>
                                <a href="#">Giày thể thao nữ</a>
                                <a href="#">Giày đế bằng</a>
                                <a href="#">Giày búp bê</a>
                                <a href="#">Giày boots nữ</a>
                                <a href="#">Giày lười</a>
                                <a href="#">Phụ kiện giày</a>
                                <a href="#">Giày Bé xướng nữ</a>
                            </div>

                            <div>
                                <h4>Giày - Dép nam</h4>
                                <a href="#">Giày thể thao nam</a>
                                <a href="#">Giày thể thao nam</a>
                                <a href="#">Dép nam</a>
                                <a href="#">Giày sandals nam</a>
                                <a href="#">Phụ kiện giày</a>
                                <a href="#">Giày boots nam</a>
                            </div>

                            <div>
                                <h4>Túi thời trang nữ</h4>
                                <a href="#">Túi déo chéo, túi déo vai nữ</a>
                                <a href="#">Vi nữ</a>
                                <a href="#">Túi xách tay nữ</a>
                                <a href="#">Túi xách tay nữ</a>
                                <a href="#">Phụ kiện túi</a>
                            </div>

                            <div>
                                <h4>Túi thời trang nam</h4>
                                <a href="#">Vi nam</a>
                                <a href="#">Túi déo chéo nam</a>
                                <a href="#">Túi xách công sở nam</a>
                                <a href="#">Túi bao tử, túi đéo bụng</a>
                            </div>
                        </div>

                        <div className="footer-category">
                            <div>
                                <h4>Balo và Vali</h4>
                                <a href="#">Balo</a>
                                <a href="#">Balo du lịch và phụ kiện</a>
                                <a href="#">Balo, cặp, túi chống sốc laptop</a>
                                <a href="#">Vali, phụ kiện vali</a>
                                <a href="#">Túi chống sốc</a>
                                <a href="#">Túi đựng laptop</a>
                                <a href="#">Túi xách thời trang</a>
                                <a href="#">Khăn quang cổ</a>
                            </div>

                            <div>
                                <h4>Phụ kiện thời trang</h4>
                                <a href="#">Phụ kiện thời trang nữ</a>
                                <a href="#">Mắt kính</a>
                                <a href="#">Phụ kiện thời trang nam</a>
                                <a href="#">Trang sức</a>
                                <a href="#">Thắt lưng</a>
                                <a href="#">Khăn quang cổ</a>
                                <a href="#">Mũ nón thời trang</a>
                                <a href="#">Găng tay</a>
                                <a href="#">Phụ kiện tóc</a>
                            </div>

                            <div>
                                <h4>Đồng hồ và Trang sức</h4>
                                <a href="#">Trang hồ nam</a>
                                <a href="#">Phụ kiện đồng hồ</a>
                                <a href="#">Đồng hồ nữ</a>
                                <a href="#">Đồng hồ trẻ em</a>
                                <a href="#">Phụ kiện đồng hồ</a>
                                <a href="#">Ké em</a>
                            </div>

                            <div>
                                <h4>Laptop - Máy Vi Tính - Linh kiện</h4>
                                <a href="#">Linh Kiện Máy Tính - Phụ Kiện Máy Tính</a>
                                <a href="#">Laptop</a>
                                <a href="#">Thiết Bi Âm Thanh và Phụ Kiện</a>
                                <a href="#">Màn hình</a>
                                <a href="#">Linh kiện máy tính</a>
                                <a href="#">Thiết bị mạng</a>
                                <a href="#">Thiết bị mạng</a>
                                <a href="#">Phụ kiện máy tính</a>
                            </div>

                            <div>
                                <h4>Nhà Cửa - Đời Sống</h4>
                                <a href="#">Trang trí nhà cửa</a>
                                <a href="#">Dụng cụ nhà bếp</a>
                                <a href="#">Đồ dùng phòng ngủ</a>
                                <a href="#">Nội thất</a>
                            </div>

                            <div>
                                <h4>Bách Hóa Online</h4>
                                <a href="#">Chăm sóc thú cưng</a>
                                <a href="#">Đồ dùng - Pha chế đăng bột</a>
                                <a href="#">Thực phẩm Đông hộp và Khô</a>
                                <a href="#">Gia Vị và Chè Biến & Hạt Các Loại</a>
                                <a href="#">Báu & Hạt Các Loại</a>
                                <a href="#">Vật và các Sản phẩm từ Vật</a>
                                <a href="#">Sữa và các Sản phẩm từ sữa</a>
                                <a href="#">Đồ Uống Không Cồn</a>
                                <a href="#">Bộ quà tặng</a>
                            </div>

                        </div>

                        <div className="footer-category">
                            <div>
                                <h4>Hàng Quốc Tế</h4>
                                <a href="#">Nhà Cửa - Đời Sống</a>
                                <a href="#">Thiết Bị Số</a>
                                <a href="#">Thời Trang</a>
                                <a href="#">Ô tô, xe máy, xe đạp</a>
                                <a href="#">Thiết Bị Số</a>
                                <a href="#">Phụ Kiện Số</a>
                                <a href="#">Thiết bị - Phụ kiện tiệc - sự kiện</a>
                                <a href="#">Làm Đẹp - Sức Khỏe</a>
                                <a href="#">Sách, văn phòng phẩm & quà lưu niệm</a>
                                <a href="#">Mẹ & Bé</a>
                                <a href="#">Điện gia dụng</a>
                                <a href="#">Bách hóa online</a>
                                <a href="#">Máy Ảnh - Máy Quay Phim</a>
                                <a href="#">Laptop & Máy Vi Tính</a>
                                <a href="#">Thiết bị - phụ kiện tiệc - sự kiện công nghiệp</a>
                                <a href="#">Tivi & Thiết Bị Nghe Nhìn</a>
                                <a href="#">Thiết bị Thông Minh</a>
                                <a href="#">Thiết bị - Phụ Kiện Game và Phụ Kiện</a>
                            </div>

                            <div>
                                <h4>Thiết Bị Số - Phụ Kiện Số</h4>
                                <a href="#">Phụ Kiện Điện Thoại và Máy Tính Bảng</a>
                                <a href="#">Phụ kiện thời trang nam</a>
                                <a href="#">Laptop</a>
                                <a href="#">Thiết Bi Âm Thanh và Phụ Kiện</a>
                                <a href="#">Máy tính bảng</a>
                                <a href="#">Thiết Bị Đeo Thông Minh và Phụ Chốt</a>
                                <a href="#">Máy và Thiết Bị Game</a>
                            </div>

                            

                            <div>
                                <h4>Voucher - Dịch vụ</h4>
                                <a href="#">Thanh toán hóa đơn</a>
                                <a href="#">Khóa học</a>
                                <a href="#">Dịch vụ - Khách sạn & Spa & Làm đẹp</a>
                                <a href="#">Dịch vụ khác</a>
                                <a href="#">Nhà hàng ăn uống</a>
                                <a href="#">Sự kiện - Giải trí</a>
                                <a href="#">Sức khỏe - Sức khỏe</a>
                                <a href="#">Phiếu quà</a>
                                <a href="#">Sim số - Thẻ nạp - Thẻ game</a>
                            </div>

                            <div>
                                <h4>Ô Tô - Xe Máy - Xe Đạp</h4>
                                <a href="#">Phụ kiện - Chăm sóc xe</a>
                                <a href="#">Xe điện</a>
                                <a href="#">Máy đo áp / Xe Scooter</a>
                                <a href="#">Dịch vụ, lập đặt</a>
                            </div>

                            <div>
                                <h4>Nhà Sách Tiki</h4>
                                <a href="#">Sách tiếng Việt</a>
                                <a href="#">Văn phòng phẩm</a>
                                <a href="#">Quà lưu niệm</a>
                                <a href="#">English Books</a>
                            </div>
                        </div>

                        <div className="footer-category">
                            <div>
                                <h4>Điện Tử - Điện Lạnh</h4>
                                <a href="#">An toàn nhà & Phụ kiện điện lạnh</a>
                                <a href="#">Tủ lạnh</a>
                                <a href="#">Máy lạnh</a>
                                <a href="#">Máy giặt</a>
                                <a href="#">Máy rửa chén</a>
                                <a href="#">Tivi</a>
                                <a href="#">Máy nước nóng</a>
                                <a href="#">Máy hút bụi</a>
                                <a href="#">Tủ đông rượu</a>
                            </div>

                            <div>
                                <h4>Thể Thao - Dã Ngoại</h4>
                                <a href="#">Trang phục thể thao nam</a>
                                <a href="#">Phụ kiện thể thao</a>
                                <a href="#">Dụng cụ thể thao</a>
                                <a href="#">Giày thể thao</a>
                                <a href="#">Dụng cụ - thiết bị tập thể thao</a>
                                <a href="#">Thể thao nước</a>
                                <a href="#">Dụng cụ câu cá</a>
                                <a href="#">Thể thao động đội</a>
                                <a href="#">Các môn thể thao khác</a>
                                <a href="#">Thể thao - Dã ngoại</a>
                                <a href="#">Giày thể thao nữ</a>
                                <a href="#">Thực phẩm bổ sung năng lượng</a>
                                <a href="#">Dụng cụ bổ sung</a>
                            </div>

                            

                            <div>
                                <h4>Máy Ảnh - Máy Quay Phim</h4>
                                <a href="#">Phụ Kiện Máy Ảnh, Máy Quay</a>
                                <a href="#">Camera Giám Sát</a>
                                <a href="#">Thiết Bị Camera Hành Trình</a>
                                <a href="#">Action Camera và Phụ Kiện</a>
                                <a href="#">Balo - Túi đựng Máy Ảnh - Flycam</a>
                                <a href="#">Máy ảnh - Máy quay phím - Flycam</a>
                                <a href="#">Ông Kinh [Lens]</a>
                                <a href="#">Thiết Bị Studio</a>
                                <a href="#">Quầy Phim / Máy Quay</a>
                                <a href="#">Phụ Kiện</a>
                                <a href="#">Máy Ảnh</a>
                            </div>

                            <div>
                                <h4>Tủ Khóa Được Quan Tâm</h4>
                                <a href="#">máy suối</a>
                                <a href="#">den suối trần</a>
                                <a href="#">mái nội điện sunhouse</a>
                                <a href="#">may sấy tóc philips</a>
                                <a href="#">bàn ủi hơi nước công là hơi nước philp</a>
                                <a href="#">máy suối xiaomi</a>
                                <a href="#">bình nước nóng ariston</a>
                                <a href="#">máy suối xiaomi</a>
                                <a href="#">máy hút bụi giường nệm</a>
                                <a href="#">cây nước nóng lạnh toshiba</a>
                                <a href="#">robot hút bụi lau nhà của nhật</a>
                                <a href="#">den suối trần</a>
                                <a href="#">nồi cơm điện tefal</a>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>



        </footer>
    );
};

export default Footer;
