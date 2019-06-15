// in src/App.js
import React from 'react';
import {Admin, AppBar, Layout, Resource} from 'react-admin';
import ErrorBoundry from './ErrorBoundry';
import {CategoryCreate, CategoryEdit, CategoryList} from './resources/Categories.js';
import {GroupCreate, GroupEdit, GroupList} from './resources/Group.js';
import {YearCreate, YearEdit, YearList, YearShow} from './resources/Year.js';
import {CustomerCreate, CustomerEdit, CustomerList} from './resources/Customers.js';
import restClient from './grailsRestClient';
import authClient from './security/authProvider';
import {Dashboard} from './dashboard';
import {Reports} from './Reports';
import {UGY} from './UGY';
import {UserList, UserShow} from './resources/User';
import {Maps} from './maps';
import {Route} from 'react-router-dom';
import About from './resources/About';
import {createGenerateClassName, jssPreset} from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';
import * as Sentry from '@sentry/browser';
import {Login} from './Login';
import {PaymentEdit} from './resources/Payments';
import profile from './resources/EditProfile';
import MyUserMenu from './userMenu';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
const dataProvider = restClient;
// const dataProvider = simpleRestProvider('http://192.168.1.3:8080/api', httpClient);

Sentry.init({
  dsn: 'https://4bd4e85079aa4ba59ddb160b8bfd1484@sentry.io/1365370'
});
Sentry.configureScope(scope => {
  scope.addEventProcessor(async (event, hint) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      event = null;
    }
    return event;
  });
});
const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu/>}/>;
const routes = [
  <Route exact path='/about' component={About}/>,
  <Route exact path='/my-profile' component={profile}/>
];
const layout = (props) => {
  const {
    children,
    ...rest
  } = props;
  return (
    <Layout {...rest} appBar={MyAppBar}>
      <ErrorBoundry>
        {children}
      </ErrorBoundry>
    </Layout>

  );
};

function renderCategories (permissions) {
  return permissions === 'ROLE_ADMIN'
    ? <Resource name='Categories' list={CategoryList} edit={CategoryEdit} create={CategoryCreate}/>
    // UGY
    : <Resource name='Categories'/>;
}

function renderYears (permissions) {
  return permissions === 'ROLE_ADMIN'
    ? <Resource name='Years' show={YearShow} edit={YearEdit} list={YearList} create={YearCreate}/>
    // UGY
    : <Resource name='Years' show={YearShow} list={YearList}/>;
}

function renderGroups (permissions) {
  return permissions === 'ROLE_ADMIN'
    ? <Resource name='Group' list={GroupList} edit={GroupEdit} create={GroupCreate}/>
    // UGY
    : <Resource name='Group'/>;
}

function renderUGY (permissions) {
  return permissions === 'ROLE_ADMIN'
    ? <Resource name='UsersProducts' options={{label: 'Users and Products'}} list={UGY}/>
    // UGY
    : null;
}

function renderResources () {
  return permissions => [
    <Resource name='customers' list={CustomerList} edit={CustomerEdit} create={CustomerCreate}/>,
    <Resource name='Reports' list={Reports}/>,
    <Resource name='Maps' list={Maps}/>,
    // Reports
    // <Resource name="customers"/>,
    <Resource name='user' list={UserList} show={UserShow}/>,
    renderCategories(permissions),
    renderYears(permissions),
    renderGroups(permissions),
    renderUGY(permissions),
    <Resource name='Payments' edit={PaymentEdit}/>,
    <Resource name='Notes'/>,
    <Resource name='payment_methods'/>,
    <Resource name='note_codes'/>,
    <Resource name='profile'/>
  ];
}

const App = () => (
  <ErrorBoundry>
    <JssProvider jss={jss} generateClassName={generateClassName}>

      <Admin dashboard={Dashboard} dataProvider={dataProvider}
        authProvider={authClient} appLayout={layout} customRoutes={routes} loginPage={Login}>

        {renderResources()}
      </Admin>
    </JssProvider>
  </ErrorBoundry>
);

export default App;
