import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {change, isSubmitting, submit} from 'redux-form';
import {
  Button,
  CREATE,
  crudGetMatching,
  DateInput,
  fetchEnd,
  fetchStart,
  LongTextInput,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  showNotification,
  SimpleForm,
  TextInput
} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import dataProvider from '../../grailsRestClient';

class PaymentCreateButton extends Component {
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

  handleSaveClick = () => {
    const {submit} = this.props;

    // Trigger a submit of our custom quick create form
    // This is needed because our modal action buttons are oustide the form
    submit('payment-quick-create');
  };

  handleSubmit = values => {
    const {
      change,
      crudGetMatching,
      fetchStart,
      fetchEnd,
      showNotification,
      record
    } = this.props;

    // Dispatch an action letting react-admin know a API call is ongoing
    fetchStart();

    // As we want to know when the new post has been created in order to close the modal, we use the
    // dataProvider directly
    let createVals = values;
    createVals.year_id = record.year_id;
    createVals.customer_id = record.id;
    createVals.user_id = record.user_id;
    createVals.user_name = record.userName;
    createVals.order_id = record.order.id;

    dataProvider(CREATE, 'payments', {data: createVals})
      .then(({data}) => {
        // Refresh the choices of the ReferenceInput to ensure our newly created post
        // always appear, even after selecting another post
        crudGetMatching(
          'payments',
          {page: 1, perPage: 25},
          {field: 'id', order: 'DESC'},
          {}
        );

        // Update the main react-admin form (in this case, the comments creation form)
        this.setState({showDialog: false});
      })
      .catch(error => {
        showNotification(error.message, 'error');
      })
      .finally(() => {
        // Dispatch an action letting react-admin know a API call has ended
        fetchEnd();
      });
  };

  render () {
    const {showDialog} = this.state;
    const {isSubmitting} = this.props;

    return (
      <Fragment>
        <Button onClick={this.handleClick} label='ra.action.create'>
          <IconContentAdd/>
        </Button>
        <Dialog
          fullWidth
          open={showDialog}
          onClose={this.handleCloseClick}
          aria-label='Create Payment'
        >
          <DialogTitle>Create Payment</DialogTitle>
          <DialogContent>
            <SimpleForm
              // We override the redux-form name to avoid collision with the react-admin main form
              form='payment-quick-create'
              resource='payments'
              // We override the redux-form onSubmit prop to handle the submission ourselves
              onSubmit={this.handleSubmit}
              // We want no toolbar at all as we have our modal actions
              toolbar={null}
            >
              <TextInput source='amount' validate={required()}/>
              <ReferenceInput label='Method' source='payment_method_id' reference='payment_methods' validate={required()}>
                <SelectInput optionText='name'/>
              </ReferenceInput>
              <DateInput source='payment_date' validate={required()}/>
              <LongTextInput source={'note'}/>
            </SimpleForm>
          </DialogContent>
          <DialogActions>
            <SaveButton
              saving={isSubmitting}
              onClick={this.handleSaveClick}
            />
            <Button
              label='ra.action.cancel'
              onClick={this.handleCloseClick}
            >
              <IconCancel/>
            </Button>
          </DialogActions>
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
  PaymentCreateButton
);
