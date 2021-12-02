import React from "react";
import CampaignFactory from "../services/CampaignFactory";
import CampaignService from "../services/CampaignService";
import "./Campaigns.scss";
import { ICampaign } from "../models/ICampaign";

class Campaigns extends React.Component {
	state = {
		campaigns: new Array<ICampaign>()
	};

	componentDidMount = async () => {
		const campaignFactory = CampaignFactory.getCampingFactory();
		const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
		const campaignsSummary = await CampaignService.getCampingsSummary(campaigns);

		this.setState({ campaigns: campaignsSummary });
	};

	render = () => {
		return (
			<pre>
				{this.state.campaigns.map((campaign, index) => {
					return (
						<section key={index}>
							<div>{campaign.minimumContribution}</div>
							<div>{campaign.balance}</div>
							<div>{campaign.requestsCount}</div>
							<div>{campaign.approversCount}</div>
							<div>{campaign.manager}</div>
							<div>{campaign.title}</div>
						</section>
					);
				})}
			</pre>
		);
	};
}

export default Campaigns;
