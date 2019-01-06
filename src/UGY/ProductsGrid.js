import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import encoding from 'encoding-japanese'
import {changeListParams, crudGetList as crudGetListAction, crudUpdate, startUndoable} from 'ra-core';
import {fetchUtils, GET_LIST} from 'react-admin';
import restClient from '../grailsRestClient';
import CurrencyFormatter from "../resources/Formatters/CurrencyFormatter";
import ProductsToolbar from "./ProductsToolBar";
import MUITextEditor from "../resources/Editors/MUITextEditor";
import MUICurrencyEditor from "../resources/Editors/MUICurrencyEditor";
import MUISelectEditor from "../resources/Editors/MUISelectEditor";
import ProductsContextMenu from "./ProductsContextMenu";
import DropDownFormatter from '../resources/Formatters/DropDownFormatter';
import ImportDialog from "./ImportDialog";
import convert from 'xml-js';
import download from "downloadjs";

//const {Editors, Formatters} = require('react-data-grid-addons');

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = restClient;
//import dataProviderFactory from '../grailsRestClient';

const styles = theme => ({
    main: {
        fontFamily: theme.typography.fontFamily,
        fontSize: 14,
        lineHeight: '1.428571429',
        '& *, &:before, &:after': {
            boxSizing: 'border-box',
        },
        '& .widget-HeaderCell__value': {
            margin: 0,
            padding: 0,
        },
        '& .react-grid-HeaderCell__draggable': {
            margin: 0,
            padding: 0,
        },
        height: '100% !important',
        width: '100%'


    },
    dataGrid: {
        width: '100%'
    },
    'react-grid-Grid': {
        height: '100% !important'
    },
    contextMenu: {
        zIndex: 80000,
        backgroundColor: '#FFF'
    }


});

const emptyRow = {};
export const rowStatus = {NO_ACTION: 'NO_ACTION', INSERT: 'INSERT', UPDATE: 'UPDATE', DELETE: 'DELETE'};



class ProductsGrid extends Component {

    state = {
        rows: [], order: {}, year: 0, userName: "", customer: {}, filter: {},
        newRowIndex: 0,
        importDialogOpen: false,
        importStepsContent: [],
        importNumber: 0,
    };
    rowGetter = (i) => {
        return this.state.rows[i];
    };

    handleGridRowsUpdated = ({cellKey, fromRow, toRow, updated}) => {
        let rows = this.state.rows.slice();
        if (cellKey === "quantity") {

        }

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];

            let updatedRow = update(rowToUpdate, {$merge: updated});
            if (updatedRow.status !== rowStatus.INSERT) {
                updatedRow.status = rowStatus.UPDATE;
            }
            this.props.updateProduct(updatedRow);
            rows[i] = updatedRow;
        }
        this.setState({rows});
    };

    handleGridSort = (sortColumn, sortDirection) => {
        this.props.setSort(sortColumn, sortDirection);
    };
    updateDimensions = () => {
        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            wrapperDiv = d.getElementById("dataGridWrapper"),
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
        // wrapperDiv.height = height + "px";
    };
    handleAddRow = ({newRowIndex, newRow}) => {

        newRow.status = rowStatus.INSERT;
        this.props.addProduct(newRow);
        let parentState = update(this.state.rows, {
            $push: [newRow]
        });

        this.setState({rows: parentState});
    };

    addProducts = (newProducts) => {
        newProducts.forEach(newRow => {
            this.handleAddRow({
                newRowIndex: 0, newRow: newRow
            });
        });
        this.setState({importDialogOpen: false, importNumber: this.state.importNumber + 1});

    };

    getSize = () => {
        return this.state.rows.size;
    };
    handleFilterChange = (filter) => {
        let newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        this.setState({filters: newFilters});
    };
    onClearFilters = () => {
        this.setState({filters: {}});
    };
    deleteRow = (e, {rowIdx}) => {
        let row = this.state.rows[rowIdx];
        if (row.status !== rowStatus.INSERT) {
            row.status = rowStatus.DELETE;
        }
        this.props.deleteProduct(row);


        this.state.rows.splice(rowIdx, 1);
        this.setState({rows: this.state.rows});
    };
    insertRowAbove = (e, {rowIdx}) => {
        this.insertRow(rowIdx);
    };
    insertRow = (rowIdx) => {
        const newRow = {
            id: 'n-' + this.state.newRowIndex,
            humanProductId: '',
            productName: '',
            unitSize: '',
            unitCost: '0.00',
            category: '-1',
            status: rowStatus.INSERT
        };
        this.props.addProduct(newRow);
        let rows = [...this.state.rows];
        rows.splice(rowIdx, 0, newRow);

        this.setState({rows: rows, newRowIndex: this.state.newRowIndex + 1});
    };

    insertRowBelow = (e, {rowIdx}) => {
        this.insertRow(rowIdx + 1);
    };
    handleImportClick = event => {
        this.setState({importDialogOpen: true});

    };

    componentWillUnmount() {

        window.removeEventListener("resize", this.updateDimensions);

    }

    handleImportClose = event => {
        this.setState({importDialogOpen: false, importNumber: this.state.importNumber + 1});

    };
    handleExportClick = event => {
        let products = {
            "_declaration": {"_attributes": {"version": "1.0", "encoding": "utf-8"}},
            Export: {Products: []}
        };
        let idx = 0;
        this.state.rows.forEach(product => {
            if (product.status !== rowStatus.DELETE) {
                products.Export.Products.push({
                    humanProductId: product.humanProductId,
                    productName: product.productName,
                    unitSize: product.unitSize,
                    unitCost: product.unitCost,
                    category: (this.props.categories.find(cat => cat.id === product.category) || {name: ''}).name,
                    _attributes: {id: idx}
                });
                idx++;
            }
        });

        const options = {compact: true, ignoreComment: true, spaces: 4};
        let result = convert.js2xml(products, options);
        //console.log(encoding.detect(result));
        //console.log(encoding.convert(result,'UTF8'));
        download(encoding.convert(result, 'UTF8'), this.props.yearText + "-export.xml", "application/xml")

    };

    createColumns(categories) {
        return [
            {
                key: 'humanProductId',
                name: 'ID',
                editable: true,
                resizable: true,
                filterable: true,
                editor: MUITextEditor

            },
            {
                key: 'productName',
                name: 'Name',
                editable: true,
                resizable: true,
                filterable: true,
                editor: MUITextEditor

            },
            {
                key: 'unitSize',
                name: 'Size',
                editable: true,
                resizable: true,
                filterable: true,
                editor: MUITextEditor

            },
            {
                key: 'unitCost',
                name: 'Unit Cost',
                editable: true,
                formatter: CurrencyFormatter,
                resizable: true,
                filterable: true,
                editor: MUICurrencyEditor

            },
            {
                key: 'category',
                name: 'Category',
                editable: true,
                resizable: true,
                filterable: true,
                editor: <MUISelectEditor options={categories}/>,
                formatter: <DropDownFormatter options={categories} value={"-1"}/>

            }
        ];
    }

    constructor(props) {
        super(props);
        this.perPageInitial = this.props.perPage;
        this.loading = false;
        this.loadProducts(this.props.year);

        // this.createColumns();
    }

    componentDidMount() {
        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
        window.addEventListener("resize", this.updateDimensions);
        this.setState({year: this.props.year})

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.year !== this.props.year) {
            this.loadProducts(nextProps.year);
            this.setState({year: nextProps.year})

        }

    }

    loadProducts(year) {

        let filter = {};
        if (year) {
            filter = {year: year};

        }
        dataProvider(GET_LIST, 'Products', {
            filter: filter,
            pagination: {page: 1, perPage: 1000},
            sort: {field: 'id', order: 'ASC'}
        })
            .then(response =>
                response.data.reduce((stats, product) => {
                        let cat = -1;
                        if (product.category) {
                            cat = product.category.id;
                        }
                        stats.products.push({
                            humanProductId: product.humanProductId,
                            id: product.id,
                            year: {id: product.year.id},
                            productName: product.productName,
                            unitSize: product.unitSize,
                            unitCost: product.unitCost,
                            category: cat,
                            status: rowStatus.NO_ACTION

                        });

                        return stats;
                    },
                    {
                        products: [],
                        /*
                                                    humanProductId: '0',
                                                    id: 0,
                                                    year: {id: 0},
                                                    productName: '',
                                                    unitSize: '',
                                                    unitCost: 0.0,
                                                    quantity: 0,
                                                    extended_cost: 0.0,
                         */
                    }
                )
            ).then(({products}) => {
                this.setState({
                    rows: products
                });
                window.dispatchEvent(new Event('resize'));
            }
        );




    }

    render() {
        const {classes} = this.props;

        return (/*<div className="list-page List-root-156">
            <div className="MuiPaper-root-34 MuiPaper-elevation2-38 MuiPaper-rounded-35 MuiCard-root-160">*/
            <div className={classes.main}>
                {/*                <div id="dataGridWrapper" style={{position: "relative", height: "100%"}}>
                    <div style={{position: "absolute", width: "98%", height: "100%", margin: "1%"}}>*/}
                <ReactDataGrid
                    className={classes.dataGrid}
                    enableCellSelect={true}
                    columns={this.createColumns(this.props.categories)}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    minColumnWidth="30"
                    // midWidth={"100px"}
                    toolbar={<ProductsToolbar onAddRow={this.handleAddRow} enableFilter={true}
                                              numberOfRows={this.getSize()}
                                              onImport={this.handleImportClick}
                                              categories={this.props.categories} onExport={this.handleExportClick}
                                              newRowIndex={this.state.newRowIndex}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                    contextMenu={<ProductsContextMenu className={classes.contextMenu} id="customizedContextMenu"
                                                      onRowDelete={this.deleteRow}
                                                      onRowInsertAbove={this.insertRowAbove}
                                                      onRowInsertBelow={this.insertRowBelow}/>}
                    columnEquality={() => false}

                />
                <ImportDialog closeImportDialog={this.handleImportClose}
                              importDialogOpen={this.state.importDialogOpen} importNumber={this.state.importNumber}
                              categories={this.props.categories} year={this.state.year} addProducts={this.addProducts}/>
                {/*                    </div>
                </div>*/}

            </div>

            /*</div>
        </div>
            </div>
            </div>*/

        );
    }
}

ProductsGrid.propTypes = {
    label: PropTypes.string,
    onImport: PropTypes.func,
    onExport: PropTypes.func,
    className: PropTypes.string,

    year: PropTypes.number,
    addProduct: PropTypes.func,
    deleteProduct: PropTypes.func,
    updateProduct: PropTypes.func,
    categories: PropTypes.array,
    yearText: PropTypes.string
};

ProductsGrid.defaultProps = {};
const mapStateToProps = (state, props) => ({});
const ProductsGridRaw = compose(
    withStyles(styles),
    connect(mapStateToProps, {
        changeListParams,
        dispatchCrudUpdate: crudUpdate,
        crudGetList: crudGetListAction,
        startUndoable,
    })
)(ProductsGrid);
export default (ProductsGridRaw); // decorate with redux-form's <Field>
