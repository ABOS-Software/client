import dataProvider from '../../grailsRestClient';
import {GET_LIST} from 'react-admin';

export const getCustomersWithYearAndUser = (Year, User, includeSub) => {
  return dataProvider(GET_LIST, 'customers', {
    filter: {year: Year, user_id: User, includeSub: includeSub},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(response => {
    return response.data;
  });
};
export const getCustomersWithUser = (User, includeSub) => {
  return dataProvider(GET_LIST, 'customers', {
    filter: {user_id: User, includeSub: includeSub},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(response => {
    response.data.reduceRight((acc, obj, i) => {
      acc[obj.customerName] ? response.data.splice(i, 1) : acc[obj.customerName] = true;
      return acc;
    }, Object.create(null));

    // response.data.sort((a, b) => b.customerName - a.customerName);
    return response.data;
  });
};
