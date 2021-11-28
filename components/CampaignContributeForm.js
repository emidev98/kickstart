import React from 'react';
import { Input, Form, Button, Message, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import CampaignService from '../ethereum/services/CampaignService';
import { Router } from '../routes';

class CampaignContributeFrom extends React.Component {
    state = {
        contribution: '0',
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
            const campaign = this.props.campaign;

            if(campaign?.methods || campaign?.options?.address){
                campaign = CampaignService.getCamping(this.props.campaign.options.address);
            }

            await campaign.methods
                .contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.contribution, 'ether')
                });
            Router.replaceRoute(`/campaigns/${this.props.campaign.options.address}`);
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
    
    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input value={this.state.contribution}
                        onChange={event => this.setState({ contribution: event.target.value })}
                        label='ether' 
                        labelPosition='right'
                        placeholder='100' 
                        disabled={this.state.loading}/>
                </Form.Field>
                <Message error header='Oops!' content={this.state.errorMessage}></Message>
                <Button primary 
                    fluid
                    loading={this.state.loading}
                    disabled={this.state.loading}>
                    <Icon name="user plus"/>
                    Contribute
                </Button>
            </Form>
        )
    }
}

export default CampaignContributeFrom;