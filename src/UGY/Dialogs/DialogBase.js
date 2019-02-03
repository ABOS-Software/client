import React from 'react';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';

const styles = () => ({});

class DialogBase extends React.Component {
  state = {};

  cancel = (event) => {
    if (this.props.cancel) {
      this.props.cancel(event);
    } else {
      this.props.closeDialog();
    }
  };

  renderActionBar = () => {
    if (this.props.ActionBar) {
      return this.props.ActionBar;
    } else {
      return (
        <DialogActions>
          <Button value={1} onClick={this.cancel} color='primary'>
            Cancel
          </Button>
          <Button value={2} onClick={this.props.save} color='primary'>
            Apply
          </Button>
        </DialogActions>
      );
    }
  };

  render () {
    const {classes} = this.props;
    return (<Dialog
      open={this.props.open}
      onClose={() => this.props.closeDialog()}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{this.props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {this.props.subText}
        </DialogContentText>
        {this.props.children}
      </DialogContent>
      {this.renderActionBar()}

    </Dialog>);
  }
}

DialogBase.PropTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  subText: PropTypes.string,
  children: PropTypes.node,
  ActionBar: PropTypes.node,
  closeDialog: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func
};

export default (withStyles(styles, {withTheme: true})(DialogBase));
