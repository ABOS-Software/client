import React from 'react';
import {withStyles} from '@material-ui/core';
import {ReferenceInput, required} from 'react-admin';
import PropTypes from 'prop-types';
import SearchSuggest from './SearchSuggest';

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
        filterToQuery={searchText => ({customer_name: searchText})} validate={required()}
      >
        <SearchSuggest handleSelection={this.handleSuggestionSelected}/>
        {/*<AdaptedAutoComplete handleSelection={this.handleSuggestionSelected}
          translateChoice={false}
          shouldRenderSuggestions={(val) => { return val.trim().length > 2; }}
          optionText={'customerName'}
          optionValue={'customerName'}/>*/}
      </ReferenceInput>
    );
  }
}

CustomerNameAutocomplete.propTypes = {
  updateCustInfo: PropTypes.func.isRequired
};

export default (withStyles(styles, {withTheme: true})(CustomerNameAutocomplete));
