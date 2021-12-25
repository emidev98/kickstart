import "./RequestRow.scss";
import React from "react";
import IRequest from "../../models/IRequest";
import { Button, Icon } from "react-materialize";
import AddressFormatter from "../Address/AddressFormatter";
import Web3Service from "../../services/Web3Service";
import BlockchainService from "../../services/BlockchainService";

type Props = {
	id: number;
	isManagerAccount: boolean;
	isContributorAccount: boolean;
	request: IRequest;
	onApprove: Function;
	onFinalize: Function;
};

export default class RequestRow extends React.Component<Props> {
	state = {
		isExpanded: false
	};

	render = () => {
		const { id, request, isManagerAccount, isContributorAccount } = this.props;
		const { utils } = Web3Service.provider;
		console.log(this.props.request);
		return (
			<tr className="request-row">
				<td>{id}</td>
				<td className={`request-description-cell ${this.state.isExpanded ? "display-less" : "display-more"}`}>
					<span className="request-description">{request.description}</span>
					<Button
						className="expand-description"
						onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
					>
						<Icon>expand_more</Icon>
						<span className="text-more">More</span>
						<span className="text-less">Less</span>
					</Button>
				</td>
				<td>
					{utils.fromWei(request.amount, "ether")} {BlockchainService.selected.currency}
				</td>
				<td>
					<AddressFormatter address={request.recipient} maxWidth="100px" />
				</td>
				<td className="center">
					{request.approvalCount} / {request.approversCount}
				</td>
				{isContributorAccount || isManagerAccount ? (
					<td className="request-action-cell">
						<div>
							{isContributorAccount ? (
								<Button className="request-action-button" onClick={() => this.props.onApprove()}>
									<span>Approve</span>
									<Icon>check</Icon>
								</Button>
							) : (
								""
							)}
							{isManagerAccount ? (
								<Button className="request-action-button" onClick={() => this.props.onFinalize()}>
									<span>Finalize</span>
									<Icon>send</Icon>
								</Button>
							) : (
								""
							)}
						</div>
					</td>
				) : (
					""
				)}
			</tr>
		);
	};
}
