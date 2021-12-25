import React from "react";
import CampaignFactory from "../services/CampaignFactory";
import CampaignService from "../services/CampaignService";
import "./Campaigns.scss";
import { ICampaign } from "../models/ICampaign";
import { Link } from "react-router-dom";
import { Button } from "react-materialize";
import LoaderService from "../services/LoaderService";
import AddressFormatter from "../components/Address/AddressFormatter";
import Web3Service from "../services/Web3Service";

class Campaigns extends React.Component {
	state = {
		campaigns: new Array<ICampaign>(),
		account: ""
	};

	componentDidMount = async () => {
		LoaderService.loading(true);
		const campaignFactory = CampaignFactory.getCampingFactory();
		const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
		const campaignsSummary = await CampaignService.getCampingsSummary(campaigns);

		Web3Service.account.subscribe((address) => {
			this.setState({ account: address });
		});

		this.setState({ campaigns: campaignsSummary });
		LoaderService.loading(false);
	};

	render = () => {
		return (
			<ul className="collection">
				{this.state.campaigns.map((campaignSummary, index) => {
					const isManagerAccount = campaignSummary.manager.toUpperCase() == this.state.account?.toUpperCase();

					return (
						<li className="collection-item" key={index}>
							<div className="collection-left">
								<h5 className="title">{campaignSummary.title}</h5>
								<AddressFormatter address={campaignSummary.address} />
							</div>

							<ul className="collection-right">
								<Link to={`/campaigns/${campaignSummary.address}`} className="collection-list-item">
									<Button
										tooltip="Check the most important details of this campaign"
										tooltipOptions={{
											position: window.innerWidth > 992 ? "left" : "top",
											outDuration: 120,
											inDuration: 120
										}}
									>
										<i className="material-icons">info_outline</i>
									</Button>
								</Link>

								<Link
									to={`/campaigns/${campaignSummary.address}/requests`}
									className="collection-list-item"
								>
									<Button
										tooltip="Check the requests that the manager has open for the campaign"
										tooltipOptions={{
											position: window.innerWidth > 992 ? "left" : "top",
											outDuration: 120,
											inDuration: 120
										}}
									>
										<i className="material-icons">list_alt</i>
									</Button>
								</Link>

								{isManagerAccount ? (
									<Link
										to={`/campaigns/${campaignSummary.address}/requests/new`}
										className="collection-list-item"
									>
										<Button
											tooltip="Add a new request to your campaign"
											tooltipOptions={{
												position: window.innerWidth > 992 ? "left" : "top",
												outDuration: 120,
												inDuration: 120
											}}
										>
											<i className="material-icons">playlist_add_circle</i>
										</Button>
									</Link>
								) : (
									<div className="collection-list-item"></div>
								)}
							</ul>
						</li>
					);
				})}
			</ul>
		);
	};
}

export default Campaigns;
