// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CreatorsToken.sol";

contract CreatorsFactory {
	address[] public tokens;
	uint256 public tokenCount;
	mapping(uint256 => address) public tokenAdresses;
	mapping(address => bool) public isToken;
	address public salesContract;

	event TokenDeployed(address tokenAddress);

	constructor(address _salesContract) {
		salesContract = _salesContract;
	}

	function deployToken(
		string calldata _name,
		string calldata _symbol,
		string calldata _initialTokenURI,
		uint256 _totalSupply
	) public returns (address) {
		CreatorsToken token = new CreatorsToken(
			_name,
			_symbol,
			_initialTokenURI,
			_totalSupply,
			msg.sender,
			salesContract
		);
		tokenAdresses[tokenCount] = address(token);
		isToken[address(token)] = true;
		tokens.push(address(token));
		tokenCount += 1;
		emit TokenDeployed(address(token));
		return address(token);
	}

	function getAllTokens() public view returns (address[] memory) {
        return tokens;
	}
}
