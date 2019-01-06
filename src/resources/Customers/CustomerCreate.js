import {withStyles} from "@material-ui/core";
import React from "react";
import {change} from 'redux-form';
import Typography from '@material-ui/core/Typography';

import {
    addField,
    BooleanInput,
    CREATE,
    Create,
    fetchUtils,
    FormDataConsumer,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput
} from "react-admin";
import ProductsGrid from "../ProductsGrid";
import AddressInput from './addressInput';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import restClient from "../../grailsRestClient";

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
    fullWidth: {width: '100%'},
    block: {display: 'block'},
    halfDivider: {
        flexGrow: 1,
        height: '2px',
        backgroundColor: 'rgba(0,0,0,0.25)'
    },
    dividerContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        verticalAlign: 'middle',
        alignItems: 'center',
    },
    orText: {
        margin: '10px'
    },
    addressContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row'
    },
    addressContainerLabeled: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column'
    },
    addressComponent: {
        flexGrow: '1',
        marginRight: '1rem'
    }

};
const AddrInput = addField(({input, meta: {touched, error}, updateAddress, ...props}) => (
    <AddressInput updateAddress={address => {
        console.log(address);
        updateAddress(address)
    }}/>
));
const reverseGeocode = (address) => {
    return {lat: 0, long: 0};
};
const saveCreation = (record, redirect) => {

    let {lat, long} = reverseGeocode(record.streetAddress + " " + record.city + ", " + record.state + " " + record.zipCode);
    let order = record.order;
    // order.customer = customer;

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
            order: order

        }
    })
    /*.then(response => {
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
        });*/


};

class CustomerCreate extends React.Component {
    updateAddress = (address) => {
        let addressObj = {address: '', zipCode: '', city: '', state: '', bldgNum: '', street: ''};
        for (let i = 0; i < address.address_components.length; i++) {
            let addressType = address.address_components[i].types[0];
            let val = address.address_components[i]['short_name'];

            switch (addressType) {
                case "street_address":
                    addressObj.address = val;
                    break;
                case "street_number":
                    addressObj.bldgNum = val;

                    break;
                case "route":
                    addressObj.street = val;

                    break;
                case "locality":
                    addressObj.city = val;

                    break;
                case "administrative_area_level_1":
                    addressObj.state = val;

                    break;
                case "country":

                    break;
                case "postal_code":
                    addressObj.zipCode = val;

                    break;
                case "postal_town":
                    addressObj.city = val;

                    break;
                case "sublocality_level_1":
                    addressObj.city = val;

                    break;
            }

        }
        if (!addressObj.address) {
            addressObj.address = addressObj.bldgNum + ' ' + addressObj.street;
        }
        this.setState({...addressObj, update: 1});
    };

    constructor(props) {
        super(props);
        this.state = {address: '', zipCode: '', city: '', state: '', update: 0};
    }

    render() {
        const {classes, ...props} = this.props;

        return (
            <Create title="Create a Customer" {...props}>
                <SimpleForm save={saveCreation}>
                    <TextInput label="Customer Name" source="customerName" formClassName={classes.inlineBlock}/>
                    <TextInput source="phone" formClassName={classes.inlineBlock}/>
                    <TextInput source="custEmail" formClassName={classes.inlineBlock}/>
                    <span/>
                    <div className={classes.addressContainerLabeled}>
                        <FormLabel variant={"headline"}>Search For Address</FormLabel>
                        <AddrInput updateAddress={this.updateAddress}/>
                    </div>
                    <div className={classes.dividerContainer}>
                        <Divider className={classes.halfDivider}/>
                        <Typography className={classes.orText}>OR</Typography>
                        <Divider className={classes.halfDivider}/>

                    </div>
                    <div className={classes.addressContainerLabeled}>
                        <FormLabel variant={"headline"}>Enter an Address manually</FormLabel>
                        <div className={classes.addressContainer}>

                            <TextInput source="streetAddress" className={classes.addressComponent}
                                       value={this.state.address}/>
                            <FormDataConsumer className={classes.addressComponent}>
                                {({formData, ...rest}) => {
                                    if (this.state.update === 1) {
                                        this.setState({update: 0});
                                        rest.dispatch(change('record-form', "streetAddress", this.state.address));
                                        rest.dispatch(change('record-form', "city", this.state.city));
                                        rest.dispatch(change('record-form', "state", this.state.state));
                                        rest.dispatch(change('record-form', "zipCode", this.state.zipCode));
                                    }
                                    return (<TextInput source="city" className={classes.addressComponent}/>)
                                }

                                }
                            </FormDataConsumer>
                            <TextInput source="state" className={classes.addressComponent}/>
                            <TextInput source="zipCode" className={classes.addressComponent}/>
                        </div>
                    </div>

                    <span/>


                    <TextInput label="Donation" source="donation" formClassName={classes.inlineBlock}/>
                    <TextInput label="Amount Paid" source="order.amountPaid" formClassName={classes.inlineBlock}/>
                    <BooleanInput label="Delivered?" source="order.delivered" formClassName={classes.inlineBlock}/>
                    <span/>
                    <ReferenceInput label="Year to add to" source="year" reference="Years"
                                    formClassName={classes.inlineBlock}>
                        <SelectInput optionText="year"/>
                    </ReferenceInput>

                    <ReferenceInput label="User to add to" source="user" reference="User"
                                    formClassName={classes.inlineBlock}>
                        <SelectInput optionText="fullName" optionValue="id"/>
                    </ReferenceInput>
                    <FormDataConsumer>
                        {({formData, ...rest}) => formData.year &&
                            <ProductsGrid source="order"  {...props} year={formData.year} {...rest}/>
                        }
                    </FormDataConsumer>
                </SimpleForm>
            </Create>
        )
        /*<Edit {...props} filters={<CustomerFilter/>}>
        <ProductsGrid>
            <TextField label="Customer Name" source="customerName"/>
            <TextField source="streetAddress"/>
            <TextField source="city"/>
            <TextField source="state"/>
            <NumberField label="Order Cost" source="order.cost" options={{style: 'currency', currency: 'USD'}}/>
            <NumberField label="Amount Paid" source="order.paid" options={{style: 'currency', currency: 'USD'}}/>
            <BooleanField label="Delivered?" source="order.delivered"/>
            <EditButton basePath="/customers"/>
        </ProductsGrid>
    </Edit>*/
    }
}

export default withStyles(styles)(CustomerCreate);