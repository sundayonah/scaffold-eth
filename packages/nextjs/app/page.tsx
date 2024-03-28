"use client";

// import CreatorsToken from "../app/creators-token/page";
import MarketPlace from "../app/marketplace/page";
// import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="">
        <MarketPlace />
      </div>
    </>
  );
};

export default Home;
