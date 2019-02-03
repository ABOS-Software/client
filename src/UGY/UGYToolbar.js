import React, {Component} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core';

const styles = (theme) => ({

  leftIcon: {
    marginRight: theme.spacing.unit
  },

  iconSmall: {
    fontSize: 20
  },
  button: {
    margin: theme.spacing.unit
  },
  bottomBar: {
    position: 'absolute',
    bottom: 10,
    right: 10
  }

});
export class UGYToolbar extends Component {
  render () {
    return <Toolbar>
      <div className={this.props.classes.bottomBar}>
        <Button variant='contained' color='secondary' className={this.props.classes.button}
          onClick={this.props.onCancel}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' className={this.props.classes.button}
          onClick={this.props.onSave}>
          <SaveIcon className={classNames(this.props.classes.leftIcon, this.props.classes.iconSmall)}/>
          Save
        </Button>
      </div>
    </Toolbar>;
  }
}

UGYToolbar.propTypes = {
  classes: PropTypes.any,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
};
export default (withStyles(styles, {withTheme: true})(UGYToolbar));
