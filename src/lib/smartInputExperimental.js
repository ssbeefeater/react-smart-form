import React, { PureComponent } from 'react';
import castArray from 'lodash.castarray';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import defaultFormStorage from './formStore';

const makeMeSmart = (formStorage = defaultFormStorage) => (Component) => {
    class SmartInput extends Component {
        constructor(props) {
            super(props);
            this.validate = debounce(this.validate, props.debounce);
            this.state = {
                value: props.defaultValue,
                error: this.generateErrorMessage(props.defaultValue),
            };
        }
        getError = () => formStorage.getErrors(this.props.name) || '';
        setError = (errorMessage) => {
            if (errorMessage !== this.state.error) {
                formStorage.setErrors({ [this.props.name]: errorMessage });
                this.setState({
                    error: errorMessage,
                });
            }
        };
        generateErrorMessage = (value, initial) => {
            let errorMessage = false;
            const propValidators = castArray(this.props.validators);
            propValidators.every((validator) => {
                if (!validator) return true;
                const validate = validator(value, this);
                if (validate !== false) {
                    errorMessage = initial ? true : validate;
                    return false;
                }
                return true;
            });
            return errorMessage;
        };

        validate = (value) => {
            this.setError(this.generateErrorMessage(value));
        };
        setValue = (value) => {
            const currentValue = formStorage.getValues(this.props.name);
            if (value !== currentValue) {
                formStorage.setValues({ [this.props.name]: value });
                this.setState({ value });
            }
        };


        onChange = (e) => {
            const { value } = e.target;
            this.setValue(value);
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };
        onBlur = (e) => {
            this.validate(e.target.value);
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
        };

        onFocus = (e) => {
            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        };


        componentWillMount() {
            const { defaultValue } = this.props;
            const valueToSet = defaultValue || '';
            formStorage.setValues({ [this.props.name]: valueToSet });
            formStorage.setErrors({ [this.props.name]: this.generateErrorMessage(valueToSet) });
        }
        componentDidMount() {
            if (this.props.focused) {
                this.input.focus();
            }
        }

        shouldComponentUpdate(nextProps, nextState) {
            const nextValue = nextState.value;
            if (!nextValue && this.props.defaultValue !== nextProps.defaultValue) {
                this.setValue(nextProps.defaultValue);
            } else if (this.state.value !== nextValue || this.state.error !== nextState.error) {
                this.validate(nextValue);
                return true;
            }
            return false;
        }
        getValue = () => formStorage.getValues(this.props.name) || '';

        render() {
            const {
                validators,
                defaultValue,
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
            return (<Component {...props}/>);
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
    console.log('rendering');

    return SmartInput;
};


export default makeMeSmart;

