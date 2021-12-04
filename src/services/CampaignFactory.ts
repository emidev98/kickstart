import web3 from "./web3";
import CampaignFactoryJson from "../contracts-interfaces/CampaignFactory.json";
import BlockchainService from "./BlockchainService";

class CampaignFactory {
	static getCampingFactory = () => {
		const contractInterface = JSON.parse(CampaignFactoryJson.interface);
		return new web3.eth.Contract(contractInterface, BlockchainService.selectedAddress);
	};

	static createCamping = async (minimumContribution: string, title: string) => {
		const accounts = await web3.eth.getAccounts();
		const campaignFactory = CampaignFactory.getCampingFactory();
		return campaignFactory.methods.createCampaign(web3.utils.toWei(minimumContribution, "ether"), title).send({
			from: accounts[0]
		});
	};
}

export default CampaignFactory;
