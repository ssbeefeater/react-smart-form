import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, { injectGlobal } from 'styled-components';
import colors from './lib/theme/colors';

const duration = '1.4';
const offset = '187';

const SVG = styled.svg`
    animation: rotator ${duration}s linear infinite;
    stroke: ${colors.main};
`;

injectGlobal`
    @keyframes rotator {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(270deg);
        }
    }
    .path {
        stroke-dasharray: ${offset};
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: dash ${duration}s ease-in-out infinite;
    }
    @keyframes dash {
        0% {
            stroke-dashoffset: ${offset};
        }
        50% {
            stroke-dashoffset: ${offset / 4};
            transform: rotate(135deg);
        }
        100% {
            stroke-dashoffset: ${offset};
            transform: rotate(450deg);
        }
    }
`;

const Spinner = (props) => {
    const className = classNames(props.className, 'spinner');
    return (
        <div className={className}>
            <SVG width={`${props.size}px`} height={`${props.size}px`} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
            </SVG>
        </div>
    );
};

Spinner.defaultProps = {
    size: 24,
};

Spinner.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
};

export default Spinner;
