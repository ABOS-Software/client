import dataProvider from '../../grailsRestClient';
import {GET_ONE} from 'react-admin';

export const getDefaultValues = () => {
  return dataProvider(GET_ONE, 'profile', {
    id: 'my-profile'
  }).then(response => {
    return response.data;
  });
};
