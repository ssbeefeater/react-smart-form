import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import smartForm from './lib/smartForm';
import { formStateShape } from './lib/propTypes';

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
    render() {
        const {
            smartForm,
            ...formProps
        } = this.props;
        return (
            <FormWrapper>
                <form {...formProps}>
                    {this.props.children}
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
    formRef: PropTypes.func,
    smartForm: formStateShape,
};
export default smartForm()(Form);

