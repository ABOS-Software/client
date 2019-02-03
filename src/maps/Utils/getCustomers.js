import dataProvider from '../../grailsRestClient';
import {GET_LIST} from 'react-admin';
import {deriveCustomerObject} from './deriveCustomerObject';

export const getCustomers = (save) => {
  dataProvider(GET_LIST, 'customers', {
    filter: {},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(customerReducer()).then(save);
};
const withinError = (in1, in2, error) => {
  return Math.abs(Math.abs(in1 - in2) / in1) <= error;
};

const customerReducer = () => response => response.data.reduce((custs, customer) => {
  let address = getCustomerAddress(customer);
  let place = getPlace(custs, customer, address);
  if (place) {
    custs['custs'][place.id]['customers'][customer.year.id] = deriveCustomerObject(customer);
  } else {
    let id = custs['places'].length;
    custs['places'].push({
      id: id,
      latitude: customer.latitude,
      longitude: customer.longitude,
      address: address
    });
    custs['custs'][id] = {
      latitude: customer.latitude,
      longitude: customer.longitude,
      id: custs['number'] + 1,
      customers: {
        [customer.year.id]: deriveCustomerObject(customer)
      }
    };
    custs['number'] = custs['number'] + 1;
  }
  return custs;
},
{number: 0, custs: {}, places: []}
);

const getCustomerAddress = (customer) => {
  return customer.streetAddress + ' ' + customer.city + ' ' + customer.state + ' ' + customer.zipCode;
};

const getPlace = (custs, customer, address) => {
  return custs['places'].find(place => ((withinError(place.latitude, customer.latitude, 0.000001) && withinError(place.latitude, customer.latitude, 0.000001)) || place.address === address));
};
