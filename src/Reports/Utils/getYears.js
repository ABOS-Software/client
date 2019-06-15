import dataProvider from '../../grailsRestClient';
import {GET_LIST} from 'react-admin';

export const getYears = () => {
  return dataProvider(GET_LIST, 'Years', {
    filter: {},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(response => {
    return response.data;
  });
};
