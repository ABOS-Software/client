import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 0,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  userPanel: {
    width: '100%',
  },
  modal: {
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    position: 'absolute',
  },
  appBar: {
    position: 'absolute',

    zIndex: theme.zIndex.drawer + 1,

  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    display: 'flex',
    width: '100%',

    flexDirection: 'column',
    flexGrow: 0,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  flex: {
    flexGrow: 1,
  },
  topLevelExpansionPanel: {
    display: 'block',
  },
  'tabScroll': {
    height: '85%',
    overflow: 'scroll',
  },
  'tabNoScroll': {
    height: '85%',
    width: '100%',

  },
  fullHeight: {
    height: '100%',
  },
  fullHeightWidth: {
    height: '100%',
    width: '100%',
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column'

  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  button: {
    margin: theme.spacing.unit,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  productsGrid: {
    height: '100% !important',
    width: '100% !important',
    display: 'flex',
    flexDirection: 'column'
  },
  deleteButton: {
    margin: theme.spacing.unit,
    color: 'white',
    backgroundColor: 'red',

  },
});

class userGroupPanel extends React.PureComponent {
  render () {
    const { title, userPanels, classes } = this.props;
    return (
      <ExpansionPanel className={classes.topLevelExpansionPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.flex}>

            <Typography className={classes.heading}>{ title }</Typography>
          </div>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.topLevelExpansionPanel}>
          {
            userPanels
          }

        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
userGroupPanel.propTypes = {
  title: PropTypes.string.isRequired,
  userPanels: PropTypes.node.isRequired,
  classes: PropTypes.any

};

export default(withStyles(styles, {withTheme: true})(userGroupPanel));
