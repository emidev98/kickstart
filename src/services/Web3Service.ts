import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BlockchainService from "./BlockchainService";

export default class Web3Service {
	static isMetamaskAvailable = false;
	static provider: any;

	static init() {
		// Otherwise we create our own provider for the
		// user to at least be able to view the data
		const provider = new Web3.providers.HttpProvider(BlockchainService.selected.url);
		Web3Service.provider = new Web3(provider);
	}

	static async connectMetamask() {
		const provider = await detectEthereumProvider();

		// If ethereum object exists on window object
		// is because Metamask injected it.
		(<any>window).ethereum.request({ method: "eth_requestAccounts" });
		Web3Service.provider = new Web3(provider as any);

		console.log(Web3Service.provider);
	}
}
