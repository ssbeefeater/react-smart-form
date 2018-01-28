import React, { Component } from 'react';
import PropTypes from 'prop-types';

const smartForm = (CustomForm) => {
    class SmartForm extends Component {
        constructor() {
            super();
            const values = {};
            const errors = {};
            this.state = {
                values,
                errors,
                loading: null,
            };
            this.defaultErrors = {};
        }
        setValues = (newValues) => {
            const { values } = this.state;
            Object.assign(values, newValues);
            this.setState({ values: Object.assign({}, values) });
        };
        setErrors = (fieldErrorMap = {}) => {
            const { errors } = this.state;
            Object.assign(errors, fieldErrorMap);
            this.setState({
                errors: Object.assign({}, errors),
            });
        };
        reset = (inputName) => {
            const { values, errors } = this.state;
            const newState = {};
            if (inputName) {
                newState.values = Object.assign({}, values, {
                    [inputName]: '',
                });
                newState.errors = Object.assign({}, errors, {
                    [inputName]: this.defaultErrors[inputName],
                });
            } else {
                newState.values = Object.keys(values).reduce((accu, val) => {
                    accu[val] = '';
                    return accu;
                }, {});
                newState.errors = Object.keys(errors).reduce((accu, val) => {
                    accu[val] = this.defaultErrors[val];
                    return accu;
                }, {});
            }
            this.setState(newState);
        };
        onSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.props.disabled && !this.hasError() && !this.state.loading) {
                if (this.props.onSubmit) {
                    const onSubmitValue = this.props.onSubmit(this.state.values);
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
            const state = {
                loading: false,
            };
            if (error instanceof Error) {
                state.errors = error.message;
            } else if (typeof error === 'string') {
                state.errors = error;
            } else if (typeof error === 'object') {
                const { errors } = this.state;
                state.errors = Object.assign({}, errors, error);
            }
            this.setState(state);
        };
        onValidate = name => (error) => {
            this.setErrors({ [name]: error });
            if (this.props.onValidate) {
                this.props.onValidate(this.hasError());
            }
        };
        onChangeInput = name => (inputValue) => {
            this.setValues({ [name]: inputValue });
            if (this.props.onChange) {
                this.props.onChange(this.state.values, this.formHasChange());
            }
        };
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
        formHasChange = () => (true);
        modifyChildren = (child) => {
            const childName = child.props.name;
            const hasError = this.hasError();
            const error = this.state.errors[childName];
            const states = {
                error: this.state.errors[childName],
                loading: this.props.loading || this.state.loading,
                disabled: (this.props.disabled && hasError) ||
                (!hasError && this.props.disabled) || (hasError && !this.props.disabled),
            };
            const props = {
                error: typeof error === 'undefined' ? false : error,
                value: this.state.values[childName],
                onChangeValue: this.onChangeInput(childName),
                onValidate: this.onValidate(childName),
                smartForm: states,
            };

            if (child.type.displayName === 'Input') {
                return (React.cloneElement(child, props));
            }
            if (child.type.displayName === 'Submit') {
                return (React.cloneElement(child, {
                    smartForm: states,
                }));
            }
            if ((!child.type || !child.type.displayName) && child.props.children instanceof Array) {
                return React.Children.map(child.props.children, this.modifyChildren);
            }
            return child;
        };
        getValues=fieldName => (fieldName ? this.state.values[fieldName] : this.state.values);
        componentWillMount() {
            const { formRef } = this.props;
            if (formRef) {
                formRef({
                    reset: this.reset,
                    setErrors: this.setErrors,
                    setValues: this.setValues,
                    getValues: this.getValues,
                });
            }
        }
        render() {
            const children = React.Children.map(this.props.children, this.modifyChildren);
            const {
                formRef,
                ...restProps
            } = this.props;
            return (
                <CustomForm
                    {...restProps}
                    onSubmit={this.onSubmit}
                >{children}</CustomForm>
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

