"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CreatorsNFTs from "../CreatorsNFTs/page";
import pinataSDK from "@pinata/sdk";
import axios from "axios";
import { InputBase } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const Page = () => {
  //   const process.env.NEXT_PUBLIC_PINATA_API_KEY = "cdc215686c5dacab48be";
  //   const pinataSecretApiKey = "54622cbeb84d4a1d9052aee5e49e2d3d9b6589470d0c26b6050e1af1cc138d10";
  //   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  //   const factoryContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileImg, setFileImg] = useState(null as File | null);
  const [ipfsImageHash, setIpfsImageHash] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);

  useScaffoldEventSubscriber({
    contractName: "CreatorsFactory",
    eventName: "TokenDeployed",
    listener: logs => {
      logs.map(log => {
        const { tokenAddress } = log.args;
        console.log(tokenAddress, "tokenAddress");
        if (tokenAddress) {
          setTokens(prevTokens => [...prevTokens, tokenAddress]);
        }
      });
    },
  });

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
  });

  const handleImagePinToIPFS = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileImg(e.target.files[0]);
    }
    console.log(e.target.files);
  };

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "CreatorsFactory",
    functionName: "deployToken",
    args: [formData.tokenName, formData.tokenSymbol, ipfsImageHash],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      // console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: tokenCount }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "tokenCount",
  });

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    /////////// IMAGE PIN TO IPFS//////////////////
    const imageForm = new FormData();
    if (fileImg) {
      imageForm.append("file", fileImg);
    }

    ////////////////////////\/\/////////////////////////////////\/\

    try {
      const pinataResponse = await axios.post(pinataUrl, imageForm, {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        },
      });

      console.log(pinataResponse, "pinata response");

      const imageHash = pinataResponse.data.IpfsHash;
      console.log(imageHash, "image");
      setIpfsImageHash(imageHash);

      console.log("File pinned successfully:", imageHash);

      /////////// ASSETS TO SMART CONTRACT//////////////////
      const formAssets = new FormData();

      formAssets.append("tokenName", formData.tokenName);
      formAssets.append("tokenSymbol", formData.tokenSymbol);
      console.log(formAssets, "form Assets");

      // Trigger the transaction using the writeAsync function
      await writeAsync({
        args: [formData.tokenName, formData.tokenSymbol, imageHash],
      });

      // After successful submission, reset the form fields
      setFormData({
        tokenName: "",
        tokenSymbol: "",
      });

      //reset the file input stat
      setFileImg(null);

      // navigate to the creatorsNFTs page
      router.push("/");
    } catch (error: any) {
      console.error("Error pinning file to IPFS:", error);
    }
  };

  return (
    <div className=" flex items-center flex-col flex-grow pt-10 mt-10">
      <h1>Create Token</h1>
      <ul>
        {tokens.map((tokenAddress, index) => (
          <>
            hello
            <li key={index}>{tokenAddress}</li>
          </>
        ))}
      </ul>

      <div className="container max-w-[40%]  mx-auto rounded-md shadow-md hover:shadow-lg p-4 space-y-3">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-sm">Asset Name</label>
            <InputBase
              name="tokenName"
              placeholder="token name"
              value={formData.tokenName}
              onChange={name => setFormData(prevState => ({ ...prevState, tokenName: name }))}
            />
          </div>
          <div>
            <label className="text-sm">Asset Symbol</label>
            <InputBase
              name="tokenSymbol"
              placeholder="symbol"
              value={formData.tokenSymbol}
              onChange={symbol => setFormData(prevState => ({ ...prevState, tokenSymbol: symbol }))}
            />
          </div>
          <div>
            <label className="text-sm">Asset Image</label>
            <input type="file" onChange={handleImagePinToIPFS} />
          </div>
          <button
            type="submit"
            className="w-full text-center p-1 rounded-sm bg-primary mt-2"
            disabled={isLoading || isMining}
          >
            {isLoading ? (
              <div className="max-w-5xl mx-auto my-auto flex justify-center items-center">
                <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-black rounded-full"></div>
              </div>
            ) : (
              "Create Token"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
