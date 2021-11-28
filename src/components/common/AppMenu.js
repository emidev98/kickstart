import React from "react";
import { Button, Icon, Menu } from "semantic-ui-react";
import { Link } from "../../../routes";

class AppMenu extends React.Component {

    render() {
        return (
        <div style={{marginBottom: "1em"}}>
            <Menu>
                <Menu.Menu position="left">
                    <Link route="/">
                        <a className="item">DecentryFi Kickstart</a>
                    </Link>
                </Menu.Menu>

                <Menu.Menu position="right">
                    <Link route="/">
                        <a className="item">
                            <Icon name="list"/>
                            Campaigns
                        </a>
                    </Link>
                    <Link route="/campaigns/new">
                        <a className="item">
                            <Icon name="plus"/>
                            Campaign
                        </a>
                    </Link>
                </Menu.Menu>
            </Menu>

            <Menu borderless={true}
                style={{ border: "none", boxShadow: "none" }}>
                <Menu.Menu position="left"
                    style={{display: "flex", alignItems: "center"}}>
                        {(
                            this.props.backRoute ? 
                                <Link route={this.props.backRoute}>
                                    <Icon style={{ marginBottom: "2px", cursor: "pointer"}} name="arrow left"></Icon>
                                </Link> : null
                        )}
                    <h3 style={{marginTop: 0, marginLeft: "0.5em"}}>{this.props.pageTitle}</h3>
                </Menu.Menu>

                {(
                    this.props.nextRoute ?                 
                    <Menu.Menu position="right">
                        <Link route={this.props.nextRoute}>
                            <Button primary fluid >
                                <Icon name={this.props.nextRouteIcon}/>
                                {this.props.nextRouteDescription}
                            </Button>
                        </Link>
                    </Menu.Menu> : null
                )}
            </Menu>
        </div>
        );
    }
}

export default AppMenu;