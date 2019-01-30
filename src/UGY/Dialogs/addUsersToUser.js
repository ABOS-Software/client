import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import update from 'immutability-helper';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

const drawerWidth = 240;

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

  render() {
    const {classes} = this.props;

    return (
      <Dialog

        open={this.props.open}
        onClose={() => this.props.closeDialog()}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Add Selected Users to User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the user to add the users to
          </DialogContentText>
          <FormControl className={classes.formControl}>
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
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.closeDialog()} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.addSelectedUsersToUser} color='primary'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

addUsersToUser.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userChecks: PropTypes.any.isRequired
};

export default (withStyles(styles, {withTheme: true})(addUsersToUser));
