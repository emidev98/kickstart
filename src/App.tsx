import "./App.scss";
import "materialize-css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign/NewCampaign";
import AppNavbar from "./components/AppNavbar/AppNavbar";

class App extends React.Component {
	componentDidMount = () => {
		// Hello
	};

	render = () => {
		return (
			<div>
				<AppNavbar />
				<Routes>
					<Route path="/" element={<Campaigns />} />
					<Route path="campaigns/new" element={<NewCampaign />} />
				</Routes>
			</div>
		);
	};
}

export default App;
