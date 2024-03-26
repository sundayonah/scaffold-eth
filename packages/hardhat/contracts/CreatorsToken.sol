// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorsToken is ERC721, ERC721URIStorage, Ownable {
	uint256 private _nextTokenId;
	address public factory;
	address public tokenSalesContract;
	string public baseURI;

	constructor(
		string memory name,
		string memory symbol,
		string memory initialTokenURI,
		uint256 totalSupply,
		address initialOwner,
		address _tokeSalesContract
	) ERC721(name, symbol) Ownable(initialOwner) {
		_mint(initialOwner, totalSupply);
		baseURI = initialTokenURI;
		factory = msg.sender;
		tokenSalesContract = _tokeSalesContract;
	}

	function safeMint(address to) external {
		require(msg.sender == tokenSalesContract, "Only Sale can mint");
		uint256 tokenId = _nextTokenId++;
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, baseURI);
	}

	// The following functions are overrides required by Solidity.

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function _baseURI() internal view override(ERC721) returns (string memory) {
		return baseURI;
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721URIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
