import React from "react";
import { Card, Table } from "react-materialize";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import RequestRow from "../../../components/RequestRow/RequestRow";
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
	state = {
		requests: [],
		account: "",
		managerAccount: ""
	};

	componentDidMount = async () => {
		LoaderService.loading(true);

		Web3Service.account.subscribe((account) => {
			this.setState({ account });
		});

		try {
			const managerAccount = CampaignService.getCampingManager(this.props.campaignAddress);
			const requests = await RequestService.getCampingRequests(this.props.campaignAddress);
			this.setState({
				requests,
				managerAccount
			});
		} catch (e) {
			M.toast({ html: `This campaign does not exist on '${BlockchainService.selected.name}'` });
			this.props.navigate("/");
		}
		LoaderService.loading(false);
	};

	onApprove = async (index: number) => {
		console.log(index);
	};
	onFinalize = async (index: number) => {
		console.log(index);
	};

	render = () => {
		return (
			<Card className="requests">
				<Table>
					<thead>
						<tr>
							<th data-field="id">ID</th>
							<th data-field="description">Description</th>
							<th data-field="amount">Amount</th>
							<th data-field="recipient">Recipient</th>
							<th data-field="approval" className="center">
								Approvals
							</th>
						</tr>
					</thead>
					<tbody>
						{this.state.requests.map((request, index) => {
							return (
								<RequestRow
									id={index}
									key={index}
									request={request}
									isContributorAccount={true}
									isManagerAccount={true}
									onApprove={() => this.onApprove(index)}
									onFinalize={() => this.onFinalize(index)}
								/>
							);
						})}
					</tbody>
				</Table>
			</Card>
		);
	};
}

export default Requests;
