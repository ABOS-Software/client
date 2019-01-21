import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

const styles = () => ({});

class EditUser extends React.Component {
  state = {};

  render() {
    return (
      <Dialog
        key={"editUserDialog"}

        open={this.state.editUserOpen}
        onClose={event => this.setState({editUserOpen: false})}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the information about the user
          </DialogContentText>
          <TextField
            value={this.state.editUser.userName}
            label={"Username"}
            onChange={event => {
              this.updateEditUserState("userName", event.target.value)
            }}
            inputProps={{
              name: 'UserName',
              id: 'AddUser-Username',
            }}
            disabled
          >

          </TextField>
          <TextField
            label={"Password"}

            value={this.state.editUser.password}
            type="password"
            onChange={event => {
              this.updateEditUserState("password", event.target.value)
            }}

            inputProps={{
              name: 'Password',
              id: 'AddUser-Password',
            }}
          >

          </TextField>
          <TextField
            label={"FullName"}

            value={this.state.editUser.fullName}
            onChange={event => {
              this.updateEditUserState("fullName", event.target.value)
            }}

            inputProps={{
              name: 'FullName',
              id: 'AddUser-FullName',
            }}
          >

          </TextField>

        </DialogContent>
        <DialogActions>
          <Button onClick={event => this.setState({editUserOpen: false})} color="primary">
            Cancel
          </Button>
          <Button onClick={this.editUser} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


}

EditUser.PropTypes = {};

export default (withStyles(styles, {withTheme: true})(EditUser));

