interface IBlockchain {
	name: string;
	url: string;
	contractExplorer: string;
	contractAddress: string;
	currency: string;
	chainId: string;
	icon: string;
	version: number;
	selected?: boolean;
}

export default IBlockchain;
