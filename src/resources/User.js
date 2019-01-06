import React from 'react';
import {Datagrid, List, Show, ShowButton, SimpleShowLayout, TextField} from 'react-admin';
import {UserDashboard} from "../userDashboard";
//import ErrorBoundary from '../ErrorBoundary';


export const UserList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="username"/>
            <TextField source="fullName"/>
            <ShowButton basePath="/User"/>
        </Datagrid>
    </List>
);

const UserTitle = ({record}) => {
    return <span>{record ? `${record.fullName}` : ''}</span>;
};

/*export const UserEdit = props => (
    <Edit title={<UserTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="UserName"/>
            <DateInput source="deliveryDate"/>
        </SimpleForm>
    </Edit>
);*/

/*export const UserCreate = props => (
    <Create title="Create a User" {...props}>
        <SimpleForm>
            <TextInput source="name"/>
            <DateInput source="deliveryDate"/>
        </SimpleForm>
    </Create>
);*/

export const UserShow = (props, {record}) => {
    return (<Show title={<UserTitle/>} {...props}>
        <SimpleShowLayout>

            <UserDashboard userId={props.id}/>
        </SimpleShowLayout>
    </Show>)

};