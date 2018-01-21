import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from './Spinner';
import colors from './lib/theme/colors';

const ButtonWrapper = styled.button`
    font-size: ${props => (props.size)}px;
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    font-family: 'Poppins', sans-serif;
    font-weight:600;
    padding:${props => (props.size / 2)}px 16px;
    line-height:${props => (props.size)}px;
    margin-top:0;
    background:transparent;
    border-radius:2px;
    border:none;
    cursor:${props => (props.disabled ? 'not-allowed' : 'pointer')};
    color:${props => (props.disabled ? colors.shadesOfGray[3] : props.color)};
    &:active, &:focus{
        outline: none;
        border: none;
    }
    ${props => (props.disabled ? '' : `
    &:hover{
        background:rgba(158, 158, 158,0.1);
    }
     &:active{
        background:rgba(158, 158, 158,0.4);
    }
    `)}


`;
const ButtonContent = styled.div`
    display:flex;
    align-items:center;
`;

const Submit = (props) => {
    const {
        children,
        color,
        size,
        disabled,
        formProps,
        loading,
    } = props;
    return (
        <ButtonWrapper
            size={size}
            color={color}
            disabled={formProps.disabled || disabled || loading}
            className="button submitButton">
            <ButtonContent>
                {loading || formProps.loading ? <Spinner className="spinner" size={size} /> : children}
            </ButtonContent>
        </ButtonWrapper>
    );
};

Submit.displayName = 'Submit';

Submit.defaultProps = {
    color: colors.main,
    size: 18,
};

Submit.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    formProps: PropTypes.shape({
        disabled: PropTypes.bool,
    }),
};
export default Submit;
