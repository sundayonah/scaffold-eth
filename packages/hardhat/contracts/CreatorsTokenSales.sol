// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CreatorsToken.sol";

interface IFactory {
	function isToken(address _token) external view returns (bool);

	function tokenAdresses(uint256 _index) external view returns (address);

	function tokens(uint256 _index) external view returns (address);
}

interface ICreatorsToken {
	function safeMint(address _to) external;
}

contract NFTSales {
	address public factory;
	mapping(address => Sale) public nftSales;

	struct Sale {
		address nftAddress;
		uint256 pricePerToken;
		uint256 amountSold;
	}

	event CreateSaleEvent(
		address indexed creator,
		address indexed nftAddress,
		uint256 tokensForSale
	);
	event BuyNFTEvent(address indexed buyer, address indexed nftAddress);

	// constructor(address _factory) {
	// 	factory = _factory;
	// }

	function createSale(address _nftAddress, uint256 _pricePerToken) external {
		require(
			nftSales[_nftAddress].nftAddress == address(0),
			"NFT sale already exists"
		);
		// require(IFactory(factory).isToken(_nftAddress), "Invalid NFT address");

		nftSales[_nftAddress] = Sale({
			nftAddress: _nftAddress,
			pricePerToken: _pricePerToken,
			amountSold: 0
		});
		emit CreateSaleEvent(msg.sender, _nftAddress, _pricePerToken);
	}

	function buyNFT(address _nftAddress) external payable {
		Sale storage sale = nftSales[_nftAddress];
		require(sale.nftAddress != address(0), "NFT sale does not exist");
		require(msg.value > 0, "Insufficient funds sent");

		// Transfer NFT to buyer
		CreatorsToken nft = CreatorsToken(_nftAddress);
		nft.safeMint(msg.sender);

		// Update sale info
		sale.amountSold += sale.pricePerToken;

		emit BuyNFTEvent(msg.sender, _nftAddress);
	}

	function deploy() public returns (bool) {
		
	}
}
