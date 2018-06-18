import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import smartFormContext from './smartFormContext';

const smartForm = (CustomForm) => {
    class SmartForm extends Component {
        defaultValues = {};
        constructor() {
            super();
            this.state = {
                loading: false,
                values: {},
                errors: {},
            };
        }
        setValues = (newValues = {}) => {
            this.setState({
                values: Object.assign(this.state.values, newValues),
            });
            return this;
        };
        hasChange = () => !isEqual(this.state.values, this.defaultValues)
        setDefaultValues = (newValues = {}) => {
            this.defaultValues = Object.assign(this.defaultValues, newValues);
            return this;
        };
        setErrors = (newErrors = {}) => {
            this.setState({
                errors: Object.assign(this.state.errors, newErrors),
            });
            return this;
        };
        getValues = fieldName => (fieldName ? this.state.values[fieldName] : this.state.values);
        getErrors = fieldName => (fieldName ? this.state.errors[fieldName] : this.state.errors);
        hasError = () => {
            const errorKeys = Object.keys(this.state.errors);
            if (!errorKeys.length) {
                return true;
            }
            return (
                errorKeys.some((name) => {
                    const error = this.state.errors[name];
                    return (typeof error === 'string' || error === true);
                }));
        };

        reset = (inputName) => {
            const { values, errors } = this.state;
            const newState = { values: {}, errors: {} };
            if (inputName) {
                newState.values = Object.assign({}, values, {
                    [inputName]: '',
                });
                newState.errors = Object.assign({}, errors, {
                    [inputName]: '',
                });
            } else {
                newState.values = Object.keys(values).reduce((accum, val) => {
                    // eslint-disable-next-line
                    accum[val] = '';
                    return accum;
                }, {});
                newState.errors = Object.keys(errors).reduce((accum, val) => {
                    // eslint-disable-next-line
                    accum[val] = '';
                    return accum;
                }, {});
            }
            this.setValues(newState.values);
        };


        onSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.hasError() && !this.state.loading) {
                if (this.props.onSubmit) {
                    const onSubmitValue = this.props.onSubmit(this.getValues(), this.hasChange);
                    if (onSubmitValue instanceof Promise) {
                        this.setState({
                            loading: true,
                        });
                        onSubmitValue.then(() => {
                            this.setState({
                                loading: false,
                            });
                        }).catch(this.handleRequestError);
                    }
                }
            }
        };
        handleRequestError = (error) => {
            if (!error) {
                return;
            }
            let errors;
            if (error instanceof Error) {
                errors = error.message;
            } else if (typeof error === 'string') {
                errors = Object.keys(this.state.errors).reduce((accum, val) => {
                    accum[val] = error;
                    return accum;
                }, {});
            } else if (typeof error === 'object') {
                errors = error;
            }
            this.setState({ loading: false });
            if (errors) {
                this.setErrors(errors);
            }
        };
        componentWillMount() {
            const { formRef } = this.props;
            if (formRef) {
                formRef({
                    reset: this.reset,
                    setErrors: this.setErrors,
                    setValues: this.setValues,
                    getValues: this.getValues,
                    getErrors: this.getErrors,
                });
            }
        }
        render() {
            const {
                formRef,
                loading,
                disabled,
                ...restProps
            } = this.props;
            const smartFormData = {
                setErrors: this.setErrors,
                getValues: this.getValues,
                getErrors: this.getErrors,
                setValues: this.setValues,
                setDefaultValues: this.setDefaultValues,
                values: this.state.values,
                errors: this.state.errors,
                hasChange: this.hasChange,
                disabled: disabled || this.hasError(),
                loading: loading || this.state.loading,
            };
            return (
                <smartFormContext.Provider value={smartFormData}>
                    <CustomForm
                        {...restProps}
                        onSubmit={this.onSubmit}
                    />
                </smartFormContext.Provider>
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
    return SmartForm;
};


export default smartForm;

