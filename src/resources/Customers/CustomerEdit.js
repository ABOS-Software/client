import React from 'react';

import {Edit, SimpleForm} from 'react-admin';
import CustomerForm from './CustomerForm';

class CustomerEdit extends React.Component {
  render () {
    const {...props} = this.props;

    return (
      <Edit {...props}>

        <SimpleForm>
          <CustomerForm edit/>

        </SimpleForm>
      </Edit>
    );
  }
}

export default CustomerEdit;
