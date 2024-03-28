"use client";

// import CreatorsToken from "../app/creators-token/page";
import CreatorsToken from "../app/CreatorsNFTs/page";
// import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="">
        <CreatorsToken />
      </div>
    </>
  );
};

export default Home;
