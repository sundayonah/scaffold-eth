"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import img1 from "../images/img1.webp";
import { useFetchTokenDetails } from "../marketplace/NFTToken";
import NFTSalesAbi from "./creatorsNFTs.json";
import { ethers } from "ethers";
import { stat } from "fs";
import { useAccount } from "wagmi";
// import { useFetchTokenDetails } from "./NFTToken";
import { Address } from "~~/components/scaffold-eth";
import { IntegerInput } from "~~/components/scaffold-eth";
import {
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const Page = () => {
  const { address } = useAccount();
  const [txValue, setTxValue] = useState<string | bigint>("");
  const [loadingStatuses, setLoadingStatuses] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string | bigint>>({});

  // Handler for input value changes
  const handleInputChange = (tokenAddress: string, updatedValue: string | bigint) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [tokenAddress]: updatedValue,
    }));
    console.log(tokenAddress, ethers.parseEther(updatedValue.toString()), "tokenAddress, updatedValue");
  };

  // const statuses: Record<string, boolean> = {};
  const [saleStatuses, setSaleStatuses] = useState<Record<string, boolean>>({});

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  const arrayOfTokens = useFetchTokenDetails(AllTokens);
  // console.log(arrayOfTokens, "arrayOfTokens");

  const tokenAddresses = arrayOfTokens.map(nft => nft.tokenAddress);

  useEffect(() => {
    const fetchSaleStatuses = async () => {
      const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
      const contractInstance = new ethers.Contract("0x2Af315ec9B9F1b493650103b98d699B01e4fa636", NFTSalesAbi, provider);

      const statuses: Record<string, boolean> = {};
      for (const address of tokenAddresses) {
        const ad = "0x3BaeB6C865135c1d613c659f84f8b4345487141D";
        const isOnSale = await contractInstance.nftSales(address);
        if (isOnSale.nftAddress == ethers.ZeroAddress) {
          statuses[address] = false;
        } else {
          statuses[address] = true;
        }

        // console.log(isOnSale.toString());
        // statuses[address] = isOnSale;
      }
      // Use the functional update form of setSaleStatuses to ensure you're working with the most up-to-date state
      setSaleStatuses(prevStatuses => ({
        ...prevStatuses,
        ...statuses,
      }));
    };

    fetchSaleStatuses();
  }, [tokenAddresses]);

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

  useScaffoldEventSubscriber({
    contractName: "NFTSales",
    eventName: "CreateSaleEvent",
    // The listener function is called whenever a GreetingChange event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    listener: logs => {
      logs.map(log => {
        // const {  } = log.args;
        console.log("📡 GreetingChange event", log.args);
      });
    },
  });

  if (!AllTokens) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center mt-24">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (userTokens.length == 0) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex flex-col justify-center items-center mt-24">
        <h1 className="text-center mb-3 font-bold text-2xl">This User has No token</h1>
        <div className="flex justify-end mb-6">
          <Link href="/creators-token" passHref className=" text-center p-1.5 rounded-md bg-primary mt-2">
            Create Token
          </Link>
        </div>
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
      {/* <h1 className="text-center mb-3 font-bold text-2xl">Creators Token</h1> */}
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
                <p className="text-start text-gray-600">Total Supply: {token.totalSupply.toString()}</p>

                <div className={`flex gap-3 ${saleStatuses[token.tokenAddress] ? "mb-10" : ""}`}>
                  <p className="text-sm">Asset: </p>
                  <Address address={token.tokenAddress} />
                </div>
              </div>
              {!saleStatuses[token.tokenAddress] && (
                <IntegerInput
                  value={inputValues[token.tokenAddress] || ""}
                  onChange={updatedValue => handleInputChange(token.tokenAddress, updatedValue)}
                  placeholder="input token price"
                />
              )}
              <button
                onClick={() => {
                  const txValueBigInt = inputValues[token.tokenAddress];

                  // BigInt(inputValues[token.tokenAddress]);
                  writeAsync({ args: [token.tokenAddress, ethers.parseEther(txValueBigInt.toString())] });
                }}
                type="submit"
                className="w-full text-center p-1 rounded-sm bg-primary mt-2"
                disabled={isLoading || isMining}
              >
                {isLoading && saleStatuses[token.tokenAddress] ? (
                  <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
                    <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-black rounded-full"></div>
                  </div>
                ) : (
                  <div>{saleStatuses[token.tokenAddress] ? "on sale" : "Create Sales"}</div>
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
