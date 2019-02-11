import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TotalSales from './TotalSales';
import Donations from './Donations';
import GrandTotals from './GrandTotals';
import NbCustomers from './NbCustomers';
import OrderedProducts from './OrderedProducts';
import {GET_LIST} from 'react-admin';
import restClient from '../grailsRestClient';

const dataProvider = restClient;

const styles = {
  flex: {display: 'flex'},
  flexColumn: {display: 'flex', flexDirection: 'column'},
  leftCol: {flex: 1, marginRight: '1em'},
  rightCol: {flex: 1, marginLeft: '1em'},
  singleCol: {marginTop: '2em', marginBottom: '2em'}
};

class Dashboard extends Component {
    state = {};

    componentDidMount () {
      const aMonthAgo = new Date();
      aMonthAgo.setDate(aMonthAgo.getDate() - 30);
      let year = -1;
      let filter = {};
      if (!this.props.year) {
        filter.year = localStorage.getItem('enabledYear');
      } else {
        filter.year = this.props.year;
      }
      year = filter.year;
      if (this.props.userId) {
        filter.user_id = this.props.userId;
      }

      this.getOrder(filter);
      this.getOrderedProducts(filter, year);
    }

    orderedProductsReducer = (stats, order) => {
      let op = {};
      let match = stats.orderedProducts.filter(op => {
        return op.ID === order.products.id;
      });
      if (match.length > 0) {
        stats = this.updateExistingOrderedProduct(op, order, match, stats);
      } else {
        stats = this.addNewOrderedProduct(op, order, stats);
      }

      return stats;
    };

    addNewOrderedProduct (op, order, stats) {
      op = {
        pID: order.products.humanProductId,
        ID: order.products.id,

        productName: order.products.productName,
        unitSize: order.products.unitSize,
        unitCost: order.products.unitCost,
        quantity: order.quantity,
        extendedCost: order.extendedCost,
        year: order.year.id
      };
      stats.orderedProducts.push(op);
      return stats;
    }

    updateExistingOrderedProduct (op, order, match, stats) {
      op = {
        pID: order.products.humanProductId,
        ID: order.products.id,
        productName: order.products.productName,
        unitSize: order.products.unitSize,
        unitCost: order.products.unitCost,
        quantity: order.quantity + match[0].quantity,
        extendedCost: order.extendedCost + match[0].extendedCost,
        year: order.year.id
      };
      let index = stats.orderedProducts.findIndex(op => {
        return op.ID === order.products.id;
      });

      stats.orderedProducts[index] = op;
      return stats;
    }

    getOrderedProducts (filter, year) {
      dataProvider(GET_LIST, 'orderedProducts', {
        filter: filter,
        sort: {},
        pagination: {page: 1, perPage: 1000}
      })
        .then(response =>
          response.data
            .filter(order => order.products.year.id === (1 * year))
            .reduce(this.orderedProductsReducer, {orderedProducts: []})
        )
        .then(({orderedProducts}) => {
          orderedProducts.sort((a, b) => {
            if (a.pID > b.pID) {
              return 1;
            } else {
              return -1;
            }
          });
          this.setState({

            orderedProductsVal: orderedProducts
          });
        });
    }

    getOrder (filter) {
      dataProvider(GET_LIST, 'Orders', {
        filter: filter,
        sort: {field: 'id', order: 'DESC'},
        pagination: {page: 1, perPage: 1000}
      })
        .then(this.processOrder())
        .then(this.updateStateWithOrder);
    }

    updateStateWithOrder = (({total, donation, grandTotal, nbCustomers, pendingOrders}) => {
      this.setState({
        totalVal: total.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        DonationsVal: donation.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        GrandTotalsVal: grandTotal.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        nbCustomersVal: nbCustomers,
        pendingOrdersVal: pendingOrders
      });
      return pendingOrders;
    });

    processOrder () {
      return response =>
        response.data
          .reduce(
            (stats, order) => {
              stats.total += order.cost;
              stats.nbCustomers++;
              stats.donation += order.customer.donation;
              stats.grandTotal += order.cost + order.customer.donation;
              stats.pendingOrders.push(order);

              return stats;
            },
            {

              total: 0,
              donation: 0,
              grandTotal: 0,
              nbCustomers: 0,
              pendingOrders: []
            }
          );
    }

    render () {
      return (

        <div style={styles.flex}>
          {this.renderLeft()}
          {this.renderRight()}
        </div>

      );
    }

    renderRight () {
      const {

        orderedProductsVal
      } = this.state;
      return <div style={styles.rightCol}>
        <div style={styles.flex}>
          <OrderedProducts
            OrderedProducts={orderedProductsVal}
          />

        </div>
      </div>;
    }

    renderLeft () {
      const {
        nbCustomersVal,
        totalVal,
        DonationsVal,
        GrandTotalsVal

      } = this.state;
      return <div style={styles.leftCol}>
        <div style={styles.singleCol}>

          <TotalSales value={totalVal}/>
        </div>
        <div style={styles.singleCol}>

          <Donations value={DonationsVal}/>
        </div>

        <div style={styles.singleCol}>

          <GrandTotals value={GrandTotalsVal}/>
        </div>

        <div style={styles.singleCol}>

          <NbCustomers value={nbCustomersVal}/>
        </div>

      </div>;
    }
}

Dashboard.propTypes = {
  year: PropTypes.number
};
export default Dashboard;
