import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BlockchainService from "./BlockchainService";

export default class Web3Service {
	static isMetamaskAvailable = false;
	static provider: any;
	static account : string;

	static init() {
		this.connectProvider();
		return this.connectMetamask();
	}

	static connectProvider() {
		const provider = new Web3.providers.HttpProvider(BlockchainService.selected.url);
		Web3Service.provider = new Web3(provider);
	}

	static async connectMetamask(shouldRaiseError?: boolean) {
		const provider = await detectEthereumProvider();

		// If ethereum object exists on window object
		// is because Metamask injected it.
		if(provider){
			const account = await (<any>window).ethereum.request({ method: "eth_requestAccounts" });
			this.onAccountChanged((accounts:Array<string>) => Web3Service.account = accounts[0]);
			Web3Service.provider = new Web3(provider as any);
			Web3Service.account = account;
		} 
		else if(shouldRaiseError) throw Error("Metamask not available");
	}

	static onAccountChanged(fn : Function) {
		(<any>window).ethereum.on("accountsChanged", (account : Array<string>) => fn(account));
	}
}
