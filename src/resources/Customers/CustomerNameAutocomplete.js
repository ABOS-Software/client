import React from 'react';
import {withStyles} from '@material-ui/core';
import AdaptedAutoComplete from './AdaptedAutoComplete';

const styles = () => ({});

class CustomerNameAutocomplete extends React.Component {
  handleSuggestionSelected = (event, {suggestion, method}) => {
    console.log('test');
  };
  render () {
    return (<AdaptedAutoComplete handleSelection={this.handleSuggestionSelected} source='category' choices={[
      {id: 'programming', name: 'Programming'},
      {id: 'lifestyle', name: 'Lifestyle'},
      {id: 'photography', name: 'Photography'}
    ]}/>);
  }
}

CustomerNameAutocomplete.propTypes = {

};

export default (withStyles(styles, {withTheme: true})(CustomerNameAutocomplete));
