import hostURL from './host';

const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');

const app = feathers();

const restClientF = rest(hostURL);

app.configure(restClientF.fetch(window.fetch));
app.configure(auth({

  entity: 'user', // the entity you are authenticating (ie. a users)
  service: 'user', // the service to look up the entity
  cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
  storageKey: 'token', // the key to store the accessToken in localstorage or AsyncStorage on React Native
  storage: window.localStorage // Passing a WebStorage-compatible object to enable automatic storage on the client.
}));
export default app;
