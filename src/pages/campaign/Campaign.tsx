import React from "react";
import { Button, Card, Col, Icon, Row } from "react-materialize";
import { Link, NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Subscription } from "rxjs";
import AddressFormatter from "../../components/Address/AddressFormatter";
import ContributeForm from "../../components/ContributeForm/ContributeForm";
import PageHeader from "../../components/PageHeader/PageHeader";
import { ICampaign } from "../../models/ICampaign";
import BlockchainService from "../../services/BlockchainService";
import CampaignService from "../../services/CampaignService";
import LoaderService from "../../services/LoaderService";
import Web3Service from "../../services/Web3Service";
import "./Campaign.scss";

type Props = {
	address: string;
	navigate: NavigateFunction;
};

function Campaign() {
	const { address } = useParams();
	const navigate = useNavigate();

	return <CampaignComponent address={address ? address : ""} navigate={navigate} />;
}

class CampaignComponent extends React.Component<Props> {

	accountSubscription?: Subscription;
	state = {
		account: "",
		campaign: {
			address: "",
			campaign: {},
			minimumContribution: "0",
			balance: "",
			requestsCount: "",
			approversCount: "",
			manager: "",
			title: ""
		} as ICampaign
	};

	componentDidMount = async () => {
		LoaderService.loading(true);

		this.accountSubscription = Web3Service.account.subscribe((account) => {
			this.setState({ account });
		});
		try {
			const campaign = await CampaignService.getCampingSummary(this.props.address);
			this.setState({ campaign });
		} catch (e) {
			M.toast({ html: `This campaign does not exist on '${BlockchainService.selected.name}'` });
			this.props.navigate("/");
		}
		LoaderService.loading(false);
	};

	componentWillUnmount = () => {
		this.accountSubscription?.unsubscribe();
	};

	onContributeSuccessfully = async () => {
		const campaign = await CampaignService.getCampingSummary(this.props.address);
		this.setState({ campaign });
	};

	onNavigateToRequests = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.log(event);
	};

	render = () => {
		const campaign = this.state.campaign;
		const blockchain = BlockchainService.selected;
		const isAccountAvailable = !!this.state.account;
		const isManagerAccount = campaign.manager.toUpperCase() == this.state.account?.toUpperCase();

		return (
			<div className="campaign">
				<PageHeader className="card-page-header"
					backToUrl="/"
					backTitle="Campaign | "
					title={`${this.state.campaign.title}`} />
				<Card className="card-minimum-contribution"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							Configured by the manager because votes need to worth at least a minimum amount of
							{blockchain.currency}&nbsp; to be able to have a decision on requests approvals.
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="Minimum contribution"
				>
					{Web3Service.provider.utils.fromWei(campaign.minimumContribution, "ether")}&nbsp;
					{blockchain.currency}
				</Card>

				<Card className="card-balance"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							Amount of money that the campaign has available to spend on open requests when the
							contributors approve the requests
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="Balance"
				>
					{Web3Service.provider.utils.fromWei(campaign.balance, "ether")}&nbsp;
					{blockchain.currency}
				</Card>

				<Card className="card-contract-address"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							Contract address that can be used to search on blockchain explorer to se realtime or
							pending transactions.
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="Campaign address">
					<div className="address-formatter-wrapper">
						<AddressFormatter address={campaign.address} />
						<a href={blockchain.contractExplorer + "address/" + campaign.address}
							target="_blank"
							rel="noreferrer">
							View contract address on explorer
						</a>
					</div>
				</Card>

				<Card className="card-manager-address"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							Can create spending requests and send transactions only after at least 50% of the
							contributors have approved the request.
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="Manager address"
				>
					<div className="address-formatter-wrapper">
						<AddressFormatter address={campaign.manager} />
						<a href={blockchain.contractExplorer + "address/" + campaign.manager}
							target="_blank"
							rel="noreferrer">
							View manager address on explorer
						</a>
					</div>
				</Card>

				<Card className="card-requests"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							Total amount of requests created for the campaign no matters if the
							status is open or closed.
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="Requests"
				>
					{campaign.requestsCount}
				</Card>

				{isAccountAvailable ? (
					<Card className="card-contribute"
						closeIcon={<Icon>close</Icon>}
						reveal={
							<p>
								Contributing to the campaign gives you voting power. To contribute, you at least
								need to donate the minimum amount configured by the manager
							</p>
						}
						revealIcon={<Icon>more_vert</Icon>}
						title="Contribute">
						<ContributeForm
							minimumContribution={campaign.minimumContribution}
							campaignAddress={campaign.address}
							onContributeSuccessfully={this.onContributeSuccessfully}
						/>
					</Card>
				) : ("")}
				
				<Card className="card-view-requests"
					closeIcon={<Icon>close</Icon>}
					reveal={
						<p>
							When you need further information about the campaigns just navigate
							to the requests that are open and you can validate if its the kind
							of campaign you wish to support or if you already supported the
							campaign you can even vote for the spending requests.
						</p>
					}
					revealIcon={<Icon>more_vert</Icon>}
					title="View requests">
					<Link to={`/campaigns/${campaign.address}/requests`}>
						<Button>
							<i className="material-icons">list_alt</i>
							View requests
						</Button>
					</Link>
				</Card>

				{isManagerAccount ? (
					<Card className="card-new-request"
						closeIcon={<Icon>close</Icon>}
						reveal={
							<p>
								Being the manager of this campaign you can create new
								spending requests to use the budget of your contributors.
							</p>
						}
						revealIcon={<Icon>more_vert</Icon>}
						title="New request">
						<Link to={`/campaigns/${campaign.address}/requests/new`}>
							<Button>
								<i className="material-icons">playlist_add_circle</i>
								New request
							</Button>
						</Link>
					</Card>
				) : ("")}
			</div >
		);
	};
}

export default Campaign;
