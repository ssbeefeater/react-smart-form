import { Subject } from 'rxjs/Subject';

class FormStorage {
    disabled=true;
    loading=false;
    constructor() {
        this.onChange.subscribe(() => {
            this.setProps({
                disabled: this.hasError(),
            });
        });
    }
    values = {};
    errors = {};
    onChange = new Subject();
    onChangeProps = new Subject();
    triggerChange=() => {
        this.onChange.next();
    };
    triggerChangeProps=() => {
        this.onChangeProps.next();
    };
    setValues = (newValues = {}) => {
        Object.assign(this.values, newValues);
        this.triggerChange();
        return this;
    };
    setErrors = (newErrors = {}) => {
        Object.assign(this.errors, newErrors);
        this.triggerChange();
        return this;
    };
    getValues=fieldName => (fieldName ? this.values[fieldName] : this.values);
    getErrors=fieldName => (fieldName ? this.errors[fieldName] : this.values);
    hasError = () => {
        const errorKeys = Object.keys(this.errors);
        if (!errorKeys.length) {
            return true;
        }
        return (
            errorKeys.some((name) => {
                const error = this.errors[name];
                return (typeof error === 'string' || error === true);
            }));
    };
    setProps=(newProps) => {
        const { loading, disabled } = newProps;
        if (loading !== this.loading || disabled !== this.disabled) {
            if (typeof loading !== 'undefined') {
                this.loading = loading;
            }
            if (typeof disabled !== 'undefined') {
                this.disabled = disabled;
            }
            this.triggerChangeProps();
        }
    };
    restore=() => {
        this.values = {};
        this.errors = {};
        this.defaultValues = {};
        this.defaultErrors = {};
    };

    reset = (inputName) => {
        const { values, errors } = this;
        const newState = { values: {}, errors: {} };
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
        this.setValues(newState.values);
    };
}

export default FormStorage;
