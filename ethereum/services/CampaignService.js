import web3 from '../web3';
import Campaign from '../build/Campaign.json';

class CampaignService {

    campaign = {}
    summary = {}
    requests = []

    static getCamping = (address) => {
        const contractInterface = JSON.parse(Campaign.interface);
        CampaignService.campaign = new web3.eth.Contract(contractInterface, address);
        return CampaignService.campaign;
    }

    static getCampingSummary = async (address) => {
        CampaignService.campaign = await CampaignService.getCamping(address);
        const summary = await CampaignService.campaign.methods.getSummary().call();
        
        CampaignService.summary = {
            campaign: CampaignService.campaign,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };

        return CampaignService.summary;
    }

    static getCampingRequests = async (address) => {
        const campaign = await CampaignService.getCamping(address);
        const approversCount = await campaign.methods.approversCount().call();
        const requestCount = await campaign.methods.getRequestCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((request, index) => {
                    return campaign.methods.requests(index).call();
                })
        );
        
        CampaignService.requests = requests
            .map((request) => {
                return {
                    description: request[0],
                    value: request[1],
                    recipient: request[2],
                    complete: request[3],
                    approvalCount: request[4],
                    approversCount: approversCount
                };
            });
        
        return CampaignService.requests;
    }

    static approveRequest = async (address, index) => {
        const accounts = await web3.eth.getAccounts();
        const campign = await CampaignService.getCamping(address);
        return campign.methods
            .approveRequest(index)
            .send({ from : accounts[0] });
    }

    static finalizeRequest = async (address, index) => {
        const accounts = await web3.eth.getAccounts();
        const campign = await CampaignService.getCamping(address);
        return campign.methods
            .finalizeRequest(index)
            .send({ from : accounts[0] });
    }
}

export default CampaignService;