const WolfToken = artifacts.require("./WolfToken.sol");

module.exports = function(deployer) {
    deployer.deploy(WolfToken);
};
