import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import { Link } from "../routes";

class AppMenu extends React.Component {

    render() {
        return (
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
        );
    }
}

export default AppMenu;