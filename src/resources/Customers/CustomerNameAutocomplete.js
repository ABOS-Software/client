import React from 'react';
import {withStyles} from '@material-ui/core';
import AdaptedAutoComplete from './AdaptedAutoComplete';
import {ReferenceInput} from 'react-admin';
import PropTypes from 'prop-types';

const styles = () => ({});

class CustomerNameAutocomplete extends React.Component {
  handleSuggestionSelected = (event, {suggestion, method}) => {
    this.props.updateCustInfo({
      address: suggestion.streetAddress, city: suggestion.city, state: suggestion.state, zipCode: suggestion.zipCode,
      phone: suggestion.phone, custEmail: suggestion.custEmail});
  };
  render () {
    const {updateCustInfo, ...rest} = this.props;
    return (
      <ReferenceInput label='Customer Name' source='customerName' reference='customers'
        filterToQuery={searchText => ({customer_name: searchText})}
      >

        <AdaptedAutoComplete handleSelection={this.handleSuggestionSelected}
          translateChoice={false}
          shouldRenderSuggestions={(val) => { return val.trim().length > 2; }}
          optionText={'customerName'}
          optionValue={'customerName'}/>
      </ReferenceInput>
    );
  }
}

CustomerNameAutocomplete.propTypes = {
  updateCustInfo: PropTypes.func.isRequired
};

export default (withStyles(styles, {withTheme: true})(CustomerNameAutocomplete));
