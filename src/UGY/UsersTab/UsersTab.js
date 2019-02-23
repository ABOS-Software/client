import React from 'react';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {showNotification} from 'react-admin';

import UserPanel from './UserPanel';
import UserGroupPanel from './userGroupPanel';
import {BulkMenu} from './BulkMenu';

const styles = theme => ({
  inline: {
    display: 'inline-flex'
  },
  flex: {
    flexGrow: 1
  }

});

class UsersTab extends React.PureComponent {
  state = {
    userBulkMenuAnchor: null,
    userAddMenuAnchor: null
  };

  addSingleUserClick = event => {
    this.props.showDialog('addUser');

    this.handleUserAddMenuClose(event);
  };
  addBulkUserClick = event => {
    this.props.showDialog('importUsers');

    this.handleUserAddMenuClose(event);
  };

  editUserClick = (uName, id, fName) => () => {
    this.props.showDialog('editUser', {editUser: {id: id, userName: uName, password: '', fullName: fName}});
  };

  handleUserBulkMenu = event => {
    this.setState({userBulkMenuAnchor: event.currentTarget});
  };

  handleUserBulkMenuClose = () => {
    this.setState({userBulkMenuAnchor: null});
  };

  handleUserAddMenu = event => {
    this.setState({userAddMenuAnchor: event.currentTarget});
  };

  handleUserAddMenuClose = () => {
    this.setState({userAddMenuAnchor: null});
  };

  renderEnabledUsers = () => {
    let {userChecks} = this.props;

    let userPanels = [];
    Object.keys(userChecks).forEach(user => {
      if (userChecks[user].enabledYear === this.props.year) {
        userPanels.push(this.renderUserPanel(user));
      }
    });
    return (<UserGroupPanel title='Enabled Users' userPanels={userPanels}/>);
  };
  renderDisabledUsers = () => {
    let userPanels = [];
    let {userChecks} = this.props;

    Object.keys(userChecks).forEach(user => {
      /*            console.log(user);
                  console.log(userChecks[user].status);

                  console.log(userChecks[user].status !== "ENABLED");
                  console.log(userChecks[user].status !== "ARCHIVED"); */
      if (userChecks[user].enabledYear !== this.props.year && userChecks[user].status !== 'ENABLED' && userChecks[user].status !== 'ARCHIVED') {
        userPanels.push(this.renderUserPanel(user));
      }
    });
    return (<UserGroupPanel title='Disabled Users' userPanels={userPanels}/>);
  };
  renderArchivedUsers = () => {
    let {userChecks} = this.props;

    let userPanels = [];
    Object.keys(userChecks).forEach(user => {
      if (userChecks[user].enabledYear !== this.props.year && userChecks[user].status === 'ARCHIVED') {
        userPanels.push(this.renderUserPanel(user));
      }
    });
    return (<UserGroupPanel title='Archived Users' userPanels={userPanels}/>);
  };

  renderUserPanel = (user) => {
    let {userChecks} = this.props;

    let userName = user;
    let id = userChecks[user].id;
    let fullName = userChecks[user].fullName;
    return (
      <UserPanel id={id} key={userName} userName={userName} fullName={fullName}
        userChecks={userChecks}
        updateUserChecks={this.props.updateUserChecks}
        checked={userChecks[userName].checked}
        group={userChecks[userName].group}
        groups={this.props.groups}
        onEdit={this.editUserClick}/>
    );
  };

  render () {
    return (
      <div>

        {this.renderToolBar()}
        <div>
          {this.renderEnabledUsers()}
          {this.renderArchivedUsers()}
          {this.renderDisabledUsers()}
        </div>
      </div>
    );
  }

  renderToolBar () {
    const {classes} = this.props;
    const {userBulkMenuAnchor, userAddMenuAnchor} = this.state;
    const userBulkMenuOpen = Boolean(userBulkMenuAnchor);
    const userAddMenuOpen = Boolean(userAddMenuAnchor);
    return <Toolbar>
      <Typography variant='title' color='inherit' className={classes.flex}/>
      <div>
        {this.renderAddUserMenu(userAddMenuOpen, userAddMenuAnchor)}
        {this.renderBulkActionMenu(userBulkMenuOpen, userBulkMenuAnchor)}

      </div>

    </Toolbar>;
  }

  renderBulkActionMenu (userBulkMenuOpen, userBulkMenuAnchor) {
    const {classes} = this.props;

    return <div className={classes.inline}>
      <IconButton
        aria-owns={userBulkMenuOpen ? 'user-Bulk-Menu' : null}
        aria-haspopup='true'
        onClick={this.handleUserBulkMenu}
        color='inherit'
      >
        <MoreVert/>
      </IconButton>
      {this.renderBulkActionMenuComponent(userBulkMenuAnchor, userBulkMenuOpen)}
    </div>;
  }

  renderBulkActionMenuComponent (userBulkMenuAnchor, userBulkMenuOpen) {
    return <BulkMenu anchorEl={userBulkMenuAnchor} open={userBulkMenuOpen} onClose={this.handleUserBulkMenuClose}
      showDialog={this.props.showDialog}
      updateUserChecks={this.props.updateUserChecks} userChecks={this.props.userChecks} year={this.props.year}/>;
  }

  renderAddUserMenu (userAddMenuOpen, userAddMenuAnchor) {
    const {classes} = this.props;

    return <div className={classes.inline}>
      <IconButton
        aria-owns={userAddMenuOpen ? 'user-add-menu' : null}
        aria-haspopup='true'
        onClick={this.handleUserAddMenu}
        color='inherit'
      >
        <AddIcon/>
      </IconButton>
      {this.renderAddUserMenuComponent(userAddMenuAnchor, userAddMenuOpen)}
    </div>;
  }

  renderAddUserMenuComponent (userAddMenuAnchor, userAddMenuOpen) {
    return <Menu
      id='user-add-menu'
      anchorEl={userAddMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={userAddMenuOpen}
      onClose={this.handleUserAddMenuClose}
    >
      <MenuItem onClick={this.addSingleUserClick}>Add Single User</MenuItem>
      <MenuItem onClick={this.addBulkUserClick}>Add Bulk Users</MenuItem>
    </Menu>;
  }
}

UsersTab.propTypes = {
  groups: PropTypes.array.isRequired,
  classes: PropTypes.any,
  showDialog: PropTypes.func.isRequired,
  userChecks: PropTypes.any.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  year: PropTypes.any.isRequired
};

export default connect(null, {
  push,
  showNotification

})(withStyles(styles, {withTheme: true})(UsersTab));
