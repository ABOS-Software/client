import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, withStyles} from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import compose from 'recompose/compose';
import classnames from 'classnames';

import {addField, FieldTitle, translate} from 'ra-core';

const styles = theme => createStyles({
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

export class AdaptedAutoComplete extends React.Component {
  state = {
    dirty: false,
    inputValue: null,
    searchText: '',
    selectedItem: null,
    suggestions: []
  };

  ignoreNextChoicesUpdate = false;
  inputEl = null;
  anchorEl = null;

  componentWillMount () {
    const selectedItem = this.getSelectedItem(
      this.props,
      this.props.input.value
    );
    this.setState({
      selectedItem,
      inputValue: this.props.input.value,
      searchText: this.getSuggestionText(selectedItem),
      suggestions:
        this.props.limitChoicesToValue && selectedItem
          ? [selectedItem]
          : this.props.choices
    });
  }

  componentWillReceiveProps (nextProps) {
    const {choices, input, limitChoicesToValue} = nextProps;
    if (input.value !== this.state.inputValue) {
      const selectedItem = this.getSelectedItem(nextProps, input.value);
      let newChoices = this.props.choices;
      if (this.props.choices.length === 0) {
        newChoices = {isAddNew: true};
      }
      this.setState({
        selectedItem,
        inputValue: input.value,
        searchText: this.getSuggestionText(selectedItem),
        dirty: false,
        suggestions:
          limitChoicesToValue && selectedItem
            ? [selectedItem]
            : newChoices,
        prevSuggestions: false
      });
      // Avoid displaying the suggestions again when one just has been selected
      this.ignoreNextChoicesUpdate = true;
      // Ensure to reset the filter
      this.updateFilter('');
    } else if (!isEqual(choices, this.props.choices)) {
      if (this.ignoreNextChoicesUpdate) {
        this.ignoreNextChoicesUpdate = false;
        return;
      }
      const selectedItem = this.getSelectedItem(
        nextProps,
        this.state.inputValue
      );
      let newChoices = choices;
      if (choices.length === 0) {
        newChoices = {isAddNew: true};
      }
      this.setState(({dirty, searchText}) => ({
        selectedItem,
        searchText: dirty
          ? searchText
          : this.getSuggestionText(selectedItem),
        suggestions:
          limitChoicesToValue && !dirty && selectedItem
            ? [selectedItem]
            : newChoices,
        prevSuggestions: false
      }));
    }
  }

  getSelectedItem = ({choices}, inputValue) =>
    choices && inputValue
      ? choices.find(
        choice => this.getSuggestionValue(choice) === inputValue
      )
      : null;

  getSuggestionValue = suggestion => {
    if (suggestion.isAddNew) {
      return this.state.inputValue;
    }
    return get(suggestion, this.props.optionValue);
  };

  getSuggestionText = suggestion => {
    if (!suggestion) return '';
    if (suggestion.isAddNew) {
      return this.state.inputValue;
    }
    const {optionText, translate, translateChoice} = this.props;
    const suggestionLabel =
      typeof optionText === 'function'
        ? optionText(suggestion)
        : get(suggestion, optionText, '');

    // We explicitly call toString here because AutoSuggest expect a string
    return translateChoice
      ? translate(suggestionLabel, {_: suggestionLabel}).toString()
      : suggestionLabel.toString();
  };

  handleSuggestionSelected = (event, {suggestion, method}) => {
    const {input} = this.props;

    const inputValue = this.getSuggestionValue(suggestion);
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

  handleSuggestionsFetchRequested = () => {
    this.setState(({suggestions, prevSuggestions}) => ({
      suggestions: prevSuggestions || suggestions
    }));
  };

  handleSuggestionsClearRequested = () => {
    this.updateFilter('');
  };

  handleMatchSuggestionOrFilter = inputValue => {
    this.setState({
      dirty: true,
      searchText: inputValue
    });
    this.updateFilter(inputValue);
  };

  handleChange = (event, {newValue, method}) => {
    switch (method) {
      case 'type':
      case 'escape':
        {
          this.handleMatchSuggestionOrFilter(newValue);
        }
        break;
    }
  };

  renderInput = inputProps => {
    const {input} = this.props;
    const {
      autoFocus,
      className,
      classes = {},
      isRequired,
      label,
      meta,
      onChange,
      resource,
      source,
      value,
      ref,
      options: {InputProps, suggestionsContainerProps, ...options},
      ...other
    } = inputProps;
    if (typeof meta === 'undefined') {
      throw new Error(
        'The TextInput component wasn\'t called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details.'
      );
    }

    const {touched, error, helperText = false} = meta;

    // We need to store the input reference for our Popper element containg the suggestions
    // but Autosuggest also needs this reference (it provides the ref prop)
    const storeInputRef = input => {
      this.inputEl = input;
      this.updateAnchorEl();
      ref(input);
    };

    return (
      <TextField
        label={
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        }
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        margin='normal'
        className={classnames(classes.root, className)}
        inputRef={storeInputRef}
        error={!!(touched && error)}
        helperText={(touched && error) || helperText}
        name={input.name}
        {...options}
        InputProps={{
          classes: {
            input: classes.input
          },
          ...InputProps,
          ...other
        }}
      />
    );
  };

  updateAnchorEl () {
    if (!this.inputEl) {
      return;
    }

    const inputPosition = this.inputEl.getBoundingClientRect();

    if (!this.anchorEl) {
      this.anchorEl = {getBoundingClientRect: () => inputPosition};
    } else {
      const anchorPosition = this.anchorEl.getBoundingClientRect();

      if (
        anchorPosition.x !== inputPosition.x ||
        anchorPosition.y !== inputPosition.y
      ) {
        this.anchorEl = {getBoundingClientRect: () => inputPosition};
      }
    }
  }

  renderSuggestionsContainer = autosuggestOptions => {
    const {
      containerProps: {className, ...containerProps},
      children
    } = autosuggestOptions;
    const {classes = {}, options} = this.props;

    // Force the Popper component to reposition the popup only when this.inputEl is moved to another location
    this.updateAnchorEl();

    return (
      <Popper
        className={className}
        open={Boolean(children)}
        anchorEl={this.anchorEl}
        placement='bottom-start'
        {...options.suggestionsContainerProps}
      >
        <Paper
          square
          className={classes.suggestionsPaper}
          {...containerProps}
        >
          {children}
        </Paper>
      </Popper>
    );
  };

  renderSuggestionComponent = ({
    suggestion,
    query,
    isHighlighted,
    ...props
  }) => <div {...props}/>;

  renderSuggestion = (suggestion, {query, isHighlighted}) => {
    if (suggestion.isAddNew) {
      return null;
    }
    const label = this.getSuggestionText(suggestion);
    const matches = match(label, query);
    const parts = parse(label, matches);
    const {classes = {}, suggestionComponent} = this.props;

    return (
      <MenuItem
        selected={isHighlighted}
        component={
          suggestionComponent || this.renderSuggestionComponent
        }
        suggestion={suggestion}
        query={query}
        isHighlighted={isHighlighted}
      >
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span
                key={index}
                className={classes.highlightedSuggestionText}
              >
                {part.text}
              </span>
            ) : (
              <strong
                key={index}
                className={classes.suggestionText}
              >
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  };

  handleBlur = () => {
    /* const {dirty, searchText, selectedItem} = this.state;
    const {allowEmpty, input} = this.props;
    if (dirty) {
      if (searchText === '' && allowEmpty) {
        input && input.onBlur && input.onBlur(null);
      } else {
        input && input.onBlur && input.onBlur(this.state.inputValue);
        let newSelectedItem = selectedItem;
        if (selectedItem === null) {
          newSelectedItem = {isAddNew: true};
        }
        this.setState({
          dirty: false,
          searchText: this.getSuggestionText(newSelectedItem),
          suggestions:
            this.props.limitChoicesToValue && newSelectedItem
              ? [newSelectedItem]
              : this.props.choices
        });
      }
    } else {
      input && input.onBlur && input.onBlur(this.state.inputValue);
    } */
    const {allowEmpty, input} = this.props;
    const inputValue = this.state.searchText;
    this.setState({inputValue: inputValue});
    input.onBlur(inputValue);
    // input.onChange(inputValue);

    /*    if (input && input.onChange) {
      input.onChange(inputValue);
    } */

    /*    if (method === 'enter') {
      event.preventDefault();
    } */
  };

  handleFocus = () => {
    const {input} = this.props;
    input && input.onFocus && input.onFocus();
  };

  updateFilter = value => {
    const {setFilter, choices} = this.props;
    if (this.previousFilterValue !== value) {
      if (setFilter) {
        setFilter(value);
      } else {
        this.setState({
          suggestions: choices.filter(choice =>
            this.getSuggestionText(choice)
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        });
      }
    }
    this.previousFilterValue = value;
  };

  shouldRenderSuggestions = val => {
    const {shouldRenderSuggestions} = this.props;
    if (
      shouldRenderSuggestions !== undefined &&
      typeof shouldRenderSuggestions === 'function'
    ) {
      return shouldRenderSuggestions(val);
    }

    return true;
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
    const {suggestions, searchText} = this.state;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={this.renderInput}
        suggestions={suggestions}
        alwaysRenderSuggestions={alwaysRenderSuggestions}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsFetchRequested={
          this.handleSuggestionsFetchRequested
        }
        onSuggestionsClearRequested={
          this.handleSuggestionsClearRequested
        }
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionText}
        renderSuggestion={this.renderSuggestion}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        inputProps={{
          className,
          classes,
          isRequired,
          label,
          meta,
          onChange: this.handleChange,
          resource,
          source,
          value: searchText,
          onBlur: this.handleBlur,
          onFocus: this.handleFocus,
          options
        }}
        {...rest}
      />
    );
  }
}

AdaptedAutoComplete.propTypes = {
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
  optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    .isRequired,
  optionValue: PropTypes.string.isRequired,
  resource: PropTypes.string,
  setFilter: PropTypes.func,
  shouldRenderSuggestions: PropTypes.func,
  source: PropTypes.string,
  suggestionComponent: PropTypes.func,
  translate: PropTypes.func.isRequired,
  translateChoice: PropTypes.bool.isRequired
};

AdaptedAutoComplete.defaultProps = {
  choices: [],
  options: {},
  optionText: 'name',
  optionValue: 'id',
  limitChoicesToValue: false,
  translateChoice: true
};

export default compose(
  addField,
  translate,
  withStyles(styles)
)(AdaptedAutoComplete);
