import { useEffect, useState } from "react";
import CreatorsTokenAbi from "./creatorsToken.json";
import { ethers } from "ethers";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// Adjust the import path as necessary
interface TokenDetail {
  tokenName: string;
  tokenSymbol: string;
  tokenURL: string;
  tokenOwner: string;
  tokenAddress: string;
}

// Custom hook to fetch token details
export const useFetchTokenDetails = (AllTokens: any) => {
  const [tokenMetaData, setTokenMetaData] = useState<TokenDetail[]>([]);

  //////////////////////////////////////////
  const { data: getAllTokens }: any = useScaffoldContractRead({
    contractName: "CreatorsFactory",
    functionName: "getAllTokens",
    // args: [BigInt(0)]
  });

  // console.log(`Total counter: ${getAllTokens}`);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
      // console.log("Fetching token details...");

      const tokenPromises = AllTokens?.map(async (tokenAddress: string) => {
        const contractInstance = new ethers.Contract(tokenAddress, CreatorsTokenAbi, provider);
        const tokenName = await contractInstance.name();
        const tokenSymbol = await contractInstance.symbol();
        const tokenOwner = await contractInstance.owner();
        const tokenURL = await contractInstance.baseURI();

        return { tokenName, tokenOwner, tokenSymbol, tokenURL, tokenAddress };
      });

      const allTokenDetails = await Promise.all(tokenPromises);
      // console.log(allTokenDetails, "allTokenDetails");
      setTokenMetaData(allTokenDetails);
    };

    if (AllTokens) {
      fetchTokenDetails();
    }
  }, [AllTokens]);

  return tokenMetaData;
};
