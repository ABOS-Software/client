import React from 'react';

import {CREATE, Create, SimpleForm} from 'react-admin';
import restClient from '../../grailsRestClient';
import CustomerForm from './CustomerForm';

const dataProvider = restClient;

const saveCreation = (record, redirect) => {
  let order = record.order;

  // order.customer = customer;

  dataProvider(CREATE, 'Customers', {
    data: {
      customerName: record.customerName,
      streetAddress: record.streetAddress,
      city: record.city,
      state: record.state,
      zipCode: record.zipCode,
      phone: record.phone,
      custEmail: record.custEmail,
      latitude: 0,
      longitude: 0,
      ordered: false,
      home: true,
      interested: true,
      donation: record.donation,
      year: {id: record.year},

      user: record.user,

      userName: record.user.userName,
      order: order

    }
  });
};

class CustomerCreate extends React.Component {
  render () {
    const {...props} = this.props;

    return (
      <Create title='Create a Customer' {...props} >
        <SimpleForm save={saveCreation} submitOnEnter={false}>
          <CustomerForm/>
        </SimpleForm>
      </Create>
    );
  }
}

export default CustomerCreate;
