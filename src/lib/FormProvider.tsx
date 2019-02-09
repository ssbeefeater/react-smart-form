import * as React from 'react';
import isEqual = require('lodash.isequal');
import debounce = require('lodash.debounce');
import castArray = require('lodash.castarray');

export const FormContext = React.createContext({});

type AnyObject = { [i: string]: any };


const removeNullValues = (obj: AnyObject) => {
    return Object.keys(obj).reduce((occum: any, key: string) => {
        const currentValue = obj[key];
        if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
            occum[key] = currentValue;
        }
        return occum;
    }, {});
};
export type FormState<V= AnyObject, P= AnyObject> = {
    hasChange: () => boolean;
    reset: (inputNames?: string | string[]) => void;
    getErrors: (name?: string | number) => Errors<V>;
    getValues: (name?: string | number) => V | any;
    setErrors: (errors: Errors<V>) => void;
    setValues: (values: V) => void;
    submit: () => void;
    props: P & FormProps<V>,
} & State<V>;
export type WithFormState = { formState: FormState };

type Errors<V= AnyObject> = {
    [T in keyof V]?: string | boolean;
};

type Validator<V= AnyObject> = (value: any, values: V) => string | boolean;

type Validators<V= AnyObject> = {
    [T in keyof V]?: Validator | Validator[];
};

interface State<V= AnyObject> {
    values: Partial<V>;
    errors: AnyObject;
    loading: boolean;
    disabled: boolean;
}


export interface FormProps<V> {
    onChange?: (values: Partial<V>, hasChange: () => boolean) => void;
    onSubmit?: (values: V, formState: FormState) => any | Promise<any>;
    onChangeErrorState?: (errorInfo: { errors: Errors<V>, hasError: boolean }) => void;
    values?: V;
    validators?: Validators<V>;
    loading?: boolean;
    disabled?: boolean;
    singleValue?: boolean;
    component?: any;
    defaultValues?: Partial<V>;
    onValidate?: (errorInfo: { errors: Errors<V>, hasError: boolean, hasChange: FormState['hasChange'] }) => void;
    formRef?: (formState: FormState<V>) => void;
}
const parseValidatorKey = (val: string): string | Function => {
    try {
        const fn = eval(`(${val})`);
        if (typeof fn === 'function') {
            return fn;
        }
    } catch (err) {
    }
    return val;
};
export class Form<V= AnyObject> extends React.PureComponent<FormProps<V>, State<V>> {

    constructor(props: FormProps<V>) {
        super(props);

        this.state = {
            values: this.props.values || this.props.defaultValues || {},
            loading: false,
            disabled: false,
            errors: {},
        };
        this.validators = Form.parseValidators(props.validators);
        this.state = {
            ...this.state,
            errors: this.validate(this.state.values, true)
        };
    }
    validators: Validators<V>;

    static parseValidators = (validators: any) => {
        if (validators) {
            return Object.keys(validators).reduce((accum: any, key: string) => {
                const validatorValue = validators[key];
                const parsedKey = parseValidatorKey(key);
                if (typeof parsedKey === 'function') {
                    const castValidatorValue = castArray(validatorValue);
                    castValidatorValue.forEach((field: string) => {
                        if (accum[field]) {
                            const current = castArray(accum[field]);
                            accum[field] = [...current, parsedKey];
                        } else {
                            accum[field] = parsedKey;
                        }
                    });
                } else {
                    if (accum[key]) {
                        const current = castArray(accum[key]);
                        accum[key] = [...current, validatorValue];
                    } else {
                        accum[key] = validatorValue;
                    }
                }
                return accum;
            }, {});
        }
        return {};
    }

    defaultValues = this.props.defaultValues || this.props.values || {};

    temp: any = {
        values: this.defaultValues || {},
        errors: {},
    };
    inputs: { [i: string]: any } = {};
    registerInput = (name: string, type: string) => {
        const index = Object.keys(this.inputs).length;
        this.inputs = Object.assign(this.inputs, {
            [name || index]: { type: type || 'string', index }
        });
        return index;
    }

    hasChange = () => {
        return !isEqual(removeNullValues(this.temp.values), removeNullValues(this.defaultValues));
    }

    hasError = (errors?: Errors<V>) => {
        const {
            errors: stateErrors
        } = this.state || {} as any;

        const errorKeys = Object.keys(errors || stateErrors || {});
        if (!errorKeys) {
            return false;
        }
        return (
            errorKeys.some((name) => {
                const error = (errors || stateErrors)[name];
                return (typeof error === 'string' || error === true);
            }));
    }

    private validate = (values: any, initialCheck?: boolean) => {
        const {
            onValidate
        } = this.props;
        if ((!values || !Object.keys(values).length) && this.validators) {
            values = Object.keys(this.validators).reduce((occum: any, key: string) => {
                occum[key] = null;
                return occum;
            }, {});
        } else if (!values) {
            return {};
        }
        const newErrors = Object.keys(values).reduce((occum: AnyObject, key: any) => {
            const currentValue = values[key];
            const currentValidator = this.validators && (this.validators as any)[key];
            occum[key] = Form.errorChecker(currentValidator, currentValue, initialCheck, this.state.values);
            return occum;
        }, {});

        if (onValidate && initialCheck) {
            onValidate(
                {
                    errors: newErrors,
                    hasChange: this.hasChange,
                    hasError: this.hasError({ ...(this.state && this.state.errors || {}), ...newErrors }),
                }
            );
        }

        return newErrors;
    }

    private static errorChecker = (validators: Validator, value: any, initialCheck: boolean, values: AnyObject): string | boolean => {
        let errorMessage: boolean | string = false;
        const propValidators = validators && castArray(validators);
        if (!propValidators) {
            return false;
        }
        propValidators.every((validator) => {
            if (!validator) return true;
            const validate = validator(value, values);
            if (validate !== false) {
                errorMessage = initialCheck ? true : validate;
                return false;
            }
            return true;
        });
        return errorMessage;
    }


    setErrors = (errors: Errors<V>) => {
        if (!errors || !Object.keys(errors).length) {
            return;
        }
        const newErrors = Object.assign({}, this.state.errors, errors);
        this.setState({
            errors: newErrors
        }, () => {
                const {
                    onChangeErrorState
                } = this.props;

                if (onChangeErrorState) {
                    onChangeErrorState({ hasError: this.hasError(newErrors), errors: newErrors });
                }
        });

    }

    setValues = (newValues = {}, defaults?: boolean) => {
        this.temp.values = Object.assign({}, this.state.values, this.temp.values, newValues);
        const initial = Object.keys(newValues).some((val) => !Object.keys(this.temp.errors).includes(val));
        this.temp.errors = Object.assign({}, this.state.errors, this.temp.errors, this.validate(newValues, initial));
        this.setState(this.temp, () => {
            const {
                onChange,
                onValidate
            } = this.props;
            if (onChange && !defaults) {
                onChange(this.temp.values, this.hasChange);
            }

            if (onValidate) {
                onValidate(
                    {
                        errors: this.temp.errors,
                        hasChange: this.hasChange,
                        hasError: this.hasError(),
                    }
                );
            }
        });
    }

    componentWillUpdate(nextProps: FormProps<V>) {
        if (nextProps.defaultValues !== this.props.defaultValues) {
            this.defaultValues = nextProps.defaultValues;
            this.setValues(this.defaultValues);
        }
    }

    setInitialNullValues = () => {
        const nullValues = Object.keys(this.inputs).reduce((accum: any, val: string) => {
            accum[val] = null;
            return accum;
        }, {});

        Object.assign(nullValues, this.state.values);
    }
    componentDidMount() {
        const {
            formRef
        } = this.props;
        this.setInitialNullValues();
        if (formRef) {
            formRef(this.getFormState());
        }
    }
    getValues = (fieldName?: string): V | any => {
        if (typeof fieldName !== 'undefined') {
            if (!Object.keys(this.state.values).includes(fieldName)) {

                const fieldIndex = this.inputs[fieldName].index;
                return (this.state.values as any)[fieldIndex];
            }
            return (this.state.values as any)[fieldName];
        }
        return this.state.values;
    }
    getErrors = (fieldName?: string): V | any => this.state.errors && (fieldName ? this.state.errors[fieldName] : this.state.errors);

    onSubmit = (e?: React.SyntheticEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!this.hasError() && !this.state.loading) {
            if (this.props.onSubmit) {
                const onSubmitValue = this.props.onSubmit(
                    this.getValues() as V,
                    this.getFormState()
                );
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
    }

    handleRequestError = (error: Error | string) => {
        if (!error) {
            return;
        }
        let errors;
        if (error instanceof Error) {
            errors = error.message;
        } else if (typeof error === 'string') {
            errors = Object.keys(this.state.errors).reduce((accum: any, val) => {
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
    }

    reset = (inputName: string | string[]) => {
        const { values } = this.state;
        const newState = { values: {}, errors: {} };
        const names = inputName && castArray(inputName);
        if (names) {
            names.forEach((name: string) => {
                newState.values = Object.assign({}, values, {
                    [name]: '',
                });
            });
        } else {
            newState.values = Object.keys(values).reduce((accum: any, val) => {
                accum[val] = '';
                return accum;
            }, {});
        }
        this.setValues(newState.values);
    }

    getFormState = (): FormState<V> & { registerInput: (name: string, type: string) => void } => {
        const {
            disabled,
            loading
        } = this.props;

        return ({
            registerInput: this.registerInput,
            reset: this.reset,
            setErrors: this.setErrors,
            getValues: this.getValues,
            getErrors: this.getErrors,
            setValues: this.setValues,
            values: this.state.values,
            errors: this.state.errors,
            hasChange: this.hasChange,
            disabled: disabled || this.hasError(),
            loading: loading || this.state.loading,
            submit: this.onSubmit,
            props: this.props,
        });
    }
    render() {
        const {
            children,
            onChange,
            onSubmit,
            onValidate,
            values,
            validators,
            loading,
            disabled,
            defaultValues,
            formRef,
            component: Component = 'form',
            singleValue,
            onChangeErrorState,
            ...props
        } = this.props;
        if (onSubmit || Component === 'form') {
            // @ts-ignore
            props.onSubmit = this.onSubmit;
        }
        return (
            <FormContext.Provider value={this.getFormState()}>
                <Component {...props}>
                    {children}
                </Component>
            </FormContext.Provider>
        );
    }
}

export default Form;