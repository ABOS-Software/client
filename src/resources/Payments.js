import React from 'react';
import {DateInput, Edit, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput} from 'react-admin';

export const PaymentEdit = props => (
  <Edit {...props}>
    <SimpleForm

    >
      <TextInput source='amount'/>
      <ReferenceInput label='Method' source='payment_method.id' reference='payment_methods'>
        <SelectInput optionText='name'/>
      </ReferenceInput>
      <DateInput source='payment_date'/>
      <LongTextInput source={'note'}/>
    </SimpleForm>
  </Edit>
);
