import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField'
import NumberFormat from 'react-number-format';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    tools: {

        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //flexBasis: '300px',
        //flexWrap: 'wrap'

    },
    toolBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
        flexGrow: 1,
        alignItems: 'center',
        //flexWrap: 'wrap'

    },
    additionFields: {
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 2,
        flexGrow: 1,
        //flexBasis: '300px',
        flexWrap: 'wrap'


    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '50px',
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        minWidth: 120,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '50px',


    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },

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
                        value: values.value,
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

class ProductsToolbar extends React.Component {
    static propTypes = {
        onAddRow: PropTypes.func,
        onImport: PropTypes.func,
        onExport: PropTypes.func,
        onToggleFilter: PropTypes.func,
        enableFilter: PropTypes.bool,
        numberOfRows: PropTypes.number,
        addRowButtonText: PropTypes.string,
        filterRowsButtonText: PropTypes.string,
        children: PropTypes.any,
        categories: PropTypes.array,
        newRowIndex: PropTypes.number
    };
    state = {
        HID: '',
        name: '',
        size: '',
        cost: '0.00',

    };
    static defaultProps = {
        enableAddRow: true,
        addRowButtonText: 'Add Row',
        filterRowsButtonText: 'Filter Rows',
        categories: [{id: '-1', value: ''}],
        newRowIndex: 0
    };

    onAddRow = () => {
        if (this.props.onAddRow !== null && this.props.onAddRow instanceof Function) {
            this.props.onAddRow({
                newRowIndex: this.props.newRowIndex, newRow: {
                    id: this.props.newRowIndex,
                    humanProductId: this.state.HID,
                    productName: this.state.name,
                    unitSize: this.state.size,
                    unitCost: this.state.cost,
                    category: this.state.category
                }
            });
        }
        this.setState({
            HID: '',
            name: '',
            size: '',
            cost: '0.00',
            category: '-1',
        })
    };

    renderAddRowButton = () => {
        if (this.props.onAddRow) {
            return (<IconButton className={this.props.classes.button} aria-label="Add Rows" onClick={this.onAddRow}>
                <AddIcon/>
            </IconButton>);
        }
    };

    renderToggleFilterButton = () => {
        if (this.props.enableFilter) {
            return (<IconButton className={this.props.classes.button} aria-label="Filter"
                                onClick={this.props.onToggleFilter}>
                <FilterListIcon/>
            </IconButton>);
        }
    };
    renderImport = () => {
        if (this.props.onImport) {
            return (<Button variant={"contained"} className={this.props.classes.button} aria-label="Filter"
                            onClick={this.props.onImport}>
                Import
                <ImportExportIcon/>
            </Button>);
        }
    };
    renderExport = () => {
        if (this.props.onExport) {
            return (<Button variant={"contained"} className={this.props.classes.button} aria-label="Filter"
                            onClick={this.props.onExport}>
                Export
                <ImportExportIcon/>
            </Button>);
        }
    };
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    renderOptions(): Array<ReactElement> {
        let options = [];
        //options.push(<MenuItem value={-1}/>);

        this.props.categories.forEach(function (name) {
            if (typeof(name) === 'string') {
                options.push(<MenuItem key={"category-dropDown-" + name} value={name}>{name}</MenuItem>);
            } else {
                options.push(<MenuItem key={"category-dropDown-" + name.id}
                                       value={name.id}>{name.text || name.value || name.name}</MenuItem>);
            }
        }, this);
        return options;
    }
    render() {
        const {classes} = this.props;
        return (
            <div>

                <div className={classes.toolBar}>
                    <div className={classes.additionFields}>

                        <TextField
                            id="HID"
                            label="Product ID"
                            className={classes.textField}
                            value={this.state.HID}
                            onChange={this.handleChange('HID')}
                            margin="normal"
                        />
                        <TextField
                            id="name"
                            label="Product Name"
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal"
                        />
                        <TextField
                            id="size"
                            label="Product size"
                            className={classes.textField}
                            value={this.state.size}
                            onChange={this.handleChange('size')}
                            margin="normal"
                        />
                        <TextField
                            id="cost"
                            label="Product cost"

                            className={classes.textField}
                            value={this.state.cost}
                            onChange={this.handleChange('cost')}
                            margin="normal"
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="category-helper">Category</InputLabel>
                            <Select
                                value={this.state.category}
                                onChange={this.handleChange('category')}
                                inputProps={{
                                    name: 'category',
                                    id: 'category-simple',
                                }}
                            >
                                {this.renderOptions()}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.tools}>
                        {this.renderAddRowButton()}
                        {this.renderToggleFilterButton()}
                        {this.renderImport()}
                        {this.renderExport()}

                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(ProductsToolbar);
