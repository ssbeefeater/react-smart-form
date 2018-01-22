import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const FormWrapper = styled.div`
    width:100%;
    font-weight:400;
    form{
        display:flex;
        flex-direction:column;
        align-items: center;
    }
`;

class Form extends Component {
    constructor(props) {
        super(props);
        const values = {};
        const errors = {};
        this.state = {
            values,
            errors,
            loading: null,
            requestError: null,
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
            requestError: null,
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
            this.beforeSubmit = true;
            this.forceUpdate();
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
            state.requestError = error.message;
        } else if (typeof error === 'string') {
            state.requestError = error;
        } else if (typeof error === 'object') {
            const { errors } = this.state;
            state.errors = Object.assign({}, errors, error);
        }
        this.setState(state);
    };
    componentDidUpdate() {
        if (this.beforeSubmit) {
            this.beforeSubmit = false;
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
    }
    onValidate = (error, name) => {
        this.setErrors({ [name]: error });
        if (typeof this.defaultErrors[name] === 'undefined') {
            this.defaultErrors[name] = error;
        }
        if (this.props.onValidate) this.props.onValidate(this.hasError());
    };
    onChangeInput = name => (inputValue) => {
        this.setValues({ [name]: inputValue });
        if (this.props.onChange) {
            this.props.onChange(this.state.values, this.formHasChange());
        }
    };
    hasError = () => (!!this.state.requestError ||
        Object.keys(this.state.errors).some((name) => {
            const error = this.state.errors[name];
            return (typeof error === 'string' || error === true);
        }));
    formHasChange = () => (true);
    modifyChildren = (child) => {
        const hasError = this.hasError();
        const props = {
            errorMessage: this.state.requestError || this.state.errors[child.props.name],
            value: this.state.values[child.props.name],
            formProps: {
                onValidate: (error) => { this.onValidate(error, child.props.name); },
                onChangeValue: this.onChangeInput(child.props.name),
                hasError: this.state.errors[child.props.name],
                beforeSubmit: this.beforeSubmit,
            },
        };
        if (child.type.displayName === 'Input') {
            return (React.cloneElement(child, props));
        }
        if (child.type.displayName === 'Submit') {
            return (React.cloneElement(child, {
                formProps: {
                    loading: this.props.loading || this.state.loading,
                    disabled: (this.props.disabled && hasError) ||
                (!hasError && this.props.disabled) || (hasError && !this.props.disabled),
                },
            }));
        }
        if ((!child.type || !child.type.displayName) && child.props.children instanceof Array) {
            return React.Children.map(child.props.children, this.modifyChildren);
        }
        return child;
    };
    componentWillMount() {
        const { formRef } = this.props;
        if (formRef) {
            formRef({
                reset: this.reset,
                setErrors: this.setErrors,
                setValues: this.setValues,
            });
        }
    }
    render() {
        const children = React.Children.map(this.props.children, this.modifyChildren);
        return (
            <FormWrapper>
                <form id={this.props.id} onSubmit={this.onSubmit}>
                    {children}
                </form>
            </FormWrapper>
        );
    }
}
Form.propTypes = {
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
export default Form;

