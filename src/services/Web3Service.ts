import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BlockchainService from "./BlockchainService";
import { BehaviorSubject } from "rxjs";
import _ from "lodash";

export default class Web3Service {
	static provider: any;
	static account = new BehaviorSubject("");
	static eventListenersAvailable = false;

	static init() {
		this.connectProvider();
		return this.connectMetamask();
	}

	static async switchNetwork(chainId: string) {
		if (this.account.value) {
			try {
				await (window as any).ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId }],
				});
				BlockchainService.select(chainId);
			} 
			catch (err) {
				const { code } = err as {code : number, message: string, stack: string};
				// This error code indicates that the chain has not been added to MetaMask.
				if (code === 4902) {
					try {
						const blockchain = _.find(BlockchainService.blockchains,(b) => b.chainId === chainId);

						await (window as any).ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [{ 
								chainId: blockchain?.chainId,
								chainName: blockchain?.name,
								rpcUrls: [blockchain?.url],
								blockExplorerUrls: [blockchain?.contractExplorer],
								nativeCurrency: {
									name: blockchain?.currency,
									symbol:  blockchain?.currency,
									decimals: blockchain?.decimals 
								}
							}]
						});
						BlockchainService.select(chainId);
					}
					catch (err) {
						const { message } = err as {code : number, message: string, stack: string};
						M.toast({html: message});
					}
				}
			}
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
		const provider = (await detectEthereumProvider()) as any;

		if (provider) {
			this.provider = new Web3(provider);
			const account = await provider.request({ method: "eth_requestAccounts" });
			this.account.next(account[0]);

			if (!this.eventListenersAvailable) {
				this.addEventListeners();
			}
		} else if (shouldRaiseError) throw Error("Metamask not available");
	}

	private static addEventListeners() {
		this.eventListenersAvailable = true;
		(<any>window).ethereum.on("accountsChanged", (account: Array<string>) => {
			this.account.next(account[0]);
		});

		(<any>window).ethereum.on("chainChanged", (chainId: any) => {
			BlockchainService.select(chainId);
			window.location.reload();
		});
	}
}
