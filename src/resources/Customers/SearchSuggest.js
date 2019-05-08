import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import {addField, FieldTitle} from 'ra-core';

function renderInputComponent (inputProps) {
  const {classes, inputRef = () => {}, ref,

    isRequired,
    label,

    resource,
    source,
    ...other
  } = inputProps;

  return (
    <TextField
      fullWidth
      label={
        <FieldTitle
          label={label}
          source={source}
          resource={resource}
          isRequired={isRequired}
        />
      }
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        },


      }}
      {...other}
    />
  );
}

function renderSuggestion (suggestion, {query, isHighlighted}) {
  const matches = match(suggestion.customerName, query);
  let extraInfo = '';
  if (suggestion.year.year && suggestion.streetAddress) {
    extraInfo = ' (' + suggestion.year.year + ', ' + suggestion.streetAddress + ')';
  } else if (suggestion.year.year) {
    extraInfo = ' (' + suggestion.year.year + ')';

  } else if (suggestion.streetAddress) {
    extraInfo = ' (' + suggestion.streetAddress + ')';

  }
  const parts = parse(suggestion.customerName + extraInfo, matches);

  return (
    <MenuItem selected={isHighlighted} component='div'>
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </strong>
          )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue (suggestion) {
  return suggestion.customerName;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  root: {},
  suggestionsContainerOpen: {
    position: 'absolute',
    marginBottom: theme.spacing.unit * 3,
    zIndex: 2
  },
  suggestionsPaper: {
    maxHeight: '50vh',
    overflowY: 'auto'
  },
  suggestion: {
    display: 'block',
    fontFamily: theme.typography.fontFamily
  },
  suggestionText: {fontWeight: 300},
  highlightedSuggestionText: {fontWeight: 500},
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
});

class SearchSuggest extends React.Component {
  state = {
    single: '',
    popper: '',
    suggestions: []
  };

  componentWillMount () {
    this.setState({single: this.props.input.value});
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (this.state.single !== nextProps.input.value) {
      this.setState({single: nextProps.input.value});
    }
  }

  getSuggestions (value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.props.choices.filter(suggestion => {
        const keep =
          count < 5 && suggestion.customerName.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
  }

  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, {newValue}) => {
    this.setState({
      [name]: newValue
    });

    const {input} = this.props;

    if (input && input.onChange) {
      input.onChange(newValue);
    }
  };
  handleSuggestionSelected = (event, {suggestion, method}) => {
    const {input} = this.props;

    const inputValue = getSuggestionValue(suggestion);
    if (input && input.onChange) {
      input.onChange(inputValue);
    }

    if (method === 'enter') {
      event.preventDefault();
    }
    if (this.props.handleSelection) {
      this.props.handleSelection(event, {suggestion, method});
    }
  };
  render () {
    const {
      alwaysRenderSuggestions,
      classes = {},
      isRequired,
      label,
      meta,
      resource,
      source,
      className,
      options,
      ...rest
    } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
      onSuggestionSelected: this.handleSuggestionSelected
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            isRequired,
            label,
            onChange: this.handleChange('single'),
            placeholder: 'Customer Name',
            resource,
            source,
            value: this.state.single,

          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />

      </div>
    );
  }
}

SearchSuggest.propTypes = {
  allowEmpty: PropTypes.bool,
  alwaysRenderSuggestions: PropTypes.bool, // used only for unit tests
  choices: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
  className: PropTypes.string,
  handleSelection: PropTypes.func,
  InputProps: PropTypes.object,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  limitChoicesToValue: PropTypes.bool,
  meta: PropTypes.object,
  options: PropTypes.object,

  resource: PropTypes.string,
  setFilter: PropTypes.func,
  shouldRenderSuggestions: PropTypes.func,
  source: PropTypes.string,
  suggestionComponent: PropTypes.func,


};

export default compose(
  addField,
  withStyles(styles))(SearchSuggest);
