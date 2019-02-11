import React from 'react';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {CREATE, UPDATE} from 'react-admin';
import DialogBase from './DialogBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import dataProvider from '../../grailsRestClient';

const styles = () => ({});

class UserActionDialog extends React.Component {
  state = {
    userName: '',
    password: '',
    fullName: ''
  };
  updateAddUserState = (field, value) => {
    this.setState({[field]: value});
  };
  closeDialog = () => {
    this.props.closeDialog();
  };

  addSingleUser = event => {
    let data = {
      username: this.state.userName,
      full_name: this.state.fullName,
      password: this.state.password
    };
    if (this.props.id) {
      dataProvider(UPDATE, 'User', {
        id: this.state.id,
        data: data
      }).then(this.closeDialog);
    } else {
      dataProvider(CREATE, 'User', {
        data: data
      }).then(this.closeDialog);
    }
  };

  disableUserName =() => {
    return !!this.props.id;
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
        disabled={this.disableUserName()}
      />
    </FormControl>;
  }

  render () {
    // const {classes} = this.props;
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.addSingleUser}>
      {this.renderForm()}
    </DialogBase>);
  }

  componentDidMount () {
    if (this.props.id) {
      this.setState({
        id: this.props.id,
        userName: this.props.userName,
        password: '',
        fullName: this.props.fullName
      });
    }
  }
}

UserActionDialog.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  id: PropTypes.number,
  userName: PropTypes.string,
  fullName: PropTypes.string

};

export default (withStyles(styles, {withTheme: true})(UserActionDialog));
