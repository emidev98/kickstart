import "./PageHeader.scss";
import React from "react";
import { Card, Icon } from "react-materialize";
import { Link, To } from "react-router-dom";

type Props = {
	backToUrl: To;
	backTitle?: string;
	title?: string;
	className?: string;
};

class PageHeader extends React.Component<Props> {

	render = () => {
		return (
			<Card className={`page-header ${this.props.className ? this.props.className : ""}`}>
				<Link className="back-link" to={this.props.backToUrl}>
					<Icon className="back-icon">chevron_left</Icon>
					<h5 className="back-title">{this.props.backTitle}&nbsp;</h5>
				</Link>
				<h5 className="page-title">{this.props.title}</h5>
			</Card>
		);
	};
}

export default PageHeader;
