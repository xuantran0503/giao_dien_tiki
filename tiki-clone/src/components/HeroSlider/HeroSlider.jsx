import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";

const slides = [
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/d1/06/e8/eed162fc140eb24921fd157a11672f5a.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/66/75/5f/1416db66f3558415765809f645a6a16e.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/d3/64/15/f3a979857209767acb2dd46d4074af02.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/c7/73/6a/072a75c942fb76954e105e8712e4301d.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/7c/41/ec/dbc218edededc6b6335793c5985cb68e.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/c1/96/50/b1ed8d284346db1e8bee14586d8f9208.png.webp",
];

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button className="custom-arrow custom-arrow-prev" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="custom-arrow custom-arrow-next" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
);

const HeroSlider = ({ height = 300 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    adaptiveHeight: false,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    dotsClass: 'slick-dots hero-dots',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
          prevArrow: <PrevArrow />,
          nextArrow: <NextArrow />
        }
      }
    ]
  };

  return (
    <div className="hero-slider" style={{ "--hero-height": `${height}px` }}>
      <div className="slider-container">
        <Slider {...settings}>
          {slides.map((src, idx) => (
            <div key={idx} className="hero-slide-card">
              <Link to={`/promotion/slide-${idx + 1}`}>
                <img src={src} alt={`slide-${idx + 1}`} />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroSlider;
