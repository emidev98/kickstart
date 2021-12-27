import _ from "lodash";
import React from "react";
import { Card, Table } from "react-materialize";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Subscription } from "rxjs";
import PageHeader from "../../../components/PageHeader/PageHeader";
import RequestRow from "../../../components/RequestRow/RequestRow";
import { IRequestRow } from "../../../models/IRequest";
import BlockchainService from "../../../services/BlockchainService";
import CampaignService from "../../../services/CampaignService";
import LoaderService from "../../../services/LoaderService";
import RequestService from "../../../services/RequestService";
import Web3Service from "../../../services/Web3Service";
import "./Requests.scss";

type Props = {
	campaignAddress: string;
	navigate: NavigateFunction;
};

function Requests() {
	const { address } = useParams();
	const navigate = useNavigate();

	return <RequestsComponent campaignAddress={address ? address : ""} navigate={navigate} />;
}
class RequestsComponent extends React.Component<Props> {
	accountSubscription?: Subscription;
	state = {
		requests: [] as Array<IRequestRow>,
		account: "",
		campaignTitle: "",
		managerAddress: ""
	};

	componentDidMount = async () => {
		LoaderService.loading(true);
		const { campaignAddress } = this.props;
		this.accountSubscription = Web3Service.account.subscribe((account) => {
			this.setState({ account });
		});

		try {
			const data = await Promise.all([
				CampaignService.getCampingManager(campaignAddress),
				CampaignService.getCampingTitle(campaignAddress),
				RequestService.getCampingRequests(campaignAddress)
			])
			const managerAddress = data[0]
			const campaignTitle = data[1]
			const requests = _.map(data[2], request =>{
				return {
					...request,
					isApprovedByAddress: false
				} as IRequestRow;
			});

			this.setState({
				requests,
				campaignTitle,
				managerAddress
			});
		} catch (e) {
			M.toast({ html: `This campaign does not exist on '${BlockchainService.selected.name}'` });
			this.props.navigate("/");
		}
		LoaderService.loading(false);
	};

	componentWillUnmount = () => {
		this.accountSubscription?.unsubscribe();
	};

	onApprove = async (index: number) => {
		LoaderService.loading(true);
		try {
			await RequestService.approveRequest(this.props.campaignAddress, index);
			this.state.requests[index].isApprovedByAddress = true;
			this.state.requests[index].approvalCount++;
			this.setState({requests: this.state.requests })
		}
		catch(err) {
			const { message } = err as Error;
			M.toast({html : message})
		}
		LoaderService.loading(false);
	};

	onFinalize = async (index: number) => {
		LoaderService.loading(true);
		try {
			await RequestService.finalizeRequest(this.props.campaignAddress, index);
			this.state.requests[index].finalized = true;
			this.setState({requests: this.state.requests })
		}
		catch(err) {
			const { message } = err as Error;
			M.toast({html : message})
		}
		LoaderService.loading(false);
	};

	render = () => {
		return (
			<div className="requests">
				<PageHeader backToUrl={`/campaigns/${this.props.campaignAddress}`}
					backTitle="Requests | "
					title={`${this.state.campaignTitle}`}/>
				<Card className="requests-body">
					<Table>
						<thead>
							<tr>
								<th data-field="id">ID</th>
								<th data-field="description">Description</th>
								<th data-field="amount">Amount</th>
								<th data-field="recipient">Recipient</th>
								<th data-field="approval" className="center">Approvals</th>
							</tr>
						</thead>
						<tbody>
							{this.state.requests.map((request, index) => {
								return <RequestRow id={index}
											key={index}
											request={request}
											campaignAddress={this.props.campaignAddress}
											managerAddress={this.state.managerAddress}
											account={this.state.account}
											onApprove={() => this.onApprove(index)}
											onFinalize={() => this.onFinalize(index)}/>
							})}
						</tbody>
					</Table>
				</Card>
			</div>
		);
	};
}

export default Requests;
