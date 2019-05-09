import React from 'react';
import {Datagrid, DateField, FormTab, NumberField, ReferenceManyField, TextField} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import PaymentCreateButton from './PaymentCreateButton';
import PaymentEditButton from './PaymentEditButton';

const styles = () => ({});

class PaymentsTab extends React.Component {
  state = {};

  render () {
    return <FormTab label='Payment Log' path='PayLog' {...this.props}>

      <ReferenceManyField
        addLabel={false}
        sort={{field: 'payment_date', order: 'DESC'}}
        reference='Payments'
        target='customer_id'
      >
        <Datagrid>
          <NumberField label='Amount' source='amount' options={{style: 'currency', currency: 'USD'}}/>
          <TextField label='Method' source='payment_method.name'/>
          <TextField label='Notes' source='note'/>
          <DateField label='Date' source='payment_date'/>
          <PaymentEditButton/>
        </Datagrid>
      </ReferenceManyField>
      <PaymentCreateButton/>
    </FormTab>;
  }
}

PaymentsTab.propTypes = {};

export default (withStyles(styles, {withTheme: true})(PaymentsTab));
