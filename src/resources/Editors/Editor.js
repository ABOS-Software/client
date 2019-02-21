import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import MUITextEditorUnWrapped from './MUITextEditorUnWrapped';
import MUINumberEditorRaw from './MUINumberEditorRaw';
import MUICurrencyEditorRaw from './MUICurrencyEditorRaw';
import MUISelectEditorRaw from './MUISelectEditorUnWrapped';

let optionPropType = PropTypes.shape({
  id: PropTypes.required,
  title: PropTypes.string
});

const styles = theme => ({
  textField: {
    border: '0 !important'
  }
});

class EditorBase extends React.Component {
  static propTypes = {
    onCommit: PropTypes.func,
    options: PropTypes.arrayOf(optionPropType),
    label: PropTypes.any,
    value: PropTypes.any,
    height: PropTypes.number,
    valueParams: PropTypes.arrayOf(PropTypes.string),
    //       column: PropTypes.shape(ExcelColumn),
    column: PropTypes.shape({
      key: PropTypes.string,
      onCellChange: PropTypes.func
    }),
    resultIdentifier: PropTypes.string,
    search: PropTypes.string,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    editorDisplayValue: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    resultIdentifier: 'id'
  };
  handleChange = (event) => {
    this.setState({value: event.target.value});
    // this.props.onCommit();
  };
  getValue = () => {
    let updated = {};

    updated[this.props.column.key] = this.state.value;

    return updated;
  };
  getInputNode = () => {
    if (this.props.type === 'Select') {
      return ReactDOM.findDOMNode(this).getElementsByTagName('select')[0];
    } else {
      return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
    }
  };

  componentWillMount () {
    this.setState({value: this.props.value});
  }

/*  onClick () {
    this.getInputNode().focus();
  }

  onDoubleClick () {
    this.getInputNode().focus();
  }*/
  /*
      getLabel = (item: any): string => {
          let label = this.props.label != null ? this.props.label : 'title';
          if (typeof label === 'function') {
              return label(item);
          } else if (typeof label === 'string') {
              return item[label];
          }
      };

      hasResults = (): boolean => {
          return this.autoComplete.state.results.length > 0;
      };

      isFocusedOnSuggestion = (): boolean => {
          let autoComplete = this.autoComplete;
          return autoComplete.state.focusedValue != null;
      };

      constuctValueFromParams = (obj: any, props: ?Array<string>) => {
          if (!props) {
              return '';
          }

          let ret = [];
          for (let i = 0, ii = props.length; i < ii; i++) {
              ret.push(obj[props[i]]);
          }
          return ret.join('|');
      }; */

  render () {
    let props = {
      height: this.props.height,
      onKeyDown: this.props.onKeyDown,
      value: this.state.value,
      onChange: this.handleChange,
      onBlur: this.props.onBlur
    };

    let editor = <MUITextEditorUnWrapped {...props}/>;
    switch (this.props.type) {
    case 'Number':
      editor = <MUINumberEditorRaw {...props}/>;
      break;
    case 'Currency':
      editor = <MUICurrencyEditorRaw {...props}/>;
      break;
    case 'Select':
      editor = <MUISelectEditorRaw {...props} options={this.props.options}/>;
      break;
    }
    return editor;
    /*      <MUITextEditorUnWrapped height={this.props.height} onKeyDown={this.props.onKeyDown} value={this.state.value}
                              onChange={this.handleChange}>

      </MUITextEditorUnWrapped>); */
  }
}

export default (EditorBase);
// export default (MUITextEditor);
