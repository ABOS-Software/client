import React from "react";
import {
    addField,
    BooleanInput,
    fetchUtils,
    FormDataConsumer,
    GET_LIST,
    ImageField,
    ImageInput,
    required,
    SelectArrayInput,
    SelectInput,
    TextInput
} from 'react-admin';

export const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
    <SelectInput onChange={(event, key, payload) => {
        onChangeCustomHandler(key)
    }}
                 {...rest}
    />
);