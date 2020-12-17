const WolfToken = artifacts.require("./WolfToken.sol");

module.exports = function(deployer) {
    
    // Arguments will be passed into the constructor
    deployer.deploy(WolfToken, 1000000);
};
