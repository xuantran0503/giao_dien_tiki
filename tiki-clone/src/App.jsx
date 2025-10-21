import React from "react";
import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
import Footer from "./components/Footer/Footer";
import "./App.css";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import YouMayLike from "./components/YouMayLike/YouMayLike";

function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      {/* <YouMayLike /> */}
      <FloatingButtons />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
