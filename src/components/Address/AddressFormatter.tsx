import './AddressFormatter.scss';
import React from 'react';

type Props = {
    address: string;
    className?: string;
    maxWidth?: string;
};

export default class AddressFormatter extends React.Component<Props> {

    state = {
        address: "",
        className: "",
        maxWidth: "auto",
        isTooltipShown : false
    }

    setTooltipShown = (isTooltipShown : boolean) => this.setState({isTooltipShown});

    render = () => {
        return (
            <span className={`address-formatter ${this.props.className}`}
                onMouseEnter={() => this.setTooltipShown(true)}
                onMouseLeave={() => this.setTooltipShown(false)}
                style={{
                    maxWidth: this.props.maxWidth ? this.props.maxWidth : "auto"
                }}>
                {this.props.address}
            </span>
        );
    };
}