import React, { useEffect } from "react";
import { Card, Icon } from "semantic-ui-react";
import { Link } from "../../routes";
import AppLayout from "../components/common/AppLayout";
import AddressFormatter from "../components/common/AddressFormatter";
import CampaignFactory from "../../ethereum/services/CampaignFactory";
import CampaignService from "../../ethereum/services/CampaignService";

class App extends React.Component {

    static async getInitialProps() {
        const campaignFactory = CampaignFactory.getCampingFactory();
        const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
        const summary = await CampaignService.getCampingsSummary(campaigns);
        
        return { campaigns: summary};
    }

    renderCampaigns() {
        const items = this.props.campaigns.map((campaign) => {
            
            return {
                header:  campaign.title,
                description:() => {
                    return (<h4 style={{
                        display: "flex", 
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <AddressFormatter address={campaign.campaign._address}/>
                        <Link route={`/campaigns/${campaign.campaign._address}`}>
                            <a style={{minWidth: "160px", display: "inline-flex", justifyContent: "flex-end"}}> 
                                <Icon name="eye" style={{marginRight: "0.5em"}}/>
                                <span>Campaign details</span>
                            </a>
                        </Link>
                    </h4>)
                },
                fluid: true
            }
        })
        return <Card.Group items={items}></Card.Group>
    }

    render() {
        return (
            <AppLayout
                pageTitle="Open campaigns">
                {this.renderCampaigns()}
            </AppLayout>
        );
    }
}

export default App;