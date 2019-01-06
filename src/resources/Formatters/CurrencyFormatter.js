import React from 'react';
import PropTypes from 'prop-types';

const CurrencyFormatter = ({value = 0}) => {
    let valueFloat = parseFloat(value).toFixed(2);
    let valueUSD = "$" + valueFloat;
    return <span>{valueUSD}</span>
};

CurrencyFormatter.propTypes = {
    value: PropTypes.number
};

export default CurrencyFormatter;
