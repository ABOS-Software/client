import React from 'react';
import {withStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import DialogActions from '@material-ui/core/DialogActions';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import DialogBase from './DialogBase';

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

  renderPasswordError = () => {
    if (this.state.passwordError) {
      return (<Typography color={'error'}>Invalid Password!</Typography>);
    }
  };

  renderDialogContent (classes) {
    return (
      <div>
        {this.renderPasswordError()}
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
      </div>);
  }
  render () {
    const {classes, ...props} = this.props;
    return (<DialogBase {...props} save={this.props.confirmPassword} cancel={this.props.confirmPassword}
      title={'Are you sure you would like to delete any rows'}
      subText={' You have deleted some of the products. This will lead to DATA LOSS of customer orders. If\n' +
      '            you would like to continue, please re-enter your password and the security code. If not,\n' +
      '            clicking cancel will still update the other changes, but it will not delete any products.'}
      ActionBar={this.renderActionBar(classes)}
    >

      {this.renderDialogContent(classes)}
    </DialogBase>);
  }

  renderActionBar (classes) {
    return <DialogActions>
      <Button value={1} onClick={this.props.confirmPassword} color='primary' variant={'contained'}>
        Don't Delete
      </Button>
      <Button value={2} onClick={this.props.confirmPassword} variant={'contained'}
        className={classes.deleteButton} autoFocus>
        Delete
      </Button>
    </DialogActions>;
  }
}

confirmDeletion.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmPassword: PropTypes.func.isRequired
};

export default (withStyles(styles, {withTheme: true})(confirmDeletion));
