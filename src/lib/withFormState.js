import React, { PureComponent } from 'react';
import smartFormContext from './smartFormContext';

const withFormState = (CustomButton) => {
    class SmartButton extends PureComponent {
        render() {
            return (
                <smartFormContext.Consumer>
                    {context => <CustomButton {...this.props}
                        smartForm={context}
                    />}
                </smartFormContext.Consumer>
            );
        }
    }
    return SmartButton;
};

export default withFormState;
