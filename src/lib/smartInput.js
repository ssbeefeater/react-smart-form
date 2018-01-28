import React from 'react';
import PropTypes from 'prop-types';
import withValidator from './withValidator';

export const smartInputProps = {
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

const Validator = withValidator('input');

const smartInput = (CustomComponent) => {
    class SmartInput extends Validator {
        static displayName='Input';
        setValue = (value) => {
            if (this.props.onChangeValue) {
                this.props.onChangeValue(value);
            }
        };
        onChange = (e) => {
            const { value } = e.target;
            this.setValue(value);
            if (this.props.onChange) {
                this.props.onChange(e);
            }
        };
        onFocus = (e) => {
            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        };
        componentWillMount() {
            const { defaultValue, value } = this.props;
            const valueToSet = defaultValue || value;
            this.setValue(valueToSet);
        }
        componentDidMount() {
            if (this.props.focused) {
                this.input.focus();
            }
        }
        shouldComponentUpdate(nextProps) {
            if (!nextProps.value && this.props.defaultValue !== nextProps.defaultValue) {
                this.setValue(nextProps.defaultValue);
                return false;
            } else if (this.props.value !== nextProps.value) {
                this.validate(nextProps.value);
            }
            return true;
        }

        render() {
            const {
                validators,
                defaultValue,
                smartForm,
                onValidate,
                onChangeValue,
                error,
                value,
                ...restProps
            } = this.props;
            const props = {
                ...restProps,
                value,
                onFocus: this.onFocus,
                onChange: this.onChange,
                onBlur: this.onBlur,
                smartForm: {
                    ...smartForm,
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
        value: '',
        defaultValue: '',
        smartForm: {},
        debounce: 300,
    };

    SmartInput.propTypes = smartInputProps;

    return SmartInput;
};


export default smartInput;

