import React from 'react';
import {withStyles} from '@material-ui/core';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import update from 'immutability-helper';
import DialogBase from './DialogBase';

const styles = theme => ({

});

class AddUsersToGroupDialog extends React.Component {
  state = {selectedGroup: 0};
  renderGroupItems = () => {
    let groupList = [];
    const {groups} = this.props;
    if (groups) {
      groups.forEach(group => {
        groupList.push(<MenuItem key={'AddGroupToUser-group-' + group.id}
          value={group.id}>{group.groupName}</MenuItem>);
      });
    }
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

  render () {
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.addSelectedUsersToGroup}
      title={'Add Selected Users to Group'}
      subText={'Please select the group to add the users to'}>
      {this.renderGroupSelector(classes)}
    </DialogBase>);
  }

  renderGroupSelector (classes) {
    return <FormControl className={classes.formControl}>
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
    </FormControl>;
  }
}

AddUsersToGroupDialog.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  userChecks: PropTypes.any.isRequired
};

export default (withStyles(styles, {withTheme: true})(AddUsersToGroupDialog));
