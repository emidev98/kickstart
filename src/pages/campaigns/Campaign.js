import React from "react";
import { Card, Grid, Segment } from "semantic-ui-react";
import AppLayout from "../../components/common/AppLayout";
import CampaignContributeFrom from "../../components/CampaignContributeForm";
import CampaignService from "../../../ethereum/services/CampaignService";
import web3 from "../../../ethereum/web3";
import AddressFormatter from "../../components/common/AddressFormatter";

class Campaign extends React.Component {
    
    static getInitialProps(props) {
        const address = props.query.address;
        return CampaignService.getCampingSummary(address);
    }

    renderCards() {
        console.log(this.props)
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount,
            title
        } = this.props;

        const items = [{
            header: title,
            meta: "Campaign Description",
            description: "Brief information of the scope for the donators to understand why should donate to this campaign",
        },{
            header: <AddressFormatter className="header" address={manager}/>,
            meta: "Manager address ",
            description: "The manager created this campaign to request money and build a project.",
            style: {
                overflowWrap: "break-word"
            }
        },{
            header: web3.utils.fromWei(minimumContribution, "ether") + " (ether)",
            meta: "Minimum contribution",
            description: "Amount of minimum contribution you need to join the campign.",
            style: {
                overflowWrap: "break-word"
            }
        },{
            header: requestsCount,
            meta: "Number or requests",
            description: "Requests tries to withdrow money from the contract but needs the approvals of the contributors."
        },{
            header: approversCount,
            meta: "Number of approvers",
            description: "Number of people that already donated to this campaign."
        },{
            header: web3.utils.fromWei(balance, "ether") + " (ether)",
            meta: "Campaign balance",
            description: "Amount of money that the campaign has available to spend.",
            style: {
                overflowWrap: "break-word"
            }
        }];

        return <Card.Group itemsPerRow={2} items={items} stackable></Card.Group>
    }

    render() {
        return (
            <AppLayout backRoute="/"
                pageTitle="Campigns"
                nextRouteDescription="Requests details"
                nextRoute={`/campaigns/${this.props.campaign.options.address}/requests`}
                nextRouteIcon="eye">
                <Grid>
                    <Grid.Column mobile={16} tablet={9} computer={11}>
                        {this.renderCards()}
                    </Grid.Column>

                    <Grid.Column mobile={16} tablet={7} computer={5}>
                        <Segment>
                            <CampaignContributeFrom campaign={this.props.campaign}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </AppLayout>
        );
    }

}

export default Campaign;