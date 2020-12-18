var WolfToken = artifacts.require("./WolfToken.sol");
var WolfTokenSale = artifacts.require("./WolfTokenSale.sol");

const initialTokens = 1000000;

contract('WolfTokenSale', function(accounts) {

    var tokenInstance;
    var tokenSaleInstance;
    var numberOfTokens;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;
    var tokenPrice = 1000000000000000; // in WEI

    it('initializes the contracts with the correct values', function() {
        return WolfTokenSale.deployed()
        .then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        })
        .then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        })
        .then(function(address) {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        })
        .then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        })
    });

    it('facilitates token buying', function() {
        return WolfToken.deployed()
        .then(function(instance) {

            // Grab token instance first
            tokenInstance = instance;
            return WolfTokenSale.deployed();
        })
        .then(function(instance) {

            // Then grab token sale instance
            tokenSaleInstance = instance;

            // Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
        })
        .then(function(receipt) {

            numberOfTokens = 10;
            var value = numberOfTokens * tokenPrice;

            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value });
        })
        .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account the tokens are bought from');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the tokens amount');
            return tokenSaleInstance.tokensSold();
        })
        .then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        })
        .then(function(balance) {
            // Check if the TokenSale has the correct number of tokens (all tokens - the bought previously)
            assert.equal(balance.toNumber(), (tokensAvailable - numberOfTokens));
            // Try to buy tokens different from the ether value
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 })
        })
        .then(assert.fail)
        .catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            // Try to buy tokens different from the ether value
            return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
        })
        .then(assert.fail)
        .catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        })
    });

    it('ends token sale', function() {
        return WolfToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return WolfTokenSale.deployed()
        })
        .then(function(instance) {
            tokenSaleInstance = instance;
            // Try to end from account other than admin
            return tokenSaleInstance.endSale({ from: buyer });
        })
        .then(assert.fail)
        .catch(function(error) {
            assert(error.message.indexOf('revert' >= 0, 'must be admin to end the sale'));
            // End sale as admin
            return tokenSaleInstance.endSale({ from: admin });
        })
        .then(function(receipt) {
            return tokenInstance.balanceOf(admin);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), 999990, 'returns all unsold WolfTokens to admin');
            return web3.eth.getBalance(tokenSaleInstance.address);
        })
        .then(function(balance) {
            assert.equal(balance, 0);
        })
    })

});