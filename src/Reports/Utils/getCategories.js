import dataProvider from '../../grailsRestClient';
import {GET_LIST} from 'react-admin';

export const getCategoriesForYear = (Year) => {
  // this.setState({year: Year});

  return dataProvider(GET_LIST, 'Categories', {
    filter: {year: Year},
    sort: {field: 'id', order: 'DESC'},
    pagination: {page: 1, perPage: 1000}
  }).then(response => {
    response.data.unshift({id: 'All', categoryName: 'All'});
    return response.data;
  });
};
