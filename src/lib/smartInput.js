import React from 'react';
import PropTypes from 'prop-types';
import defaultFormStorage from './formStorage';
import withValidator from './withValidator';

const Validator = withValidator('input');

const makeMeSmart = (formStorage = defaultFormStorage) => (CustomComponent) => {
    class SmartInput extends Validator {
        constructor(props) {
            super(props);
            this.state = {
                value: props.defaultValue,
                error: this.generateErrorMessage(props.defaultValue),
            };
            this.subscription = formStorage.onChange.subscribe(() => {
                const value = formStorage.getValues(this.props.name);
                const error = formStorage.getErrors(this.props.name);

                if (value !== this.state.value || error !== this.state.error) {
                    this.setState({
                        value,
                        error,
                    });
                }
            });
        }
        setError = (errorMessage) => {
            if (errorMessage !== this.state.error) {
                formStorage.setErrors({ [this.props.name]: errorMessage });
            }
        };

        setValue = (value) => {
            const currentValue = formStorage.getValues(this.props.name);
            if (value !== currentValue) {
                formStorage.setValues({ [this.props.name]: value });
            }
        };

        onChange = (e) => {
            const { value } = e.target;
            this.setValue(value);
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };
        componentWillUnmount() {
            this.subscription.unsubscribe();
        }
        componentWillMount() {
            const { defaultValue } = this.props;
            const valueToSet = defaultValue || '';
            formStorage.setValues({ [this.props.name]: valueToSet });
            formStorage.setErrors({ [this.props.name]: this.generateErrorMessage(valueToSet, true) });
        }
        componentDidMount() {
            if (this.props.focused) {
                this.input.focus();
            }
        }
        render() {
            const {
                validators,
                defaultValue,
                onValidate,
                ...restProps
            } = this.props;
            const props = {
                ...restProps,
                value: this.state.value,
                onFocus: this.onFocus,
                onChange: this.onChange,
                onBlur: this.onBlur,
                smartForm: {
                    error: this.state.error,
                },
                ref: (input) => {
                    this.input = input;
                    if (restProps.ref) {
                        restProps.ref(input);
                    }
                },
            };
            return (<CustomComponent {...props}/>);
        }
    }

    SmartInput.defaultProps = {
        defaultValue: '',
        debounce: 300,
    };
    SmartInput.propTypes = {
        validators: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.func),
            PropTypes.func,
        ]),
        onChange: PropTypes.func,
        focused: PropTypes.bool,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        name: PropTypes.string,
        defaultValue: PropTypes.string,
        debounce: PropTypes.number,
    };
    return SmartInput;
};


export default makeMeSmart;

