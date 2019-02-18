import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {CREATE, GET_LIST} from 'react-admin';
import Paper from '@material-ui/core/Paper';
import restClient from '../grailsRestClient';
import hostURL from '../host';
import feathersClient from '../feathersClient';
import {authClientConfig} from '../security/authProvider';
import UsersTab from './UsersTab/UsersTab';
import {
  AddUserDialog,
  AddUsersToGroupDialog,
  AddUsersToUserDialog,
  ConfirmDeletionDialog,
  EditUserDialog
} from './Dialogs';
import UGYToolbar from './UGYToolbar';
import {styles} from './Styles';
import {TabContainer} from './TabContainer';
import ProductsTab from './ProductsTab';
import ImportUsersDialog from './Dialogs/ImportUsersDialog';

const dataProvider = restClient;

class CenterView extends React.Component {
  state = {
    tab: 0,
    yearNavOpen: true,
    anchor: 'left',
    update: false,
    ready: false,
    userChecks: [],
    groups: [],
    open: true,
    selectedGroup: 0,
    addUsersToGroupOpen: false,
    addUsersToUserOpen: false,
    addUserOpen: false,
    importDialogOpen: false,
    importUsersOpen: false,
    newProducts: [],
    updatedProducts: [],
    deletedProducts: [],
    confirmDeletionDialogOpen: false,
    importStepsContent: [],
    importNumber: 0,
    categories: [],
    editUser: {id: -1, userName: '', password: '', fullName: ''},
    editUserOpen: false

  };

  save = event => {
    console.log(this.state.userChecks);
    let options = {};
    let url = hostURL + '/UserHierarchy';
    if (!options.headers) {
      options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    dataProvider(CREATE, 'UserHierarchy', {
      data: {year: this.props.year, data: this.state.userChecks}
    }).then(response => {
      localStorage.setItem('enabledYear', response.data.enabledYear);
    });

    options = {};
    if (!options.headers) {
      options.headers = new Headers({Accept: 'application/json'});
    }

    options.headers.set('Authorization', `Bearer ${token}`);
    if (this.state.deletedProducts.length > 0) {
      this.setState({confirmDeletionDialogOpen: true});
    } else {
      dataProvider(CREATE, 'ProductsMany', {
        data: {
          newProducts: this.state.newProducts,
          updatedProducts: this.state.updatedProducts,
          deletedProducts: this.state.deletedProducts,
          year: this.props.year
        }
      }).then(response => {
        this.setState({open: false});
        //  this.setState({open: false});
        this.props.push('/');
      });
    }
  };
  confirmPassword = event => {
    if (event.currentTarget.value == 2) {
      const username = localStorage.getItem('userName');
      const password = this.state.confirmDeletionPassword;
      feathersClient.authenticate({...authClientConfig, username: username, password: password}).then(() => {
        this.updateProducts(this.state.deletedProducts);
      }).catch(() => {
        this.setState({passwordError: true});
        return {};
      });
    } else {
      this.setState({deletedProducts: []});
      this.updateProducts([]);
    }
  };

  updateProducts (deletedProducts) {
    dataProvider(CREATE, 'ProductsMany', {
      data: {
        newProducts: this.state.newProducts,
        updatedProducts: this.state.updatedProducts,
        deletedProducts: deletedProducts,
        year: this.props.year
      }
    }).then(response => {
      this.setState({confirmDeletionDialogOpen: false, confirmDeletionPassword: '', open: false});
      //  this.setState({open: false});
      this.props.push('/');
    });
  }

  handleTabChange = (event, value) => {
    this.setState({tab: value});
  };

  cancel = event => {
    this.setState({open: false});
    this.props.push('/');
  };

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
  };
  closeDialog = (dialog) => () => {
    this.modifyDialog(dialog, {}, false);
  };
  modifyDialog = (dialog, options, value) => {
    let obj = {};
    switch (dialog) {
    case 'addUsersToGroup':
      obj.addUsersToGroupOpen = value;
      break;
    case 'addUsersToUser':
      obj.addUsersToUserOpen = value;
      break;
    case 'addUser':
      obj.addUserOpen = value;
      break;
    case 'importUsers':
      obj.importUsersOpen = value;
      break;
    case 'editUser':
      obj.editUserOpen = value;
      if (options.editUser) {
        obj.editUser = options.editUser;
      } else {
        obj.editUser = {id: -1, userName: '', password: '', fullName: ''};
      }
      break;
    }
    this.setState(obj);
  };
  showDialog = (dialog, options) => {
    this.modifyDialog(dialog, options, true);
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
      this.setState({'users': users, 'update': true, 'userChecks': userChecks});
    });
  }
  renderMainView () {
    const {classes} = this.props;

    const {anchor, yearNavOpen} = this.state;
    return <main className={classes.fullHeightWidth}>
      <div className={classes.toolbar}/>
      <Paper className={classes.fullHeightWidth}>
        {this.renderTabView()}
        <UGYToolbar className={this.props.classes.bottomBar} onCancel={this.cancel} onSave={this.save}/>
      </Paper>
    </main>;
  }

  renderTabView () {
    const {classes} = this.props;

    const {tab} = this.state;

    return <div className={classes.fullHeightWidth}>
      <Tabs value={tab} onChange={this.handleTabChange}>
        <Tab label='Users'/>
        <Tab label='Products'/>
      </Tabs>
      {tab === 0 && <TabContainer className={classes.tabScroll}>{this.renderUserTab()}</TabContainer>}
      {tab === 1 && <TabContainer className={classes.tabNoScroll}>{this.renderProductsTab()}</TabContainer>}
    </div>;
  }

  renderUserTab () {
    return (
      <UsersTab groups={this.state.groups}
        showDialog={this.showDialog}
        userChecks={this.state.userChecks}
        updateUserChecks={this.handleUpdateUserChecks}
        year={this.props.year}/>
    );
  }

  safeStateUpdater = (state) => {
    this.setState(state);
  }

  renderProductsTab () {
    return (
      <ProductsTab year={this.props.year} yearText={this.props.yearText} updateProducts={this.safeStateUpdater}/>
    );
  }
  renderDialogs () {
    return [
      <AddUsersToGroupDialog key={'addUsersToGroupDialog'}
        closeDialog={this.closeDialog('addUsersToGroup')}
        userChecks={this.state.userChecks}
        updateUserChecks={this.handleUpdateUserChecks}
        open={this.state.addUsersToGroupOpen}
        groups={this.state.groups}/>,
      <AddUsersToUserDialog key={'addUsersToUserDialog'}
        closeDialog={this.closeDialog('addUsersToUser')}
        userChecks={this.state.userChecks}
        updateUserChecks={this.handleUpdateUserChecks}
        open={this.state.addUsersToUserOpen}/>,
      <AddUserDialog key={'addUserDialog'}
        closeDialog={this.closeDialog('addUser')}
        open={this.state.addUserOpen}/>,
      <ImportUsersDialog key={'importUserDialog'}
        closeImportDialog={this.closeDialog('importUsers')}
        importDialogOpen={this.state.importUsersOpen}/>,
      <EditUserDialog key={'editUserDialog-' + this.state.editUser.id}
        closeDialog={this.closeDialog('editUser')}
        open={this.state.editUserOpen}
        userName={this.state.editUser.userName}
        id={this.state.editUser.id} fullName={this.state.editUser.fullName}/>,
      <ConfirmDeletionDialog key={'confirmDeletionDialog'}
        closeDialog={this.closeDialog('confirmDeletion')}
        open={this.state.confirmDeletionDialogOpen}
        confirmPassword={this.confirmPassword}/>

    ];
  }

  componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.year !== prevProps.year) {
      this.getUsers(this.props.year.id);
      this.getGroups(this.props.year.id);
    }
  }
  componentDidMount () {
    this.getUsers();
    this.getGroups();
    this.setState({ready: true});
  }
  render () {
    return (<div className={this.props.classes.content}>
      {this.renderMainView()}
      {this.renderDialogs()}
    </div>);
  }
}

CenterView.PropTypes = {
  year: PropTypes.any,
  yearText: PropTypes.any
};

export default connect(null, {
  push

})(withStyles(styles, {withTheme: true})(CenterView));
