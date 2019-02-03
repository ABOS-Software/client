import React from 'react';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {translate} from 'react-admin';
import styles from './styles';
import CardIcon from './CardIcon';

const Donations = ({value, translate, classes}) => (
  <div className={classes.main}>
    <CardIcon Icon={ShoppingCartIcon} bgColor='#ff9800'/>
    <Card className={classes.card}>
      <Typography className={classes.title} color='textSecondary'>
        {'Donations'}
      </Typography>
      <Typography variant='headline' component='h2'>
        {value}
      </Typography>
    </Card>
  </div>
);

export default translate(withStyles(styles)(Donations));
