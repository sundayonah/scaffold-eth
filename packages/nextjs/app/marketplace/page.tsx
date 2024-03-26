"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NftsData } from "./NFTToken";
import CreatorsTokenAbi from "./creatorsToken.json";
import { ethers } from "ethers";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// import { EtherInput } from "~~/components/scaffold-eth";
/*
#c8f5ff
#e9fbff
*/
const Page = () => {
  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "CreatorsFactory",
  //   functionName: "deployToken",
  //   args: [formData.tokenName, formData.tokenSymbol, ipfsImageHash, BigInt(formData.totalSupply)],
  //   // value: ethers.utils.parseEther("0.1").toBigInt(),
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  console.log("Total counter:,", AllTokens);

  // const { data: tokenDetails } = useScaffoldContractRead({
  //   contractName: "CreatorsToken",
  //   functionName: "name",
  //   args: [AllTokens[0]],
  // });

  // console.log(tokenDetails, "tokenDetails");

  useEffect(() => {
    const tokenDetails = async () => {
      // if (typeof window.ethereum !== "undefined") {
      // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      console.log("222222222");
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
      const contractInstance = new ethers.Contract(AllTokens[0].toString(), CreatorsTokenAbi, provider);

      console.log(contractInstance);

      const getToken = await contractInstance.name();
      console.log(getToken);
    };
    tokenDetails();
  }, [AllTokens]);
  console.log("1111111111");

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
