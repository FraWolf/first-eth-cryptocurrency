var WolfToken = artifacts.require("./WolfToken.sol");

const initialTokens = 1000000;

contract('WolfToken', function(accounts) {

    var tokenInstance;

    it('initializes the contract with the correct values', function() {
        return WolfToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        })
        .then(function(name) {
            assert.equal(name, 'Wolf Token');
            return tokenInstance.symbol();
        })
        .then(function(symbol) {
            assert.equal(symbol, 'WOLF');
            return tokenInstance.version();
        })
        .then(function(version) {
            assert.equal(version, '1.0');
        })
    });

    it('allocates the initial supply upon deployment', function() {
        return WolfToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        })
        .then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), initialTokens);
            return tokenInstance.balanceOf(accounts[0]);
        })
        .then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), initialTokens);
        })
    });

    it('transfer token ownership', function() {

        return WolfToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 99999999999);
        })
        .then(assert.fail)
        .catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        })
        .then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        })
        .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), 250000);
            return tokenInstance.balanceOf(accounts[0]);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        })
    });

    it('approves tokens for delegated transfer', function() {
        return WolfToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        })
        .then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100);
        })
        .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        })
        .then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        })
    });

})