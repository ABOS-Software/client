// in src/App.js
import React from 'react';
import {Admin, AppBar, Layout, MenuItemLink, Resource, UserMenu} from 'react-admin';

import {CategoryCreate, CategoryEdit, CategoryList} from './resources/Categories.js';
import {GroupCreate, GroupEdit, GroupList} from './resources/Group.js';
import {YearCreate, YearEdit, YearList, YearShow} from './resources/Year.js';
import {CustomerCreate, CustomerEdit, CustomerList} from './resources/Customers.js';
import restClient from './grailsRestClient';
import authClient, {authClientConfig} from './security/authProvider';
import {Dashboard} from './dashboard';
import {Reports} from "./Reports";
import {UGY} from "./UGY";
import {reps} from "./reps";
import {UserList, UserShow} from "./resources/User";
import {Maps} from './maps';
import {Route} from 'react-router-dom';
import About from './resources/About';
import InfoIcon from '@material-ui/icons/Info';
import {createGenerateClassName, jssPreset} from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';
import feathersClient from './feathersClient';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());

const dataProvider = restClient;
//const dataProvider = simpleRestProvider('http://192.168.1.3:8080/api', httpClient);
const MyUserMenu = props => (
    <UserMenu {...props}>
        <MenuItemLink
            to="/about"
            primaryText="About"
            leftIcon={<InfoIcon />}
        />
    </UserMenu>
);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;
const routes = [
    <Route exact path="/about" component={About} />,
];
const layout = (props) => <Layout {...props} appBar={MyAppBar}/>;
const App = () => (
    <JssProvider jss={jss} generateClassName={generateClassName}>

        <Admin dashboard={Dashboard} dataProvider={dataProvider}
               authProvider={authClient(feathersClient, authClientConfig)} appLayout={layout} customRoutes={routes}>
            {permissions => [
                <Resource name="customers" list={CustomerList} edit={CustomerEdit} create={CustomerCreate}/>,
                <Resource name="Reports" list={Reports}/>,
                <Resource name="Maps" list={Maps}/>,
                //Reports
                // <Resource name="customers"/>,
                <Resource name="User" list={UserList} show={UserShow}/>,
                <Resource name="Reps" options={{label: 'res'}} list={reps}/>,
                permissions === 'manager'
                    ? <Resource name="User"/>
                    : null,
                permissions === 'ROLE_ADMIN'
                    ? <Resource name="Categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate}/>
                    //UGY
                    : <Resource name="Categories"/>,
                permissions === 'ROLE_ADMIN'
                    ? <Resource name="Years" show={YearShow} edit={YearEdit} list={YearList} create={YearCreate}/>
                    //UGY
                    : <Resource name="Years"/>,
                permissions === 'ROLE_ADMIN'
                    ? <Resource name="Group" list={GroupList} edit={GroupEdit} create={GroupCreate}/>
                    //UGY
                    : <Resource name="Group"/>,
                permissions === 'ROLE_ADMIN'
                    ? <Resource name="UsersProducts" options={{label: 'Users and Products'}} list={UGY}/>
                    //UGY
                    : <Resource name="UsersProducts" options={{label: 'Users and Products'}} list={UGY}/>,
            ]}

        </Admin>
    </JssProvider>
);

export default App;
