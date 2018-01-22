import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import colors from '../lib/theme/colors';

const OptionWrapper = styled.li`
    font-weight:400;
    font-size:13px;
    cursor:pointer;
    padding:17px 16px;
    background:#ffffff;
    &:first-child,&:last-child{
       padding-top:17.5px;
       padding-bottom:17.5px;
    }
    &:not(:last-child){
        border-bottom:1px solid ${colors.shadesOfGray[3]};
    }
    &:hover{
        background:rgba(158, 158, 158,0.1);
    }
     &:active{
         background:rgba(158, 158, 158,0.4);
    }
    box-sizing: border-box;
    &.hoveredItem{
        background-color:rgba(158, 158, 158,0.1);
    }
`;

class Option extends Component {
    onMouseDown = () => {
        if (this.props.onClickAction) {
            this.props.onClickAction(this.props.properties);
        }
    };
    render() {
        const optionClassName = classNames({
            hoveredItem: this.props.focused,
        });
        return (
            <OptionWrapper ref={this.props.optionRef}
                className={optionClassName}
                onMouseDown={this.onMouseDown}
                onClick={this.onClick}
                onMouseEnter={this.props.onMouseEnter}>
                {this.props.properties.label}
            </OptionWrapper>
        );
    }
}
Option.defaultProps = {
    properties: {},
};
Option.propTypes = {
    onClickAction: PropTypes.func,
    focused: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    properties: PropTypes.object,
    optionRef: PropTypes.func,
};

export default Option;
