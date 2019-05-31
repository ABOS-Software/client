import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import {styles} from '../resources/Products/Styles';
import HorizontalLinearStepper from './HorizontalLinearStepper';

class Wizard extends Component {
  render () {
    const {classes, ...props} = this.props;
    // Tab Pane
    // Next Button/Prev Button
    // Loop through tabs supplied as children
    return (
      <Card>
        <div className={classes.main}>
          <HorizontalLinearStepper {...props}/>

        </div>

      </Card>

    );
  }
}

Wizard.propTypes = {
  label: PropTypes.string,
  options: PropTypes.object,
  source: PropTypes.string,
  input: PropTypes.object,
  className: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  stepContents: PropTypes.arrayOf(PropTypes.node),
  handleSubmit: PropTypes.func,
  save: PropTypes.func,
  formName: PropTypes.string,
  defaultValue: PropTypes.object,
};

Wizard.defaultProps = {
  formName: 'Wizard-form'
};

const WizardRaw = compose(
  withStyles(styles)
)(Wizard);
export default WizardRaw; // decorate with redux-form's <Field>
