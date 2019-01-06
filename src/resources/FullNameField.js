import React from 'react';
import pure from 'recompose/pure';

const FullNameField = ({record = {}, size}) => (
    <div style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'center'}}>
        {record.customerName}
    </div>
);

const PureFullNameField = pure(FullNameField);

PureFullNameField.defaultProps = {
    source: 'customerName',
    label: 'resources.customers.fields.name',
};

export default PureFullNameField;