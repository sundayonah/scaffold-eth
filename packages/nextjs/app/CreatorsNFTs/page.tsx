"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import img1 from "../images/img1.webp";
import { useFetchTokenDetails } from "../marketplace/NFTToken";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
// import { useFetchTokenDetails } from "./NFTToken";
import { Address } from "~~/components/scaffold-eth";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Page = () => {
  const { address } = useAccount();
  const [txValue, setTxValue] = useState<string | bigint>("");

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  //   console.log(object);

  const arrayOfTokens = useFetchTokenDetails(AllTokens);
  //   console.log(arrayOfTokens);

  const tokenAddresses: string[] = arrayOfTokens.map(nft => nft.tokenAddress);
  console.log(tokenAddresses);

  const { data: nfts }: any = useScaffoldContractRead({
    contractName: "NFTSales",
    functionName: "nftSales",
    args: [""],
  });
  console.log(nfts);

  //  console.log(nfts);
  //  console.log(txValue);

  // Filter tokens to display only those owned by the connected address
  const userTokens = arrayOfTokens.filter(token => token.tokenOwner === address);

  //   const txValueBigInt = typeof txValue === "bigint" ? txValue : BigInt(txValue);

  // console.log(userTokens);
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "NFTSales",
    functionName: "createSale",
    // args: [userTokens?.tokenAddress, txValueBigInt],
    args: [undefined, undefined],
    // value: ethers.parseEther("0.1"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  if (!AllTokens) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 mt-12">
      <div className="flex justify-end mb-6">
        <Link href="/creators-token" passHref className=" text-center p-1.5 rounded-md bg-primary mt-2">
          Create New Token
        </Link>
      </div>
      <h1 className="text-center mb-3 font-bold text-2xl">Creators Token</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {userTokens.map(token => (
          <>
            <div
              key={token.tokenName}
              className="bg-[#e9fbff] shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
            >
              <Image
                className="w-full h-32 object-cover object-center rounded-md mx-auto"
                src={`https://ipfs.io/ipfs/${token.tokenURL}`}
                alt={token.tokenName}
                width={100}
                height={50}
              />
              <div className="absolute bottom-32 left-2 text-gray-200 bg-white bg-opacity-50 p-2 rounded-bl-md shadow-xl">
                {/* <span className="text-gray-500">#{index + 1}</span> */}
              </div>
              <div className="p-2">
                <h2 className="text-start text-lg font-bold mt-1">{token.tokenName}</h2>
                <p className="text-start text-gray-600">Total Supply: {token.totalSupply}</p>

                <div className="flex gap-3">
                  <p className="text-sm">Owner: </p>
                  <Address address={token.tokenOwner} />
                </div>
              </div>
              <IntegerInput
                value={txValue}
                onChange={updatedTxValue => {
                  setTxValue(updatedTxValue);
                }}
                placeholder="input token price"
              />
              <button
                onClick={() => {
                  const txValueBigInt = typeof txValue === "bigint" ? txValue : BigInt(txValue);
                  writeAsync({ args: [token.tokenAddress, txValueBigInt] });
                }}
                type="submit"
                className="w-full text-center p-1 rounded-sm bg-primary mt-2"
                disabled={isLoading || isMining}
              >
                {isLoading ? (
                  <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
                    <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-black rounded-full"></div>
                  </div>
                ) : (
                  "Create Sale"
                )}
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Page;
