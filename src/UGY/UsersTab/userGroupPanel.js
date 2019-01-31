import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PropTypes from 'prop-types';
import {styles} from "../Styles";


class userGroupPanel extends React.PureComponent {
  render () {
    const {title, userPanels, classes} = this.props;
    return (
      <ExpansionPanel className={classes.topLevelExpansionPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
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

export default (withStyles(styles, {withTheme: true})(userGroupPanel));
