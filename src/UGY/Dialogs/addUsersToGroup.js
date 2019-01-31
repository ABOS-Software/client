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
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import update from 'immutability-helper';

const styles = theme => ({

});

class AddUsersToGroupDialog extends React.Component {
  state = {selectedGroup: 0};
  renderGroupItems = () => {
    let groupList = [];
    this.props.groups.forEach(group => {
      groupList.push(<MenuItem key={'AddGroupToUser-group-' + group.id}
                               value={group.id}>{group.groupName}</MenuItem>);
    });
    return groupList;
  };
  addSelectedUsersToGroup = event => {
    let parentState = this.props.userChecks;

    Object.keys(this.props.userChecks).filter(userName => this.props.userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [userName]: {group: {$set: this.state.selectedGroup}}
      });
    });
    this.props.updateUserChecks(parentState);
    this.props.closeDialog();
    // this.setState({userChecks: parentState, addUsersToGroupOpen: false});
  };

  render() {
    const {classes} = this.props;
    return (<Dialog
      open={this.props.open}
      onClose={() => this.props.closeDialog()}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Add Selected Users to Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select the group to add the users to
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='addUsersToGroup-GroupSelection'>Group</InputLabel>
          <Select
            value={this.state.selectedGroup}
            onChange={event => {
              this.setState({selectedGroup: event.target.value});
            }}
            inputProps={{
              name: 'GroupSelection',
              id: 'addUsersToGroup-GroupSelection'
            }}
          >
            {this.renderGroupItems()

            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.props.closeDialog()} color='primary'>
          Cancel
        </Button>
        <Button onClick={this.addSelectedUsersToGroup} color='primary'>
          Apply
        </Button>
      </DialogActions>
    </Dialog>);
  }
}

AddUsersToGroupDialog.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  userChecks: PropTypes.any.isRequired
};

export default (withStyles(styles, {withTheme: true})(AddUsersToGroupDialog));
