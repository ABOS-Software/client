import {getBlankOrder} from './getBlankOrder';
import dataProvider from '../../../grailsRestClient';
import {GET_LIST} from 'react-admin';

export const getProducts = (order, filter, save) => {
  let orderResponse;
  let orderUse = true;
  if (order.data) {
    orderResponse = order.data;
  } else if (order.orderedProducts) {
    orderResponse = order;
  } else {
    order = getBlankOrder();
    orderResponse = order;
    orderUse = false;
  }
  dataProvider(GET_LIST, 'Products', {
    filter: filter,
    pagination: {page: 1, perPage: 1000},
    sort: {field: 'id', order: 'ASC'}
  })
    .then(processProductResponse(orderResponse))
    .then(save(orderUse, orderResponse, order));
};

const processProductResponse = (orderResponse) => response =>
  response.data.reduce((stats, product) => {
    let match = orderResponse.orderedProducts.filter(orderObj => {
      return Number(orderObj.products.id) === Number(product.id);
    });
    if (match.length > 0) {
      stats = pushOrderedProductToList(stats, product, match);
    } else {
      stats = pushProductToList(stats, product);
    }

    return stats;
  },
  {
    products: []

  }
  );

const pushProductToList = (stats, product) => {
  stats.products.push({
    humanProductId: product.humanProductId,
    id: product.id,
    year: {id: product.year.id},
    productName: product.productName,
    unitSize: product.unitSize,
    unitCost: product.unitCost,
    quantity: 0,
    extended_cost: 0.0
  });
  return stats;
};

const pushOrderedProductToList = (stats, product, match) => {
  stats.products.push({
    humanProductId: product.humanProductId,
    id: product.id,
    year: {id: product.year.id},
    productName: product.productName,
    unitSize: product.unitSize,
    unitCost: product.unitCost,
    quantity: match[0].quantity,
    extended_cost: match[0].extendedCost
  });
  return stats;
};
