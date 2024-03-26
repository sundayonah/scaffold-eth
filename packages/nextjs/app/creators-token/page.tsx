"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // const handleDivClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };
  /*
    string calldata _name,
		string calldata _symbol,
		string calldata _initialTokenURI,
		uint256 _totalSupply
  */

  // const { data: CreatorsFactory } = useScaffoldContract({
  //   contractName: "CreatorsFactory",
  // })

  // const deploy = async () => {
  //   await CreatorsFactory?.read.tokenCount();
  // }

  ///////////////////////////

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

  // const { data: deployedContractData } = useDeployedContractInfo("CreatorsFactory");
  // console.log(deployedContractData,'contract details')

  const { data: tokenCount }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "tokenCount",
    // args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
  });

  console.log(`Total counter: ${tokenCount}`);

  const { data: AllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  console.log(`Total counter: ${AllTokens}`);

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
        args: [formData.tokenName, formData.tokenSymbol, ipfsImageHash, BigInt(formData.totalSupply)],
        // gasLimit: 600000, // Example gas limit
        // gasPrice: ethers.utils.parseUnits("10.0", "gwei").toBigInt(), // Example gas price
      });

      // if (typeof window.ethereum !== "undefined") {
      //   const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      //   const signer = provider.getSigner();
      //   const contractInstance = new ethers.Contract(factoryContractAddress, FactoryAbi.abi, signer);

      //   const createToken = await contractInstance.deployToken(
      //     formData.tokenName,
      //     formData.tokenSymbol,
      //     imageHash,
      //     formData.totalSupply,
      //     {
      //       gasLimit: 600000,
      //       gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      //     },
      //   );
      //   // Wait for the transaction to be mined
      //   const receipt = await createToken.wait();
      //   console.log("Token deployed successfully:", receipt);
      // } else {
      //   console.error("Ethereum provider not found. Please ensure you are using a browser with Ethereum support.");
      // }
      //////////////////////////\/\/////////////////////////////////\/\
    } catch (error: any) {
      console.error("Error pinning file to IPFS:", error);
    }
  };

  // useEffect(() => {
  //   const TokensCount = async () => {
  //     // if (typeof window.ethereum !== "undefined") {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  //     const contractInstance = new ethers.Contract(factoryContractAddress, FactoryAbi.abi, provider);
  //     const tokenCount = await contractInstance.tokenCount();
  //     const tokens = await contractInstance.tokens(0);
  //     console.log(tokenCount.toString(), "tokenCount");
  //     console.log(tokens);
  //   };
  //   // };
  //   TokensCount();
  // }, []);

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
            {isLoading ? "Loading..." : "Create"}
          </button>
        </form>
      </div>
      <div>
        <button className="btn btn-primary" onClick={() => writeAsync()}>
          Send TX
        </button>
      </div>
    </div>
  );
};

export default Page;

/*

Deploying CreatorsToken contract with the deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
//////////////CREATORS TOKE/////////////////////
deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
////////////////FACTORY///////////////////
deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

const ethers = require('ethers');
const axios = require('axios');

// Function to upload image to IPFS and interact with smart contract
async function uploadImageAndInteractWithContract(file, tokenName, tokenSymbol, totalSupply, tokenAddress) {
 // Step 1: Upload image to IPFS using Pinata
 const pinataApiKey = 'YOUR_PINATA_API_KEY';
 const pinataSecretApiKey = 'YOUR_PINATA_SECRET_API_KEY';
 const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

 const formData = new FormData();
 formData.append('file', file);

 const pinataResponse = await axios.post(pinataUrl, formData, {
    maxContentLength: Infinity, // This is needed to prevent axios from erroring out with large files
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
 });

 const ipfsHash = pinataResponse.data.IpfsHash;

 // Step 2: Interact with smart contract
 const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_PROVIDER_URL');
 const signer = provider.getSigner();
 const contractAddress = 'YOUR_CONTRACT_ADDRESS';
 const contractABI = [
    // Your contract ABI here
 ];

 const contract = new ethers.Contract(contractAddress, contractABI, signer);

 // Assuming your smart contract has a function named `createToken` that accepts the IPFS hash and other details
 const tx = await contract.createToken(ipfsHash, tokenName, tokenSymbol, totalSupply, tokenAddress);
 await tx.wait(); // Wait for the transaction to be mined

 console.log('Transaction successful');
}

// Example usage
// uploadImageAndInteractWithContract(file, "TokenName", "TKN", 1000, "0xYourTokenAddress");


*/
/*
const ethers = require('ethers');
const axios = require('axios');

// Function to upload image to IPFS and interact with smart contract
async function uploadImageAndInteractWithContract(file, tokenName, tokenSymbol, totalSupply, tokenAddress) {
 // Step 1: Upload image to IPFS using Pinata
 const pinataApiKey = 'cdc215686c5dacab48be';
 const pinataSecretApiKey = '54622cbeb84d4a1d9052aee5e49e2d3d9b6589470d0c26b6050e1af1cc138d10';
 const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

 const formData = new FormData();
 formData.append('file', file);

 const pinataResponse = await axios.post(pinataUrl, formData, {
    maxContentLength: Infinity,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
 });

 const ipfsHash = pinataResponse.data.IpfsHash;

 // Step 2: Prepare the token URI with the IPFS hash
 const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;

 // Step 3: Interact with smart contract
 const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_PROVIDER_URL');
 const signer = provider.getSigner();
 const contractAddress = '0x5e17b14ADd6c386305A32928F985b29bbA34Eff5';


 const contract = new ethers.Contract(contractAddress, contractABI, signer);

 // Call the mintNFT function with the tokenURI including the IPFS hash
 const tx = await contract.mintNFT(tokenAddress, tokenURI);
 await tx.wait(); // Wait for the transaction to be mined

 console.log('Transaction successful');
}

// Example usage
// uploadImageAndInteractWithContract(file, "TokenName", "TKN", 1000, "0xYourTokenAddress");

*/
