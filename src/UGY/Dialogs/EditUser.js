import React from 'react';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';

import UserActionDialog from './UserActionDialog';

const styles = theme => ({

});
class EditUser extends React.Component {
  render () {
    const {classes, ...props} = this.props;
    return (<UserActionDialog {...props}
      title={'Edit User'}
      subText={'Please enter the information about the user'}/>);
  }
}

EditUser.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired
};

export default (withStyles(styles, {withTheme: true})(EditUser));
