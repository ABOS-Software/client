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
  required,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput
} from 'react-admin';

// import ErrorBoundary from '../ErrorBoundary';
/* import CategoryIcon from '';
export { CategoryIcon }; */

export const CategoryList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='categoryName'/>
      <DateField source='deliveryDate'/>
      <EditButton basePath='/categories'/>
      <ReferenceField label='Year' source='year.id' reference='Years'>
        <TextField source='year'/>
      </ReferenceField>
    </Datagrid>
  </List>
);

export const CategoryEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source='categoryName'/>
      <DateInput source='deliveryDate' validate={required()}/>

    </SimpleForm>
  </Edit>
);

export const CategoryCreate = props => (
  <Create title='Create a Category' {...props}>
    <SimpleForm>
      <TextInput source='categoryName' validate={required()}/>
      <ReferenceInput label='Year' source='year' reference='Years' validate={required()}>
        <SelectInput optionText='year'/>
      </ReferenceInput>
      <DateInput source='deliveryDate' validate={required()}/>
    </SimpleForm>
  </Create>
);
