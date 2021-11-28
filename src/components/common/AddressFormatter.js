
import React from 'react';
import { Popup } from 'semantic-ui-react';

class AddressFormatter extends React.Component {

    state = {
        isOpen: false
    }

    renderText() {
        return (
            <span className={this.props.className}
                style={{
                    display: this.props.showTextElipsis ? "inline-block" : "auto",
                    maxWidth: this.props.maxWidth ? this.props.maxWidth : "auto",
                    whiteSpace: this.props.showTextElipsis ? "nowrap" : "auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                    textUnderlineOffset: "1px"
                }}
            onClick={this.onClickToCopy}>
                {this.props.address}
            </span>
        );
    }

    onClickToCopy = ()=>{
        navigator.clipboard.writeText(this.props.address);
    }

    render() {
        return (
            <Popup flowing 
                hoverable
                hideOnScroll
                trigger={this.renderText()}>
                <div onClick={this.onClickToCopy}>
                    <span style={{marginRight: "0.5em"}}>{this.props.address}</span>
                    <small style={{cursor: "pointer"}}>(click to copy)</small>
                </div>
            </Popup>
        );
    }
}

export default AddressFormatter;