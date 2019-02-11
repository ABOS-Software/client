import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import ProductsToolbar from './ProductsToolBar';

import ProductsContextMenu from './ProductsContextMenu';
import ImportDialog from './Dialogs/ImportDialog';
import {styles} from './GridStyles';
import {createColumns} from './Columns';
import {exportProducts, loadProducts} from './Utils';

export const rowStatus = {NO_ACTION: 'NO_ACTION', INSERT: 'INSERT', UPDATE: 'UPDATE', DELETE: 'DELETE'};

class ProductsGrid extends Component {
    state = {
      rows: [],
      order: {},
      year: 0,
      userName: '',
      customer: {},
      filter: {},
      newRowIndex: 0,
      importDialogOpen: false,
      importStepsContent: [],
      importNumber: 0
    };

    constructor (props) {
      super(props);
      this.perPageInitial = this.props.perPage;
      this.loading = false;
    // this.createColumns();
    }

    rowGetter = (i) => {
      return this.state.rows[i];
    };

    handleGridRowsUpdated = ({cellKey, fromRow, toRow, updated}) => {
      let rows = this.state.rows.slice();

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

    handleImportClose = event => {
      this.setState({importDialogOpen: false, importNumber: this.state.importNumber + 1});
    };

    componentDidMount () {
      loadProducts(this.props.year).then(products => {
        this.setState({
          rows: products
        });
        window.dispatchEvent(new Event('resize'));
      });
      this.setState({year: this.props.year});
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.year !== this.props.year) {
        loadProducts(nextProps.year).then(products => {
          this.setState({
            rows: products
          });
          window.dispatchEvent(new Event('resize'));
        });
        this.setState({year: nextProps.year});
      }
    }

    render () {
      const {classes} = this.props;

      return (
        <div className={classes.main}>
          <ReactDataGrid
            className={classes.dataGrid}
            enableCellSelect
            columns={createColumns(this.props.categories)}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            minColumnWidth='30'
            // midWidth={"100px"}
            toolbar={this.getToolBar()}
            onAddFilter={this.handleFilterChange}
            onClearFilters={this.onClearFilters}
            contextMenu={this.getContextMenu(classes)}
            columnEquality={() => false}
          />
          <ImportDialog closeImportDialog={this.handleImportClose}
            importDialogOpen={this.state.importDialogOpen} importNumber={this.state.importNumber}
            categories={this.props.categories} year={this.state.year} addProducts={this.addProducts}/>
        </div>
      );
    }

    getContextMenu (classes) {
      return <ProductsContextMenu className={classes.contextMenu} id='customizedContextMenu'
        onRowDelete={this.deleteRow}
        onRowInsertAbove={this.insertRowAbove}
        onRowInsertBelow={this.insertRowBelow}/>;
    }

    getToolBar () {
      return <ProductsToolbar onAddRow={this.handleAddRow} enableFilter
        numberOfRows={this.getSize()}
        onImport={this.handleImportClick}
        categories={this.props.categories} onExport={() => exportProducts(this.state.rows, this.props.yearText, this.props.categories)}
        newRowIndex={this.state.newRowIndex}/>;
    }
}

ProductsGrid.propTypes = {

  year: PropTypes.number,
  addProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
  updateProduct: PropTypes.func,
  categories: PropTypes.array,
  yearText: PropTypes.string
};

ProductsGrid.defaultProps = {};
const ProductsGridRaw = compose(
  withStyles(styles)
)(ProductsGrid);
export default (ProductsGridRaw); // decorate with redux-form's <Field>
