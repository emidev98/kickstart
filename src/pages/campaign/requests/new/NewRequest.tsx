import _ from "lodash";
import React, { BaseSyntheticEvent, FormEvent } from "react";
import { Button, Card, CardPanel, Col, Row, Textarea, TextInput } from "react-materialize";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Subscription } from "rxjs";
import AddressFormatter from "../../../../components/Address/AddressFormatter";
import BlockchainService from "../../../../services/BlockchainService";
import CampaignService from "../../../../services/CampaignService";
import LoaderService from "../../../../services/LoaderService";
import RequestService from "../../../../services/RequestService";
import Web3Service from "../../../../services/Web3Service";
import "./NewRequest.scss";

type Props = {
	campaignAddress: string;
	navigate: NavigateFunction;
};

function NewRequest() {
	const navigate = useNavigate();
	const { address } = useParams();

	return <NewRequestComponent campaignAddress={address ? address : ""} navigate={navigate} />;
}

class NewRequestComponent extends React.Component<Props> {
	accountSubscription?: Subscription;
	state = {
		description: {
			value: "",
			errorMessage: "",
			isValid: false
		},
		amount: {
			value: "",
			errorMessage: "",
			isValid: false
		},
		recipientAddress: {
			value: "",
			errorMessage: "",
			isValid: false
		},
		account: "",
		errorMessage: "Uncompleted",
		isValid: false
	};

	componentDidMount = async () => {
		try {
			await CampaignService.getCampingSummary(this.props.campaignAddress);
		} catch (e) {
			M.toast({ html: `This campaign does not exist on '${BlockchainService.selected.name}'` });
			this.props.navigate("/");
		}
		this.accountSubscription = Web3Service.account.subscribe((account) => {
			this.setState({ account });
		});
	};

	componentWillUnmount = () => {
		this.accountSubscription?.unsubscribe();
	};

	onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		LoaderService.loading(true);
		try {
			await RequestService.createRequest(
				this.props.campaignAddress,
				this.state.description.value,
				this.state.amount.value,
				this.state.recipientAddress.value
			);
			this.props.navigate(`/campaigns/${this.props.campaignAddress}/requests`);
		} catch (err) {
			const { message } = err as Error;
			M.toast({ html: message });
		}
		LoaderService.loading(false);
	};

	onInputChange = (event: BaseSyntheticEvent) => {
		event.preventDefault();
		const {
			id,
			value
		}: {
			id: "description" | "amount" | "recipientAddress";
			value: string | number;
		} = event.target;
		let errorMessage = "";

		switch (id) {
			case "description":
				if (!value) {
					errorMessage = "Write a description for your spending request";
				} else errorMessage = "";
				break;
			case "amount":
				if (!value) {
					errorMessage = "Amount cannot be empty";
				} else if (!_.gt(value, 0)) {
					errorMessage = "Amount needs to be a positive number";
				} else errorMessage = "";
				break;
			case "recipientAddress":
				if (!value) {
					errorMessage = "Recipient address cannot be empty";
				} else errorMessage = "";
				break;
		}

		this.setState({
			[id]: {
				value,
				errorMessage,
				isValid: _.isEmpty(errorMessage)
			}
		});
	};

	render = () => {
		return (
			<Card
				className="new-request"
				header={
					<div className="card-header">
						<h5>New spending request for&nbsp;</h5>
						<AddressFormatter address={this.props.campaignAddress} />
					</div>
				}
			>
				<Row>
					<Col l={8} m={6} s={12}>
						<form className="new-request-form" onSubmit={this.onSubmit}>
							<Textarea
								id="description"
								disabled={!this.state.account}
								value={this.state.description.value}
								label={"* Description"}
								className={`${this.state.description.errorMessage ? "invalid" : ""}`}
								onChange={this.onInputChange}
							/>
							<CardPanel
								className="error-panel"
								style={{
									display: this.state.description.errorMessage ? "block" : "none"
								}}
							>
								{this.state.description.errorMessage}
							</CardPanel>
							<TextInput
								id="amount"
								disabled={!this.state.account}
								value={this.state.amount.value}
								label={`* Amount (in ${BlockchainService.selected.currency})`}
								inputClassName={`${this.state.amount.errorMessage ? "invalid" : ""}`}
								onChange={this.onInputChange}
							/>
							<CardPanel
								className="error-panel"
								style={{
									display: this.state.amount.errorMessage ? "block" : "none"
								}}
							>
								{this.state.amount.errorMessage}
							</CardPanel>
							<TextInput
								id="recipientAddress"
								disabled={!this.state.account}
								value={this.state.recipientAddress.value}
								label={"* Recipient address"}
								inputClassName={`${this.state.recipientAddress.errorMessage ? "invalid" : ""}`}
								onChange={this.onInputChange}
							/>
							<CardPanel
								className="error-panel"
								style={{
									display: this.state.recipientAddress.errorMessage ? "block" : "none"
								}}
							>
								{this.state.recipientAddress.errorMessage}
							</CardPanel>
							<Button
								className="submit-form"
								disabled={
									!this.state.description.isValid ||
									!this.state.amount.isValid ||
									!this.state.recipientAddress.isValid
								}
							>
								<i className="material-icons">add</i>
								Create spending request
							</Button>
						</form>
					</Col>

					<Col l={4} m={6} s={12}>
						<ul className="info-list">
							<li>
								Spending requests must have a <b>description</b> to inform the contributors what is the
								scope of that request so they can approve.
							</li>

							<li>
								The <b>amount</b> is represented in <b>{BlockchainService.selected.currency}</b>. It can
								only be transferred when the spending request is approved by at least 50% of
								contributors.
							</li>

							<li>
								<b>Recipient address</b> is where the amount will be send when you finalize the request.
							</li>
						</ul>
					</Col>
				</Row>
			</Card>
		);
	};
}

export default NewRequest;
