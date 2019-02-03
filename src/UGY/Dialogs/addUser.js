import React from 'react';
import {withStyles} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import {CREATE} from 'react-admin';

import restClient from '../../grailsRestClient';

import PropTypes from 'prop-types';
import DialogBase from './DialogBase';

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

  renderForm () {
    const {classes} = this.props;

    return (
      <div>
        {this.renderUserName(classes)}
        {this.renderPassword(classes)}
        {this.renderFullName(classes)}
      </div>);
  }

  renderFullName (classes) {
    return <FormControl className={classes.formControl}>
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
    </FormControl>;
  }

  renderPassword (classes) {
    return <FormControl className={classes.formControl}>
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
    </FormControl>;
  }

  renderUserName (classes) {
    return <FormControl className={classes.formControl}>
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
    </FormControl>;
  }

  render () {
    // const {classes} = this.props;
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.addSingleUser}
      title={'Add User'}
      subText={'Please enter the information about the user'}>
      {this.renderForm()}
    </DialogBase>);
  }
}

addUser.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired

};

export default (withStyles(styles, {withTheme: true})(addUser));
