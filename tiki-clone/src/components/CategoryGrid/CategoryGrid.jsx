import React from "react";
import { Link } from "react-router-dom";
import "./CategoryGrid.css";

const CategoryGrid = () => {
  const categories = [
    { id: 1, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/a1/06/43/e003ce2d6429ba1284290b3e58091ce8.png.webp" },
    { id: 2, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/3c/15/54/4955a55c63282be1c010a9b261b6e0c9.png.webp" },
    { id: 3, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/a9/64/cc/427004d940aa6f9e2749988644a46ff2.png.webp" },
    { id: 4, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/15/51/dd/ec77db4d0f7ec6553aeede2d55f839b8.png.webp" },
    { id: 5, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/2a/d6/0b/74597e5af043ac7e890fc5018f053db0.png.webp" },
    { id: 6, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/59/ea/fd/6495b25ad68d64cb40a5030ca4baaad0.png.webp" },
    { id: 7, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/c2/b5/98/5bd1ffd78a46f67c3f7b076f79fcbb2e.png.webp" },
    { id: 8, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/da/02/d0/673e7b48f1fb5de649fabdaf277a7724.png.webp" },
    { id: 9, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/0f/2c/e2/20972e1733dcb58d8d7200f731f8690e.png.webp" },
    { id: 10, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/01/2e/d1/6f3683df5859f288abd700da254d54fb.png.webp" },
    { id: 11, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/52/2f/f8/8c2750bf4562cb065b1f11153b968fa5.png.webp" },
    { id: 12, image: "https://salt.tikicdn.com/cache/w280/ts/tikimsp/e2/6c/2f/ff28be8536f6d3a652a9c35ff463a7e4.png.webp" }
  ];

  return (
    <div className="category-grid-section">
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/category/${category.id}`} key={category.id} className="category-card">
            <div className="category-images">
              <img src={category.image} alt="Category" className="category-img" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
