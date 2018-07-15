import React, { Component } from 'react';
import castArray from 'lodash.castarray';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

const withValidator = (CustomComponent) => {
    class Validator extends Component {
        constructor(props) {
            super(props);
            this.validate = debounce(this.validate, props.debounce);
            this.state = {
                value: props.defaultValue || props.value,
                error: this.generateErrorMessage(props.defaultValue, true),
            };
            this.onValidate(this.state.error);
        }
        setError = (errorMessage) => {
            const { error } = this.props;
            const undefinedPropError = typeof error === 'undefined';
            const currentError = undefinedPropError ? this.state.error : error;
            if (errorMessage !== currentError) {
                if (undefinedPropError) {
                    this.setState({
                        error: errorMessage,
                    });
                }
                this.onValidate(errorMessage);
            }
        };
        generateErrorMessage = (value, initial) => {
            let errorMessage = false;
            const propValidators = castArray(this.props.validators);
            propValidators.every((validator) => {
                if (!validator) return true;
                const validate = validator(value);
                if (validate !== false) {
                    errorMessage = initial ? true : validate;
                    return false;
                }
                return true;
            });
            return errorMessage;
        };

        validate = (value, initial) => {
            this.setError(this.generateErrorMessage(value, initial));
        };
        setValue = (value) => {
            if (value !== this.state.value) {
                this.setState({ value });
            }
        };

        onChange = (value) => {
            if (typeof this.props.value !== 'string') {
                let val = value;

                if (value && value.target && typeof value.target.value !== 'object') {
                    val = value.target.value;
                }
                this.setValue(val);
            }
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };
        onBlur = (e) => {
            setTimeout(() => { this.validate(this.state.value); }, 100);
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
        };
        onValidate = (error) => {
            const { onValidate } = this.props;
            if (onValidate) {
                onValidate(error);
            }
        };
        shouldComponentUpdate(nextProps, nextState) {
            const nextValue = nextProps.value || nextState.value;
            const currentValue = this.props.value || this.state.value;
            if (!nextValue && this.props.defaultValue !== nextProps.defaultValue) {
                this.setValue(nextProps.defaultValue);
                return false;
            } else if (currentValue !== nextValue) {
                this.validate(nextValue);
            }
            return (nextProps !== this.props) || (nextState !== this.state);
        }
        render() {
            const {
                validators,
                onValidate,
                ...restProps
            } = this.props;
            const props = {
                ...restProps,
                onChange: this.onChange,
                onBlur: this.onBlur,
                error: this.props.error || this.state.error,
                ref: (input) => {
                    this.input = input;
                    if (restProps.ref) {
                        restProps.ref(input);
                    }
                },
            };
            return (<CustomComponent {...props} />);
        }
    }

    Validator.defaultProps = {
        defaultValue: '',
        debounce: 300,
    };
    Validator.propTypes = {
        value: PropTypes.string,
        validators: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.func),
            PropTypes.func,
        ]),
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        defaultValue: PropTypes.string,
        debounce: PropTypes.number,
        onValidate: PropTypes.func,
        error: PropTypes.oneOf([
            PropTypes.string,
            PropTypes.bool,
        ]),
    };

    return Validator;
};


export default withValidator;

