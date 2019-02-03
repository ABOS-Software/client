import {AUTH_CHECK, AUTH_ERROR, AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT} from 'react-admin';
import decodeJwt from 'jwt-decode';

export const authClientConfig = {
  storageKey: 'token', // The key in localStorage used to store the authentication token
  authenticate: { // Options included in calls to Feathers client.authenticate
    strategy: 'local' // The authentication strategy Feathers should use
  },
  permissionsKey: 'permissions', // The key in localStorage used to store permissions from decoded JWT
  permissionsField: 'role', // The key in the decoded JWT containing the user's role
  passwordField: 'password', // The key used to provide the password to Feathers client.authenticate
  usernameField: 'username', // The key used to provide the username to Feathers client.authenticate
  redirectTo: '/login' // Redirect to this path if an AUTH_CHECK fails. Uses the react-admin default of '/login' if omitted.
};

function login (client, authenticate, usernameField, username, passwordField, password) {
  return client.authenticate({
    ...authenticate,
    [usernameField]: username,
    [passwordField]: password
  }).then(async response => {
    console.log('Authenticated!', response);
    const payload = await client.passport.verifyJWT(response.accessToken);
    console.log('Authenticated!', payload);

    let user = await client.service('user').get(payload.userId);
    client.set('user', user);
    localStorage.setItem('userName', user.username);
    localStorage.setItem('fullName', user.fullName);
    localStorage.setItem('enabledYear', user.enabledYear);

    console.log('User', client.get('user'));

    return response;
  });
}

function getPermissions (permissionsKey, ret, storageKey, permissionsField) {
  const localStoragePermissions = JSON.parse(localStorage.getItem(permissionsKey));
  if (localStoragePermissions && localStoragePermissions.length !== 0) {
    ret = Promise.resolve(localStoragePermissions);
  }
  try {
    const jwtToken = localStorage.getItem(storageKey);
    const decodedToken = decodeJwt(jwtToken);
    const jwtPermissions = decodedToken[permissionsField] ? decodedToken[permissionsField] : [];
    localStorage.setItem(permissionsKey, JSON.stringify(jwtPermissions));
    ret = Promise.resolve(jwtPermissions);
  } catch (e) {
    ret = Promise.reject();
  }
  return ret;
}

export default (client, options = {}) => (type, params) => {
  const {
    storageKey,
    authenticate,
    permissionsKey,
    permissionsField,
    passwordField,
    usernameField,
    redirectTo
  } = Object.assign({}, {
    storageKey: 'token',
    authenticate: {type: 'local'},
    permissionsKey: 'permissions',
    permissionsField: 'role',
    passwordField: 'password',
    usernameField: 'email'
  }, options);

  let ret;

  switch (type) {
  case AUTH_LOGIN:
    const {username, password} = params;
    ret = login(client, authenticate, usernameField, username, passwordField, password);
    break;

  case AUTH_LOGOUT:
    localStorage.removeItem(permissionsKey);
    ret = client.logout();
    break;

  case AUTH_CHECK:
    ret = localStorage.getItem(storageKey) ? Promise.resolve() : Promise.reject({redirectTo});
    break;

  case AUTH_ERROR:
    const {code} = params;
    if (code === 401 || code === 403) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(permissionsKey);
      ret = Promise.reject();
    }
    ret = Promise.resolve();
    break;

  case AUTH_GET_PERMISSIONS:

    ret = getPermissions(permissionsKey, ret, storageKey, permissionsField);
    break;

  default:
    ret = Promise.reject(`Unsupported FeathersJS authClient action type ${type}`);
  }
  return ret;
};
