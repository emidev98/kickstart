import { Contract } from "web3-eth-contract";

export interface ICampaign {
	campaign: Contract;
	address: string;
	minimumContribution: string;
	balance: string;
	requestsCount: string;
	approversCount: string;
	manager: string;
	title: string;
}
