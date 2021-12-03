import React from "react";
import { Footer } from "react-materialize";
import "./AppFooter.scss";
import logo from "./../../assets/img/logo.png";

class AppFooter extends React.Component {
	componentDidMount = () => {
		// Hello
	};

	render = () => {
		return (
			<Footer
				copyrights="&copy; GPL v3"
				moreLinks={
					<a className="right decentryFi" href="https://decentryfi.xyz/">
						<img src={logo} />
						<span>DecentryFi</span>
					</a>
				}
			/>
		);
	};
}

export default AppFooter;
