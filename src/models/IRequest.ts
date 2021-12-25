interface IRequest {
	description: string;
	amount: string;
	recipient: string;
	finalized: boolean;
	approvalCount: string;
	approversCount: string;
}

export default IRequest;
