import React from 'react';
import AppHeader from './AppHeader';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

class AppLayout extends React.Component {

    render() {
        return (
            <Container id="app-container" style={{ paddingTop: '1em'}}>
                <Head>
                    <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
                </Head>
                <AppHeader/>
                {this.props.children}
            </Container>
        );
    }
}

export default AppLayout;