import Web3Service from "./Web3Service";
import Campaign from "../contracts-interfaces/Campaign.json";
import { ICampaign } from "../models/ICampaign";

class CampaignService {
	requests = [];

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

	static getCampingRequests = async (address: string) => {
		const campaign = CampaignService.getCamping(address);
		const approversCount = await campaign.methods.approversCount().call();
		const requestCount = await campaign.methods.getRequestCount().call();

		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill(null)
				.map((request, index) => {
					return campaign.methods.requests(index).call();
				})
		);

		return requests.map((request) => {
			return {
				description: request[0],
				value: request[1],
				recipient: request[2],
				complete: request[3],
				approvalCount: request[4],
				approversCount: approversCount
			};
		});
	};

	static approveRequest = async (address: string, index: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(address);

		return campaign.methods.approveRequest(parseInt(index)).send({ from: accounts[0] });
	};

	static finalizeRequest = async (address: string, index: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(address);

		return campaign.methods.finalizeRequest(parseInt(index)).send({ from: accounts[0] });
	};
}

export default CampaignService;
