import React from 'react';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import NumberFormat from "react-number-format";


let optionPropType = PropTypes.shape({
    id: PropTypes.required,
    title: PropTypes.string
});

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

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.floatValue,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

class MUICurrencyEditorRaw extends React.Component {

    static propTypes = {
        onChange: PropTypes.func,

        value: PropTypes.any,
        height: PropTypes.number,

        onKeyDown: PropTypes.func,
    };

    static defaultProps = {
        resultIdentifier: 'id'
    };

    handleChange = () => {
        this.props.onCommit();
    };

    getValue = () => {
        let updated = {};

        updated[this.props.column.key] = "Test";

        return updated;
    };


    getInputNode = () => {
        return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
    };

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
        };*/

    render(): ?ReactElement {
        return (<div height={this.props.height} onKeyDown={this.props.onKeyDown} className={this.props.classes.wrapper}>
            <TextField InputProps={{
                inputComponent: NumberFormatCustom,
            }} value={this.props.value} onChange={this.props.onChange} className={this.props.classes.textField}/>
        </div>);
    }

}

export default (withStyles(styles, {withTheme: true})(MUICurrencyEditorRaw));