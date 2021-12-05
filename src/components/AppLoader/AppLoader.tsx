import "./AppLoader.scss";
import React from "react";
import logo from "../../assets/img/logo.png";
import { ProgressBar } from "react-materialize";

type Props = {
	loading?: boolean;
};

class AppLoader extends React.Component<Props> {
	render = () => {
		return (
			<div className={`app-loader ${this.props.loading ? "loading" : ""}`}>
				<ProgressBar />

				<div className="app-loader-content">
					<img src={logo} />
					<h4>DecentryFi Kickstart</h4>
				</div>
			</div>
		);
	};
}

export default AppLoader;
