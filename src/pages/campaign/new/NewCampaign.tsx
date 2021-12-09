import React, { FormEvent } from "react";
import { Button, Card, CardTitle, Icon, TextInput } from "react-materialize";
import "./NewCampaign.scss";

class NewCampaign extends React.Component {

	state = {
		errorMessage : "",
		title: "",
		minimumContribution : ""
	}

	componentDidMount = () => {
		console.log("NewCampaign - componentDidMount");
	}

	onSubmit = (event : FormEvent) => {
		event.preventDefault();
		console.log("onSubmit");
	}

	render = () => {
		
		return (
			<Card header={
				<span>
					<Icon>info</Icon>
					<h5>Create new campaign</h5>
				</span>
			}>
				<form onSubmit={this.onSubmit}>
					<TextInput value={this.state.title}
						label="Title"
						onChange={event => this.setState({ title: event.target.value })}/>
					<TextInput value={this.state.minimumContribution}
						label="Minimum contribution"
						onChange={event => this.setState({ minimumContribution: event.target.value })}/>
					<Button> Create</Button>
				</form>
			</Card>
		);
	};
}

export default NewCampaign;
