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

const styles = () => ({

});

class addUsersToGroup extends React.Component {
  state = {};

  render() {
    return(<Dialog
      key={"addUsersToGroupDialog"}
      open={this.state.addUsersToGroupOpen}
      onClose={event => this.setState({addUsersToGroupOpen: false})}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add Selected Users to Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select the group to add the users to
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="addUsersToGroup-GroupSelection">Group</InputLabel>
          <Select
            value={this.state.selectedGroup}
            onChange={event => {
              this.setState({selectedGroup: event.target.value})
            }}
            inputProps={{
              name: 'GroupSelection',
              id: 'addUsersToGroup-GroupSelection',
            }}
          >
            {this.renderGroupItems()

            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={event => this.setState({addUsersToGroupOpen: false})} color="primary">
          Cancel
        </Button>
        <Button onClick={this.addSelectedUsersToGroup} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>)
  }


}

addUsersToGroup.PropTypes = {};

export default (withStyles(styles, {withTheme: true})(addUsersToGroup));