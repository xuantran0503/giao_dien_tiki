import React from "react";
import Header from "../components/Header/Header";
import Banner from "../components/Banner/Banner";
import FloatingButtons from "../components/FloatingButtons/FloatingButtons";

const HomePage = () => {
  return (
    <div className="App">
      <Header />
      <Banner />
      <FloatingButtons />
    </div>
  );
};

export default HomePage;
