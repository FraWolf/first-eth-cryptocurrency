pragma solidity ^0.5.0;

contract WolfToken {

    // Contructor, it runs when the Smart Contract gets deployed
    // Set the total number of tokens
    // Read the total number of tokens

    uint256 public totalSupply;

    constructor () public {

        // Total tokens available
        totalSupply = 1000000; // 1M Tokens

    }

}