class FormStore {
    values = {};
    errors = {};
    defaultValues={};
    defaultErrors={};
    setValues = (newValues = {}) => {
        Object.assign(this.values, newValues);
        return this;
    };
    setDefaultValues = (newValues = {}) => {
        Object.assign(this.defaultValues, newValues);
        return this;
    };
    setDefaultErrors = (newValues = {}) => {
        Object.assign(this.defaultErrors, newValues);
        return this;
    };
    setErrors = (newErrors = {}) => {
        Object.assign(this.errors, newErrors);
        return this;
    };
    getValues=fieldName => (fieldName ? this.values[fieldName] : this.values);
    getErrors=fieldName => (fieldName ? this.errors[fieldName] : this.values);
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
        this.setErrors(newState.errors);
        this.setValues(newState.values);
    };
}

export default FormStore;
