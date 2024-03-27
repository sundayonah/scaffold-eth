"use client";

import React, { useEffect, useRef, useState } from "react";
import CreatorsNFTs from "../CreatorsNFTs/page";
import CreatorsAbi from "./creatorsToken.json";
import FactoryAbi from "./factory.json";
import pinataSDK from "@pinata/sdk";
import axios from "axios";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useWalletClient } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// import { EtherInput } from "~~/components/scaffold-eth";
// import { AddressInput } from "~~/components/scaffold-eth";

const Page = () => {
  const pinataApiKey = "cdc215686c5dacab48be";
  const pinataSecretApiKey = "54622cbeb84d4a1d9052aee5e49e2d3d9b6589470d0c26b6050e1af1cc138d10";
  const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const factoryContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileImg, setFileImg] = useState(null as File | null);
  const [ipfsImageHash, setIpfsImageHash] = useState("");

  // const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
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
    args: [formData.tokenName, formData.tokenSymbol, ipfsImageHash, BigInt(formData.totalSupply)],
    // value: ethers.utils.parseEther("0.1").toBigInt(),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: tokenCount }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "tokenCount",
    // args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
  });

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  // console.log(`Total counter: ${AllTokens}`);

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
          // Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
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
      formAssets.append("totalSupply", formData.totalSupply);
      console.log(formAssets, "form Assets");

      // Trigger the transaction using the writeAsync function
      // await writeAsync();
      await writeAsync({
        args: [formData.tokenName, formData.tokenSymbol, imageHash, BigInt(formData.totalSupply)],
        // gasLimit: 600000, // Example gas limit
        // gasPrice: ethers.utils.parseUnits("10.0", "gwei").toBigInt(), // Example gas price
      });

      // After successful submission, reset the form fields
      setFormData({
        tokenName: "",
        tokenSymbol: "",
        totalSupply: "",
      });

      //reset the file input stat
      setFileImg(null);
    } catch (error: any) {
      console.error("Error pinning file to IPFS:", error);
    }
  };

  return (
    <div className=" flex items-center flex-col flex-grow pt-10 mt-10">
      <h1>Creators Token</h1>

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
            <label className="text-sm">Asset Total Supply</label>

            <InputBase
              name="totalSupply"
              placeholder="totalSupply"
              value={formData.totalSupply}
              onChange={totalSupply => setFormData(prevState => ({ ...prevState, totalSupply: totalSupply }))}
            />
          </div>
          <div>
            <label className="text-sm">Asset Image</label>
            <input type="file" onChange={handleImagePinToIPFS} />
          </div>
          {/* <div
            className="flex items-center justify-center p-4 mt-2 bg-[#e9fbff] rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={handleDivClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Upload Image</span>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImagePinToIPFS} />
          </div> */}
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
