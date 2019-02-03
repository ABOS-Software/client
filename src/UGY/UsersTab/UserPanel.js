import React from 'react';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import update from 'immutability-helper';
import {styles} from '../Styles';

class UserListItem extends React.PureComponent {
  static defaultProps = {
    onClick: (event) => {
    }
  };
    state = {
      checked: false
    };

    /*    setChecked = event => {
            const {userName, user, handleManageCheckBoxChange} = this.props;
            this.setState({checked: event.target.checked});

            handleManageCheckBoxChange(userName, user)(event);
        }; */

    constructor (props) {
      super(props);
    }

    componentDidMount () {
      this.setState({checked: this.props.checked});
    }

    render () {
      const {user, children, onClick, checked, handleManageCheckBoxChange, userName} = this.props;
      return (
        <ListItem button onClick={onClick}>
          <InputWrapper>
            <Checkbox
              checked={checked}
              onChange={handleManageCheckBoxChange(userName, user)}
              value={user}
            />
          </InputWrapper>
          <ListItemText primary={user}/>
          {children}
        </ListItem>
      );
    }
}

UserListItem.propTypes = {
  user: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  handleManageCheckBoxChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node
};
const stopPropagation = (e) => e.stopPropagation();
const InputWrapper = ({children}) =>
  <div onClick={stopPropagation} style={{display: 'inline-flex'}}>
    {children}
  </div>;

class UserPanel extends React.Component {
    state = {
      checked: false,
      expanded: false,
      checkboxClicked: false,
      group: -1,
      groups: [],
      userChecks: []
    };

    constructor (props) {
      super(props);
    }

    handleClick = group => event => {
      let parentState = update(this.state.groups, {
        [group]: {$toggle: ['open']}
      });

      this.setState({groups: parentState});
    };

    handleGroupCheckbox = groupId => (parentUser, group) => event => {
      const {userName, handleManageCheckBoxChange, userChecks} = this.props;
      let parentState = update(this.state.groups, {
        [group]: {checked: {$set: event.target.checked}}
      });

      this.setState({groups: parentState});
      let userChecksState = this.state.userChecks;
      Object.keys(userChecks[userName].subUsers).filter(grp => userChecks[userName].subUsers[grp].group === groupId).forEach(user => {
        userChecksState = update(userChecksState, {
          [user]: {$set: event.target.checked}
        });

        handleManageCheckBoxChange(userName, user)(event);
      });
      this.setState({userChecks: userChecksState});
    };

    handleUserCheckbox = (parentUser, user) => event => {
      const {handleManageCheckBoxChange} = this.props;
      let parentState = update(this.state.userChecks, {
        [user]: {$set: event.target.checked}
      });

      this.setState({userChecks: parentState});
      let groupState = this.state.groups;
      this.props.groups.forEach(group => {
        let filter = Object.keys(parentState).filter(usr => this.props.userChecks[user].subUsers[usr].group === group.id);
        if (filter.length > 0 && filter.filter(usr => !this.state.userChecks[usr]).length !== 0) {
          groupState = update(groupState, {
            [group.groupName]: {checked: {$set: true}}
          });
        } else {
          groupState = update(groupState, {
            [group.groupName]: {checked: {$set: false}}
          });
        }
      });
      this.setState({groups: groupState});

      handleManageCheckBoxChange(parentUser, user)(event);
    };

    renderUserManagementList = currentUser => {
      const {userChecks, handleManageCheckBoxChange, groups, classes} = this.props;
      const {groups: groupState} = this.state;
      let groupItems = [];
      if (Object.keys(groupState).length > 0) {
        groups.forEach(group => {
          if (groupState[group.groupName]) {
            let listItems = [];

            Object.keys(userChecks[currentUser].subUsers).filter(grp => userChecks[currentUser].subUsers[grp].group === group.id).forEach(user => {
              // let userName = user;
              // let checked = userChecks[userName].subUsers[user].checked;
              listItems.push(<UserListItem key={currentUser + '-sub-' + user} userName={currentUser}
                handleManageCheckBoxChange={this.handleUserCheckbox} user={user}
                checked={this.props.userChecks[currentUser].subUsers[user].checked}/>);
            });

            groupItems.push(
              <UserListItem key={currentUser + '-sub-' + group.groupName + '-' + group.year.id}
                userName={currentUser}
                handleManageCheckBoxChange={this.handleGroupCheckbox(group.id)} user={group.groupName}
                checked={groupState[group.groupName].checked}
                onClick={this.handleClick(group.groupName)}>
                {groupState[group.groupName].open ? <ExpandLess/> : <ExpandMore/>}

              </UserListItem>,
              <Collapse key={currentUser + '-sub-' + group.groupName + '-collapse' + '-' + group.year.id}
                in={groupState[group.groupName].open} timeout='auto' unmountOnExit
                className={classes.nested}>
                <List component='div' disablePadding>
                  {listItems}
                </List>
              </Collapse>);
          }
        });
      }
      /* .forEach((keyVal) => {
             let user = keyVal;

         }); */
      return (<List>
        {groupItems}

      </List>);
    };

    setChecked = event => {
      const {userName, handleCheckBoxChange} = this.props;
      this.setState({checked: event.target.checked, checkboxClicked: true});

      handleCheckBoxChange(userName)(event);
    };

    handleUserPanelExpanded = (event, expanded) => {
      // if (!this.state.checkboxClicked) {
      this.setState({'expanded': expanded, checkboxClicked: false});
      // }
    };
    componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
      if (this.props.groups !== prevProps.groups) {
        let groupsList = [];

        this.props.groups.forEach(group => {
          groupsList[group.groupName] = {open: false, checked: false};
        });
        this.setState({checked: this.props.checked, groups: groupsList});
      }
    }
    componentDidMount () {
      let groupsList = [];
      const {userName, userChecks} = this.props;
      let userCheckList = [];
      Object.keys(userChecks[userName].subUsers).forEach(subUser => {
        userCheckList[subUser] = userChecks[userName].subUsers[subUser].checked;
      });
      this.props.groups.forEach(group => {
        groupsList[group.groupName] = {open: false, checked: false};
      });
      this.setState({checked: this.props.checked, groups: groupsList, userChecks: userCheckList});
    }

    handleGroupChange = event => {
      this.setState({group: event.target.value});
      this.props.handleGroupChange(this.props.userName)(event);
    };

    render () {
      const {id, userName, fullName, classes} = this.props;
      return (<ExpansionPanel className={classes.userPanel} expanded={this.state.expanded}
        onChange={this.handleUserPanelExpanded}>
        {this.renderPanelSummary(userName, classes, id, fullName)}
        <ExpansionPanelDetails>
          <div className={classes.flexColumn}>
            {this.renderGroupSelector(classes, userName)}
            {this.renderUserManagementList(userName)}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      );
    }

    renderPanelSummary (userName, classes, id, fullName) {
      return <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
        <InputWrapper>
          <Checkbox
            checked={this.state.checked}
            onChange={this.setChecked}
            value={userName}
          />
        </InputWrapper>

        <div className={classes.flexCenter}>

          <Typography className={classes.heading}>{userName}</Typography>
        </div>
        {this.renderActionButtons(classes, userName, id, fullName)}
      </ExpansionPanelSummary>;
    }

    renderActionButtons (classes, userName, id, fullName) {
      return <div>
        <InputWrapper>

          <Button variant='contained' color={'primary'} className={classes.button}
            onClick={this.props.onEdit(userName, id, fullName)}>
          Edit
          </Button>
        </InputWrapper>
        <InputWrapper>

          <Button variant='contained' className={classes.deleteButton}>
          Delete
          </Button>
        </InputWrapper>

      </div>;
    }

    renderGroupItems () {
      let groupList = [];
      this.props.groups.forEach(group => {
        groupList.push(<MenuItem key={'AddGroupToUser-group-' + group.id}
          value={group.id}>{group.groupName}</MenuItem>);
      });
      return groupList;
    };

    renderGroupSelector = (classes, userName) => {
      return <div className={classes.flex}>
        <FormControl className={classes.formControl} fullWidth={false}>

          <InputLabel htmlFor={userName + '-group-select'}>Group</InputLabel>
          <Select
            value={this.props.group}
            onChange={this.handleGroupChange}
            inputProps={{
              name: userName + '-group-select',
              id: userName + '-group-select'
            }}
          >
            {this.renderGroupItems()}
          </Select>
        </FormControl>
      </div>;
    }
}

UserPanel.propTypes = {
  id: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  userChecks: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  handleManageCheckBoxChange: PropTypes.func.isRequired,
  handleGroupChange: PropTypes.func.isRequired,
  handleCheckBoxChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onEdit: PropTypes.func
};
export default withStyles(styles, {withTheme: true})(UserPanel);
