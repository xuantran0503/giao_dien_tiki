import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const CommitmentPage = () => {
  const { commitmentType } = useParams();

  const commitmentInfo = {
    "authentic": {
      title: "100% Hàng Thật",
      description: "Tiki cam kết 100% sản phẩm là hàng chính hãng, đảm bảo chất lượng."
    },
    "freeship": {
      title: "Freeship Mọi Đơn",
      description: "Miễn phí vận chuyển cho mọi đơn hàng trên toàn quốc."
    },
    "refund": {
      title: "Hoàn 200% Nếu Hàng Giả",
      description: "Nếu phát hiện hàng giả, Tiki sẽ hoàn lại 200% giá trị đơn hàng."
    },
    "return": {
      title: "30 Ngày Đổi Trả",
      description: "Đổi trả miễn phí trong vòng 30 ngày nếu sản phẩm có lỗi."
    },
    "fast-delivery": {
      title: "Giao Nhanh 2H",
      description: "Giao hàng siêu tốc trong vòng 2 giờ tại các khu vực nội thành."
    },
    "cheap-price": {
      title: "Giá Siêu Rẻ",
      description: "Cam kết giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn."
    }
  };

  const info = commitmentInfo[commitmentType] || {
    title: "Cam Kết Của Tiki",
    description: "Tiki cam kết mang đến trải nghiệm mua sắm tốt nhất."
  };

  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>{info.title}</h1>
        <div className="test-info">
          <p className="test-description">
            {info.description}
          </p>
          <div className="test-features">
            <h3>Chi tiết cam kết:</h3>
            <ul>
              <li>✓ Áp dụng cho tất cả sản phẩm trên Tiki</li>
              <li>✓ Được kiểm tra và xác thực bởi Tiki</li>
              <li>✓ Hỗ trợ khách hàng 24/7</li>
              <li>✓ Quy trình xử lý nhanh chóng</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default CommitmentPage;
