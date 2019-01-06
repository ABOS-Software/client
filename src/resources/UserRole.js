import React from 'react';
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    EditButton,
    List,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
//import ErrorBoundary from '../ErrorBoundary';
import CategoryIcon from 'material-ui/svg-icons/social/person';

export {CategoryIcon};

export const CategoryList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="categoryName"/>
            <DateField source="deliveryDate"/>
            <EditButton basePath="/categories"/>
        </Datagrid>
    </List>
);

const CategoryTitle = ({record}) => {
    return <span>Category {record ? `"${record.name}"` : ''}</span>;
};

export const CategoryEdit = props => (
    <Edit title={<CategoryTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="categoryName"/>
            <DateInput source="deliveryDate"/>
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = props => (
    <Create title="Create a Category" {...props}>
        <SimpleForm>
            <TextInput source="name"/>
            <DateInput source="deliveryDate"/>
        </SimpleForm>
    </Create>
);