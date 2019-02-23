import React from 'react';
import {SelectInput} from 'react-admin';

export const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
  <SelectInput {...rest}
    onChange={(event, key, payload) => {
      onChangeCustomHandler(key);
    }}
  />
);
