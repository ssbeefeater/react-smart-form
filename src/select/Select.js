import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import Input from '../Input';
import Option from './Option';

const SelectList = styled.ul`
    display:inline-block;
    box-shadow: 0 2px 16px rgba(33, 33, 33, 0.35);
    width:100%;
    box-sizing: border-box;
    border-radius: 2px;
    background:#ffffff;
    padding-bottom:8px 0;
    ${props => (props.showList ? '' : `
        display:none;
    `)}
    position:absolute;
    top:60px;
    left:0;
    right:0;
    z-index:2;
    max-height:192px;
    overflow:auto;
`;

const SelectWrapper = styled.div`
    width:100%;
    position:relative;
`;

class Select extends Component {
    constructor(props) {
        super();
        let selectValue = {};
        if (props.value) {
            selectValue = props.options.find(option => option.value === props.value);
        }
        this.state = {
            showList: false,
            selectedOption: selectValue,
            keyword: '',
            focusedList: false,
            focusedOption: 0,
            emptyText: false,
        };
    }
    moveList = (up) => {
        const container = this.listContainer;
        const currentChild = findDOMNode(this.selectedField);
        if (!up && container && currentChild &&
            (currentChild.offsetTop + (currentChild.offsetHeight) >
                container.scrollTop + (container.offsetHeight - 8))) {
            this.containerScrollTo((currentChild.offsetTop - container.offsetTop) +
                (currentChild.offsetHeight * 2) + 12);
        } else if (up && container && currentChild &&
            (currentChild.offsetTop - currentChild.offsetHeight < container.scrollTop)) {
            this.containerScrollTo(((currentChild.offsetTop - container.offsetTop) -
                (currentChild.offsetHeight * 3)) + 12);
        }
    }
    containerScrollTo = (scrollTo) => {
        this.listContainer.scrollTop = scrollTo;
    }
    onKeyUp = (e) => {
        const keyCode = e.keyCode || e.which || e.charCode || 0;
        const focusedOption = this.state.focusedOption;
        switch (keyCode) {
            case 38: // up btn
                if (this.state.showList && focusedOption > 0) {
                    this.setState({ focusedOption: focusedOption - 1 });
                    this.moveList(true);
                } else {
                    this.setState({ showList: true });
                }
                break;
            case 40: // down btn
                if (this.state.showList && focusedOption < this.options.length - 1) {
                    this.setState({ focusedOption: focusedOption + 1 });
                    this.moveList();
                } else {
                    this.setState({ showList: true });
                }
                break;
            case 13: // down btn
                if (this.state.showList) {
                    this.onPressEnter(e);
                }
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        this.listContainer = findDOMNode(this.refs.selectWrapper);
    }
    onPressEnter = () => {
        this.onSelect(this.options[this.state.focusedOption]);
    }
    onChange = (value) => {
        this.setState({
            keyword: value.toLowerCase(),
            showList: true,
            emptyText: false,
            focusedOption: 0,
            selectedOption: {},
        });
        this.containerScrollTo(0);
    }
    onFocus = () => {
        this.setState({
            showList: true,
        });
    }
    onBlur = () => {
        const hasSelectedItem = !!Object.keys(this.state.selectedOption).length;
        const currentOption = this.options[0];
        if (!hasSelectedItem && currentOption &&
            currentOption.label.toLowerCase() === this.state.keyword) {
            this.onSelect(currentOption);
        } else if (!hasSelectedItem) {
            this.onSelect({});
        } else {
            this.setState({
                showList: false,
            });
        }
    }
    onSelect = (selectedOption) => {
        if (!selectedOption) { return; }
        this.setState({
            showList: false,
            keyword: '',
            emptyText: Object.keys(selectedOption).length === 0,
            focusedOption: (selectedOption && selectedOption.index) || this.state.focusedOption,
            selectedOption,
        });
        if (this.props.onChangeValue) {
            this.props.onChangeValue(selectedOption.value || '');
        }
        if (this.props.onSelect) {
            this.props.onSelect(selectedOption);
        }
    }
    onFocusList = () => {
        this.setState({
            focusedList: true,
        });
    }
    getOptions = () => {
        let options = this.props.options;
        const keyword = this.state.keyword;
        if (this.state.keyword) {
            options = options.filter(option => (
                option.label.toLowerCase().includes(keyword) ||
                (typeof option.alias === 'string' && option.alias.toLowerCase().includes(keyword))
            ));
        }
        this.options = options;
        return options.map((option, index) => {
            const isFocused = this.state.focusedOption === index;
            const props = {
                focused: isFocused,
                onClickAction: this.onSelect,
                key: index,
                properties: { ...option, index },
                onMouseEnter: () => {
                    this.setState({ focusedOption: index });
                },
            };
            if (isFocused) {
                props.optionRef = (listItem) => { this.selectedField = listItem; };
            }
            return (<Option {...props } />);
        });
    }
    handleIconClick = () => {
        const nextListState = !this.state.showList;
        this.setState({
            showList: nextListState,
            focusedList: nextListState,
        });
        if (this.input) {
            this.input.focus();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                selectedOption: nextProps.options.find(option => option.value === nextProps.value),
            });
            return false;
        }
        return true;
    }
    render() {
        const children = this.getOptions();
        const inputProps = {
            onValidate: this.props.onValidate,
            onChangeValue: this.onChangeValue,
            hasError: this.props.hasError,
            disabled: this.props.disabled,
            beforeSubmit: this.props.beforeSubmit,

            notifyRequire: this.props.notifyRequire,
            required: this.props.required,
            emptyValue: this.state.emptyText,
            inputOptions: {
                onClick: this.onFocus,
                onKeyUp: this.onKeyUp,
                ref: input => (this.input = input),
                onKeyPress: (e) => {
                    if ((e.keyCode || e.which || e.charCode || 0) === 13 && this.state.showList) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                },
            },
            onBlur: this.onBlur,
            value: this.state.selectedOption.label,
            label: this.props.label,
            onChange: this.onChange,
            type: 'text',
            icon: 'keyboardArrowDown',
            onIconClick: this.handleIconClick,
        };
        return (
            <SelectWrapper>
                <Input {...inputProps} />
                <SelectList tabIndex="0" ref="selectWrapper" showList={this.state.showList} onMouseDown={this.onFocusList}>
                    {children}
                </SelectList>
            </SelectWrapper>
        );
    }
}
Select.defaultProps = {

};
Select.propTypes = {
    label: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    onSelect: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    required: PropTypes.bool,
    onValidate: PropTypes.func,
    onChangeValue: PropTypes.func,
    hasError: PropTypes.bool,
    disabled: PropTypes.bool,
    beforeSubmit: PropTypes.bool,
    notifyRequire: PropTypes.bool,
    value: PropTypes.string,
};

export default Select;
