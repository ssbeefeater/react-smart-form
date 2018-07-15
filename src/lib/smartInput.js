import React from 'react';
import PropTypes from 'prop-types';
import withValidator from './withValidator';
import smartFormContext from './smartFormContext';

const Validator = withValidator('input');

const makeMeSmart = (CustomComponent) => {
    class SmartInput extends Validator {
        setError = (errorMessage) => {
            const {
                setErrors,
                getErrors,
                name,
            } = this.props.smartFormContextValues;
            if (errorMessage !== getErrors(name)) {
                setErrors({ [this.props.name]: errorMessage });
            }
        };

        setValue = (value) => {
            const currentValue = this.props.smartFormContextValues.getValues(this.props.name);
            if (value !== currentValue) {
                this.props.smartFormContextValues.setValues({ [this.props.name]: value });
            }
        };

        onChange = (value) => {
            let val = value;

            if (value && value.target && typeof value.target.value !== 'object') {
                val = value.target.value;
            }

            this.setValue(val);
            this.validate(val);
            if (this.props.onChange) {
                this.props.onChange(val);
            }
        };

        shouldComponentUpdate(nextProps) {
            const prevProps = this.props;
            const {
                smartFormContextValues,
                name,
            } = this.props;

            if (prevProps.defaultValue !== nextProps.defaultValue) {
                const valueToSet = nextProps.defaultValue || '';
                smartFormContextValues.setValues({ [name]: valueToSet });
                smartFormContextValues.setDefaultValues({ [name]: valueToSet });
                smartFormContextValues.setErrors({
                    [nextProps.name]: this.generateErrorMessage(valueToSet, true),
                });
            }
            return true;
        }

        onBlur = (e) => {
            const {
                smartFormContextValues,
                name,
                onBlur,
                validateOnBlur,
            } = this.props;
            if (validateOnBlur) {
                this.validate(smartFormContextValues.getValues(name));
                if (onBlur) {
                    onBlur(e);
                }
            }
        }
        componentWillMount() {
            const { defaultValue, smartFormContextValues } = this.props;
            if (!smartFormContextValues) { return; }

            const valueToSet = defaultValue || '';
            smartFormContextValues.setValues({ [this.props.name]: valueToSet });
            smartFormContextValues.setDefaultValues({ [this.props.name]: valueToSet });
            smartFormContextValues.setErrors({
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

            const newProps = {
                ...restProps,
                name,
            };
            if (smartFormContextValues) {
                Object.assign(newProps, {
                    value: smartFormContextValues.getValues(name) || '',
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
                });
            }
            return (<CustomComponent {...newProps} />);
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
        validateOnBlur: PropTypes.bool,
        smartForm: PropTypes.object,
    };
    return props => (
        <smartFormContext.Consumer>
            {context => (<SmartInput {...props} smartFormContextValues={context} />)}
        </smartFormContext.Consumer>);
};


export default makeMeSmart;

