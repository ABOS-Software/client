import React from 'react';
import {
    BooleanField,
    classes,
    CREATE,
    Datagrid,
    EditButton,
    fetchUtils,
    Field,
    Filter,
    List,
    NumberField,
    ReferenceArrayInput,
    SelectArrayInput,
    TextField,
    TextInput,
    UPDATE
} from 'react-admin';
import restClient from '../grailsRestClient';
import CustomerLinkField from "./CustomerRecordLink";
import {withStyles} from '@material-ui/core/styles';
import CustomerEditClass from './Customers/CustomerEdit';
import CustomerCreateClass from './Customers/CustomerCreate';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = restClient;
const styles = {
    flex: {display: 'flex'},
    flexColumn: {display: 'flex', flexDirection: 'column'},
    leftCol: {flex: 1, marginRight: '1em'},
    rightCol: {flex: 1, marginLeft: '1em'},
    singleCol: {marginTop: '2em', marginBottom: '2em'},
    inlineBlock: {display: 'inline-flex', marginRight: '1rem'},
    block: {display: 'block'},

};
//import ErrorBoundary from '../ErrorBoundary';
/*import CustomerIcon from '';
export { CustomerIcon };*/
/*
[

  {
    "id": 92,
    "phone": "",
    "home": false,
    "interested": false,
    "ordered": false,
    "donation": 0,
    "userName": "me",
    "order": {
      "id": 92,
      "cost": 46,
      "delivered": false,
      "paid": 0
    },
    "zipCode": null,
    "customerName": "",
    "streetAddress": "",
    "state": null,
    "latitude": ,
    "longitude": ,
    "year": {
      "year": "2018"
    }
  }
]

 */
const CustomerFilter = (props) => (
    <Filter  {...props}>
        <TextInput label="Search" source="customerName" alwaysOn/>
        <ReferenceArrayInput
            source="year"
            reference="Years"
            sort={{field: 'id', order: 'ASC'}}
            label="Year"
        >
            <SelectArrayInput optionText="year" source="year" label="Year"/>
        </ReferenceArrayInput>
    </Filter>
);

export const CustomerList = (props) => (
    <List {...props} filters={<CustomerFilter context="form"/>}>
        <Datagrid>
            <CustomerLinkField/>
            <TextField source="streetAddress"/>
            <TextField source="city"/>
            <TextField source="state"/>
            <NumberField label="Order Cost" source="order.cost" options={{style: 'currency', currency: 'USD'}}/>
            <NumberField label="Amount Paid" source="order.amountPaid" options={{style: 'currency', currency: 'USD'}}/>
            <BooleanField label="Delivered?" source="order.delivered"/>
            <EditButton basePath="/customers"/>
        </Datagrid>

    </List>

);

const CustomerTitle = ({record}) => {
    return <span>{record ? (record.customerName ? `${record.customerName + " " + record.year.year + " Order"}` : `${record.json.customerName + " " + record.json.year.year + " Order"}`) : ''}</span>;
};

export const CustomerEdit = ({...props}) => (
    <CustomerEditClass {...props} title={<CustomerTitle/>}/>
);
const reverseGeocode = (address) => {
    return {lat: 0, long: 0};
};

const saveCreation = (record, redirect) => {

    let {lat, long} = reverseGeocode(record.streetAddress + " " + record.city + ", " + record.state + " " + record.zipCode);
    dataProvider(CREATE, 'Customers', {
        data: {
            customerName: record.customerName,
            streetAddress: record.streetAddress,
            city: record.city,
            state: record.state,
            zipCode: record.zipCode,
            phone: record.phone,
            custEmail: record.custEmail,
            latitude: lat,
            longitude: long,
            ordered: false,
            home: true,
            interested: true,
            donation: record.donation,
            year: {id: record.year},

            user: record.user,

            userName: record.user.userName,
            order: {}

        }
    }).then(response => {
        let customer = {id: response.id};
        let order = record.order;
        order.customer = customer;
        let newOrderedProducts = [];
        order.orderedProducts.forEach((orderedProduct) => {
            orderedProduct.customer = customer;
            newOrderedProducts.push(orderedProduct);
        });
        order.orderedProducts = newOrderedProducts;
        dataProvider(UPDATE, 'Customers', {

            data: {
                customerName: record.customerName,
                streetAddress: record.streetAddress,
                city: record.city,
                state: record.state,
                zipCode: record.zipCode,
                phone: record.phone,
                custEmail: record.custEmail,
                latitude: lat,
                longitude: long,
                ordered: false,
                home: true,
                interested: true,
                donation: record.donation,
                year: {id: record.year},

                user: record.user,

                userName: record.user.userName,
                order: order


            }

        });
    });


};
export const CustomerCreate = withStyles(styles)(({classes, ...props}) => (
    <CustomerCreateClass {...props}/>

));
