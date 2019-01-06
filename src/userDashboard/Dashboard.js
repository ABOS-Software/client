import React, {Component} from 'react';

import TotalSales from './TotalSales';
import Donations from './Donations';
import GrandTotals from './GrandTotals';
import NbCustomers from './NbCustomers';
import OrderedProducts from './OrderedProducts';
import {fetchUtils, GET_LIST} from 'react-admin';
import restClient from '../grailsRestClient';


const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = restClient;

const styles = {
    flex: {display: 'flex'},
    flexColumn: {display: 'flex', flexDirection: 'column'},
    leftCol: {flex: 1, marginRight: '1em'},
    rightCol: {flex: 1, marginLeft: '1em'},
    singleCol: {marginTop: '2em', marginBottom: '2em'},
};

class Dashboard extends Component {
    state = {};

    componentDidMount() {
        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
        let year = -1;
        if (!this.props.year) {
            year = localStorage.getItem("enabledYear");
        } else {
            year = this.props.year;
        }
        let userId = -1;
        if (!this.props.userId) {
            userId = -1;
        } else {
            userId = this.props.userId;
        }

        {
            dataProvider(GET_LIST, 'Orders', {
                filter: {year: year, user_id: userId},
                sort: {field: 'id', order: 'DESC'},
                pagination: {page: 1, perPage: 1000},
            })
                .then(response =>
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
                                pendingOrders: [],
                            }
                        )
                )
                .then(({total, donation, grandTotal, nbCustomers, pendingOrders}) => {
                    this.setState({
                        totalVal: total.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }),
                        DonationsVal: donation.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }),
                        GrandTotalsVal: grandTotal.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }),
                        nbCustomersVal: nbCustomers,
                        pendingOrdersVal: pendingOrders,
                    });
                    return pendingOrders;
                });


        }
        dataProvider(GET_LIST, 'orderedProducts', {
            filter: {year: year, user_id: userId},
            sort: {field: 'products_id', order: 'ASC'},
            pagination: {page: 1, perPage: 1000},
        })
            .then(response =>
                response.data
                    .filter(order => order.products.year.id === (1 * year))
                    .reduce(
                        (stats, order) => {
                            let op = {};
                            let match = stats.orderedProducts.filter(op => {
                                return op.ID === order.products.id;
                            });
                            if (match.length > 0) {
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

                            }
                            else {
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

                            }


                            return stats;
                        },
                        {


                            orderedProducts: [],
                        }
                    )
            )
            .then(({orderedProducts}) => {
                this.setState({

                    orderedProductsVal: orderedProducts,
                });
            });


    }

    render() {
        const {
            nbCustomersVal,
            totalVal,
            DonationsVal,
            GrandTotalsVal,
            Commissions,
            pendingOrders,
            orderedProductsVal,
        } = this.state;
        return (

            <div style={styles.flex}>
                <div style={styles.leftCol}>
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


                </div>
                <div style={styles.rightCol}>
                    <div style={styles.flex}>
                        <OrderedProducts
                            OrderedProducts={orderedProductsVal}
                        />

                    </div>
                </div>
            </div>

        );
    }
}

/*Dashboard.propTypes = {
  year: PropTypes.number
};*/
export default Dashboard;
