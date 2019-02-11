import convert from 'xml-js';
import download from 'downloadjs';
import encoding from 'encoding-japanese';
import {rowStatus} from '../ProductsGrid';

export const exportProducts = (rows, yearText, categories) => {
  let products = {
    '_declaration': {'_attributes': {'version': '1.0', 'encoding': 'utf-8'}},
    Export: {Products: []}
  };
  let idx = 0;
  rows.forEach(product => {
    if (product.status !== rowStatus.DELETE) {
      products.Export.Products.push({
        humanProductId: product.humanProductId,
        productName: product.productName,
        unitSize: product.unitSize,
        unitCost: product.unitCost,
        category: (categories.find(cat => cat.id === product.category) || {name: ''}).name,
        _attributes: {id: idx}
      });
      idx++;
    }
  });

  const options = {compact: true, ignoreComment: true, spaces: 4};
  let result = convert.js2xml(products, options);

  download(encoding.convert(result, 'UTF8'), yearText + '-export.xml', 'application/xml');
};
