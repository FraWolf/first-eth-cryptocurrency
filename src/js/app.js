App = {

    loading: false,
    contracts: {},
    account: '0x0',
    tokensAvailable: 750000,

    load: async () => {
        console.log("App initialized...");

        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContracts();
        await App.render();
    },

    loadWeb3: async () => {

        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            windows.alert("Please connect to Metamask.");
        }

        // Modern browsers
        if(window.ethereum) {
            window.web3 = new Web3(ethereum);

            try {
                // Request account access
                await ethereum.enable();

                // Account now exposed
                web3.eth.sendTransaction({ /* ... */ });
            } catch(error) {
                // User denied the account access
            }
        }

        // Legacy browsers
        else if(window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);

            // Account now exposed
            web3.eth.sendTransaction({ /* ... */ });
        }

        // Not an ETH Browser
        else {
            console.log("Non ETH Browser detected.")
        }

    },

    loadAccount: async () => {
        web3.eth.getCoinbase((err, account) => {
            if(err === null) {
                App.account = account;
                console.log(`Your Address: ${account}`);
            }
        })
    },

    loadContracts: async () => {
        // Sale Token
        const WolfTokenSale = await $.getJSON("WolfTokenSale.json");
        App.contracts.WolfTokenSale = TruffleContract(WolfTokenSale);
        App.contracts.WolfTokenSale.setProvider(App.web3Provider);

        // Take values from blockchain
        App.WolfTokenSale = await App.contracts.WolfTokenSale.deployed();
        console.log(`Wolf Token Sale Address: ${App.WolfTokenSale.address}`);

        // Token
        const WolfToken = await $.getJSON("WolfToken.json");
        App.contracts.WolfToken = TruffleContract(WolfToken);
        App.contracts.WolfToken.setProvider(App.web3Provider);

        // Take values from blockchain
        App.WolfToken = await App.contracts.WolfToken.deployed();
        console.log(`Wolf Token Address: ${App.WolfToken.address}`);
    },

    render: async () => {

        if(App.loading) return;

        // Set loading state to true
        App.setLoading(true);

        $('#accountAddress').html(`You Address: ${App.account}`);

        const price = await (await App.WolfTokenSale.tokenPrice()).toNumber();
        const tokensSold = await (await App.WolfTokenSale.tokensSold()).toNumber();
        //const tokensSold = 50000;
        const totalSupply = await (await App.WolfToken.totalSupply()).toNumber();

        // Progress bar
        var progessPercent = (Math.ceil(tokensSold) / App.tokensAvailable) * 100;
        console.log(progessPercent);

        // Loads accounts informations
        const userBalance = await (await App.WolfToken.balanceOf(App.account)).toNumber();

        $('#progress').css('width', `${progessPercent}%`);
        $('.tokens-available').html(App.tokensAvailable);
        $('.tokens-sold').html(tokensSold);
        $('.token-price').html(web3.fromWei(price, "ether"));
        $('.wolf-balance').html(userBalance);

        App.setLoading(false);
    },

    buyTokens: async () => {

        App.setLoading(true);

        var numberOfTokens = $('#numberOfToken').val();

        const price = await (await App.WolfTokenSale.tokenPrice()).toNumber();

        let buyToken = await App.WolfTokenSale.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * price,
            gas: 500000
        });
        
        window.location.reload();

    },

    setLoading: (boolean) => {

        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');

        if(boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }

    },

}

$(() => {
    $(window).load(() => {
        App.load();
    })
})