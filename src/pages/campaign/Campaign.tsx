import React from "react";
import { Button, Card, CardPanel, Col, Icon, Row, TextInput } from "react-materialize";
import { useParams } from "react-router-dom";
import AddressFormatter from "../../components/Address/AddressFormatter";
import ContributeForm from "../../components/ContributeForm/ContributeForm";
import { ICampaign } from "../../models/ICampaign";
import BlockchainService from "../../services/BlockchainService";
import CampaignService from "../../services/CampaignService";
import LoaderService from "../../services/LoaderService";
import Web3Service from "../../services/Web3Service";
import "./Campaign.scss";

type Props = {
	address: string
};

function Campaign(props: any) {
	const { address } = useParams();

	return <CampaignComponent {...props} address={address} />
}

class CampaignComponent extends React.Component<Props>{

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
	}

	componentDidMount = async () => {
		LoaderService.loading(true);

		Web3Service.account.subscribe((account) => {
			this.setState({ account })
		});
		const campaign = await CampaignService.getCampingSummary(this.props.address);
		this.setState({ campaign });

		LoaderService.loading(false);
	}

	render = () => {
		const campaign = this.state.campaign;
		const blockchain = BlockchainService.selected;

		return <Row className="campaign">
			<Col s={12} m={12} l={4}>
				<Card title={campaign.title}/>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Configured by the manager because votes need to worth 
						at least a minimum amount of {blockchain.currency}&nbsp;
						to be able to have a decision on requests approvals.</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Minimum contribution">
						{Web3Service.provider.utils.fromWei(campaign.minimumContribution, "ether")}&nbsp;
						{blockchain.currency}
				</Card>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Amount of money that the campaign has available to spend on
						open requests when the contributors approve the requests</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Balance">
						{Web3Service.provider.utils.fromWei(campaign.balance, "ether")}&nbsp;
						{blockchain.currency}
				</Card>
			</Col>

			<Col s={12} m={12} l={4}>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Contract address that can be used to search on blockchain
						explorer to se realtime or pending transactions.<br/>

						<a href={blockchain.contractExplorer + "address/" + campaign.address}
							target="_blank" rel="noreferrer">
							Open contract address on explorer
						</a>
					</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Address">
					<div className="address-formatter-wrapper">
						<AddressFormatter address={campaign.address}/>
					</div>
				</Card>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Can create spending requests and send transactions only after at least
						50% of the contributors have approved the request.<br/>

						<a href={blockchain.contractExplorer + "address/" + campaign.manager}
							target="_blank" rel="noreferrer">
							Open manager address on explorer
						</a>
					</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Manager address">
					<div className="address-formatter-wrapper">
						<AddressFormatter address={campaign.manager}/>
					</div>
				</Card>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>
						Total amount of requests created for the campaign no matters if the status is open or
						closed.

					</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Requests">
						{campaign.requestsCount}
				</Card>
			</Col>

			<Col s={12} m={12} l={4}>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>
						Contributing to the campaign gives you voting power. To contribute, you at least 
						need to donate the minimum amount configured by the manager
					</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Contribute">
						<ContributeForm minimumContribution={campaign.minimumContribution}
							campaignAddress={campaign.address}/>
				</Card>
			</Col>
		</Row>
	};
}

export default Campaign;
