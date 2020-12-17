pragma solidity ^0.5.0;

contract WolfToken {
    
    //-----------------
    // Token informations
    //-----------------
    
    string public name      = "Wolf Token";
    string public symbol    = "WOLF";
    string public version   = "1.0";

    uint256 public totalSupply;

    // Array for user's balances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance; // Nested mapping
    // Account 0 approves account 1 to spend 100 tokens

    //-----------------
    // Events
    //-----------------

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //-----------------
    // Constructor
    //-----------------

    constructor (uint256 _initialSupply) public {

        // Assign the initial supply to the Token Owner
        balanceOf[msg.sender] = _initialSupply;

        // Total tokens available
        totalSupply = _initialSupply;

    }

    //-----------------
    // Functions
    //-----------------

    // Transfer function (to pay with it)
    function transfer(address _to, uint256 _value) public returns (bool success) {

        // Check if the address has enough token to transfer
        require(balanceOf[msg.sender] >= _value);

        // Remove tokens from the sender
        balanceOf[msg.sender] -= _value;

        // Add tokens to the receiver
        balanceOf[_to] += _value;

        // Emitting the transfer event
        emit Transfer(msg.sender, _to, _value);

        // Return a boolean
        return true;

    }

    // Transfer from
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

        //

    }

    // Approving transactions
    function approve(address _spender, uint256 _value) public returns (bool success) {

        // Allowance
        allowance[msg.sender][_spender] = _value;

        // Approval event
        emit Approval(msg.sender, _spender, _value);

        // Returns
        return true;

    }

    // transferForm

}

// require is an sort of if statement