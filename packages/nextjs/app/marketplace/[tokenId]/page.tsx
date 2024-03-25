"use client";

import Image from "next/image";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NftsData } from "../NFTToken";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";

const NFTPage = ({ params }: { params: { tokenId: string } }) => {
  const { address: connectedAddress } = useAccount();

  const tokenDetails = NftsData.find(token => token.id.toString() === params.tokenId);

  if (!tokenDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-12 mt-16">
      <div className="bg-base-300 p-6 rounded-lg max-w-md mx-auto mt-6">
        <h2 className="text-lg font-bold mb-2">Your Ethereum Balance</h2>

        <div className="text-sm font-semibold mb-2">
          Address: <Address address={connectedAddress} />
        </div>

        <div className="text-sm font-semibold">
          Balance: <Balance address={connectedAddress} />
        </div>
      </div>{" "}
      <h2>{tokenDetails.name}</h2>
      <div>
        <Image
          className="w-full h-80 object-cover object-center rounded-md mx-auto"
          src={tokenDetails.img}
          alt={tokenDetails.name}
        />
        <p>Total Supply: {tokenDetails.totalSupply}</p>
        <div className="flex gap-3">
          <p>Owner: </p>
          <Address address={tokenDetails.owner} />
        </div>
        <div className="w-[50%] text-center p-1 rounded-sm bg-primary">
          <button className="">Buy</button>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;
