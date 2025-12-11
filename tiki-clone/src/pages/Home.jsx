import React from "react";
import Banner from "../components/Banner/Banner";
import TopDeals from "../components/TopDeals/TopDeals";

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <div className="container">
        <TopDeals />
      </div>
    </div>
  );
};

export default Home;
