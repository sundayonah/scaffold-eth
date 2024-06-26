import { useEffect, useState } from "react";
import CreatorsTokenAbi from "./creatorsToken.json";
import { ethers } from "ethers";
import {
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

// interface for TokenDetails
interface TokenDetail {
  tokenName: string;
  tokenSymbol: string;
  tokenURL: string;
  tokenOwner: string;
  tokenAddress: string;
  totalSupply: string;
}

// Custom hook to fetch token details
export const useFetchTokenDetails = (AllTokens: any) => {
  const [tokenMetaData, setTokenMetaData] = useState<TokenDetail[]>([]);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");

      const tokenPromises = AllTokens?.map(async (tokenAddress: string) => {
        const contractInstance = new ethers.Contract(tokenAddress, CreatorsTokenAbi, provider);
        const tokenName = await contractInstance.name();
        const tokenSymbol = await contractInstance.symbol();
        const tokenOwner = await contractInstance.owner();
        const tokenURL = await contractInstance.baseURI();
        const totalSupply = await contractInstance.totalSupply();

        return { tokenName, tokenOwner, tokenSymbol, tokenURL, tokenAddress, totalSupply };
      });

      const allTokenDetails = await Promise.all(tokenPromises);
      setTokenMetaData(allTokenDetails);
    };

    if (AllTokens) {
      fetchTokenDetails();
    }
  }, [AllTokens]);

  return tokenMetaData;
};
