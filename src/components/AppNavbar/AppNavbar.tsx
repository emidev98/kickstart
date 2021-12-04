import "./AppNavbar.scss";
import React from "react";
import { Dropdown, Icon, Navbar, Button } from "react-materialize";
import { NavLink } from "react-router-dom";
import BlockchainService from "../../services/BlockchainService";
import IBlockchain from "../../models/IBlockchain";
import logo from "../../assets/img/logo.png";

class AppNavbar extends React.Component {
	state = {
		selectedBlockchain : {
			name: "",
			url: "",
			contractExplorer: "",
			contractAddress: "",
			currency: "",
			chainId: "",
			icon: ""
		}
	}
	componentDidMount = () => {
		this.initBlockchain();
	};

	initBlockchain = () => {
		this.setState({
			selectedBlockchain : BlockchainService.selected
		});
	}

	getContractExplorerUrl = () => {
		const contractExplorer = this.state.selectedBlockchain.contractExplorer;

		return contractExplorer + "address/" + this.state.selectedBlockchain.contractAddress;
	}

	onSelectBlockchain = (blockchain : IBlockchain) => {
		console.log(blockchain);
	};

	renderBrand = () => {
		return (
			<NavLink to="/">
				<img src={logo} />
				<h5>Kickstart</h5>
			</NavLink>
		);
	};

	renderAvailableBlockchains = () =>{
		console.log(BlockchainService.blockchains);
		return BlockchainService.blockchains
			.filter(blockchain => blockchain.contractAddress)
			.map((blockchain, index)=> {
				return (
					<a onClick={()=> this.onSelectBlockchain(blockchain)} key={index}>
						<div className={`network-logo ${blockchain.icon}`}/>
						<span>{blockchain.name}</span>
					</a>
				);
			});
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
				<Dropdown
					id="change-network-dropdown"
					options={{
						constrainWidth: false,
						coverTrigger: false,
						inDuration: 120,
						outDuration: 120
					}}
					trigger={
						<a>
							<Icon>keyboard_arrow_down</Icon>
							<span>Networks ({this.state.selectedBlockchain.name})</span>
						</a>
					}>
					{this.renderAvailableBlockchains()}
				</Dropdown>
				<Dropdown
					id="more-options-dropdown"
					options={{
						constrainWidth: false,
						coverTrigger: false,
						inDuration: 120,
						outDuration: 120
					}}
					trigger={
						<a>
							<Icon>more_vert</Icon>
						</a>
					}>

					<a href="https://github.com/decentryfi/kickstart" target="_blank" rel="noreferrer">
						<Icon>code</Icon>
						<span>Contract source code</span>
					</a>
					<a href={this.getContractExplorerUrl()} target="_blank" rel="noreferrer">
						<Icon>description</Icon>
						<span>Deployed contract</span>
					</a>
				</Dropdown>
			</Navbar>
		);
	};
}

export default AppNavbar;
