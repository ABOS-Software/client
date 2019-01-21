import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const styles = () => ({});

class addUser extends React.Component {
  state = {};

  render() {
    return (
      <Dialog
        key={"addUserDialog"}

        open={this.state.addUserOpen}
        onClose={event => this.setState({addUserOpen: false})}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the information about the user
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="AddUser-Username">Username</InputLabel>
            <TextField
              value={this.state.addUser.userName}
              onChange={event => {
                this.updateAddUserState("userName", event.target.value)
              }}
              inputProps={{
                name: 'UserName',
                id: 'AddUser-Username',
              }}
            >

            </TextField>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="AddUser-Password">Password</InputLabel>
            <TextField
              value={this.state.addUser.password}
              type="password"
              onChange={event => {
                this.updateAddUserState("password", event.target.value)
              }}

              inputProps={{
                name: 'Password',
                id: 'AddUser-Password',
              }}
            >

            </TextField>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="AddUser-FullName">FullName</InputLabel>
            <TextField
              value={this.state.addUser.fullName}
              onChange={event => {
                this.updateAddUserState("fullName", event.target.value)
              }}

              inputProps={{
                name: 'FullName',
                id: 'AddUser-FullName',
              }}
            >

            </TextField>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={event => this.setState({addUserOpen: false})} color="primary">
            Cancel
          </Button>
          <Button onClick={this.addSingleUser} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


}

addUser.PropTypes = {};

export default (withStyles(styles, {withTheme: true})(addUser));

