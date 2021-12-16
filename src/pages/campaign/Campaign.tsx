import React from "react";
import { Card, CardTitle, Col, Icon, Row } from "react-materialize";
import { Link, useParams } from "react-router-dom";
import AddressFormatter from "../../components/Address/AddressFormatter";
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

		console.log(campaign)

		LoaderService.loading(false);
	}

	render = () => {
		const campaign = this.state.campaign;
		const blockchain = BlockchainService.selected;

		return <Row>
			<Col m={6} s={12}>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Short information about the scope of the campaign.</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Title">
						{campaign.title}
				</Card>
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
						open requests when the donators approve the requests</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Balance">
						{Web3Service.provider.utils.fromWei(campaign.balance, "ether")}&nbsp;
						{blockchain.currency}
				</Card>
			</Col>
			<Col m={6} s={12}>
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
					<AddressFormatter address={campaign.address}/>
				</Card>
				<Card closeIcon={<Icon>close</Icon>}
					reveal={<p>Can create spending requests and send transactions only after at least
						50% of the donators have approved the request.<br/>

						<a href={blockchain.contractExplorer + "address/" + campaign.manager}
							target="_blank" rel="noreferrer">
							Open manager address on explorer
						</a>
					</p>}
					revealIcon={<Icon>more_vert</Icon>}
					title="Manager address">
					<AddressFormatter address={campaign.manager}/>
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
		</Row>
	};
}

export default Campaign;
