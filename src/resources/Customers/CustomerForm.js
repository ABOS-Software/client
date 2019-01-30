import React, {Component} from 'react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {change} from 'redux-form';

import {addField, BooleanInput, FormDataConsumer, ReferenceInput, SelectInput, TextInput} from 'react-admin';
import AddressInput from './addressInput';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import ProductsGrid from '../ProductsGrid';
import {withStyles} from '@material-ui/core';

const AddrInput = addField(({input, meta: {touched, error}, updateAddress, ...props}) => (
  <AddressInput updateAddress={address => {
    console.log(address);
    updateAddress(address);
  }}/>
));
const styles = {

  inlineBlock: {display: 'inline-flex', marginRight: '1rem'},
  halfDivider: {
    flexGrow: 1,
    height: '2px',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  dividerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'middle',
    alignItems: 'center'
  },
  orText: {
    margin: '10px'
  },
  addressContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  },
  addressContainerLabeled: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column'
  },
  addressComponent: {
    flexGrow: '1',
    marginRight: '1rem'
  }

};

class CustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {address: '', zipCode: '', city: '', state: '', update: 0};
  }

  updateAddress = (address) => {
    let addressObj = {address: '', zipCode: '', city: '', state: '', bldgNum: '', street: ''};
    for (let i = 0; i < address.address_components.length; i++) {
      let addressType = address.address_components[i].types[0];
      let val = address.address_components[i]['short_name'];

      switch (addressType) {
        case 'street_address':
          addressObj.address = val;
          break;
        case 'street_number':
          addressObj.bldgNum = val;

          break;
        case 'route':
          addressObj.street = val;

          break;
        case 'locality':
          addressObj.city = val;

          break;
        case 'administrative_area_level_1':
          addressObj.state = val;

          break;
        case 'country':

          break;
        case 'postal_code':
          addressObj.zipCode = val;

          break;
        case 'postal_town':
          addressObj.city = val;

          break;
        case 'sublocality_level_1':
          addressObj.city = val;

          break;
      }
    }
    if (!addressObj.address) {
      addressObj.address = addressObj.bldgNum + ' ' + addressObj.street;
    }
    this.setState({...addressObj, update: 1});
  };

  renderCreateOrEditFields() {
    const {classes, ...props} = this.props;

    if (!this.props.edit) {
      return (
        <div>
          <ReferenceInput label='Year to add to' source='year' reference='Years'
                          formClassName={classes.inlineBlock} {...props}>
            <SelectInput optionText='year'/>
          </ReferenceInput>

          <ReferenceInput label='User to add to' source='user' reference='User'
                          formClassName={classes.inlineBlock} {...props}>
            <SelectInput optionText='fullName' optionValue='id'/>
          </ReferenceInput>

        </div>
      );
    }
  }

  render() {
    const {classes, ...props} = this.props;

    return (<span>
      <TextInput label='Customer Name' source='customerName' formClassName={classes.inlineBlock}/>
      <TextInput source='phone' formClassName={classes.inlineBlock}/>
      <TextInput source='custEmail' formClassName={classes.inlineBlock}/>
      <span/>
      <div className={classes.addressContainerLabeled}>
        <FormLabel variant={'headline'}>Search For Address</FormLabel>
        <AddrInput updateAddress={this.updateAddress}/>
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
                     value={this.state.address}/>
          <FormDataConsumer className={classes.addressComponent} {...props}>
            {({formData, ...rest}) => {
              if (this.state.update === 1) {
                this.setState({update: 0});
                rest.dispatch(change('record-form', 'streetAddress', this.state.address));
                rest.dispatch(change('record-form', 'city', this.state.city));
                rest.dispatch(change('record-form', 'state', this.state.state));
                rest.dispatch(change('record-form', 'zipCode', this.state.zipCode));
              }
              return (<TextInput source='city' className={classes.addressComponent}/>);
            }}
          </FormDataConsumer>
          <TextInput source='state' className={classes.addressComponent}/>
          <TextInput source='zipCode' className={classes.addressComponent}/>
        </div>
      </div>

      <span/>

      <TextInput label='Donation' source='donation' formClassName={classes.inlineBlock}/>
      <TextInput label='Amount Paid' source='order.amountPaid' formClassName={classes.inlineBlock}
                 defaultValue={'0.00'}/>
      <BooleanInput label='Delivered?' source='order.delivered' formClassName={classes.inlineBlock}
                    defaultValue={false}/>
      <span/>
      {this.renderCreateOrEditFields()}
      <FormDataConsumer {...props}>
        {({formData, ...rest}) => {
          console.log(formData);
          if (this.props.edit) {
            return (<ProductsGrid source='order' {...props} {...rest} amountPaid={formData.order.amountPaid}
                                  delivered={formData.order.delivered}/>);
          } else if (formData.year) {
            return (<ProductsGrid source='order' {...props} year={formData.year} {...rest}
                                  amountPaid={formData.order.amountPaid} delivered={formData.order.delivered}/>);
          }
        }
        }
      </FormDataConsumer>
    </span>);
  }
}

CustomerForm.propTypes = {
  classes: PropTypes.any,
  save: PropTypes.func,
  edit: PropTypes.bool
};
CustomerForm.defaultProps = {
  edit: false
};
export default withStyles(styles)(addField(({input, meta: {touched, error}, ...props}) => (
  <CustomerForm {...props} />
)));
