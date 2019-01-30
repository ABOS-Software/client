import {withStyles} from '@material-ui/core';
import React from 'react';

import {addField, CREATE, Create, fetchUtils, SimpleForm} from 'react-admin';
import restClient from '../../grailsRestClient';
import CustomerForm from './CustomerForm';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }
  const token = localStorage.getItem('access_token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const FullForm = addField(({input, meta: {touched, error}, ...props}) => (
  <CustomerForm {...props} />
));
const dataProvider = restClient;
const styles = {

  inlineBlock: {display: 'inline-flex', marginRight: '1rem'},
  halfDivider: {
    flexGrow: 1,
    height: '2px',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  dividerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'middle',
    alignItems: 'center'
  },
  orText: {
    margin: '10px'
  },
  addressContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  },
  addressContainerLabeled: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column'
  },
  addressComponent: {
    flexGrow: '1',
    marginRight: '1rem'
  }

};
const reverseGeocode = (address) => {
  return {lat: 0, long: 0};
};
const saveCreation = (record, redirect) => {
  let {lat, long} = reverseGeocode(record.streetAddress + ' ' + record.city + ', ' + record.state + ' ' + record.zipCode);
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
      latitude: lat,
      longitude: long,
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
  /* .then(response => {
            let customer = {id: response.id};
            let order = record.order;
            order.customer = customer;
            let newOrderedProducts = [];
            order.orderedProducts.forEach((orderedProduct) => {
                orderedProduct.customer = customer;
                newOrderedProducts.push(orderedProduct);
            });
            order.orderedProducts = newOrderedProducts;
            dataProvider(UPDATE, 'Customers', {

                data: {
                    customerName: record.customerName,
                    streetAddress: record.streetAddress,
                    city: record.city,
                    state: record.state,
                    zipCode: record.zipCode,
                    phone: record.phone,
                    custEmail: record.custEmail,
                    latitude: lat,
                    longitude: long,
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
        }); */
};

class CustomerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {address: '', zipCode: '', city: '', state: '', update: 0};
  }

    updateAddress = (address) => {
      let addressObj = {address: '', zipCode: '', city: '', state: '', bldgNum: '', street: ''};
      for (let i = 0; i < address.address_components.length; i++) {
        let addressType = address.address_components[i].types[0];
        let val = address.address_components[i]['short_name'];

        switch (addressType) {
          case 'street_address':
            addressObj.address = val;
            break;
          case 'street_number':
            addressObj.bldgNum = val;

            break;
          case 'route':
            addressObj.street = val;

            break;
          case 'locality':
            addressObj.city = val;

            break;
          case 'administrative_area_level_1':
            addressObj.state = val;

            break;
          case 'country':

            break;
          case 'postal_code':
            addressObj.zipCode = val;

            break;
          case 'postal_town':
            addressObj.city = val;

            break;
          case 'sublocality_level_1':
            addressObj.city = val;

            break;
        }
      }
      if (!addressObj.address) {
        addressObj.address = addressObj.bldgNum + ' ' + addressObj.street;
      }
      this.setState({...addressObj, update: 1});
    };

  render() {
    const {classes, ...props} = this.props;

    return (
      <Create title='Create a Customer' {...props}>
        <SimpleForm save={saveCreation}>
          <CustomerForm/>
        </SimpleForm>
      </Create>
    );
    /* <Edit {...props} filters={<CustomerFilter/>}>
      <ProductsGrid>
          <TextField label="Customer Name" source="customerName"/>
          <TextField source="streetAddress"/>
          <TextField source="city"/>
          <TextField source="state"/>
          <NumberField label="Order Cost" source="order.cost" options={{style: 'currency', currency: 'USD'}}/>
          <NumberField label="Amount Paid" source="order.paid" options={{style: 'currency', currency: 'USD'}}/>
          <BooleanField label="Delivered?" source="order.delivered"/>
          <EditButton basePath="/customers"/>
      </ProductsGrid>
  </Edit> */
    }
}

export default withStyles(styles)(CustomerCreate);
