import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultFormStorage from './formStorage';
import withSmartForm from './withFormState';

const smartForm = (formStorage = defaultFormStorage) => (CustomForm) => {
    class SmartForm extends Component {
        onSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!formStorage.disabled && !formStorage.hasError() && !formStorage.loading) {
                if (this.props.onSubmit) {
                    const onSubmitValue = this.props.onSubmit(formStorage.getValues());
                    if (onSubmitValue instanceof Promise) {
                        formStorage.setProps({
                            loading: true,
                        });
                        onSubmitValue.then(() => {
                            formStorage.setProps({
                                loading: false,
                            });
                        }).catch(this.handleRequestError);
                    }
                }
            }
        };
        componentWillReceiveProps(nextProps) {
            const { loading, disabled } = nextProps;
            if (loading !== this.props.loading || disabled !== this.props.disabled) {
                formStorage.setProps({
                    loading,
                    disabled,
                });
            }
        }
        handleRequestError = (error) => {
            if (!error) {
                return;
            }
            let errors;
            if (error instanceof Error) {
                errors = error.message;
            } else if (typeof error === 'string') {
                errors = error;
            } else if (typeof error === 'object') {
                errors = error;
            }
            formStorage.setProps({ loading: false });
            if (errors) {
                formStorage.setErrors(errors);
            }
        };
        componentWillUnmount() {
            formStorage.restore();
        }
        componentWillMount() {
            const { formRef } = this.props;
            if (formRef) {
                formRef({
                    reset: formStorage.reset,
                    setErrors: formStorage.setErrors,
                    setValues: formStorage.setValues,
                    getValues: formStorage.getValues,
                    getErrors: formStorage.getErrors,
                });
            }
        }
        render() {
            const {
                formRef,
                ...restProps
            } = this.props;
            return (
                <CustomForm
                    {...restProps}
                    onSubmit={this.onSubmit}
                />
            );
        }
    }

    SmartForm.propTypes = {
        onValidate: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        onSubmit: PropTypes.func,
        disabled: PropTypes.bool,
        loading: PropTypes.bool,
        onChange: PropTypes.func,
        id: PropTypes.string,
        formRef: PropTypes.func,
    };
    return withSmartForm()(SmartForm);
};


export default smartForm;

