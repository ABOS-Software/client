import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const columnShape = {
    key: PropTypes.string.isRequired
};


class NumberEditor extends Component {
    static propTypes = {
        column: PropTypes.shape(columnShape).isRequired,
        value: PropTypes.any,
        maxValue: PropTypes.number,
        minValue: PropTypes.number,
        editorValue: PropTypes.number
    };
    static defaultProps = {
        editorValue: 0
    };
    state = {editorValue: 0};
    disableContainerStyles = true;

    constructor(props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.state = {editorValue: props.value};
    }

    getInputNode() {
        let domNode = ReactDOM.findDOMNode(this);
        if (domNode.tagName === 'INPUT') {
            return domNode;
        }

        return domNode.querySelector('input:not([type=hidden])') || domNode;
    }

    handleValueChange(value) {
        let numVal = Number(value);
        if (!numVal || numVal === "NaN") {
            return;
        }
        this.setState({editorValue: numVal});
    }

    getValue() {
        return {[this.props.column.key]: this.state.editorValue};
    }

    render() {

        if (this.props.minValue && this.props.maxValue) {
            return (
                <div className="editor-main editor-base">
                    <input min={this.props.minValue} max={this.props.maxValue} defaultValue={this.props.editorValue}
                           onChange={({target: {value}}) => {
                               this.handleValueChange(value)
                           }}/>
                </div>
            );
        }
        if (!this.props.minValue && !this.props.maxValue) {
            return (
                <div className="editor-main editor-base">
                    <input defaultValue={this.props.editorValue} onChange={({target: {value}}) => {
                        this.handleValueChange(value)
                    }}/>
                </div>
            );
        }
        if (this.props.minValue) {
            return (
                <div className="editor-main editor-base">
                    <input min={this.props.minValue} defaultValue={this.props.editorValue}
                           onChange={({target: {value}}) => {
                               this.handleValueChange(value)
                           }}/>
                </div>
            );
        }
        if (this.props.maxValue) {
            return (
                <div className="editor-main editor-base">
                    <input max={this.props.maxValue} defaultValue={this.props.editorValue}  {...this.state}
                           onChange={({target: {value}}) => {
                               this.handleValueChange(value)
                           }}/>
                </div>
            );
        }
    }


}


export default NumberEditor;
