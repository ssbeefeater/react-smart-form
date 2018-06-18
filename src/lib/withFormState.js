import React, { PureComponent } from 'react';
import smartFormContext from './smartFormContext';

const withFormState = (CustomButton) => {
    class SmartButton extends PureComponent {
        render() {
            return (
                <smartFormContext.Consumer>
                    {context => <CustomButton {...this.props}
                        smartForm={{
                            disabled: context.disabled,
                            loading: context.loading,
                            hasChange: context.hasChange,
                        }}
                    />}
                </smartFormContext.Consumer>
            );
        }
    }
    return SmartButton;
};

export default withFormState;
