import CampaignService from "./CampaignService";
import Web3Service from "./Web3Service";

class RequestService {

	static getCampingRequests = async (campaignAddress: string) => {
		const campaign = CampaignService.getCamping(campaignAddress);
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

	static createRequest = async (
		campaignAddress : string, 
		description: string, 
		amount: string,
		recipientAddress: string
	) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		await campaign.methods
			.createRequest(
				description, 
				Web3Service.provider.utils.toWei(amount, 'ether'), 
				recipientAddress
			)
			.send({ from: accounts[0] });
	}

	static approveRequest = async (campaignAddress: string, index: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		return campaign.methods.approveRequest(parseInt(index)).send({ from: accounts[0] });
	};

	static finalizeRequest = async (campaignAddress: string, index: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaign = CampaignService.getCamping(campaignAddress);

		return campaign.methods.finalizeRequest(parseInt(index)).send({ from: accounts[0] });
	};
}

export default RequestService;
