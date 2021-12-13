import "./App.scss";
import "materialize-css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import AppFooter from "./components/AppFooter/AppFooter";
import NewCampaign from "./pages/campaign/new/NewCampaign";
import AppLoader from "./components/AppLoader/AppLoader";
import LoaderService from "./services/LoaderService";
import Requests from "./pages/campaign/requests/Requests";
import NewRequest from "./pages/campaign/requests/new/NewRequest";
import Request from "./pages/campaign/requests/request/Request";

class App extends React.Component {
	state = {
		loading: true
	};

	componentDidMount = () => {
		LoaderService.observers
			.subscribe((loading: boolean) => {
				this.setState({ loading });
			});
	};

	render = () => {
		return (
			<div id="app" className={this.state.loading ? "loading" : ""}>
				<AppNavbar />
				<div id="pages-wrapper" className="container">
					<Routes>
						<Route path="/" element={<Campaigns />} />
						<Route path="campaigns/new" element={<NewCampaign />} />
						<Route path="campaigns/:address" element={<NewCampaign />} />
						<Route path="campaigns/:address/requests" element={<Requests />} />
						<Route path="campaigns/:address/requests/new" element={<NewRequest />} />
						<Route path="campaigns/:address/requests/:requestAddress" element={<Request />} />
					</Routes>
				</div>
				<AppLoader loading={this.state.loading} />
				<AppFooter />
			</div>
		);
	};
}

export default App;
