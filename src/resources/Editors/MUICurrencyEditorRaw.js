import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';

const styles = theme => ({
  textField: {
    border: '0 !important',
    flexGrow: 1

  },
  wrapper: {
    display: 'flex',
    flexGrow: 1
  }
});

function NumberFormatCustom (props) {
  const {inputRef, onChange, ...other} = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.floatValue
          }
        });
      }}
      thousandSeparator
      prefix='$'
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

class MUICurrencyEditorRaw extends React.Component {
    static propTypes = {
      onChange: PropTypes.func,

      value: PropTypes.any,
      height: PropTypes.number,

      onKeyDown: PropTypes.func
    };

    static defaultProps = {
      resultIdentifier: 'id'
    };

    handleChange = () => {
      this.props.onCommit();
    };

    getInputNode = () => {
      return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
    };

    render () {
      return (<div height={this.props.height} onKeyDown={this.props.onKeyDown} className={this.props.classes.wrapper}>
        <TextField InputProps={{
          inputComponent: NumberFormatCustom
        }} value={this.props.value} onChange={this.props.onChange} className={this.props.classes.textField} onBlur={this.props.onBlur}/>
      </div>);
    }
}

MUICurrencyEditorRaw.propTypes = {
  onCommit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default (withStyles(styles, {withTheme: true})(MUICurrencyEditorRaw));
