import React from 'react';
import {
  BooleanField,
  Datagrid,
  EditButton,
  Filter,
  List,
  NumberField,
  ReferenceArrayInput,
  SelectArrayInput,
  TextField,
  TextInput
} from 'react-admin';
import CustomerLinkField from './CustomerRecordLink';
import CustomerEditClass from './Customers/CustomerEdit';
import CustomerCreateClass from './Customers/CustomerCreate';

const CustomerFilter = (props) => (
  <Filter {...props}>
    <TextInput label='Search' source='customer_name' alwaysOn/>
    <ReferenceArrayInput
      source='year'
      reference='Years'
      sort={{field: 'id', order: 'ASC'}}
      label='Year'
    >
      <SelectArrayInput optionText='year' source='year' label='Year'/>
    </ReferenceArrayInput>
    <ReferenceArrayInput
      source='user_id'
      reference='user'
      sort={{field: 'id', order: 'ASC'}}
      label='User'
    >
      <SelectArrayInput optionText='fullName' source='id' label='User'/>
    </ReferenceArrayInput>
  </Filter>
);

export const CustomerList = (props) => (
  <List {...props} filters={<CustomerFilter context='form'/>}>
    <Datagrid>
      <CustomerLinkField/>
      <TextField source='streetAddress'/>
      <TextField source='city'/>
      <TextField source='state'/>
      <NumberField label='Order Cost' source='order.cost' options={{style: 'currency', currency: 'USD'}}/>
      <NumberField label='Amount Paid' source='order.amountPaid' options={{style: 'currency', currency: 'USD'}}/>
      <BooleanField label='Delivered?' source='order.delivered'/>
      <EditButton basePath='/customers'/>
    </Datagrid>

  </List>

);

const CustomerTitle = ({record}) => {
  return <span>{record ? (record.customerName ? `${record.customerName + ' ' + record.year.year + ' Order'}` : `${record.json.customerName + ' ' + record.json.year.year + ' Order'}`) : ''}</span>;
};

export const CustomerEdit = ({...props}) => (
  <CustomerEditClass {...props} title={<CustomerTitle/>}/>
);

export const CustomerCreate = (props) => (
  <CustomerCreateClass {...props}/>

);
