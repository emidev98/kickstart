export default interface IBlockchain {
    name: string;
    url: string;
    contractExplorer: string;
    contractAddress: string;
    currency: string;
    chainId: string;
    icon: any;
    selected?: boolean;
}