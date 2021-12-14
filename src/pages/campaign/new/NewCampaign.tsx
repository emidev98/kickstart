import _ from "lodash";
import React, { BaseSyntheticEvent, FormEvent } from "react";
import { Button, Card, CardPanel, Col, Icon, Row, Textarea, TextInput } from "react-materialize";
import Web3Service from "../../../services/Web3Service";
import "./NewCampaign.scss";

class NewCampaign extends React.Component {

	state = {
		form : {
			title: {
				value: "",
				errorMessage: ""
			},
			minimumContribution: {
				value: "",
				errorMessage: ""
			}
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

	onChangeForm = (event: BaseSyntheticEvent) => {
		event.preventDefault();
		const { id, value } : { 
			id: "title" | "minimumContribution",
			value: string | number
		} = event.target;
		
		this.setState({
			form : {
				...this.state.form,
				[id]: {
					...this.state.form[id],
					value
				}
			}
		});

		_.forEach(this.state.form, (formValues, formName) => {
			let errorMessage = "";

			switch(formName){
				case 'title':
					if(!value) {
						errorMessage = "Write a title for your campaign";
					}
					else if((value as string).length > 80) {
						errorMessage = "Minimum contribution needs to be a positive number";
					}
					break;
				case 'minimumContribution':
					if(value < 0) {
						errorMessage = "Minimum contribution needs to be a positive number";
					}
					break;
			}

			if(errorMessage){
				this.setFormValueToState(
					formName,
					formValues,
					errorMessage,
					value
				);
				this.setState({errorMessage});
			}

			//todo validate again 
		})

		console.log(this.state.form.minimumContribution)
		console.log(this.state.form.title)
	}

	setFormValueToState = (formFieldName: any, formFieldValues: any, errorMessage: any, value: any) => {
		this.setState({
			form : {
				...this.state.form,
				[formFieldName]: {
					...formFieldValues,
					errorMessage,
					value
				}
			}
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
						<form className="campaign-form" 
							onSubmit={this.onSubmit} 
							onChange={this.onChangeForm}>
							<Textarea id='title'
								disabled={!this.state.account}
								label="* Title"
								data-length={80}/>
							<TextInput id='minimumContribution'
								disabled={!this.state.account}
								label="* Minimum contribution"
								type="number"
								inputClassName="hide-scrollbar"/>
							<CardPanel className="error-panel"
								style={{
									display: this.state.errorMessage ? "block" : "none"
								}}>{this.state.errorMessage}</CardPanel>
							<Col className="form-footer">
								<Button disabled={!this.state.account || !!this.state.errorMessage}> 
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
