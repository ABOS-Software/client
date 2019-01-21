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

const styles = () => ({});

class addUsersToUser extends React.Component {
  state = {};

  render() {
    return (
      <Dialog
        key={"addUsersToUserDialog"}

        open={this.state.addUsersToUserOpen}
        onClose={event => this.setState({addUsersToUserOpen: false})}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Selected Users to User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the user to add the users to
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="addUsersToGroup-GroupSelection">User</InputLabel>
            <Select
              value={this.state.selectedUser}
              onChange={event => {
                this.setState({selectedUser: event.target.value})
              }}
              inputProps={{
                name: 'UserSelection',
                id: 'addUsersToUser-UserSelection',
              }}
            >
              {this.renderUserItems()

              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={event => this.setState({addUsersToUserOpen: false})} color="primary">
            Cancel
          </Button>
          <Button onClick={this.addSelectedUsersToUser} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


}

addUsersToUser.PropTypes = {};

export default (withStyles(styles, {withTheme: true})(addUsersToUser));

