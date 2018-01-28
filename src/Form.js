import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import smartForm from './lib/smartForm';

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
        return (
            <FormWrapper>
                <form {...this.props}>
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
    id: PropTypes.string,
    formRef: PropTypes.func,
};
export default smartForm(Form);

