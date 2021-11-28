import React from 'react';
import AppLayout from '../../components/AppLayout';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import web3 from '../../ethereum/web3';
import CampaignFactory from '../../ethereum/services/CampaignFactory';


class NewCampaign extends React.Component {
    state = {
        minimumContribution: '0',
        errorMessage : '',
        loading : false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            errorMessage: '',
            loading: true
        });

        try {
            const accounts = await web3.eth.getAccounts();
            const campaignFactory = CampaignFactory.getCampingFactory();
            await campaignFactory.methods
                .createCampaign(web3.utils.toWei(this.state.minimumContribution, 'ether'))
                .send({
                    from: accounts[0]
                });
            Router.push("/");
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
            <AppLayout>
                <h2>Create a campaign</h2>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                            label='ether' 
                            labelPosition='right'
                            placeholder='100' 
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

export default NewCampaign; 