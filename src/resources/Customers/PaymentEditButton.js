import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {change, isSubmitting, submit} from 'redux-form';
import {
  Button,
  crudGetMatching,
  DateInput,
  Edit,
  fetchEnd,
  fetchStart,
  LongTextInput,
  ReferenceInput,
  required,
  SelectInput,
  showNotification,
  SimpleForm,
  TextInput
} from 'react-admin';
import IconEdit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const redirect = (basePath, id, data) => `/customers/${data.customer_id}/2`;

class PaymentEditButton extends Component {
  state = {
    error: false,
    showDialog: false
  };

  handleClick = () => {
    this.setState({showDialog: true});
  };

  handleCloseClick = () => {
    this.setState({showDialog: false});
  };

  render () {
    const {showDialog} = this.state;
    const editProps = {
      id: this.props.record.id,
      basePath: '/Payments',
      hasCreate: false,
      hasEdit: true,
      hasList: false,
      hasShow: false,
      resource: 'Payments'
    };
    return (
      <Fragment>
        <Button onClick={this.handleClick} label='ra.action.edit'>
          <IconEdit/>
        </Button>
        <Dialog
          fullWidth
          open={showDialog}
          onClose={this.handleCloseClick}
          aria-label='Edit Payment'
        >
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogContent>
            <Edit {...editProps}>
              <SimpleForm form={'payment-edit-form'} redirect={redirect}>
                <TextInput source='amount' validate={required()}/>
                <ReferenceInput label='Method' source='payment_method.id' reference='payment_methods'>
                  <SelectInput optionText='name'/>
                </ReferenceInput>
                <DateInput source='payment_date'/>
                <LongTextInput source={'note'}/>
              </SimpleForm>
            </Edit>
          </DialogContent>

        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isSubmitting: isSubmitting('payment-quick-create')(state)
});

const mapDispatchToProps = {
  change,
  crudGetMatching,
  fetchEnd,
  fetchStart,
  showNotification,
  submit
};

export default connect(mapStateToProps, mapDispatchToProps)(
  PaymentEditButton
);
