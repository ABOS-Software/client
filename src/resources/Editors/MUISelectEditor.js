import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import MUISelectEditorRaw from "./MUISelectEditorUnWrapped";

const {editors: {EditorBase}} = require('react-data-grid');


let optionPropType = PropTypes.shape({
    id: PropTypes.required,
    title: PropTypes.string
});

const styles = theme => ({
    textField: {
        border: '0 !important',
    }
});

class MUISelectEditor extends EditorBase {

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
        editorDisplayValue: PropTypes.func,

    };

    static defaultProps = {
        resultIdentifier: 'id'
    };
    handleChange = (event) => {
        this.setState({value: event.target.value});
        //    this.onChange(event);
        //this.props.onCommit();
    };
    getValue = () => {
        let updated = {};

        updated[this.props.column.key] = this.state.value;

        return updated;
    };
    getInputNode = () => {
        return ReactDOM.findDOMNode(this);
        // return ReactDOM.findDOMNode(this).getElementsByTagName('select')[0];
    };

    onClick() {
        this.getInputNode().focus();
    }

    onDoubleClick() {
        this.getInputNode().focus();
    }

    componentWillMount() {
        this.setState({value: this.props.value})

    }

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
        return (
            <MUISelectEditorRaw height={this.props.height} onKeyDown={this.props.onKeyDown} value={this.state.value}
                                onChange={this.handleChange} options={this.props.options}>

            </MUISelectEditorRaw>);
    }

}

export default (MUISelectEditor);
//export default (MUITextEditor);