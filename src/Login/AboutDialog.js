import React from 'react';
import {withStyles} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import About from '../resources/About';

const styles = () => ({});

class DialogBase extends React.Component {
  state = {};

  render () {
    return (<Dialog
      open={this.props.open}
      onClose={() => this.props.closeDialog()}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{'About'}</DialogTitle>
      <DialogContent>
        <About/>
      </DialogContent>

    </Dialog>);
  }
}

DialogBase.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired

};

export default (withStyles(styles, {withTheme: true})(DialogBase));
