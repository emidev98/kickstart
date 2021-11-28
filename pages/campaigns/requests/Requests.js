import React from "react";
import AppLayout from "../../../components/AppLayout";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import { Router } from "../../../routes";
import web3 from "../../../ethereum/web3";
import CampaignService from "../../../ethereum/services/CampaignService";
import { Link } from "../../../routes";
import RequestRow from "../../../components/RequestRow";
const { Header, Row, HeaderCell, Body } = Table;

class Requests extends React.Component {
    
    static async getInitialProps(props) {
        const address = props.query.address;
        const requests = await CampaignService.getCampingRequests(address);
        return { address, requests };
    }

    onApprove = async (index) => {
        await CampaignService.approveRequest(this.props.address, index);
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    };

    onFinalize = async (index) => {
        await CampaignService.approveRequest(this.props.address, index);
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    };

    renderRequestsTable(){
        return (
            <Table celled>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Value (ether)</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
            
                <Body>
                    {this.props.requests.map((request,index) => {
                        return (
                            <RequestRow
                                id={index}
                                key={index}
                                request={request}
                                address={this.props.address}
                                onApprove={this.onApprove}
                                onFinalize={this.onFinalize}>
                            </RequestRow>
                        )
                    })}
                </Body>
            </Table>
        );
    }
    

    render() {
        return (    
            <AppLayout>
                <Menu borderless={true}
                    style={{ border: "none", boxShadow: "none" }}>
                    <Menu.Menu position="left"
                        style={{display: "flex", alignItems: "center"}}>
                        <Link route={`/campaigns/${this.props.address}`}>
                            <Icon style={{ marginBottom: "2px", cursor: "pointer"}} name="arrow left"></Icon>
                        </Link>
                        <h3 style={{marginTop: 0, marginLeft: "0.5em"}}>Campaign requests</h3>
                    </Menu.Menu>

                    <Menu.Menu position="right">
                        <Link route={`/campaigns/${this.props.address}/requests/new`}>
                            <Button primary fluid>
                                <Icon name="plus"/>
                                Request
                            </Button>
                        </Link>
                    </Menu.Menu>
                </Menu>
                {this.renderRequestsTable()}
            </AppLayout>
        );
    };

}

export default Requests; 