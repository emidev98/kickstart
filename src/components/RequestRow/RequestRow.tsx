import "./RequestRow.scss";
import React from "react";
import { IRequestRow } from "../../models/IRequest";
import { Button, Icon } from "react-materialize";
import AddressFormatter from "../Address/AddressFormatter";
import Web3Service from "../../services/Web3Service";
import BlockchainService from "../../services/BlockchainService";
import RequestService from "../../services/RequestService";
import _ from "lodash";

type Props = {
	id: number;
	campaignAddress: string;
	managerAddress: string;
	account: string;
	request: IRequestRow;
	onApprove: Function;
	onFinalize: Function;
};

export default class RequestRow extends React.Component<Props> {
	state = {
		isManagerAddress: false,
		hasAddress: false
	};

	componentDidMount = async () => {
		await this.init();
	};

	componentDidUpdate = async (_previousProps: Props) => {
		if(!_.isEqual(this.props, _previousProps))
			await this.init();
	}

	init = async () => {
		const { id, campaignAddress, managerAddress, account, request } = this.props;
		if (!_.isEmpty(account)) {
			request.isApprovedByAddress = await RequestService.hasApprovedRequest(campaignAddress, account, id);
		}

		const hasAddress = !_.isEmpty(account);
		const isManagerAddress = hasAddress && managerAddress.toLowerCase() === account.toLowerCase();

		this.setState({
			isManagerAddress,
			hasAddress
		});
	}

	render = () => {
		const { id, request } = this.props;
		const { isManagerAddress, hasAddress } = this.state;
		const { utils } = Web3Service.provider;
		const hasConsensus = request.approvalCount / request.approversCount > 0.5;

		return (
			<tr className="request-row">
				<td>{id}</td>
				<td className="request-description-cell">
					<span className="request-description">{request.description}</span>
				</td>
				<td>
					{utils.fromWei(request.amount, "ether")} {BlockchainService.selected.currency}
				</td>
				<td>
					<AddressFormatter address={request.recipient} maxWidth="100px" />
				</td>
				<td className="request-approvals-cell">
					<div>{request.approvalCount} / {request.approversCount}</div>
					<div>({(request.approvalCount / request.approversCount) * 100} %)</div>
				</td>
				<td className="request-action-cell">
					{request.finalized ? (
						<div className="request-actions-wrapper">
							<span className="request-action">
								<span>COMPLETED</span>
								<Icon>check</Icon>
							</span>
						</div>
					) : (
						<div className="request-actions-wrapper">
							{request.isApprovedByAddress ? (
								<span className="request-action">
									<span>APPROVED</span>
									<Icon>check</Icon>
								</span>
							) : (
								<Button className={`request-action approve ${!hasAddress ? "hide" : ""}`}
									disabled={request.isApprovedByAddress}
									onClick={() => this.props.onApprove()}>
									<span className="request-action">
										<span>Approve</span>
										<Icon>check</Icon>
									</span>
								</Button>)
							}
							<Button className={`request-action ${!isManagerAddress ? "hide" : ""}`}
								disabled={!hasConsensus}
								onClick={() => this.props.onFinalize()}>
								<span>Finalize</span>
								<Icon>send</Icon>
							</Button>
						</div>)
					}
				</td>

			</tr>
		);
	};
}
