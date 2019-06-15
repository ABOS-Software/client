import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {change, isSubmitting, submit} from 'redux-form';
import {
  Button,
  crudGetMatching,
  Edit,
  fetchEnd,
  fetchStart,
  LongTextInput,
  ReferenceInput,
  required,
  SelectInput,
  showNotification,
  SimpleForm
} from 'react-admin';
import IconEdit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const redirect = (basePath, id, data) => `/customers/${data.customer_id}/notes`;

class NotesEditButton extends Component {
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
      basePath: '/Notes',
      hasCreate: false,
      hasEdit: true,
      hasList: false,
      hasShow: false,
      resource: 'Notes'
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
                <LongTextInput source={'note'} validate={required()}/>
                <ReferenceInput label='Code' source='note_code.id' reference='note_codes' validate={required()}>
                  <SelectInput optionText='name'/>
                </ReferenceInput>
              </SimpleForm>
            </Edit>
          </DialogContent>

        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isSubmitting: isSubmitting('notes-quick-create')(state)
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
  NotesEditButton
);
