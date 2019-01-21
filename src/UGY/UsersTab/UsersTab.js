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
import update from 'immutability-helper';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {showNotification} from 'react-admin';


import UserPanel from './UserPanel';
import {rowStatus} from './ProductsGrid';
import {authClientConfig} from '../security/authProvider';
import userGroupPanel from './userGroupPanel';


const styles = theme => ({});

class UsersTab extends React.PureComponent {
  state = {
    userBulkMenuAnchor: null,
    userAddMenuAnchor: null
  };


  componentWillMount() {
    this.stepsContent();
  }



  addSelectedUsersToGroupClicked = event => {
    this.props.showDialog("addUsersToGroup");
    this.handleUserBulkMenuClose(event);
  };



  addSelectedUsersToUserClicked = event => {
    this.props.showDialog("addUsersToUser");
    this.handleUserBulkMenuClose(event);
  };


  addSingleUserClick = event => {
    this.props.showDialog("addUser");

    this.handleUserAddMenuClose(event);
  };


  editUserClick = (uName, id, fName) => () => {
    this.props.showDialog("editUser", {editUser: {id: id, userName: uName, password: '', fullName: fName}});

   // this.setState({editUserOpen: true, editUser: {id: id, userName: uName, password: '', fullName: fName}});

    //this.handleUserAddMenuClose(event);
  };



  handleCheckBoxChange = name => event => {
    let {userChecks} = this.props;

    let parentState = update(userChecks, {
      [name]: {checked: {$set: event.target.checked}}
    });
    this.props.updateUserChecks(parentState);
    //this.setState({userChecks: parentState, update: true});
    //this.setState({[name]: event.target.checked});
  };

  handleGroupChange = name => event => {
    let {userChecks} = this.props;

    let parentState = update(userChecks, {
      [name]: {group: {$set: event.target.value}}
    });
    this.props.updateUserChecks(parentState);

    //this.setState({userChecks: parentState, update: true});
    //this.setState({[name]: event.target.checked});
  };

  handleManageCheckBoxChange = (parent, name) => event => {
    let {userChecks} = this.props;

    let parentState = update(userChecks, {
      [parent]: {subUsers: {[name]: {checked: {$set: event.target.checked}}}}
    });
    this.props.updateUserChecks(parentState);

    //this.setState({userChecks: parentState, update: true});


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

  enableSelectedUsers = event => {
    let {userChecks} = this.props;
    let parentState = userChecks;
    let curYear = this.props.year;
    Object.keys(userChecks).filter(userName => userChecks[userName].checked).forEach(userName => {
      parentState = update(parentState, {
        [userName]: {enabledYear: {$set: curYear}, status: {$set: "ENABLED"}}

      });
    });
    this.props.updateUserChecks(parentState);

    this.handleUserBulkMenuClose(event);
  };

  renderEnabledUsers = () => {
    let {userChecks} = this.props;

    let userPanels = [];
    Object.keys(userChecks).forEach(user => {
      if (userChecks[user].enabledYear === this.props.year) {

        userPanels.push(this.renderUserPanel(user))

      }
    });
    return (<userGroupPanel title="Enabled Users" userPanels={userPanels}/>)

  };
  renderDisabledUsers = () => {
    let userPanels = [];
    let {userChecks} = this.props;


    Object.keys(userChecks).forEach(user => {
      /*            console.log(user);
                  console.log(userChecks[user].status);

                  console.log(userChecks[user].status !== "ENABLED");
                  console.log(userChecks[user].status !== "ARCHIVED");*/
      if (userChecks[user].enabledYear !== this.props.year && userChecks[user].status !== "ENABLED" && userChecks[user].status !== "ARCHIVED") {


        userPanels.push(this.renderUserPanel(user))

      }
    });
    return (<userGroupPanel title="Disabled Users" userPanels={userPanels}/>)

  };
  renderArchivedUsers = () => {
    let {userChecks} = this.props;

    let userPanels = [];
    Object.keys(userChecks).forEach(user => {
      if (userChecks[user].enabledYear !== this.props.year && userChecks[user].status === "ARCHIVED") {

        userPanels.push(this.renderUserPanel(user))
      }
    });
    return (<userGroupPanel title="Archived Users" userPanels={userPanels}/>)
  };

  renderUserPanel = (user) => {
    let {userChecks} = this.props;

    let userName = user;
    let id = userChecks[user].id;
    let fullName = userChecks[user].fullName;
    return (
      <UserPanel id={id} key={userName} userName={userName} fullName={fullName}
                 userChecks={userChecks}
                 handleManageCheckBoxChange={this.handleManageCheckBoxChange}
                 handleCheckBoxChange={this.handleCheckBoxChange}
                 checked={userChecks[userName].checked}
                 handleGroupChange={this.handleGroupChange}
                 group={userChecks[userName].group}
                 groups={this.props.groups}
                 onEdit={this.editUserClick}/>
    );
  };

  render() {
    const {classes} = this.props;
    const {userBulkMenuAnchor, userAddMenuAnchor} = this.state;
    const userBulkMenuOpen = Boolean(userBulkMenuAnchor);
    const userAddMenuOpen = Boolean(userAddMenuAnchor);
    return (
      <div>

        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>

          </Typography>
          <div>
            <IconButton
              aria-owns={userAddMenuOpen ? 'user-add-menu' : null}
              aria-haspopup="true"
              onClick={this.handleUserAddMenu}
              color="inherit"
            >
              <AddIcon/>
            </IconButton>
            <Menu
              id="user-add-menu"
              anchorEl={userAddMenuAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={userAddMenuOpen}
              onClose={this.handleUserAddMenuClose}
            >
              <MenuItem onClick={this.addSingleUserClick}>Add Single User</MenuItem>
              <MenuItem onClick={this.addBulkUserClick}>Add Bulk Users</MenuItem>
            </Menu>
            <IconButton
              aria-owns={userBulkMenuOpen ? 'user-Bulk-Menu' : null}
              aria-haspopup="true"
              onClick={this.handleUserBulkMenu}
              color="inherit"
            >
              <MoreVert/>
            </IconButton>
            <Menu
              id="user-Bulk-Menu"
              anchorEl={userBulkMenuAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={userBulkMenuOpen}
              onClose={this.handleUserBulkMenuClose}
            >
              <MenuItem onClick={this.addSelectedUsersToGroupClicked}>Add Selected to Group</MenuItem>
              <MenuItem onClick={this.removeSelectedUsersFromYear}>Disable Selected</MenuItem>
              <MenuItem onClick={this.enableSelectedUsers}>Enable Selected</MenuItem>
              <MenuItem onClick={this.addSelectedUsersToUserClicked}>Add selected to User</MenuItem>
              <MenuItem onClick={this.archiveSelectedUsers}>Archive selected users</MenuItem>
            </Menu>

          </div>

        </Toolbar>
        <div>
          {this.renderEnabledUsers()}
          {this.renderArchivedUsers()}
          {this.renderDisabledUsers()}
        </div>
      </div>
    )
  }
}

UsersTab.propTypes = {
  groups: PropTypes.array.isRequired,
  classes: PropTypes.any.isRequired,
  showDialog: PropTypes.func.isRequired,
  userChecks: PropTypes.any.isRequired,
  updateUserChecks: PropTypes.func.isRequired,
  year: PropTypes.any.isRequired,
};

export default connect(null, {
  push,
  showNotification,

})(withStyles(styles, {withTheme: true})(UsersTab));