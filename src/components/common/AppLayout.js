import React from 'react';
import AppMenu from './AppMenu';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

class AppLayout extends React.Component {

    render() {
        return (
            <Container id="app-container" style={{ paddingTop: '1em'}}>
                <Head>
                    <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
                </Head>
                <AppMenu backRoute={this.props.backRoute}
                    pageTitle={this.props.pageTitle}
                    nextRouteDescription={this.props.nextRouteDescription}
                    nextRoute={this.props.nextRoute}
                    nextRouteIcon={this.props.nextRouteIcon}/>
                {this.props.children}
            </Container>
        );
    }
}

export default AppLayout;