import { useEffect, useState } from "react";
import CreatorsTokenAbi from "./creatorsToken.json";
import { ethers } from "ethers";
import {
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

// Adjust the import path as necessary
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

  //////////////////////////////////////////
  // const { data: getAllTokens }: any = useScaffoldContractRead({
  //   contractName: "CreatorsFactory",
  //   functionName: "getAllTokens",
  //   // args: [BigInt(0)]
  // });

  // useScaffoldEventSubscriber({
  //   contractName: "CreatorsFactory",
  //   eventName: "TokenDeployed",
  //   // The listener function is called whenever a GreetingChange event is emitted by the contract.
  //   // Parameters emitted by the event can be destructed using the below example
  //   // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
  //   listener: logs => {
  //     logs.map(log => {
  //       // const {  } = log.args;
  //       console.log("📡 GreetingChange event", log.args);
  //     });
  //   },
  // });

  useEffect(() => {
    const fetchTokenDetails = async () => {
      const provider = new ethers.JsonRpcProvider("https://polygon-mumbai-bor-rpc.publicnode.com");
      // console.log("Fetching token details...");

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
      // console.log(allTokenDetails, "allTokenDetails");
      setTokenMetaData(allTokenDetails);
    };

    if (AllTokens) {
      fetchTokenDetails();
    }
  }, [AllTokens]);

  return tokenMetaData;
};
