pragma solidity ^0.5.0;

import "./WolfToken.sol";

contract WolfTokenSale {

    // Define the admin address (not public to now show)
    address admin;

    // Variable that refer to our token
    WolfToken public tokenContract;

    // Token price state
    uint256 public tokenPrice;

    // Tokens sold
    uint256 public tokensSold;

    // This contract
    address thisContract = address(this); // Indicate this Smart Contract

    // Events
    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor (WolfToken _tokenContract, uint256 _tokenPrice) public {

        // Declare admin
        admin = msg.sender;

        // Token contract
        tokenContract = _tokenContract;

        // Token price (in WEI)
        tokenPrice = _tokenPrice;
    }

    // multiply function
    // internal: can be call internally on the contract only
    // pure: it says that it's only to calculate, not interaction with blockchain
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // Buy tokens function
    // public: because we want to call it out from blockchain
    // payable: because we want someone to send ether in this transaction
    function buyTokens(uint256 _numberOfTokens) public payable {

        // Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        require(tokenContract.balanceOf(thisContract) >= _numberOfTokens);

        // Require that transfer is successful

        // Keep track of number of tokens sold
        tokensSold += _numberOfTokens;

        // Trigger Sell Event
        emit Sell(msg.sender, _numberOfTokens);

    }

}

/*

WEI is the smallest unit in ETH
----
We give the 75% of the tokens available to the Token Sale address because
the token sale can sell it to persons

*/