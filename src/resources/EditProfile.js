import React, {Component} from 'react';
import {Edit, FormDataConsumer, FormTab, ImageField, ImageInput, TabbedForm, TextInput} from 'react-admin';
import AddressFields from '../Reports/AddressFields';
import {updateAddress} from '../Reports/Utils';
import {change} from 'redux-form';
import {withStyles} from '@material-ui/core';
import {styles} from '../Reports/Style';

class ProfileEdit extends Component {
  state = {update: false, address: '', zipCode: '', city: '', state: '', updateAddress: 0};

  updateAddress = (address) => {
    let addressObj = updateAddress(address);
    this.setState({...addressObj, updateAddress: 1});
  };
  renderAddressFields () {
    const {classes} = this.props;

    return <FormDataConsumer className={classes.addressComponent}>
      {({formData, ...rest}) => {
        if (this.state.updateAddress === 1) {
          this.setState({updateAddress: 0});
          rest.dispatch(change('record-form', 'streetAddress', this.state.address));
          rest.dispatch(change('record-form', 'city', this.state.city));
          rest.dispatch(change('record-form', 'state', this.state.state));
          rest.dispatch(change('record-form', 'zipCode', this.state.zipCode));
        }
        return (
          <AddressFields updateAddress={this.updateAddress} value={this.state.address} fieldRequired={false}/>
        );
      }}
    </FormDataConsumer>;
  }

  render () {
    const {
      classes,
      ...props
    } = this.props;
    return (
      <Edit
        redirect={false} // I don't need any redirection here, there's no list page
        id={'my-profile'}
        resource={'profile'}
        basePath={'/my-profile'}
        title={'My Profile'}
        {...props}
      >
        <TabbedForm>
          <FormTab label='Report Defaults'>

            <TextInput
              source='Scout_name'/>
            {this.renderAddressFields()}

            <TextInput
              source='Scout_Phone'/>
            <TextInput
              source='Scout_Rank'/>
            <ImageInput
              source='LogoLocation' accept='image/*'>
              <ImageField source='base64' title='title'/>
            </ImageInput>
          </FormTab>
        </TabbedForm>
      </Edit>
    );
  }
}

export default withStyles(styles)(ProfileEdit);
