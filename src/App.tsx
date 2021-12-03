import "./App.scss";
import "materialize-css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import AppFooter from "./components/AppFooter/AppFooter";
import NewCampaign from "./pages/campaign/new/NewCampaign";

class App extends React.Component {
	render = () => {
		return (
			<div id="app">
				<AppNavbar />
				<div id="pages-wrapper" className="container">
					<Routes>
						<Route path="/" element={<Campaigns />} />
						<Route path="campaigns/new" element={<NewCampaign />} />
						<Route path="campaigns/:address" element={<NewCampaign />} />
						<Route path="campaigns/:address/requests" element={<NewCampaign />} />
						<Route path="campaigns/:address/requests/new" element={<NewCampaign />} />
						<Route path="campaigns/:address/requests/:requestAddress" element={<NewCampaign />} />
					</Routes>
				</div>
				<AppFooter />
			</div>
		);
	};
}

export default App;
