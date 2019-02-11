import React from 'react';
import {withStyles} from '@material-ui/core';

import PropTypes from 'prop-types';

import UserActionDialog from './UserActionDialog';

const styles = theme => ({

});
class addUser extends React.Component {
  render () {
    // const {classes} = this.props;
    const {classes, ...props} = this.props;
    return (<UserActionDialog {...props}
      title={'Add User'}
      subText={'Please enter the information about the user'}/>);
  }
}

addUser.PropTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired

};

export default (withStyles(styles, {withTheme: true})(addUser));
