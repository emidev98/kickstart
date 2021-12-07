import defaultChains from "../blockchains.json";
import IBlockchain from "../models/IBlockchain";
import LocalStorageService from "./LocalStorageService";
import * as _ from "lodash";

class BlockchainService {
	static get blockchains(): Array<IBlockchain> {
		const storage = LocalStorageService.get();

		if(_.isEmpty(storage.blockchains)){
			LocalStorageService.setItem("blockchains", defaultChains);
			return defaultChains as Array<IBlockchain>;
		}

		// TODO compare default chains agains local storage chains
		return storage.blockchains;
	}

	static select(chainId : string) {
		const chains = _.map(BlockchainService.blockchains, (blockchain) =>{
			delete blockchain.selected
			return blockchain;
		});

		// TODO Throw expection if chain does not exist ? 
		const chain = _.find(chains, blockchain => blockchain.chainId == chainId) as IBlockchain;
		chain.selected = true;
		
		LocalStorageService.setItem("blockchains", chains);
	}

	static get selected(): IBlockchain {
		const storage = LocalStorageService.get();

		if(_.isEmpty(storage.blockchains)){
			return _.find(BlockchainService.blockchains,blockchain => blockchain.selected) as IBlockchain;
		}

		return _.find(storage.blockchains, (blockchain: IBlockchain) => blockchain.selected);
	}

	static get selectedAddress() {
		return BlockchainService.selected.contractAddress;
	}
}

export default BlockchainService;
