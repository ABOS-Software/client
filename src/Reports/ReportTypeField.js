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
import React from "react";
import {CustomSelectInput} from "./CustomSelect";

const requiredValidate = required();

export class ReportType extends React.PureComponent {
    render() {
        return <CustomSelectInput
            source="template" choices={[{id: "customers_split", name: "Year; Split by Customer"}, {
            id: "Year Totals",
            name: "Year Totals"
        }, {id: "Customer Year Totals", name: "Customer Year Totals"}, {
            id: "Customer All-Time Totals",
            name: "Customer All-Time Totals"
        }]} validate={requiredValidate} onChangeCustomHandler={this.props.onChangeCustomHandler}/>;
    }
}