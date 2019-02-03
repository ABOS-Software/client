import React from 'react';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {UPDATE} from 'react-admin';
import DialogBase from './DialogBase';

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
  renderDialogContent (classes) {
    return (
      <div>
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
      </div>
    );
  }
  render () {
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.editUser}
      title={'Edit User'}
      subText={'Please enter the information about the user'}>
      {this.renderDialogContent(classes)}
    </DialogBase>);
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
