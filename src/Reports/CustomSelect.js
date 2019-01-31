import React from 'react';
import {SelectInput} from 'react-admin';

export const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
  <SelectInput onChange={(event, key, payload) => {
    onChangeCustomHandler(key);
  }}
    {...rest}
  />
);
