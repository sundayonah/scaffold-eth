"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NftsData } from "./NFTToken";
import { Address } from "~~/components/scaffold-eth";

// import { EtherInput } from "~~/components/scaffold-eth";
/*
#c8f5ff
#e9fbff
*/
const Page = () => {
  return (
    <div className="container mx-auto px-12 mt-16">
      <h1 className="text-center mb-3">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {NftsData.map((token, index) => (
          <div
            key={token.id}
            className="bg-[#e9fbff] shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
          >
            <Link href={`/marketplace/${token.id}`} passHref>
              <Image
                className="w-full h-32 object-cover object-center rounded-md mx-auto"
                src={token.img}
                alt={token.name}
              />
              <div className="absolute bottom-32 left-2 text-gray-200 bg-white bg-opacity-50 p-2 rounded-bl-md shadow-xl">
                #{index + 1}
              </div>
              <div className="p-2">
                <h2 className="text-start text-lg font-bold mt-1">{token.name}</h2>
                <p className="text-start text-gray-600">Total Supply: {token.totalSupply}</p>
                {/* <EtherInput value={token.} onChange={amount => setEthAmount(amount)} />; */}

                <div className="flex gap-3">
                  <p className="text-sm">Owner: </p>
                  <Address address={token.owner} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
