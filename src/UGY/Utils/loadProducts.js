import {rowStatus} from '../ProductsGrid';
import {GET_LIST} from 'react-admin';
import dataProvider from '../../grailsRestClient';

export default (year) => {
  let filter = {};
  if (year) {
    filter = {year: year};
  }
  return dataProvider(GET_LIST, 'Products', {
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
        products: []

      }
      )
    ).then(({products}) => {
      return products;
    }
    );
};
