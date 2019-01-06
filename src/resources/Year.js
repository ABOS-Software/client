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
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';
import {Dashboard} from "../dashboard";
//import ErrorBoundary from '../ErrorBoundary';


export const YearList = ({permissions, ...props}) => (
    <List {...props}>
        <Datagrid>
            <TextField source="year"/>
            <ShowButton basePath="/Years"/>
            {/*{permissions === "ROLE_ADMIN" ? <EditButton basePath="/Years"/> : null }*/}
        </Datagrid>
    </List>
);

const YearTitle = ({record}) => {
    return <span>Year {record ? `"${record.year}"` : ''}</span>;
};

export const YearEdit = props => (
    <Edit title={<YearTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="year"/>

        </SimpleForm>
    </Edit>
);

export const YearCreate = props => (
    <Create title="Create a Year" {...props}>
        <SimpleForm>
            <TextInput source="year"/>
        </SimpleForm>
    </Create>
);

export const YearShow = props => {
    return (<Show title={<YearTitle/>} {...props}>
        <SimpleShowLayout>
            <Dashboard year={props.id}/>
        </SimpleShowLayout>
    </Show>)

};
