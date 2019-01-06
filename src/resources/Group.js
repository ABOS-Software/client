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
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput
} from 'react-admin';
//import ErrorBoundary from '../ErrorBoundary';


export const GroupList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="groupName"/>
            <ReferenceField label="Year" source="year.id" reference="Years">
                <TextField source="year"/>
            </ReferenceField>
            <EditButton basePath="/group"/>
        </Datagrid>
    </List>
);

const GroupTitle = ({record}) => {
    return <span>Group {record ? `"${record.groupName}"` : ''}</span>;
};

export const GroupEdit = props => (
    <Edit title={<GroupTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="groupName"/>
        </SimpleForm>
    </Edit>
);

export const GroupCreate = props => (
    <Create title="Create a Group" {...props}>
        <SimpleForm>
            <TextInput source="GroupName"/>
            <ReferenceInput label="Year" source="year" reference="Years">
                <SelectInput optionText="year"/>
            </ReferenceInput>
        </SimpleForm>
    </Create>
);