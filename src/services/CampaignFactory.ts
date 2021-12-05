import Web3Service from "./Web3Service";
import CampaignFactoryJson from "../contracts-interfaces/CampaignFactory.json";
import BlockchainService from "./BlockchainService";

class CampaignFactory {
	static getCampingFactory = () => {
		const contractInterface = JSON.parse(CampaignFactoryJson.interface);
		return new Web3Service.provider.eth.Contract(contractInterface, BlockchainService.selectedAddress);
	};

	static createCamping = async (minimumContribution: string, title: string) => {
		const accounts = await Web3Service.provider.eth.getAccounts();
		const campaignFactory = CampaignFactory.getCampingFactory();
		return campaignFactory.methods
			.createCampaign(Web3Service.provider.utils.toWei(minimumContribution, "ether"), title)
			.send({
				from: accounts[0]
			});
	};
}

export default CampaignFactory;
