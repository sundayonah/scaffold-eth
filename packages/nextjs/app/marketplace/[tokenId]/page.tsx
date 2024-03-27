"use client";

import { useState } from "react";
import Image from "next/image";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFetchTokenDetails } from "../NFTToken";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const NFTPage = ({ params }: { params: { tokenId: string } }) => {
  const { address: connectedAddress } = useAccount();
  const [errorMessage, setErrorMessage] = useState("");

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  const arrayOfTokens = useFetchTokenDetails(AllTokens);

  const tokenDetails = arrayOfTokens.find(token => token.tokenURL.toString() === params.tokenId);
  // console.log(tokenDetails, "arrayOfTokens");

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "NFTSales",
    functionName: "buyNFT",
    args: [tokenDetails?.tokenAddress],
    value: ethers.parseEther("0.0001"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleBuyNFT = async () => {
    try {
      await writeAsync();
    } catch (error: any) {
      if (error.message.includes("NFT sale does not exist")) {
        setErrorMessage("NFT sale does not exist. Please check the NFT address.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("An error occurred while buying the NFT.");
      }
    }
  };

  if (!tokenDetails) {
    return (
      <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
        <div className="animate-spin h-24 w-24 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 mt-16">
      <h2 className="font-bold text-2xl">{tokenDetails.tokenName}</h2>
      <div>
        <Image
          className="w-full h-80 object-cover object-center rounded-md mx-auto"
          src={`https://ipfs.io/ipfs/${tokenDetails.tokenURL}`}
          alt={tokenDetails.tokenName}
          width={100}
          height={50}
        />

        <p className="text-sm font-semibold gap-5">Total Supply: {tokenDetails.totalSupply.toString()}</p>
        <div className="flex items-center text-sm font-semibold gap-5">
          Owner: <Address address={tokenDetails.tokenOwner} />
        </div>
        <div className="flex items-center text-sm font-semibold gap-5">
          Asset: <Address address={tokenDetails.tokenAddress} />
        </div>
        <div className="flex items-center text-sm font-semibold">
          Balance: <Balance address={connectedAddress} />
        </div>

        <button
          onClick={() => {
            console.log("Yoou have clicked me", tokenDetails.tokenName);
            // writeAsync();
            handleBuyNFT();
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
            "Buy NFT"
          )}
        </button>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default NFTPage;
