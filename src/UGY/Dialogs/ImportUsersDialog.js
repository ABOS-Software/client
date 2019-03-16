import React from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {CREATE, showNotification} from 'react-admin';
import dataProvider from '../../grailsRestClient';
import ImportDialogBase from './ImportDialogBase';

const styles = theme => ({});

class ImportUsersDialog extends React.Component {
    state = {
      action: '',
      importType: '',
      users: []
    };

    addUsers (users) {
      users.forEach(user => {
        let data = {
          username: user.userName,
          full_name: user.fullName,
          password: user.password
        };
        dataProvider(CREATE, 'user', {
          data: data
        });
      });
      this.props.closeImportDialog();
    }

    convertXML = (records) => {
      if (records.Users.Users) {
        let users;
        users = records.Users.Users;
        this.addUsers(users);
      }
    };

    convertCSV = (records) => {
      this.addUsers(records);
    };

    render () {
      return (
        <ImportDialogBase convertCSV={this.convertCSV} convertXML={this.convertXML} {...this.props}/>
      );
    }
}

ImportUsersDialog.propTypes = {
  closeImportDialog: PropTypes.func.isRequired,
  importDialogOpen: PropTypes.bool.isRequired
};

export default connect(null, {
  push,
  showNotification

})(withStyles(styles, {withTheme: true})(ImportUsersDialog));
