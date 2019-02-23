import React from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {showNotification} from 'react-admin';
import {rowStatus} from '../ProductsGrid';
import ImportDialogBase from './ImportUsersDialog';

const styles = theme => ({});

class ImportProductsDialog extends React.Component {
    state = {
      action: '',
      importType: '',
      products: [],
      newRowIndex: 0,
      categories: []
    };

    convertNewXML (records) {
      let newRowIndex = this.state.newRowIndex;
      let products = [];
      let categories = [];
      /* records.categories.forEach(cat => {
              categories.push({
                  categoryName: cat.categoryName,
                  deliveryDate: cat.deliveryDate,
                  id: 'i-' + this.props.importNumber + '-' + newRowIndex,

              })
          }); */
      let recordsProds;
      recordsProds = records.Export.Products;
      recordsProds.forEach(product => {
        let cat = (this.props.categories.find(cat => cat.name === (product.category._text)) || {id: -1}).id;
        products.push(
          {
            humanProductId: product.humanProductId._text,
            id: 'i-' + this.props.importNumber + '-' + newRowIndex,
            year: {id: this.props.year},
            productName: product.productName._text,
            unitSize: product.unitSize._text,
            unitCost: product.unitCost._text,
            category: cat,
            status: rowStatus.INSERT
          }
        );
        newRowIndex++;
      });
      this.setState({products: products, newRowIndex: newRowIndex, categories: categories});
      this.props.addProducts(products);
    }

    convertOldXML (records) {
      let newRowIndex = this.state.newRowIndex;
      let products = [];
      let categories = [];
      /* records.categories.forEach(cat => {
              categories.push({
                  categoryName: cat.categoryName,
                  deliveryDate: cat.deliveryDate,
                  id: 'i-' + this.props.importNumber + '-' + newRowIndex,

              })
          }); */
      let recordsProds;
      recordsProds = records.LawnGarden.Products;
      recordsProds.forEach(product => {
        let cat = (this.props.categories.find(cat => cat.name === (product.Category._text)) || {id: -1}).id;
        products.push(
          {
            humanProductId: product.ProductID._text,
            id: 'i-' + this.props.importNumber + '-' + newRowIndex,
            year: {id: this.props.year},
            productName: product.ProductName._text,
            unitSize: product.Size._text,
            unitCost: product.UnitCost._text,
            category: cat,
            status: rowStatus.INSERT
          }
        );
        newRowIndex++;
      });
      this.setState({products: products, newRowIndex: newRowIndex, categories: categories});
      this.props.addProducts(products);
    }

    convertXML = (records) => {
      if (records.Export.Products) {
        this.convertNewXML(records);
      } else if (records.LawnGarden && records.LawnGarden.Products) {
        this.convertOldXML(records);
      }
    };

    convertCSV = (records) => {
      let newRowIndex = this.state.newRowIndex;
      let products = [];
      records.forEach(product => {
        let cat = (this.props.categories.find(cat => cat.name === product.Category) || {id: -1}).id;
        products.push(
          {
            humanProductId: product.ProductID,
            id: 'i-' + this.props.importNumber + '-' + newRowIndex,
            year: {id: this.props.year},
            productName: product.ProductName,
            unitSize: product.Size,
            unitCost: product.UnitCost,
            category: cat,
            status: rowStatus.INSERT
          }
        );
        newRowIndex++;
      });
      this.setState({products: products, newRowIndex: newRowIndex});
      this.props.addProducts(products);
    };

    render () {
      return (
        <ImportDialogBase convertCSV={this.convertCSV} convertXML={this.convertXML} {...this.props}/>
      );
    }
}

ImportProductsDialog.propTypes = {
  closeImportDialog: PropTypes.func.isRequired,
  importDialogOpen: PropTypes.bool.isRequired,
  importNumber: PropTypes.number.isRequired,
  categories: PropTypes.array.isRequired,
  year: PropTypes.number.isRequired,
  addProducts: PropTypes.func.isRequired
};

export default connect(null, {
  push,
  showNotification

})(withStyles(styles, {withTheme: true})(ImportProductsDialog));
