import Web3Service from "./Web3Service";
import Campaign from "../contracts-interfaces/Campaign.json";
import { ICampaign } from "../models/ICampaign";

class CampaignService {

	static getCamping = (address: string) => {
		const contractInterface = JSON.parse(Campaign.interface);
		return new Web3Service.provider.eth.Contract(contractInterface, address);
	};

	static getCampingSummary = async (address: string) => {
		const campaign = CampaignService.getCamping(address);
		const summary = await campaign.methods.getSummary().call();

		return {
			address: campaign.options.address,
			campaign: campaign,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4],
			title: summary[5]
		} as ICampaign;
	};

	static getCampingsSummary: (addresses: Array<string>) => Promise<Array<ICampaign>> = (addresses) => {
		return Promise.all(
			addresses.map((address) => {
				return CampaignService.getCampingSummary(address);
			})
		);
	};

	static contributeToCampaign = async (address: string, contribution: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		return CampaignService.getCamping(address)
			.methods.contribute()
			.send({
				from: accounts[0],
				value: Web3Service.provider.utils.toWei(contribution, "ether")
			});
	};
}

export default CampaignService;
