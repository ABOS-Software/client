import authProvider from '../security/authProvider';
import {AUTH_ERROR} from 'react-admin';

export default (push) => (e) => {
  authProvider(AUTH_ERROR, e)
    .catch(e => {
      push('/login');
    });
};
