import web3 from "./web3";
import CampaignFactoryJson from "../eth-interfaces/CampaignFactory.json";

class CampaignFactory {
	static address = "0x5a3a8465410E9523cB965f31997E82cFECd2ea56";

	static getCampingFactory = () => {
		const contractInterface = JSON.parse(CampaignFactoryJson.interface);
		return new web3.eth.Contract(contractInterface, CampaignFactory.address);
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
