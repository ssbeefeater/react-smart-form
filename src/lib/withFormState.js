import React, { Component } from 'react';
import defaultFormStorage from './formStorage';

const withFormStates = (formStorage = defaultFormStorage) => (CustomButton) => {
    class SmartButton extends Component {
        constructor() {
            super();
            this.subscription = formStorage.onChangeProps.subscribe(() => {
                this.forceUpdate();
            });
        }
        componentWillUnmount() {
            this.subscription.unsubscribe();
        }
        render() {
            const { disabled, loading } = formStorage;
            return <CustomButton {...this.props} smartForm={{ disabled, loading }}/>;
        }
    }
    return SmartButton;
};

export default withFormStates;
