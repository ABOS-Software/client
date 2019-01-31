import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import {CREATE} from 'react-admin';

import restClient from '../../grailsRestClient';

import PropTypes from 'prop-types';

const dataProvider = restClient;

const styles = theme => ({

});
class addUser extends React.Component {
  state = {
    userName: '',
    password: '',
    fullName: ''
  };
  updateAddUserState = (field, value) => {
    this.setState({[field]: value});
  };
  addSingleUser = event => {
    dataProvider(CREATE, 'User', {
      data: {
        username: this.state.userName,
        full_name: this.state.fullName,
        password: this.state.password
      }
    }).then(response => {
      this.props.closeDialog();
    });
  };

  render() {
    const {classes} = this.props;

    return (
      <Dialog
        key={'addUserDialog'}

        open={this.props.open}
        onClose={() => this.props.closeDialog()}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the information about the user
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='AddUser-Username'>Username</InputLabel>
            <TextField
              value={this.state.userName}
              onChange={event => {
                this.updateAddUserState('userName', event.target.value);
              }}
              inputProps={{
                name: 'UserName',
                id: 'AddUser-Username'
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='AddUser-Password'>Password</InputLabel>
            <TextField
              value={this.state.password}
              type='password'
              onChange={event => {
                this.updateAddUserState('password', event.target.value);
              }}

              inputProps={{
                name: 'Password',
                id: 'AddUser-Password'
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='AddUser-FullName'>FullName</InputLabel>
            <TextField
              value={this.state.fullName}
              onChange={event => {
                this.updateAddUserState('fullName', event.target.value);
              }}

              inputProps={{
                name: 'FullName',
                id: 'AddUser-FullName'
              }}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.closeDialog()} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.addSingleUser} color='primary'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

addUser.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired

};

export default (withStyles(styles, {withTheme: true})(addUser));
