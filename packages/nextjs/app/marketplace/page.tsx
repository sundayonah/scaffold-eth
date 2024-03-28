"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetchTokenDetails } from "./NFTToken";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Page = () => {
  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  const arrayOfTokens = useFetchTokenDetails(AllTokens);

  if (!AllTokens) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {arrayOfTokens.map((token, index) => (
          <div
            key={token.tokenName}
            // className="bg-[#e9fbff] shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
            className="bg-primary shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
          >
            <Link href={`/marketplace/${token.tokenURL}`} passHref>
              <Image
                className="w-full h-32 object-cover object-center rounded-md mx-auto"
                src={`https://ipfs.io/ipfs/${token.tokenURL}`}
                alt={token.tokenName}
                width={100}
                height={50}
              />

              <div className="p-2">
                <h2 className="text-start text-lg font-bold mt-1">{token.tokenName}</h2>
                <p className="text-start text-gray-600 font-bold">Total Supply: {token.totalSupply.toString()}</p>

                <div className="flex gap-3">
                  <p className="text-sm font-bold  text-gray-600 mr-0.5">Owner: </p>
                  <Address address={token.tokenOwner} />
                </div>
                <div className="flex gap-3">
                  <p className="text-sm font-bold  text-gray-600 mr-2">Asset: </p>
                  <Address address={token.tokenAddress} />
                </div>
              </div>
            </Link>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
