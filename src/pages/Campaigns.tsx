import React from "react";
import CampaignFactory from "../services/CampaignFactory";
import CampaignService from "../services/CampaignService";
import "./Campaigns.scss";
import { ICampaign } from "../models/ICampaign";
import { Link } from "react-router-dom";
import { Button } from "react-materialize";

class Campaigns extends React.Component {
	state = {
		campaigns: new Array<ICampaign>()
	};

	componentDidMount = async () => {
		const campaignFactory = CampaignFactory.getCampingFactory();
		const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
		const campaignsSummary = await CampaignService.getCampingsSummary(campaigns);
		console.log(campaignsSummary);
		this.setState({ campaigns: campaignsSummary });
	};

	render = () => {
		return (
			<ul className="collection">
				{this.state.campaigns.map((campaignSummary, index) => {
					return (
						<li className="collection-item" key={index}>
							<div className="collection-left">
								<h5 className="title">{campaignSummary.title}</h5>
								<p>{campaignSummary.address}</p>
							</div>
							<ul className="collection-right">
								<Link to={`/campaigns/${campaignSummary.address}`}
									className="collection-list-item">
									<Button tooltip="Check the most important details of this specific campaign"
										tooltipOptions={{
											position: "left",
											outDuration: 120,
											inDuration: 120
										}}>
										<i className="material-icons">info_outline</i>
									</Button>
								</Link>

								<Link to={`/campaigns/${campaignSummary.address}/requests`}
									className="collection-list-item">
									<Button tooltip="Check the requests that the manager has open for the campign"
										tooltipOptions={{
											position: "left",
											outDuration: 120,
											inDuration: 120
										}}>
										<i className="material-icons">list_alt</i>
									</Button>
								</Link>

								<Link to={`/campaigns/${campaignSummary.address}/requests/new`}
									className="collection-list-item">
									<Button tooltip="Add a new request to the campaign"
										tooltipOptions={{
											position: "left",
											outDuration: 120,
											inDuration: 120
										}}>
										<i className="material-icons">playlist_add_circle</i>
									</Button>
								</Link>
							</ul>
						</li>
					);
				})}
			</ul>
		);
	};
}

export default Campaigns;
