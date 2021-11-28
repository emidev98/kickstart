import web3 from "../web3";
import CampaignFactoryJson from '../build/CampaignFactory.json';

class CampaignFactory {

    static getCampingFactory = () => {
        const contractInterface = JSON.parse(CampaignFactoryJson.interface);

        const address = '0x2FB76d172464110808c1cF0191bD0b05dAc806b9';
        return new web3.eth.Contract(contractInterface, address);
    }
}

export default CampaignFactory;