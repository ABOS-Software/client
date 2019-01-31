import React from 'react';
import {withStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const styles = theme => ({

  deleteButton: {
    margin: theme.spacing.unit,
    color: 'white',
    backgroundColor: 'red'

  }
});
class confirmDeletion extends React.Component {
  state = {
    passwordError: false,
    confirmDeletionPassword: ''

  };

  render () {
    const {classes} = this.props;

    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.closeDialog()}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Are you sure you would like to delete any rows</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have deleted some of the products. This will lead to DATA LOSS of customer orders. If
            you would like to continue, please re-enter your password and the security code. If not,
            clicking cancel will still update the other changes, but it will not delete any products.
          </DialogContentText>
          {this.state.passwordError &&
          <Typography color={'error'}>Invalid Password!</Typography>

          }
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='confirmDeletion-Password'>Password</InputLabel>
            <TextField
              value={this.state.confirmDeletionPassword}
              type='password'
              onChange={event => {
                this.setState({confirmDeletionPassword: event.target.value});
              }}

              inputProps={{
                name: 'Password',
                id: 'confirmDeletion-Password'
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button value={1} onClick={this.props.confirmPassword} color='primary' variant={'contained'}>
            Don't Delete
          </Button>
          <Button value={2} onClick={this.props.confirmPassword} variant={'contained'}
            className={classes.deleteButton} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

confirmDeletion.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmPassword: PropTypes.func.isRequired
};

export default (withStyles(styles, {withTheme: true})(confirmDeletion));