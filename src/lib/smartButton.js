import React, { Component } from 'react';

const smartButton = (CustomButton) => {
    class SmartButton extends Component {
        static displayName = 'Submit';
        render() {
            return <CustomButton {...this.props}/>;
        }
    }
    return SmartButton;
};

export default smartButton;
