export default interface IRequest {
	description: string;
	amount: string;
	recipient: string;
	finalized: boolean;
	approvalCount: number;
	approversCount: number;
}

export interface IRequestRow extends IRequest{
	isApprovedByAddress?: boolean;
}