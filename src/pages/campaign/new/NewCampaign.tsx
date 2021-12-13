import React, { FormEvent } from "react";
import { Button, Card, Col, Icon, Row, Textarea, TextInput } from "react-materialize";
import Web3Service from "../../../services/Web3Service";
import "./NewCampaign.scss";

class NewCampaign extends React.Component {

	state = {
		errorMessage : "",
		title: "",
		minimumContribution : "",
		account : ""
	}

	componentDidMount = () => {
		console.log("NewCampaign - componentDidMount");

		Web3Service.account
			.subscribe((account)=> {
				this.setState({account})
			});
	}

	onSubmit = (event : FormEvent) => {
		event.preventDefault();
		console.log("onSubmit");
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
						<form className="campaign-form" onSubmit={this.onSubmit}>
							<Textarea disabled={!this.state.account} 
								value={this.state.title}
								label="Title"
								data-length={120}
								onChange={event => this.setState({ title: event.target.value })}/>
							<TextInput disabled={!this.state.account} 
								value={this.state.minimumContribution}
								label="Minimum contribution"
								onChange={event => this.setState({ minimumContribution: event.target.value })}/>
							<Col className="form-footer">
								<Button disabled={!this.state.account}> 
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
