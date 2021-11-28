import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import AddressFormatter from './common/AddressFormatter';
const { Row, Cell } = Table;

class RequestRow extends React.Component {

    render() {
        const { id, request } = this.props;
        
        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
                <Cell>
                    <AddressFormatter address={request.recipient}
                        maxWidth="200px"
                        showTextElipsis="true"/>
                </Cell>
                <Cell>{request.approvalCount}/{request.approversCount}</Cell>
                <Cell>
                    <Button color="green" 
                        onClick={ async () => await this.props.onApprove(id)}>
                        Approve
                    </Button>
                </Cell>
                <Cell>
                    <Button color="teal" 
                        onClick={ async () => await this.props.onFinalize(id)}
                        disabled={!(request.approvalCount > (request.approversCount / 2))}>
                        Finalize
                    </Button>
                </Cell>
            </Row>
        );
    };

}

export default RequestRow; 