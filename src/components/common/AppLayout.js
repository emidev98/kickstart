import React from 'react';
import AppMenu from './AppMenu';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

class AppLayout extends React.Component {

    render() {
        return (
            <Container id="app-container" style={{ paddingTop: '1em'}}>
                <Head>
                    <title>Kickstart from DecentryFi</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                    <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
                    <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/decentryfi/website/main/images/favicon.png" />
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