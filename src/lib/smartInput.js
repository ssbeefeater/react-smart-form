import React from 'react';
import PropTypes from 'prop-types';
import withValidator from './withValidator';
import smartFormContext from './smartFormContext';

const Validator = withValidator('input');

const makeMeSmart = (CustomComponent) => {
    class SmartInput extends Validator {
        setError = (errorMessage) => {
            if (errorMessage !== this.state.error) {
                this.props.smartFormContextValues.setErrors({ [this.props.name]: errorMessage });
            }
        };

        setValue = (value) => {
            const currentValue = this.props.smartFormContextValues.getValues(this.props.name);
            if (value !== currentValue) {
                this.props.smartFormContextValues.setValues({ [this.props.name]: value });
            }
        };

        onChange = (e) => {
            const { value } = e.target;
            this.setValue(value);
            this.validate(value);
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };
        componentWillMount() {
            const { defaultValue } = this.props;
            const valueToSet = defaultValue || '';
            this.props.smartFormContextValues.setValues({ [this.props.name]: valueToSet });
            this.props.smartFormContextValues.setErrors({
                [this.props.name]: this.generateErrorMessage(valueToSet, true),
            });
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
                smartFormContextValues,
                name,
                ...restProps
            } = this.props;
            const props = {
                ...restProps,
                value: smartFormContextValues.getValues(name),
                name,
                onFocus: this.onFocus,
                onChange: this.onChange,
                onBlur: this.onBlur,
                smartForm: {
                    error: smartFormContextValues.getErrors(name),
                },
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
        smartForm: PropTypes.object,
    };
    return props => (
        <smartFormContext.Consumer>
            {context => (<SmartInput {...props} smartFormContextValues={context} />)}
        </smartFormContext.Consumer>);
};


export default makeMeSmart;

