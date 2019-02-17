import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {changeListParams} from 'ra-core';
import {addField, GET_ONE} from 'react-admin';
import dataProvider from '../../grailsRestClient';
import {styles} from './Styles';
import {getColumns, getProducts, updateDimensions} from './Utils';

class ProductsGrid extends Component {
    state = {rows: [], order: {orderedProducts: []}, year: 0, userName: '', customer: {}};

    constructor (props) {
      super(props);
      this.perPageInitial = this.props.perPage;
      this.loading = false;
      this._columns = getColumns();
    }

    rowGetter = (i) => {
      return this.state.rows[i];
    };

    handleGridRowsUpdated = ({cellKey, fromRow, toRow, updated}) => {
      const {input: {onChange}} = this.props;
      let rows = this.state.rows.slice();
      if (cellKey === 'quantity') {

      }
      for (let i = fromRow; i <= toRow; i++) {
        let rowToUpdate = rows[i];
        rowToUpdate.extended_cost = updated.quantity * rowToUpdate.unitCost;
        rowToUpdate.quantity = updated.quantity;
        // let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = rowToUpdate;
      }
      onChange(this.convertToOrder(rows));
      this.setState({rows});
    };

    convertOrderedProduct (row, exisiting) {
      let {year, userName, customer} = this.state;
      let ret = {
        products: {

          id: row.id
        },
        quantity: row.quantity,
        extendedCost: row.extended_cost,
        userName: userName

      };
      if (exisiting) {
        ret.year = year;
        ret.customer = customer;
        ret.user = customer.user;
      }
      return ret;
    }

    convertToOrder = (rows) => {
      let {order} = this.state;
      let newOrderedProducts = [];
      let quantity = 0;
      let cost = 0;
      let existing = order.hasOwnProperty('id');

      rows.forEach(row => {
        let match = this.filterOrderedProductsToCurrentRow(row);
        if (match.length > 0) {
          match[0].quantity = row.quantity;
          match[0].extendedCost = row.extended_cost;
          quantity += row.quantity;
          cost += row.extended_cost;
          newOrderedProducts.push(match[0]);
        } else {
          if (row.quantity > 0) {
            newOrderedProducts.push(this.convertOrderedProduct(row, existing));
            quantity += row.quantity;
            cost += row.extended_cost || 0;
          }
        }
      });

      return this.getNewOrderValue(newOrderedProducts, cost, quantity, existing);
    };

    filterOrderedProductsToCurrentRow (row) {
      let {order} = this.state;

      return order.orderedProducts.filter(order => {
        return order.products.id === row.id;
      });
    }

    getNewOrderValue (newOrderedProducts, cost, quantity, existing) {
      let {order} = this.state;
      let ret = {
        orderedProducts: newOrderedProducts,
        cost: cost,
        quantity: quantity,
        amountPaid: order.amountPaid,
        delivered: order.delivered
      //  year: order.year,
      // userName: userName
      };
      if (existing) {
        ret.id = order.id;
      }
      return ret;
    }

    handleGridSort = (sortColumn, sortDirection) => {
      this.props.setSort(sortColumn, sortDirection);
    };

    componentDidMount () {
      window.addEventListener('resize', updateDimensions);
      this.loadProducts();
    }

    getProducts (order, filter) {
      getProducts(order, filter, this.saveProductsResponse);
    }

    saveProductsResponse = (orderUse, orderResponse, order) => ({products}) => {
      if (orderUse) {
        this.setState({
          rows: products,
          order: orderResponse,
          year: order.year,
          userName: order.userName
        });
      } else {
        this.setState({
          rows: products,
          order: {
            orderedProducts: [],
            cost: 0.0,
            quantity: 0,
            amountPaid: 0.0,
            delivered: false,
            year: {},
            userName: ''
          }
        });
      }

      window.dispatchEvent(new Event('resize'));
    };

    loadProducts (year) {
      let {record} = this.props;
      if (record.json) {
        record = record.json;
      }
      let filter = this.getProductFilter(year, record);

      this.setState({customer: record});
      if (record.order && record.order.id) {
        this.getProductsForOrder(record, filter);
      } else {
        this.getProducts({}, filter);
      }
    }

    getProductsForOrder (record, filter) {
      if (!record.order.orderedProducts) {
        this.getOrderAndProducts(record, filter);
      } else {
        this.getProducts(record.order, filter);
      }
    }

    getOrderAndProducts (record, filter) {
      dataProvider(GET_ONE, 'Orders', {
        id: record.order.id
      }).then(orderResponse => {
        this.getProducts(orderResponse, filter);
      });
    }

    getProductFilter (year, record) {
      let filter = {};
      if (year) {
        filter = {year: year};
      } else if (record.year) {
        filter = {year: record.year.id};
      } else if (this.props.year) {
        filter = {year: this.props.year};
      }
      return filter;
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.year !== this.props.year) {
        this.loadProducts(nextProps.year);
        const {input: {onChange}} = this.props;
        let rows = this.state.rows.slice();
        onChange(this.convertToOrder(rows));
      }
      if (nextProps.ids.length !== this.props.ids.length) {
        this.loading = false;
      }
    }

    componentWillUnmount () {
      this.props.changeListParams(this.props.resource, {
        ...this.props.params,
        perPage: this.perPageInitial
      });
      window.removeEventListener('resize', updateDimensions);
    }

    render () {
      const {classes} = this.props;

      return (
        <div className={classes.main}>
          <div id='dataGridWrapper' style={{position: 'relative', height: '660px'}}>
            <div style={{position: 'absolute', width: '98%', height: '100%', margin: '1%'}}>
              <ReactDataGrid
                className='toto'
                enableCellSelect
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                minColumnWidth='30'
                minHeight='600px'
                disabled
              />
            </div>
          </div>

        </div>

      );
    }
}

ProductsGrid.propTypes = {

  input: PropTypes.object,
  perPage: PropTypes.any,
  setSort: PropTypes.func,
  record: PropTypes.any,
  changeListParams: PropTypes.func,
  resource: PropTypes.any,
  params: PropTypes.any,
  ids: PropTypes.array,

  year: PropTypes.number
};

ProductsGrid.defaultProps = {
  columns: [],
  data: {},
  hasBulkActions: false,
  ids: [],
  selectedIds: [],
  pageSize: 25
};
const mapStateToProps = (state, props) => ({
  params: state.admin.resources[props.resource].list.params
});
const ProductsGridRaw = compose(
  withStyles(styles),
  connect(mapStateToProps, {
    changeListParams
  })
)(ProductsGrid);
export default addField(ProductsGridRaw); // decorate with redux-form's <Field>
