import React from 'react';

import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import update from 'immutability-helper';

export class BulkMenu extends React.Component {
  addSelectedUsersToGroupClicked = event => {
    this.props.showDialog('addUsersToGroup');
    this.props.onClose(event);
  };

  addSelectedUsersToUserClicked = event => {
    this.props.showDialog('addUsersToUser');
    this.props.onClose(event);
  };
  enableSelectedUsers = event => {
    let {userChecks} = this.props;
    let parentState = userChecks;
    let curYear = this.props.year;
    Object.keys(userChecks).filter(userName => userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [userName]: {enabledYear: {$set: curYear}, status: {$set: 'ENABLED'}}

      });
    });
    this.props.updateUserChecks(parentState);

    this.props.onClose(event);
  };

  archiveSelectedUsers = event => {
    let {userChecks} = this.props;

    let parentState = userChecks;
    Object.keys(userChecks).filter(userName => userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [userName]: {status: {$set: 'ARCHIVED'}, enabledYear: {$set: -1}}
      });
    });
    this.props.updateUserChecks(parentState);
    this.props.onClose(event);
  };
  removeSelectedUsersFromYear = event => {
    let {userChecks} = this.props;

    let parentState = userChecks;
    Object.keys(userChecks).filter(userName => userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [userName]: {status: {$set: 'DISABLED'}, enabledYear: {$set: -1}}

      });
    });
    this.props.updateUserChecks(parentState);
    this.props.onClose(event);
  };
  render () {
    return <Menu
      id='user-Bulk-Menu'
      anchorEl={this.props.anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={this.props.open}
      onClose={this.props.onClose}
    >
      <MenuItem onClick={this.addSelectedUsersToGroupClicked}>Add Selected to Group</MenuItem>
      <MenuItem onClick={this.removeSelectedUsersFromYear}>Disable Selected</MenuItem>
      <MenuItem onClick={this.enableSelectedUsers}>Enable Selected</MenuItem>
      <MenuItem onClick={this.addSelectedUsersToUserClicked}>Add selected to User</MenuItem>
      <MenuItem onClick={this.archiveSelectedUsers}>Archive selected users</MenuItem>
    </Menu>;
  }
}

BulkMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.any,
  onClose: PropTypes.func,
  showDialog: PropTypes.func,
  updateUserChecks: PropTypes.func,
  userChecks: PropTypes.any,
  year: PropTypes.any
};
