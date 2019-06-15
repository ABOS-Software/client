import React from 'react';
import {addField, required, TextInput} from 'react-admin';

import AddressInput from '../resources/Customers/addressInput';
import PropTypes from 'prop-types';

import FormLabel from '@material-ui/core/FormLabel/FormLabel';
import Divider from '@material-ui/core/Divider/Divider';
import Typography from '@material-ui/core/Typography/Typography';
import {withStyles} from '@material-ui/core';
import {styles} from './Style';

const AddrInput = addField(({input, meta: {touched, error}, updateAddress, ...props}) => (
  <AddressInput updateAddress={address => {
    console.log(address);
    updateAddress(address);
  }}/>
));
const requiredValidate = required();

class AddressFields extends React.PureComponent {
  render () {
    const {classes, updateAddress, value, fieldRequired} = this.props;
    const requiredValidate = fieldRequired ? required() : undefined;
    return <div>
      <div className={classes.addressContainerLabeled}>
        <FormLabel variant={'headline'}>Search For Address</FormLabel>
        <AddrInput updateAddress={updateAddress}/>
      </div>
      <div className={classes.dividerContainer}>
        <Divider className={classes.halfDivider}/>
        <Typography className={classes.orText}>OR</Typography>
        <Divider className={classes.halfDivider}/>

      </div>
      <div className={classes.addressContainerLabeled}>
        <FormLabel variant={'headline'}>Enter an Address manually</FormLabel>
        <div className={classes.addressContainer}>

          <TextInput source='streetAddress' className={classes.addressComponent}
            value={value} validate={requiredValidate}/>

          <TextInput source='city' className={classes.addressComponent}
            validate={requiredValidate}/>
          <TextInput source='state' className={classes.addressComponent}
            validate={requiredValidate}/>
          <TextInput source='zipCode' className={classes.addressComponent}
            validate={requiredValidate}/>
        </div>
      </div>
    </div>;
  }
}

AddressFields.propTypes = {
  classes: PropTypes.any,
  updateAddress: PropTypes.func,
  value: PropTypes.string,
  fieldRequired: PropTypes.bool
};
AddressFields.defaultProps = {
  fieldRequired: true
};
export default withStyles(styles)(AddressFields);
