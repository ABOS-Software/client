import React from 'react';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Modal from '@material-ui/core/Modal';
import classNames from 'classnames';

import update from 'immutability-helper';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import ProductsGrid from './ProductsGrid.js';
import {CREATE, GET_LIST, showNotification, UPDATE} from 'react-admin';

import Paper from '@material-ui/core/Paper';

import restClient from '../grailsRestClient';
import {rowStatus} from './ProductsGrid';
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
import {styles} from "./Styles";
import {TabContainer} from "./TabContainer";

const dataProvider = restClient;

class UGYEditor extends React.PureComponent {
  // users: {}, years: {}, customers: {}
  // users: {}, years: {}, customers: {}
  state = {
    tab: 0,
    yearNavOpen: true,
    anchor: 'left',
    update: false,
    ready: false,
    userChecks: [],
    years: [],
    groups: [],
    open: true,
    selectedGroup: 0,
    addUsersToGroupOpen: false,
    addUsersToUserOpen: false,
    addUserOpen: false,
    importDialogOpen: false,
    newProducts: [],
    updatedProducts: [],
    deletedProducts: [],
    confirmDeletionDialogOpen: false,
    importStepsContent: [],
    importNumber: 0,
    year: 5,
    yearText: '2018',
    categories: [],
    editUser: {id: -1, userName: '', password: '', fullName: ''},
    editUserOpen: false

  };
  constructor (props) {
    super(props);
  }

    loadCategories = (yearId) => {
      let filter = {};
      if (yearId) {
        filter = {year: yearId};
      } else if (this.state.year) {
        filter = {year: this.state.year};
      }
      dataProvider(GET_LIST, 'Categories', {
        filter: filter,
        pagination: {page: 1, perPage: 100},
        sort: {field: 'id', order: 'DESC'}
      })
        .then(response =>
          response.data.reduce((stats, category) => {
            stats.categories.push({

              id: category.id,
              name: category.categoryName,
              value: category.categoryName

            });

            return stats;
          },
          {
            categories: []

          }
          )
        ).then(({categories}) => {
          categories.push({id: '-1', value: ' '});

          this.setState({
            categories: categories
          });
        }
        );
    };

    getYears () {
      dataProvider(GET_LIST, 'Years', {
        filter: {},
        sort: {field: 'id', order: 'DESC'},
        pagination: {page: 1, perPage: 1000}
      }).then(response => {
        this.setState({years: response.data});
      });
    }

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
        data: {year: this.state.year, data: this.state.userChecks}
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
            year: this.state.year
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

  updateProducts(deletedProducts) {
    dataProvider(CREATE, 'ProductsMany', {
      data: {
        newProducts: this.state.newProducts,
        updatedProducts: this.state.updatedProducts,
        deletedProducts: deletedProducts,
        year: this.state.year
      }
    }).then(response => {
      this.setState({confirmDeletionDialogOpen: false, confirmDeletionPassword: '', open: false});
      //  this.setState({open: false});
      this.props.push('/');
    });
  }

  handleDrawerToggle = () => {
      this.setState(state => ({yearNavOpen: !state.yearNavOpen}));
    };

    handleTabChange = (event, value) => {
      this.setState({tab: value});
    };
    updateYear = year => event => {
      this.setState({year: year.id, yearText: year.year});
      this.getUsers(year.id);
      this.getGroups(year.id);
      this.loadCategories(year.id);
    };
    cancel = event => {
      this.setState({open: false});
      this.props.push('/');
    };

    editUser = event => {
      dataProvider(UPDATE, 'User', {
        id: this.state.editUser.id,
        data: {
          username: this.state.editUser.userName,
          full_name: this.state.editUser.fullName,

          password: this.state.editUser.password
        }
      }).then(response => {
        this.setState({editUserOpen: false});
      });
    };

    getGroups (yearId) {
      dataProvider(GET_LIST, 'Group', {
        filter: {year_id: yearId || this.state.year},
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

    handleAddProduct = (newProd) => {
      let parentState = update(this.state.newProducts, {
        $push: [newProd]
      });
      this.setState({newProducts: parentState});
    };

    handleUpdateProduct = (updated) => {
      let parentState;
      if (updated.status === rowStatus.UPDATE) {
        let index = this.state.updatedProducts.findIndex(prod => prod.id === updated.id);

        if (index > -1) {
          parentState = update(this.state.updatedProducts, {
            [index]: {$merge: updated}
          });
        } else {
          parentState = update(this.state.updatedProducts, {
            $push: [updated]
          });
        }
        this.setState({updatedProducts: parentState});
      } else {
        let index = this.state.newProducts.findIndex(prod => prod.id === updated.id);
        if (index > -1) {
          parentState = update(this.state.newProducts, {
            [index]: {$merge: updated}
          });
        } else {
          parentState = update(this.state.newProducts, {
            $push: [updated]
          });
        }
        this.setState({newProducts: parentState});
      }
    };

    handleDeleteProduct = (deleted) => {
      let parentState;

      if (deleted.status !== rowStatus.INSERT) {
        parentState = update(this.state.deletedProducts, {
          $push: [deleted]
        });
        this.setState({deletedProducts: parentState});
      } else {
        let index = this.state.newProducts.findIndex(prod => prod.id === deleted.id);
        let updated = {status: rowStatus.DELETE};
        parentState = update(this.state.newProducts, {
          [index]: {$merge: updated}
        });
        this.setState({newProducts: parentState});
      }
    };

    getUsers (yearId) {
      dataProvider(GET_LIST, 'UserHierarchy', {filter: {year: yearId || this.state.year}}).then(response => {
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
    renderYearItems = () => {
      let yearItems = [];
      this.state.years.forEach(year => {
        yearItems.push(<ListItem key={'YearItem-' + year.id} selected={this.state.year === year.id} button
          onClick={this.updateYear(year)}>
          <ListItemText primary={year.year}/>
        </ListItem>);
      });
      return yearItems;
    };

    render () {
      const {classes} = this.props;
      if (this.state.ready) {
        return (
          <div>
            <Modal

              open={this.state.open}
              disableBackdropClick
            >
              <div className={classes.modal}>
                <div className={classes.root}>
                  {this.renderTitleBar(classes)}
                  {this.renderDrawer()}

                  {this.renderMainView()}
                </div>
              </div>

            </Modal>
            {this.renderDialogs()}

          </div>

        );
      } else {
        return (<h2>Loading...</h2>);
      }
    }

    renderMainView () {
      const {classes} = this.props;

      const {anchor, yearNavOpen} = this.state;
      return <main className={classNames(classes.content, classes[`content-${anchor}`], {
        [classes.contentShift]: yearNavOpen,
        [classes[`contentShift-${anchor}`]]: yearNavOpen
      })}>
        <div className={classes.toolbar}/>
        <Paper className={classes.fullHeightWidth}>
          {this.renderTabView()}
          <UGYToolbar onCancel={this.cancel} onSave={this.save}/>
        </Paper>
      </main>;
    }

    renderTabView () {
      const {classes} = this.props;

      const {tab} = this.state;

      return <div>
        <Tabs value={tab} onChange={this.handleTabChange}>
          <Tab label='Users'/>
          <Tab label='Products'/>
        </Tabs>
        {tab === 0 && <TabContainer className={classes.tabScroll}>{this.renderUserTab()}</TabContainer>}
        {tab === 1 && <TabContainer className={classes.tabNoScroll}>{this.renderProductsTab()}</TabContainer>}
      </div>;
    }

  renderUserTab() {
    return (
      <UsersTab groups={this.state.groups}
                showDialog={this.showDialog}
                userChecks={this.state.userChecks}
                updateUserChecks={this.handleUpdateUserChecks}
                year={this.state.year}/>
    );
  }

  renderProductsTab() {
    const {classes} = this.props;

    return (
      <div className={classes.productsGrid}>
        <div className={classes.fullHeightWidth}>
          <ProductsGrid year={this.state.year} yearText={this.state.yearText}
                        addProduct={this.handleAddProduct} updateProduct={this.handleUpdateProduct}
                        deleteProduct={this.handleDeleteProduct} categories={this.state.categories}/>
        </div>
      </div>
    );
  }

  renderDrawer() {
    const {classes} = this.props;
      const drawer = (
        <div>
          <div className={classes.toolbar}/>
          <Divider/>
          <List component='nav'>
            {this.renderYearItems()}

          </List>

        </div>
      );
      return (<div>
        {this.renderLargeDrawer(drawer)}
        {this.renderSmallDrawer(drawer)}
      </div>);
  }

  renderLargeDrawer(drawer) {
    const {classes, theme} = this.props;

    return <Hidden mdUp>

      <Drawer
        variant='permanent'
        open={this.state.yearNavOpen}
        onClose={this.handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        {drawer}
      </Drawer>
    </Hidden>;
  }

  renderSmallDrawer(drawer) {
    const {classes, theme} = this.props;

    return <Hidden smDown implementation='css' className={classes.fullHeight}>
      <Drawer
        variant='persistent'
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}

        open={this.state.yearNavOpen}
        onClose={this.handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper
        }}
        className={classes.fullHeight}
      >
        {drawer}
      </Drawer>
    </Hidden>
      ;
  }

  renderTitleBar() {
    const {classes} = this.props;

    return <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='Open drawer'
          onClick={this.handleDrawerToggle}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant='title' color='inherit' noWrap>
          Users And Products
        </Typography>
      </Toolbar>
    </AppBar>;
  }

  renderDialogs() {
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

  componentWillMount() {
  }

  componentDidMount() {
    this.loadCategories();

    this.getUsers();
    this.getYears();
    this.getGroups();
    this.setState({ready: true});
  }
}

UGYEditor.propTypes = {
  push: PropTypes.func,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default connect(null, {
  push,
  showNotification

})(withStyles(styles, {withTheme: true})(UGYEditor));
