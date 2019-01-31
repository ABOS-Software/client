import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {UPDATE} from 'react-admin';

import restClient from '../../grailsRestClient';

const dataProvider = restClient;

const styles = theme => ({

});
class EditUser extends React.Component {
  state = {
    id: this.props.id,
    userName: this.props.userName,
    password: '',
    fullName: this.props.fullName
  };

  updateEditUserState = (field, value) => {
    this.setState({[field]: value});
  };
  editUser = event => {
    dataProvider(UPDATE, 'User', {
      id: this.state.id,
      data: {
        username: this.state.userName,
        full_name: this.state.fullName,

        password: this.state.password
      }
    }).then(response => {
      this.props.closeDialog();
    });
  };

  render () {
    return (
      <Dialog

        open={this.props.open}
        onClose={() => this.props.closeDialog()}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the information about the user
          </DialogContentText>
          <TextField
            value={this.state.userName}
            label={'Username'}
            onChange={event => {
              this.updateEditUserState('userName', event.target.value);
            }}
            inputProps={{
              name: 'UserName',
              id: 'AddUser-Username'
            }}
            disabled
          />
          <TextField
            label={'Password'}

            value={this.state.password}
            type='password'
            onChange={event => {
              this.updateEditUserState('password', event.target.value);
            }}

            inputProps={{
              name: 'Password',
              id: 'AddUser-Password'
            }}
          />
          <TextField
            label={'FullName'}

            value={this.state.fullName}
            onChange={event => {
              this.updateEditUserState('fullName', event.target.value);
            }}

            inputProps={{
              name: 'FullName',
              id: 'AddUser-FullName'
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.closeDialog()} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.editUser} color='primary'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditUser.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired
};

export default (withStyles(styles, {withTheme: true})(EditUser));
