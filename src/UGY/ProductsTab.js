import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import update from 'immutability-helper';
import ProductsGrid, {rowStatus} from './ProductsGrid';
import dataProvider from '../grailsRestClient';
import {GET_LIST} from 'react-admin';

const styles = () => ({});

class ProductsTab extends React.Component {
  state = {
    newProducts: [],
    updatedProducts: [],
    deletedProducts: [],
    categories: []

  };
  loadCategories = (yearId) => {
    let filter = {};
    if (yearId) {
      filter = {year: yearId};
    } else if (this.props.year) {
      filter = {year: this.props.year};
    }
    dataProvider(GET_LIST, 'Categories', {
      filter: filter,
      pagination: {page: 1, perPage: 100},
      sort: {field: 'id', order: 'DESC'}
    })
      .then(response =>
        response.data.reduce((stats, category) => {
          stats.categories.push({

            id: category.id,
            name: category.categoryName,
            value: category.categoryName

          });

          return stats;
        },
        {
          categories: []

        }
        )
      ).then(({categories}) => {
        categories.push({id: '-1', value: ' '});

        this.setState({
          categories: categories
        });
      }
      );
  };

  updateProductsState = (newState) => {
    this.setState(newState);
    this.props.updateProducts(newState);
  };

  handleAddProduct = (newProd) => {
    let parentState = update(this.state.newProducts, {
      $push: [newProd]
    });
    this.updateProductsState({newProducts: parentState});
  };

  handleUpdateProduct = (updated) => {
    let parentState;
    if (updated.status === rowStatus.UPDATE) {
      let index = this.state.updatedProducts.findIndex(prod => prod.id === updated.id);

      if (index > -1) {
        parentState = update(this.state.updatedProducts, {
          [index]: {$merge: updated}
        });
      } else {
        parentState = update(this.state.updatedProducts, {
          $push: [updated]
        });
      }
      this.updateProductsState({updatedProducts: parentState});
    } else {
      let index = this.state.newProducts.findIndex(prod => prod.id === updated.id);
      if (index > -1) {
        parentState = update(this.state.newProducts, {
          [index]: {$merge: updated}
        });
      } else {
        parentState = update(this.state.newProducts, {
          $push: [updated]
        });
      }
      this.updateProductsState({newProducts: parentState});
    }
  };

  handleDeleteProduct = (deleted) => {
    let parentState;

    if (deleted.status !== rowStatus.INSERT) {
      parentState = update(this.state.deletedProducts, {
        $push: [deleted]
      });
      this.updateProductsState({deletedProducts: parentState});
    } else {
      let index = this.state.newProducts.findIndex(prod => prod.id === deleted.id);
      let updated = {status: rowStatus.DELETE};
      parentState = update(this.state.newProducts, {
        [index]: {$merge: updated}
      });
      this.updateProductsState({newProducts: parentState});
    }
  };
  componentDidMount () {
    this.loadCategories();
  }
  componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.year !== prevProps.year) {
      this.loadCategories(this.props.year);
    }
  }
  render () {
    const {classes} = this.props;

    return (
      <div className={classes.productsGrid}>
        <div className={classes.fullHeightWidth}>
          <ProductsGrid year={this.props.year} yearText={this.props.yearText}
            addProduct={this.handleAddProduct} updateProduct={this.handleUpdateProduct}
            deleteProduct={this.handleDeleteProduct} categories={this.state.categories}/>
        </div>
      </div>
    );
  }
}

ProductsTab.PropTypes = {
  year: PropTypes.any,
  yearText: PropTypes.any,
  updateProducts: PropTypes.func
};

export default (withStyles(styles, {withTheme: true})(ProductsTab));
