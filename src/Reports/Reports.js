import React from 'react';
import {
  BooleanInput,
  FormDataConsumer,
  ImageField,
  ImageInput,
  required,
  SelectArrayInput,
  SelectInput,
  TextInput
} from 'react-admin';
import {withStyles} from '@material-ui/core';
import {change} from 'redux-form';
import Wizard from './Wizard';
import {CustomSelectInput} from './CustomSelect';
import {ReportType} from './ReportTypeField';
import {
  getCategoriesForYear,
  getCustomersWithUser,
  getCustomersWithYearAndUser,
  getUsers,
  getYears,
  save,
  updateAddress,
  updateReportType
} from './Utils';
import {styles} from './Style';
import AddressFields from './AddressFields';

export const requiredValidate = required();

const steps = () => [
  'Pick Report Template', 'Fill In Details'
];

class reportsWizard extends React.Component {
  // users: {}, years: {}, customers: {}
    state = {update: false, address: '', zipCode: '', city: '', state: '', updateAddress: 0};

    updateIncludeSub = (event, key, payload) => {
      this.setState({includeSubUser: key, update: true});
    };

    updateYear (year) {
      this.setState({year: year, update: true});
    // this.updateChoices();
    }

    updateUser (user) {
      this.setState({user: user, update: true});
    // this.updateChoices();
    }

    updateAddress = (address) => {
      let addressObj = updateAddress(address);
      this.setState({...addressObj, updateAddress: 1});
    };

    updateChoices () {
      if (this.state.update) {
        const year = this.state.year;
        const user = this.state.user;
        const includeSub = this.state.includeSubUser;
        this.updateCustomers(year, user, includeSub);
        this.updateCategories(year);
        this.updateAllTimeCustomers(user, includeSub);
        this.setState({update: false});
      }
    }

    updateAllTimeCustomers (user, includeSub) {
      if (user && this.state.reportType === 'Customer All-Time Totals') {
        getCustomersWithUser(user, includeSub).then(customers => this.setState({customers: customers}));
      }
    }

    updateCategories (year) {
      if (year) {
        getCategoriesForYear(year).then(categories => this.setState({categories: categories}));
      }
    }

    updateCustomers (year, user, includeSub) {
      if ((year && user) > -1) {
        getCustomersWithYearAndUser(year, user, includeSub).then(customers => this.setState({customers: customers}));
      }
    }

    stepsContent () {
      this.setState({
        stepsContent: [<ReportType onChangeCustomHandler={(key) => this.setState(updateReportType(key))}/>,
          [
            <TextInput
              source='Scout_name' validate={requiredValidate}/>,
            this.renderAddressFields(),

            <TextInput
              source='Scout_Phone' validate={requiredValidate}/>,
            <TextInput
              source='Scout_Rank' validate={requiredValidate}/>,
            <ImageInput
              source='LogoLocation' accept='image/*'>
              <ImageField source='src' title='title'/>
            </ImageInput>,

            this.renderYearFields(),
            this.renderUserFields(),
            this.renderCategoryFields(),
            this.renderCustomerNameFields(),
            this.renderPrintHeaderField()
          ]
        ]
      });
    }

    checkCustomerConditionsYear () {
      return (this.state.year && this.state.user && this.state.custReq);
    }

    checkCustomerConditionsHistorical () {
      return (this.state.reportType === 'Customer All-Time Totals' && this.state.user && this.state.custReq);
    }

    checkCustomerConditions () {
      return (this.checkCustomerConditionsYear() || this.checkCustomerConditionsHistorical());
    }

    renderCustomerNameFields () {
      return <FormDataConsumer>
        {({formData, ...rest}) => {
          if (this.checkCustomerConditions()) {
            return <SelectArrayInput source='Customer' optionText={'customerName'}
              optionValue={'id'} choices={
                this.state.customers} {...rest} validate={requiredValidate}/>;
          }
        }
        }
      </FormDataConsumer>;
    }

    renderCategoryFields () {
      return <FormDataConsumer>
        {({formData, ...rest}) => {
          if (this.state.year && this.state.catReq) {
          // console.log(this.state.year);

            return <SelectInput source='Category' optionText={'categoryName'}
              optionValue={'categoryName'}
              choices={this.state.categories} {...rest}
              validate={requiredValidate}/>;
          }
        }
        }
      </FormDataConsumer>;
    }

    renderUserFields () {
      return <FormDataConsumer>
        {({formData, ...rest}) => {
          if (this.state.userReq) {
            return [
              <CustomSelectInput label='User' source='User' key='UserComboBox'
                optionText={'fullName'}
                optionValue={'id'}
                choices={this.state.users} {...rest}
                onChangeCustomHandler={(key) => this.updateUser(key)}
                validate={requiredValidate}/>,
              <BooleanInput key='Include_Sub_Users'
                source='Include_Sub_Users' onChange={this.updateIncludeSub}/>
            ];
          }
        }
        }
      </FormDataConsumer>;
    }

    renderYearFields () {
      return <FormDataConsumer>
        {({formData, ...rest}) => {
          if (this.state.yearReq) {
            return (
              <CustomSelectInput source={'Year'} label='Year' optionText='year'
                optionValue='id' choices={this.state.years}
                onChangeCustomHandler={(key) => this.updateYear(key)}
                validate={requiredValidate} {...rest}/>
            );
          }
        }}
      </FormDataConsumer>;
    }

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
            <AddressFields updateAddress={this.updateAddress} value={this.state.address}/>
          );
        }}
      </FormDataConsumer>;
    }

    renderPrintHeaderField () {
      return <FormDataConsumer>
        {({formData, ...rest}) => {
          if (this.state.dueReq) {
            return <BooleanInput
              source='Print_Due_Header'/>;
          }
        }}
      </FormDataConsumer>;
    }

    componentWillReceiveProps () {
      getUsers().then(users => this.setState({users: users}));
      getYears().then(years => this.setState({years: years}));
    }

    componentWillMount () {
      this.stepsContent();
    }

    render () {
      this.updateChoices();
      return (
        <Wizard {...this.props} steps={steps()} stepContents={this.state.stepsContent} save={save}
          formName={'record-form'}/>
      );
    }
}

export default withStyles(styles)(reportsWizard);
