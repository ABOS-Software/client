import React, {Component} from 'react';
import * as PropTypes from 'prop-types';
import {change} from 'redux-form';
import Typography from '@material-ui/core/Typography';

import {
  addField,
  BooleanInput,
  FormDataConsumer,
  GET_LIST,
  Labeled,
  LinearProgress,
  ReferenceInput,
  SelectInput,
  TextInput
} from 'react-admin';
import ProductsGrid from '../Products/ProductsGrid';
import {withStyles} from '@material-ui/core';
import {updateAddress} from '../../utils';
import AddressFields from '../../Reports/AddressFields';
import restClient from '../../grailsRestClient';

const dataProvider = restClient;
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

class YearSelect extends Component {
  render () {
    if (this.props.loading) {
      return (
        <Labeled
          label={'Year to add to'}
          source={'year'}
        >
          <LinearProgress/>
        </Labeled>
      );
    }
    return <SelectInput label='Year to add to' optionText='year' source='year' choices={this.props.choices}
      isLoading={this.props.loading} defaultValue={(this.props.choices[0] || {id: null}).id}/>;
  }
}

YearSelect.propTypes = {
  choices: PropTypes.any,
  loading: PropTypes.bool
};

class CustomerForm extends Component {
  constructor (props) {
    super(props);
    this.state = {address: '', zipCode: '', city: '', state: '', update: 0, years: [], loadingYear: true, runningTotal: 0.0};
  }

  updateAddress = (address) => {
    let addressObj = updateAddress(address);
    this.setState({...addressObj, update: 1});
  };
  getYears () {
    dataProvider(GET_LIST, 'Years', {
      filter: {},
      sort: {field: 'year', order: 'DESC'},
      pagination: {page: 1, perPage: 1000}
    }).then(response => {
      this.setState({years: response.data, loadingYear: false});
    });
  }
  renderCreateOrEditFields () {
    const {classes, ...props} = this.props;

    if (!this.props.edit) {
      return (
        <div>
          {/*          <ReferenceInput label='Year to add to' source='year' reference='Years'
            formClassName={classes.inlineBlock} {...props} defaultValue={6}> */}
          <YearSelect choices={this.state.years} loading={this.state.loadingYear}/>
          {/*          </ReferenceInput> */}

          <ReferenceInput label='User to add to' source='user' reference='User'
            formClassName={classes.inlineBlock} {...props}>
            <SelectInput optionText='fullName' optionValue='id'/>
          </ReferenceInput>

        </div>
      );
    }
  }

  render () {
    const {classes, ...props} = this.props;

    return (<span>
      <TextInput label='Customer Name' source='customerName' formClassName={classes.inlineBlock}/>
      <TextInput source='phone' formClassName={classes.inlineBlock}/>
      <TextInput source='custEmail' formClassName={classes.inlineBlock}/>
      <span/>
      {this.renderAddressFields()}

      <span/>

      <TextInput label='Donation' source='donation' formClassName={classes.inlineBlock}/>
      <TextInput label='Amount Paid' source='order.amountPaid' formClassName={classes.inlineBlock}
        defaultValue={'0.00'}/>
      <span>
        <BooleanInput label='Delivered?' source='order.delivered' formClassName={classes.inlineBlock}
          defaultValue={false} row/>
        {this.renderRunningTotal()}
      </span>
      <span/>
      {this.renderCreateOrEditFields()}
      {this.renderPropsGrid(props)}
    </span>);
  }

  renderAddressFields () {
    const {classes, ...props} = this.props;

    return (<FormDataConsumer className={classes.addressComponent} {...props}>
      {({formData, ...rest}) => {
        if (this.state.update === 1) {
          this.setState({update: 0});
          rest.dispatch(change('record-form', 'streetAddress', this.state.address));
          rest.dispatch(change('record-form', 'city', this.state.city));
          rest.dispatch(change('record-form', 'state', this.state.state));
          rest.dispatch(change('record-form', 'zipCode', this.state.zipCode));
        }
        return (<AddressFields updateAddress={this.updateAddress} value={this.state.address}/>);
      }}
    </FormDataConsumer>);
  }

  renderRunningTotal () {
    const {classes, ...props} = this.props;

    return <FormDataConsumer {...props}>
      {({formData, ...rest}) => {
        if (!formData.order) {
          formData.order = {
            cost: '0',
            delivered: false
          };
        }
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
          // the default value for minimumFractionDigits depends on the currency
          // and is usually already 2
        });

        return (<Typography
          variant={'h6'}
        >
          Running Total: {formatter.format(formData.order.cost)}
        </Typography>
        );
      }
      }
    </FormDataConsumer>;
  }

  renderPropsGrid (props) {
    return <FormDataConsumer {...props}>
      {({formData, ...rest}) => {
        if (!formData.order) {
          formData.order = {
            amountPaid: '0',
            delivered: false
          };
        }
        if (this.props.edit) {
          return (<ProductsGrid source='order' {...props} {...rest} amountPaid={formData.order.amountPaid}
            delivered={formData.order.delivered}/>);
        } else if (formData.year) {
          return (<ProductsGrid source='order' {...props} year={formData.year} {...rest}
            amountPaid={formData.order.amountPaid} delivered={formData.order.delivered}/>);
        }
      }
      }
    </FormDataConsumer>;
  }

  componentDidMount () {
    this.getYears();
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
  <CustomerForm {...props}/>
)));
