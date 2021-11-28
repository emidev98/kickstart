const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
require('dotenv').config();

const provider = new HDWalletProvider(
    process.env['MNEMONIC'],
    process.env['PROVIDER_URL']
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    
    console.log('Current Balance', await web3.eth.getBalance(accounts[0]));

    const result = await new web3.eth
        .Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode,
        })
        .send({
            gas:'1000000',
            from: accounts[0]
        });

    console.log('Contract got deployed to ', result.options.address);
}

deploy()