import "./AppNavbar.scss";
import React from "react";
import { Icon, Navbar, NavItem } from "react-materialize";
import { Link } from "react-router-dom";

class AppNavbar extends React.Component {
	componentDidMount = () => {
		// Hello
	};

	renderBrand = () => {
		return (
		  <a href="https://www.decentryfi.xyz">
				<img src="https://raw.githubusercontent.com/decentryfi/styleguide/9ccef39168afa50a53ad56e1c8f6d32c0ccf29a0/logos/secondary-transparent.png" />
				<h5>Kickstart</h5>
			</a>
		);
	};

	render = () => {
		return (
			<Navbar alignLinks="right" brand={this.renderBrand()} menuIcon={<Icon>menu</Icon>}>
				<Link to="/">
					<Icon>list</Icon>
					<span>Campaigns</span>
				</Link>
				<Link to="/campaigns/new">
					<Icon>add</Icon>
					<span>New</span>
				</Link>
			</Navbar>
		);
	};
}

export default AppNavbar;
