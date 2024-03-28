#  User Flow: Token Creation and NFT Sales



## Token Creation

Alice, an aspiring artist, decides to tokenize her artwork and offer it as an NFT (Non-Fungible Token) for sale. She navigates to the CreatorsFactory contract, where tokens are created and deployed. Alice fills in the required details: Name of the token (e.g., "ArtToken"), Symbol for the token (e.g., "ART"), Initial token URI (Uniform Resource Identifier) containing metadata or information about the artwork.
After confirming the details, Alice initiates the token creation process by interacting with the CreatorsFactory contract. The CreatorsFactory contract deploys a new instance of the CreatorsToken contract, which represents Alice's artwork as an ERC721-compliant NFT.  Alice receives the address of the newly created token contract, enabling her to manage and distribute her NFTs.

## NFT Sales Creation

With her artwork tokenized, Alice proceeds to create a sale for her NFTs. She interacts with the NFTSales contract, which facilitates the sale of NFTs to potential buyers. Alice submits the following details to create the NFT sale: Address of the NFT contract representing her artwork, Price per token, indicating the cost of each NFT.
Upon submission, the NFTSales contract verifies the validity of the NFT contract address provided by Alice. If the contract address is valid, the NFTSales contract records the details of the sale, including the price per token and the total number of tokens available for sale. A unique event is emitted, signaling the creation of the NFT sale and capturing relevant details for transparency.

## Buying NFT

Bob, an art enthusiast, learns about Alice's NFT sale and decides to purchase one of her artworks. He visits the NFTSales contract to explore the available NFTs and their prices. After selecting an NFT he wishes to purchase, Bob submits a transaction to buy the NFT. Bob includes the necessary Ether (ETH) as payment for the NFT, ensuring he covers the price set by Alice. The NFTSales contract receives Bob's transaction and verifies that he has sent the correct amount of Ether. Upon successful verification, the NFTSales contract triggers the transfer of the purchased NFT from Alice's ownership to Bob's ownership. An event is emitted, confirming the successful purchase of the NFT by Bob and capturing relevant transaction details. Bob now owns the NFT, allowing him to showcase and enjoy Alice's artwork in his digital collection.

<!-- ![Marketplace](/packages/nextjs/public/marketplace.png) -->