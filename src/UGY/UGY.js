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
import Modal from '@material-ui/core/Modal';
import classNames from 'classnames';
import {GET_LIST} from 'react-admin';
import restClient from '../grailsRestClient';
import {styles} from './Styles';
import CenterView from './CenterView';

const dataProvider = restClient;

class UGYEditor extends React.PureComponent {
  state = {
    yearNavOpen: true,
    anchor: 'left',
    update: false,
    ready: false,

    open: true,

    year: 0,
    yearText: '',
    years: []

  };

  getYears () {
    dataProvider(GET_LIST, 'Years', {
      filter: {},
      sort: {field: 'year', order: 'DESC'},
      pagination: {page: 1, perPage: 1000}
    }).then(response => {
      let year = response.data[0];
      this.setState({years: response.data, year: year.id, yearText: year.year});
    });
  }

  handleDrawerToggle = () => {
    this.setState(state => ({yearNavOpen: !state.yearNavOpen}));
  };

    updateYear = year => event => {
      this.setState({year: year.id, yearText: year.year});
    };

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

          </div>

        );
      } else {
        return (<h2>Loading...</h2>);
      }
    }

    renderMainView () {
      const {classes} = this.props;
      const {anchor, yearNavOpen} = this.state;

      return <CenterView className={classNames(classes.content, classes[`content-${anchor}`], {
        [classes.contentShift]: yearNavOpen,
        [classes[`contentShift-${anchor}`]]: yearNavOpen
      })} year={this.state.year} yearText={this.state.yearText}/>;
    }

    renderDrawer () {
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

    renderLargeDrawer (drawer) {
      const {classes} = this.props;

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

    renderSmallDrawer (drawer) {
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

    renderTitleBar () {
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

    componentWillMount () {
    }

    componentDidMount () {
      this.getYears();
      this.setState({ready: true});
    }
}

UGYEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default (withStyles(styles, {withTheme: true})(UGYEditor));
