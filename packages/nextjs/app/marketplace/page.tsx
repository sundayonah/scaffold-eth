"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetchTokenDetails } from "./NFTToken";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Page = () => {
  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "CreatorsFactory",
  //   functionName: "deployToken",
  //   args: [formData.tokenName, formData.tokenSymbol, ipfsImageHash, BigInt(formData.totalSupply.toString())],
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

  const arrayOfTokens = useFetchTokenDetails(AllTokens);

  // console.log(arrayOfTokens);

  // console.log("Total counter:,", AllTokens);

  // const { data: tokenDetails } = useScaffoldContractRead({
  //   contractName: "CreatorsToken",
  //   functionName: "name",
  //   args: [AllTokens[0]],
  // });

  // console.log(tokenDetails, "tokenDetails");

  // useEffect(() => {
  //   const tokenDetails = async () => {
  //     const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
  //     console.log("eyeyeyeyeyeyeyeyyeyeyey");
  //     const tokenPromises = AllTokens.map(async (tokenAddress: string) => {
  //       const contractInstance = new ethers.Contract(tokenAddress, CreatorsTokenAbi, provider);
  //       const tokenName = await contractInstance.name();
  //       const tokenSymbol = await contractInstance.symbol();
  //       const tokenOwner = await contractInstance.owner();
  //       // const tokensupply = await contractInstance.totalSupply.toString()();
  //       const tokenURL = await contractInstance.baseURI();
  //       console.log(tokenName, "token name");
  //       console.log(tokenSymbol);
  //       console.log(tokenOwner);
  //       console.log(tokenURL);
  //       console.log({ tokenName, tokenSymbol, tokenOwner, tokenURL }, "TOKEN DETAILS");
  //       const tokenMetaData = { tokenName, tokenSymbol, tokenURL };
  //       setTokenMetaData(tokenMetaData);
  //       console.log(tokenMetaData);

  //       return { tokenName, tokenSymbol, tokenURL };
  //     });
  //     const tokenDetails = await Promise.all(tokenPromises);
  //     console.log(tokenDetails);
  //   };
  //   tokenDetails();
  // }, [AllTokens]);
  // console.log("1111111111");

  // useEffect(() => {
  //   const tokenDetails = async () => {
  //     const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
  //     console.log("Fetching token details...");

  //     // Map over AllTokens to fetch details for each token
  //     const tokenPromises = AllTokens?.map(async (tokenAddress: string) => {
  //       const contractInstance = new ethers.Contract(tokenAddress, CreatorsTokenAbi, provider);

  //       // console.log(contractInstance, "contractInstance");
  //       const tokenName = await contractInstance.name();
  //       const tokenSymbol = await contractInstance.symbol();
  //       const tokenOwner = await contractInstance.owner();
  //       const tokenURL = await contractInstance.baseURI();
  //       // console.log({ tokenOwner }, "TOKEN DETAILS");

  //       // Return an object for each token detail
  //       return { tokenName, tokenOwner, tokenSymbol, tokenURL };
  //     });

  //     // Wait for all promises to resolve
  //     const allTokenDetails = await Promise.all(tokenPromises);
  //     // console.log(allTokenDetails);

  //     // Set the accumulated token details to the state
  //     setTokenMetaData(allTokenDetails);
  //   };

  //   tokenDetails();
  // }, [AllTokens]);

  // console.log(AllTokens.length, "AllTokens");

  if (!AllTokens) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 mt-24">
      <h1 className="text-center mb-3 font-bold text-2xl">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {arrayOfTokens.map((token, index) => (
          <div
            key={token.tokenName}
            className="bg-[#e9fbff] shadow-md hover:shadow-lg rounded p-1 transition-all duration-500 transform hover:translate-y-[-5px]"
          >
            <Link href={`/marketplace/${token.tokenURL}`} passHref>
              <Image
                className="w-full h-32 object-cover object-center rounded-md mx-auto"
                src={`https://ipfs.io/ipfs/${token.tokenURL}`}
                alt={token.tokenName}
                width={100}
                height={50}
              />
              {/* <div className="absolute bottom-32 left-2 text-gray-200 bg-white bg-opacity-50 p-2 rounded-bl-md shadow-xl">
                <span className="text-gray-500">#{index + 1}</span>
              </div> */}
              <div className="p-2">
                <h2 className="text-start text-lg font-bold mt-1">{token.tokenName}</h2>
                <p className="text-start text-gray-600 font-bold">Total Supply: {token.totalSupply.toString()}</p>

                <div className="flex gap-3">
                  <p className="text-sm font-bold">Owner: </p>
                  <Address address={token.tokenOwner} />
                </div>
                <div className="flex gap-3">
                  <p className="text-sm font-bold">Asset: </p>
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
