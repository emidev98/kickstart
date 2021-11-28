import React from "react";
import AppLayout from "../../../components/common/AppLayout";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import CampaignService from "../../../../ethereum/services/CampaignService";
import { Link, Router } from "../../../../routes";
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
            <AppLayout backRoute={`/campaigns/${this.props.address}`}
                pageTitle="Back to campaign"
                nextRouteDescription="Request"
                nextRoute={`/campaigns/${this.props.address}/requests/new`}
                nextRouteIcon="add">
                {this.renderRequestsTable()}
            </AppLayout>
        );
    };

}

export default Requests; 