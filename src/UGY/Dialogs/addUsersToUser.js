import React from 'react';
import {withStyles} from '@material-ui/core';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import update from 'immutability-helper';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import DialogBase from './DialogBase';

const styles = theme => ({

});
class addUsersToUser extends React.Component {
  state = {
    selectedUser: ''

  };
  renderUserItems = () => {
    let userList = [];
    Object.keys(this.props.userChecks).forEach(userName => {
      userList.push(<MenuItem key={'AddUserToUser-user-' + userName} value={userName}>{userName}</MenuItem>);
    });
    return userList;
  };
  addSelectedUsersToUser = event => {
    let parentState = this.props.userChecks;

    Object.keys(this.props.userChecks[this.state.selectedUser].subUsers).filter(userName => this.props.userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [this.state.selectedUser]: {subUsers: {[userName]: {checked: {$set: true}}}}
      });
    });
    this.props.updateUserChecks(parentState);
    this.props.closeDialog();
  };

  render () {
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.addSelectedUsersToUser}
      title={'Add Selected Users to User'}
      subText={'Please select the user to add the users to'}>
      {this.renderDialogContent(classes)}
    </DialogBase>);
  }

  renderDialogContent (classes) {
    return <FormControl className={classes.formControl}>
      <InputLabel htmlFor='addUsersToGroup-GroupSelection'>User</InputLabel>
      <Select
        value={this.state.selectedUser}
        onChange={event => {
          this.setState({selectedUser: event.target.value});
        }}
        inputProps={{
          name: 'UserSelection',
          id: 'addUsersToUser-UserSelection'
        }}
      >
        {this.renderUserItems()

        }
      </Select>
    </FormControl>;
  }
}

addUsersToUser.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userChecks: PropTypes.any.isRequired
};

export default (withStyles(styles, {withTheme: true})(addUsersToUser));
