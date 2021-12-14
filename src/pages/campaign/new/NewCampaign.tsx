import _ from "lodash";
import React, { BaseSyntheticEvent, FormEvent } from "react";
import { Button, Card, CardPanel, Col, Icon, Row, Textarea, TextInput } from "react-materialize";
import CampaignFactory from "../../../services/CampaignFactory";
import LoaderService from "../../../services/LoaderService";
import Web3Service from "../../../services/Web3Service";
import "./NewCampaign.scss";

class NewCampaign extends React.Component {

	state = {
		title: {
			value: "",
			errorMessage: "",
			isValid:  false
		},
		minimumContribution: {
			value: "",
			errorMessage: "",
			isValid:  false
		},
		errorMessage: "",
		account: ""
	}

	componentDidMount = () => {
		Web3Service.account
			.subscribe((account)=> {
				this.setState({account})
			});
	}

	validateForm = (event: BaseSyntheticEvent) => {
		event.preventDefault();
		const { id, value } : { 
			id: "title" | "minimumContribution",
			value: string | number
		} = event.target;
		let errorMessage = "";

		switch(id){
			case 'title':
				if(!value) {
					errorMessage = "Write a title for your campaign";
				}
				else if((value as string).length > 80) {
					errorMessage = "Campaign title should not be longer than 80 characters";
				}
				else errorMessage = "";
				break;
			case 'minimumContribution':
				if(!value){
					errorMessage = "Minimum contribution cannot be empty";
				}
				else if(!_.gt(value, 0)) {
					errorMessage = "Minimum contribution needs to be a positive number";
				}
				else errorMessage = "";
				break;
		}

		this.setState({
			[id] : {
				value,
				errorMessage,
				isValid: _.isEmpty(errorMessage)
			},
			errorMessage
		});
	}

	onSubmit = async (event : FormEvent) => {
		LoaderService.loading(true);
		event.preventDefault();
		try {
			console.log(this.state)
			await CampaignFactory.createCamping(
				this.state.minimumContribution.value,
				this.state.title.value
			);
		}
		catch(e : any) {
			M.toast({ html: e.message});
		}
		LoaderService.loading(false);
	}

	render = () => {
		return (
			<Card className="new-campaign" header={
				<div className="card-header">
					<h5>Create new campaign</h5>
				</div>
			}>
				<Row>
					<Col l={8} m={6} s={12}>
						<form className="campaign-form" 
							onSubmit={this.onSubmit} 
							onChange={this.validateForm}>
							<Textarea id='title'
								disabled={!this.state.account}
								label="* Title"
								data-length={80}
								className={`${this.state.title.errorMessage? "invalid":""}`}/>
							<CardPanel className="error-panel"
								style={{
									display: this.state.title.errorMessage ? "block" : "none"
								}}>{this.state.title.errorMessage}</CardPanel>
							<TextInput id='minimumContribution'
								disabled={!this.state.account}
								label="* Minimum contribution"
								type="number"
								inputClassName={
									`hide-scrollbar ${this.state.minimumContribution.errorMessage? "invalid":""}`}/>
							<CardPanel className="error-panel"
								style={{
									display: this.state.minimumContribution.errorMessage ? "block" : "none"
								}}>{this.state.minimumContribution.errorMessage}</CardPanel>
							<Col className="form-footer">
								<Button disabled={
									!this.state.minimumContribution.isValid || !this.state.title.isValid
								}> 
									<Icon>add</Icon>
									<span>Create</span>
								</Button>
							</Col>
						</form>
					</Col>

					<Col l={4} m={6} s={12}>
						<ul className="campaign-description">
							<li>
								To create a new campaign install and connect your
								<a href="https://metamask.io/download.html" 
									rel="noreferrer" 
									target="_blank"> Metamask wallet</a>.
							</li>

							<li>
								Everyone can create as many campaigns as needed.
							</li>

							<li>
								When a campaign is created the address used to connect is assigned as manager
								to the campaign.
							</li>
							
							<li>
								The manager can create spending requests which needs to be approved by at least 
								50% of people who donate to the campaign in order to be executed by the manager.
							</li>

							<li>
								Introduce a campaign title and a minimum accepted transaction contribution
							</li>
						</ul>
					</Col>
				</Row>
			</Card>
		);
	};
}

export default NewCampaign;
