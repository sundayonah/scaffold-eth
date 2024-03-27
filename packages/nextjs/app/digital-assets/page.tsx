"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NFTSalesAbi from "../CreatorsNFTs/creatorsNFTs.json";
import CreatorsTokenAbi from "../marketplace/creatorsToken.json";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Page = () => {
  const { address } = useAccount();
  const [tokenMetaData, setTokenMetatoken] = useState<any[]>([]);

  // console.log(address);

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "NFTSales",
    eventName: "BuyNFTEvent",
    fromBlock: 31231n,
    watch: true,
    filters: { premium: true },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });
  // create an array and filter events then check if connected address is buyer, push into the array and display
  const userEvents = events?.filter(event => event.args.buyer === address);
  // map the event to display just the token address
  const userTokens = userEvents?.map(event => event.args.nftAddress);
  const tokenDetails = userTokens?.map(async (tokenAddress: any) => {
    const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
    const contractInstance = new ethers.Contract(tokenAddress, CreatorsTokenAbi, provider);
    const saleContractInstance = new ethers.Contract(
      "0x2Af315ec9B9F1b493650103b98d699B01e4fa636",
      NFTSalesAbi,
      provider,
    );
    const tokenName = await contractInstance.name();
    const tokenSymbol = await contractInstance.symbol();
    const tokenOwner = await contractInstance.owner();
    const tokenURL = await contractInstance.baseURI();
    const isOnSale = await saleContractInstance.nftSales(tokenAddress);

    const amount = isOnSale[1];
    // console.log({ tokenName, tokenSymbol, tokenOwner, tokenURL, amount });

    return { tokenAddress, tokenName, tokenSymbol, tokenOwner, tokenURL, amount };
  });

  // Use Promise.all to wait for all promises to resolve
  Promise.all(tokenDetails)
    .then(resolvedTokenDetails => {
      setTokenMetatoken(resolvedTokenDetails);
      // console.log(resolvedTokenDetails);
    })
    .catch(error => {
      console.error("Error fetching token details:", error);
    });

  // console.log(tokenDetails);

  if (tokenDetails?.length == 0) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 mt-24">
      <h1 className="text-center mb-3 font-bold text-2xl">User Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {tokenMetaData.map((token, index) => (
          <div
            key={token.tokenName}
            className="bg-[#e9fbff] shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
          >
            {/* <Link href={`/marketplace/${token.tokenURL}`} passHref> */}
            <Image
              className="w-full h-32 object-cover object-center rounded-md mx-auto"
              src={`https://ipfs.io/ipfs/${token.tokenURL}`}
              alt={token.tokenName}
              width={100}
              height={50}
            />

            <div className="p-2">
              <h2 className="text-start text-lg font-bold mt-1">{token.tokenName}</h2>
              <p className="text-start text-gray-600 font-bold">Total Supply: {token.totalSupply}</p>

              <div className="flex gap-5">
                <p className="text-sm font-bold">Owner: </p>
                <Address address={token.tokenOwner} />
              </div>
              <div className="flex gap-6">
                <p className="text-sm font-bold">Asset: </p>
                <Address address={token.tokenAddress} />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold">Amount: </p>
                {ethers.formatEther(token.amount.toString())} ETH
              </div>
            </div>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
