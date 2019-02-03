import dataProvider from '../../grailsRestClient';
import {GET_LIST} from 'react-admin';

export const getUsers = () => {
  return dataProvider(GET_LIST, 'User', {
    filter: {},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(response => {
    return response.data;
  });
};
