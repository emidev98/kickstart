import React from "react";
import AppLayout from "../../components/common/AppLayout";
import { Input, Form, Button, Message } from "semantic-ui-react";
import { Router } from "../../../routes";
import CampaignFactory from "../../../ethereum/services/CampaignFactory";

class NewCampaign extends React.Component {
    state = {
        minimumContribution: "0",
        title: "",
        errorMessage: "",
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            errorMessage: "",
            loading: true
        });

        try {
            await CampaignFactory.createCamping(this.state.minimumContribution, this.state.title)
            Router.replaceRoute("/");
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
            <AppLayout backRoute="/"
            pageTitle="Create campaign">
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Title</label>
                        <Input value={this.state.title}
                            onChange={event => this.setState({ title: event.target.value })}
                            placeholder="Lorem ipsum..." 
                            disabled={this.state.loading}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                            label="ether" 
                            labelPosition="right"
                            placeholder="100" 
                            disabled={this.state.loading}/>
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}></Message>
                    <Button primary 
                        loading={this.state.loading}
                        disabled={this.state.loading}> Create</Button>
                </Form>
            </AppLayout>
        );
    };

}

export default NewCampaign; 