import React from "react";
import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
// HeroSlider and MiniCategories are rendered inside Banner now
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
    </div>
  );
}

export default App;
