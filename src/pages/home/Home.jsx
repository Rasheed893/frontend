import React from "react";
import Banner from "./Banner";
import TopSellers from "./TopSellers";
import Recommended from "./Recommended/Recommended";
import News from "./News";
import Header from "../../components/Header";
import Carousel from "./Spinner";
import MainBanner from "./mainBanner/MainBanner";
import SpecialOffer from "./specialOffer/SpecialOffer";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <SpecialOffer />
      <TopSellers />
      <Recommended />
      <MainBanner />
      <News />
    </>
  );
};

export default Home;
