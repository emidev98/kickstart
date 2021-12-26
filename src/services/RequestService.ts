import IRequest from "../models/IRequest";
import CampaignService from "./CampaignService";
import Web3Service from "./Web3Service";

class RequestService {
	static getCampingRequests = async (campaignAddress: string): Promise<Array<IRequest>> => {
		const campaign = CampaignService.getCamping(campaignAddress);
		const approversCount = await campaign.methods.approversCount().call();
		const requestCount = await campaign.methods.getRequestCount().call();

		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill(null)
				.map((_request, index) => {
					return campaign.methods.requests(index).call();
				})
		);

		return requests.map((request) => {
			return {
				description: request[0],
				amount: request[1],
				recipient: request[2],
				finalized: request[3],
				approvalCount: parseInt(request[4]),
				approversCount: parseInt(approversCount)
			};
		});
	};

	static hasApprovedRequest = (campaignAddress: string, approverAddress: string, index: number): Promise<boolean> => {
		const campaign = CampaignService.getCamping(campaignAddress);
		return campaign.methods.hasApprovedRequest(index, approverAddress).call();
	};

	static createRequest = async (
		campaignAddress: string,
		description: string,
		amount: string,
		recipientAddress: string
	) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		await campaign.methods
			.createRequest(description, Web3Service.provider.utils.toWei(amount, "ether"), recipientAddress)
			.send({ from: accounts[0] });
	};

	static approveRequest = async (campaignAddress: string, index: number) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		return campaign.methods.approveRequest(index).send({ from: accounts[0] });
	};

	static finalizeRequest = async (campaignAddress: string, index: number) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		return campaign.methods.finalizeRequest(index).send({ from: accounts[0] });
	};
}

export default RequestService;
