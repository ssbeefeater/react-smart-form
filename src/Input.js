import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Eye from 'mdi-react/EyeIcon';
import EyeOff from 'mdi-react/EyeOffIcon';
import classNames from 'classnames';
import colors from './lib/theme/colors';
import smartInput from './lib/smartInput';

const InputOuter = styled.div`
    font-family: 'Roboto', sans-serif;
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      font-size: 12px;
    }
    ::-moz-placeholder { /* Firefox 19+ */
      font-size: 12px;
    }
    :-ms-input-placeholder { /* IE 10+ */
      font-size: 12px;
    }
    :-moz-placeholder { /* Firefox 18- */
      font-size: 12px;
    }
    position: relative;
    width:100%;
    margin:4px 0;
    padding:20px 0;
    .smart-form-bar {
        position: relative;
        border-bottom: 1px solid ${colors.shadesOfGray[3]};
        display: block;
        &::before {
            content: '';
            height: 2px;
            width: 0;
            left: 50%;
            bottom: -1px;
            position: absolute;
            background: ${colors.main};
            transition: left 0.28s ease, width 0.28s ease;
            z-index: 2;
        }
    }
    .smart-form-inputField {
        font-family: 'Roboto', sans-serif;
        display: block;
        background: none;
        padding: 4px 0;
        font-size: 16px;
        border-width: 0;
        border-color: transparent;
        width: calc(100%);
        &.widthIcon{
            width: calc(100% - 24px);
        }
        color: transparent;
        transition: all 0.28s ease;
        box-shadow: none;
        ~.control-label {
            color: ${colors.shadesOfGray[2]};
        }
    }
    .smart-form-inputField:focus,
    .smart-form-inputField.hasValue{
        color: ${colors.shadesOfGray[0]};
        ~.control-label {
            font-size: 12px;
            color: ${colors.shadesOfGray[1]};
            top: 4px;
            left: 0;
        }
    }
    .smart-form-inputField {
        &:focus,&.focusedElement {
            outline: none;
            ~.control-label {
                color:  ${colors.main};
            }
            ~.smart-form-bar {
                &::before {
                    width: 100%;
                    left: 0;
                }
            }
        }
    }
    &.withError{
        .smart-form-bar{
            border-bottom: 1px solid ${colors.error};
            &::before {
                background: ${colors.error};
            }
        }
    }
    .inputIcon{
        position:absolute;
        right:0;
        top:24px;
        width:18px;
        height:18px;
        fill:#bebebe;
        cursor:pointer;
    }
    &.textarea{
        textarea {
            resize: none;
            background:${colors.shadesOfGray[4]};
        }
    }
`;

const ErrorWrapper = styled.div`
    position: absolute;
    color:${colors.error};
    font-size:12px;
    line-height:20px;
    margin-top:3px;
`;

const Label = styled.label`
        position: absolute;
        top: 24px;
        pointer-events: none;
        z-index: 1;
        color: ${colors.shadesOfGray[1]};
        font-size: 14px;
        font-weight: normal;
        transition: all 0.28s ease;
        &.required{
            &::after{
                content:' *';
            }
        }
`;

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: this.props.label,
            type: props.type,
        };
    }

    togglePassword = (e, r, value) => {
        if (this.props.type === 'password') {
            this.setState({
                type: value || (this.state.type === 'text' ? 'password' : 'text'),
            });
        }
    };
    onBlur = (e) => {
        if (this.props.focusedLabel) {
            this.setState({
                label: this.props.label,
            });
        }
        if (this.props.onBlur) this.props.onBlur(e);
    };
    onFocus = (e) => {
        if (this.props.focusedLabel) {
            this.setState({
                label: this.props.focusedLabel,
            });
        }
        if (this.props.onFocus) this.props.onFocus(e);
    };

    render() {
        const {
            children,
            type,
            label,
            icon: inputIcon,
            focusedLabel,
            formProps,
            smartForm,
            showPassword,
            debounce: dbnc,
            ...inputOptions
        } = this.props;

        const showError = typeof smartForm.error === 'string';
        let { icon } = this.props;
        if (!icon && type === 'password' && showPassword) {
            const ValidIcon = this.state.type === 'password' ? Eye : EyeOff;
            icon = <ValidIcon className="inputIcon" onClick={this.togglePassword} />;
        }
        const Field = type === 'textarea' ? 'textarea' : 'input';
        const inputClassName = classNames({
            hasError: showError,
            hasValue: !!this.props.value || children,
            widthIcon: !!icon,
        });
        const inputProps = {
            ...inputOptions,
            onFocus: this.onFocus,
            type: this.state.type,
            onBlur: this.onBlur,
            readOnly: this.props.readOnly || this.props.disabled,
            className: `${inputClassName} smart-form-inputField`,
            ref: (input) => {
                this.input = input;
                if (inputOptions.ref) {
                    inputOptions.ref(input);
                }
            },
        };
        const fieldComponent = this.props.wrapComponent ?
            <div className={inputProps.className}
                onBlur={this.onBlur}
                onFocus={this.onFocus}>{children}</div>
            : <Field {...inputProps} />;
        return (
            <InputOuter className={classNames({
                withError: showError,
            }, type, 'input')}>
                {
                    children ?
                        React.cloneElement(children, {
                            ...inputProps,
                            className: inputClassName,
                        }) :
                        <div>
                            {fieldComponent}
                            {icon}
                            <Label className={classNames(
                                { required: inputOptions.required },
                                'control-label',
                            )}>{this.state.label}</Label>
                            <i className="smart-form-bar" />
                        </div>
                }
                <ErrorWrapper className="smart-form-errorMessage">{smartForm.error}</ErrorWrapper>
            </InputOuter>
        );
    }
}
Input.defaultProps = {
    value: '',
    showPassword: true,
    debounce: 300,
    formProps: {},
};
Input.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    validators: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.func),
        PropTypes.func,
    ]),
    icon: PropTypes.string,
    onChange: PropTypes.func,
    focusedLabel: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    focused: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    showPassword: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    defaultValue: PropTypes.string,
    inputRef: PropTypes.func,
    debounce: PropTypes.number,
    wrapComponent: PropTypes.element,
    formProps: PropTypes.shape({
        beforeSubmit: PropTypes.bool,
        onValidate: PropTypes.func,
        onChangeValue: PropTypes.func,
        requestError: PropTypes.string,
    }),
};

export default smartInput(Input);
