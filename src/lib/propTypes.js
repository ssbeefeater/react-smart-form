import PropTypes from 'prop-types';

export const formStateShape = PropTypes.shape({
    loading: PropTypes.boolean,
    disabled: PropTypes.boolean,
});

export const smartInputShape = PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    disabled: PropTypes.boolean,
});