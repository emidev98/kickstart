import "./AppNavbar.scss";
import React from "react";
import { Icon, Navbar } from "react-materialize";
import { NavLink } from "react-router-dom";
import logo from "./../../assets/img/logo.png";

class AppNavbar extends React.Component {
	componentDidMount = () => {
		// Hello
	};

	renderBrand = () => {
		return (
			<a href="https://www.decentryfi.xyz">
				<img src={logo} />
				<h5>Kickstart</h5>
			</a>
		);
	};

	render = () => {
		return (
			<Navbar alignLinks="right" brand={this.renderBrand()} menuIcon={<Icon>menu</Icon>}>
				<NavLink to="/">
					<Icon>list</Icon>
					<span>Campaigns</span>
				</NavLink>
				<NavLink to="/campaigns/new">
					<Icon>add</Icon>
					<span>New</span>
				</NavLink>
			</Navbar>
		);
	};
}

export default AppNavbar;
