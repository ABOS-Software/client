import React from 'react';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {translate} from 'react-admin';

import CardIcon from './CardIcon';

const styles = {
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
        minHeight: 52,
    },
};

const Commissions = ({value, translate, classes}) => (
    <div className={classes.main}>
        <CardIcon Icon={ShoppingCartIcon} bgColor="#ff9800"/>
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.new_orders')}
            </Typography>
            <Typography variant="headline" component="h2">
                {value}
            </Typography>
        </Card>
    </div>
);

export default translate(withStyles(styles)(Commissions));
