import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BlockchainService from "./BlockchainService";
import { Subject } from 'rxjs';

export default class Web3Service {
	static provider: any;
	static account = new Subject<string>();
	static eventLisenersAvailable = false;
	
	static init() {
		this.connectProvider();
		return this.connectMetamask();
	}

	static connectProvider() {
		const provider = new Web3.providers.HttpProvider(BlockchainService.selected.url);
		Web3Service.provider = new Web3(provider);
	}

	static async connectMetamask(shouldRaiseError?: boolean) {
		const provider = await detectEthereumProvider() as any;
		
		if(provider){
			Web3Service.provider = new Web3(provider);
			const account = await provider.request({ method: "eth_requestAccounts" });
			Web3Service.account.next(account);
			console.log(provider.chainId);

			if(!this.eventLisenersAvailable){
				this.addEventListeners();
			}
		} 
		else if(shouldRaiseError) throw Error("Metamask not available");
	}

	private static addEventListeners(){
		this.eventLisenersAvailable = true;
		(<any>window).ethereum.on("accountsChanged", (account : Array<string>) => {
			Web3Service.account.next(account[0]);
		});

		(<any>window).ethereum.on('chainChanged', (chainId : any) => {
			BlockchainService.select(chainId);
			window.location.reload();
		});
	}
}
