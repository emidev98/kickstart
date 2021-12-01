import ganache from "ganache-core";
import Web3 from "web3";
import compiledFactory from "../../ethereum/build/CampaignFactory.json";
import compiledCampaing from "../../ethereum/build/Campaign.json";

const web3 = new Web3((ganache.provider() as any));

let accounts: any;
let factory: any;
let campaignAddress: any;
let campaign: any;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ 
            from: accounts[0], 
            gas:2000000,
            gasPrice: "10000000"
         });
    
    await factory.methods.createCampaign("100", "Build a spaceship")
        .send({ 
            from: accounts[0],
            gas:2000000,
            gasPrice: "10000000"
        });
    
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaing.interface),
        campaignAddress
    );
});

describe("Campaigns", () => {

    it("deploys a factory and a campaign", () =>{
        expect(factory.options.address).toBeTruthy();
        expect(campaign.options.address).toBeTruthy();
    });

    it("marks caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();

        expect(accounts[0]).toBe(manager);
    });

    it("allows people to contribute and marks them as approvers", async () => {
        await campaign.methods.contribute().send({
            value: "200",
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        expect(isContributor).toBeTruthy();
    });

    it("requires a minimum contribution", async () => {
        try {
            await campaign.methods.contribute().send({
                value: "99",
                from: accounts[1]
            });
            expect(false).toBe(true);
        }
        catch(err : any) {
            expect(err.message).toBe("VM Exception while processing transaction: revert");
        }
    });

    it("allows a manager to make a payment request", async () =>{
        await campaign.methods
            .createRequest("Buy the rocket", "100", accounts[1])
            .send({
                from: accounts[0], 
                gas:2000000,
                gasPrice: "10000000"
            });

        const request = await campaign.methods.requests(0).call();

        expect(request.description).toBe("Buy the rocket");
        expect(request.value).toBe("100");
        expect(request.recipient).toBe(accounts[1]);
        expect(request.complete).toBe(false);
        expect(request.approvalCount).toBe("0");
    });

    it("processes requests", async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei("10", "ether")
        });
        
        await campaign.methods
            .createRequest("Buy something else", web3.utils.toWei("5", "ether"), accounts[1])
            .send({
                from: accounts[0], 
                gas: "200000", 
                gasPrice: "10000000"
            });

        await campaign.methods
            .approveRequest(0)
            .send({
                from: accounts[0], 
                gas: "200000", 
                gasPrice: "10000000"
            });
        
        await campaign.methods
            .finalizeRequest(0)
            .send({
                from: accounts[0], 
                gas: "200000", 
                gasPrice: "10000000"
            });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");

        expect(parseFloat(balance) > 104);
    });

});