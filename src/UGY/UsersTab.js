import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import dataProvider from '../grailsRestClient';
import {GET_LIST} from 'react-admin';

const styles = () => ({});

class UsersTab extends React.Component {
  state = {
    userChecks: [],
    groups: [],

  };

  componentDidMount () {
    this.getUsers();
    this.getGroups();
  }
  componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.year !== prevProps.year) {
      this.getUsers(this.props.year);
      this.getGroups(this.props.year);
    }
  }

  getGroups (yearId) {
    dataProvider(GET_LIST, 'Group', {
      filter: {year_id: yearId || this.props.year},
      sort: {field: 'id', order: 'DESC'},
      pagination: {page: 1, perPage: 1000}
    }).then(response => {
      this.setState({groups: response.data});
    });
  }

  handleUpdateUserChecks = (userChecks) => {
    this.setState({userChecks: userChecks});
    this.props.updateUserChecks(userChecks);
  };

  getUsers (yearId) {
    dataProvider(GET_LIST, 'UserHierarchy', {filter: {year: yearId || this.props.year}}).then(response => {
      let users = response.data[0];
      let userChecks = {};
      Object.keys(users).forEach(user => {
        userChecks[user] = {
          checked: false,
          id: users[user].id,
          fullName: users[user].fullName,
          group: users[user].group,
          status: users[user].status,
          subUsers: users[user].subUsers,
          enabledYear: users[user].enabledYear
        };
      });
      this.handleUpdateUserChecks(userChecks);
    });
  }
  renderUserTab () {

  }

  render () {
    return (
      <UsersTab groups={this.state.groups}
                showDialog={this.props.showDialog}
                userChecks={this.state.userChecks}
                updateUserChecks={this.handleUpdateUserChecks}
                year={this.props.year}/>
    );
  }
}

UsersTab.PropTypes = {
  showDialog: PropTypes.func,
  updateUserChecks: PropTypes.func,
  year: PropTypes.any
};

export default (withStyles(styles, {withTheme: true})(UsersTab));
