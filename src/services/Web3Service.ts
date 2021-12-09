import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BlockchainService from "./BlockchainService";
import { BehaviorSubject } from 'rxjs';

export default class Web3Service {
	static provider: any;
	static account = new BehaviorSubject("");
	static eventLisenersAvailable = false;

	static init() {
		this.connectProvider();
		return this.connectMetamask();
	}

	static switchNetwork(chainId : string) {
		BlockchainService.select(chainId);
		if(this.account.value){
			(window as any).ethereum
				.request({
					method: "wallet_switchEthereumChain", 
					params: [{ chainId : chainId}]
				});
		}
		else {
			this.connectProvider();
			window.location.reload();
		}
	}

	static connectProvider() {
		const provider = new Web3.providers.HttpProvider(BlockchainService.selected.url);
		this.provider = new Web3(provider);
	}

	static async connectMetamask(shouldRaiseError?: boolean) {
		const provider = await detectEthereumProvider() as any;
		
		if(provider){
			this.provider = new Web3(provider);
			const account = await provider.request({ method: "eth_requestAccounts" });
			this.account.next(account[0]);

			if(!this.eventLisenersAvailable){
				this.addEventListeners();
			}
		} 
		else if(shouldRaiseError) throw Error("Metamask not available");
	}

	private static addEventListeners(){
		this.eventLisenersAvailable = true;
		(<any>window).ethereum.on("accountsChanged", (account : Array<string>) => {
			this.account.next(account[0]);
		});

		(<any>window).ethereum.on('chainChanged', (chainId : any) => {
			BlockchainService.select(chainId);
			window.location.reload();
		});
	}
}
