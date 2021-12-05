import blockchains from "../blockchains.json";
import IBlockchain from "../models/IBlockchain";

class BlockchainService {
	static get blockchains(): Array<IBlockchain> {
		return blockchains;
	}

	static get selected(): IBlockchain {
		return blockchains.find((blockchain) => blockchain.selected) as IBlockchain;
	}

	static get selectedAddress() {
		return BlockchainService.selected?.contractAddress;
	}
}

export default BlockchainService;
