import React from 'react';
import AppLayout from '../../../components/common/AppLayout';
import { Input, Form, Button, Message, Menu, Icon } from 'semantic-ui-react';
import web3 from '../../../../ethereum/web3';
import CampaignService from '../../../../ethereum/services/CampaignService';
import { Link, Router } from "../../../../routes";
import AddressFormatter from '../../../components/common/AddressFormatter';


class NewRequest extends React.Component {
    state = {
        description: '',
        amount: '',
        receipent: '',
        errorMessage : '',
        loading : false,
    };

    static getInitialProps(props) {
        const address = props.query.address;
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            errorMessage: '',
            loading: true
        });
        const { description, amount, receipent} = this.state;

        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = await CampaignService.getCamping(this.props.address);

            await campaign.methods
                .createRequest(description, web3.utils.toWei(amount, 'ether'), receipent)
                .send({ from: accounts[0] });

            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }
        catch(e) {
            this.setState({
                errorMessage : e.message
            });
        }

        this.setState({
            loading: false
        });
    };
    
    render() {
        return (
            <AppLayout
                backRoute={`/campaigns/${this.props.address}/requests`}
                pageTitle={`Back to campaign requests`}>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                            icon='info' 
                            placeholder='Lorem ipsum dolor sit amet...' 
                            disabled={this.state.loading}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Amount</label>
                        <Input value={this.state.amount}
                            onChange={event => this.setState({ amount: event.target.value })}
                            label='ether' 
                            labelPosition='right'
                            placeholder='100' 
                            disabled={this.state.loading}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Receipient address</label>
                        <Input value={this.state.receipent}
                            onChange={event => this.setState({ receipent: event.target.value })}
                            icon='at' 
                            placeholder='0x88987' 
                            disabled={this.state.loading}/>
                    </Form.Field>

                    <Message error header='Oops!' content={this.state.errorMessage}></Message>
                    <Button primary 
                        loading={this.state.loading}
                        disabled={this.state.loading}> Create</Button>
                </Form>
            </AppLayout>
        );
    };

}

export default NewRequest; 