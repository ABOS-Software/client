import React from 'react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import {FormDataConsumer, FormTab} from 'react-admin';
import ProductsGrid from '../Products/ProductsGrid';
import {withStyles} from '@material-ui/core';

const styles = () => ({});

class OrderTab extends React.Component {
  state = {};
  renderRunningTotal () {
    const {classes, ...props} = this.props;

    return <FormDataConsumer {...props}>
      {({formData, ...rest}) => {
        if (!formData.order) {
          formData.order = {
            cost: '0',
            delivered: false
          };
        }
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
          // the default value for minimumFractionDigits depends on the currency
          // and is usually already 2
        });

        return (<Typography
            variant={'h6'}
          >
            Running Total: {formatter.format(formData.order.cost)}
          </Typography>
        );
      }
      }
    </FormDataConsumer>;
  }

  renderPropsGrid (props) {
    return <FormDataConsumer {...props}>
      {({formData, ...rest}) => {
        if (!formData.order) {
          formData.order = {
            amountPaid: '0',
            delivered: false
          };
        }
        if (this.props.edit) {
          return (<ProductsGrid source='order' {...props} {...rest} amountPaid={formData.order.amountPaid}
                                delivered={formData.order.delivered}/>);
        } else if (formData.year) {
          return (<ProductsGrid source='order' {...props} year={formData.year} {...rest}
                                amountPaid={formData.order.amountPaid} delivered={formData.order.delivered}/>);
        }
      }
      }
    </FormDataConsumer>;
  }
  render () {
    return <FormTab label={"Order"} path={"order"} {...this.props}>
      {this.renderRunningTotal()}
      {this.renderPropsGrid()}
    </FormTab>
  }

}

OrderTab.propTypes = {
  edit: PropTypes.bool
};

export default (withStyles(styles, {withTheme: true})(OrderTab));

