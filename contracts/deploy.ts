import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import dotenv from "dotenv";
import compiledFactory from "./build/CampaignFactory.json";
dotenv.config();

const provider = new HDWalletProvider(<string>process.env["MNEMONIC"], <string>process.env["PROVIDER_URL"]);
const web3 = new Web3(provider);

async function deploy() {
	const accounts = await web3.eth.getAccounts();
	const balance = await web3.eth.getBalance(accounts[0]);

	console.log(`Start deployment with ${balance} gwei of balance`);

	const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({
			data: compiledFactory.bytecode
		})
		.send({
			gas: 1000000,
			from: accounts[0]
		});

	return result.options.address;
}

deploy()
	.then((address) => console.log(`Deployment done on ${address}`))
	.catch((err) => console.log(`Deployment failed with error code ${err}`));

// TODO: Fix exit code when individual script is executed.
