const WolfToken = artifacts.require("./WolfToken.sol");
const WolfTokenSale = artifacts.require("./WolfTokenSale.sol");

const tokenPrice = 1000000000000000; // 0.001 Ether

module.exports = function(deployer) {
    
    // Arguments will be passed into the constructor
    deployer.deploy(WolfToken, 1000000)
    .then(function() {

        // Deploy the Token Sale contract
        return deployer.deploy(WolfTokenSale, WolfToken.address, tokenPrice);
        
    })

};
