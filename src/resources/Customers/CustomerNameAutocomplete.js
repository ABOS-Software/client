import React from 'react';
import {withStyles} from '@material-ui/core';
import AdaptedAutoComplete from './AdaptedAutoComplete';
import {ReferenceInput} from 'react-admin';

const styles = () => ({});

class CustomerNameAutocomplete extends React.Component {
  handleSuggestionSelected = (event, {suggestion, method}) => {
    console.log('test');
  };
  render () {
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

};

export default (withStyles(styles, {withTheme: true})(CustomerNameAutocomplete));
