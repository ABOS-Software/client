import React from 'react';
import Card from '@material-ui/core/Card';
import DollarIcon from '@material-ui/icons/AttachMoney';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {translate} from 'react-admin';

import CardIcon from './CardIcon';

import styles from './styles';

const TotalSales = ({value, translate, classes}) => (
  <div className={classes.main}>
    <CardIcon Icon={DollarIcon} bgColor='#31708f'/>
    <Card className={classes.card}>
      <Typography className={classes.title} color='textSecondary'>
        {'Total Sales'}
      </Typography>
      <Typography variant='headline' component='h2'>
        {value}
      </Typography>
    </Card>
  </div>
);

export default translate(withStyles(styles)(TotalSales));
