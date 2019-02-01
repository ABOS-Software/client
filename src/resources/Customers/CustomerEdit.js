import {withStyles} from '@material-ui/core';
import React from 'react';

import {Edit, SimpleForm} from 'react-admin';
import CustomerForm from './CustomerForm';

const styles = {};

class CustomerEdit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {address: '', zipCode: '', city: '', state: '', update: 0};
  }

  render () {
    const {classes, ...props} = this.props;

    return (
      <Edit {...props}>

        <SimpleForm>
          <CustomerForm edit/>

        </SimpleForm>
      </Edit>
    );
  }
}

export default withStyles(styles)(CustomerEdit);
