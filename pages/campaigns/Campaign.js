import React from 'react';
import { Button, Card, Grid, Icon, Menu, Segment } from 'semantic-ui-react';
import AppLayout from '../../components/AppLayout';
import CampaignContributeFrom from '../../components/CampaignContributeForm';
import CampaignService from '../../ethereum/services/CampaignService';
import web3 from '../../ethereum/web3';
import { Link } from "../../routes";

class Campaign extends React.Component {
    
    static getInitialProps(props) {
        const address = props.query.address;
        return CampaignService.getCampingSummary(address);
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount,
        } = this.props;

        const items = [{
            header: manager,
            meta: 'Address of Manager',
            description: 'The manager created this campaign to request money and build a project.',
            style: {
                overflowWrap: 'break-word'
            }
        },{
            header: web3.utils.fromWei(minimumContribution, 'ether') + ' (ether)',
            meta: 'Minimum Contribution',
            description: 'Amount of minimum contribution you need to join the campign.',
            style: {
                overflowWrap: 'break-word'
            }
        },{
            header: requestsCount,
            meta: 'Number or Requests',
            description: 'Requests tries to withdrow money from the contract but needs the approvals of the contributors.'
        },{
            header: approversCount,
            meta: 'Number of Approvers',
            description: 'Number of people that already donated to this campaign.'
        },{
            header: web3.utils.fromWei(balance, 'ether') + ' (ether)',
            meta: 'Campaign Balance',
            description: 'Amount of money that the campaign has available to spend.'
        }];

        return <Card.Group itemsPerRow={2} items={items} stackable></Card.Group>
    }

    render() {
        return (
            <AppLayout>
                <Menu borderless={true}
                    style={{ border: "none", boxShadow: "none" }}>
                    <Menu.Menu position="left"
                        style={{display: "flex", alignItems: "center"}}>
                        <Link route={`/`}>
                            <Icon style={{ marginBottom: "2px", cursor: "pointer"}}name="arrow left"></Icon>
                        </Link>
                        <h3 style={{marginTop: 0, marginLeft: "0.5em"}}>Campaign</h3>
                    </Menu.Menu>

                    <Menu.Menu position="right">
                        <Link route={`/campaigns/${this.props.campaign.options.address}/requests`}>
                            <Button primary fluid >
                                <Icon name="eye"/>
                                View requests
                            </Button>
                        </Link>
                    </Menu.Menu>
                </Menu>
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