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
const storeUser = ({...params}) => {
  /*     const dataProvider = restClient(app, {});
      dataProvider(GET_ONE, 'currentUser')
          .then(response => {
              if (response.status < 200 || response.status >= 300) {
                  throw new Error(response.statusText);
              }
              return response.json();
          }).then(({userName, fullName, enabledYear}) => {
          localStorage.setItem('userName', userName);
          localStorage.setItem('fullName', fullName);
          localStorage.setItem('enabledYear', enabledYear);
      });*/
  console.log(params);

};
app.on('authenticated', storeUser);

/*() => {
   const dataProvider = restClientDp(app, {});

    /!*
        *!/
});*/

// Connect to the same as the browser URL (only in the browser)

// Connect to a different URL
export default app;