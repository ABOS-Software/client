import React from 'react';
import compose from 'recompose/compose';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import {translate} from 'react-admin';

const style = theme => ({
    root: {
        flex: 1,
    },
    avatar: {
        background: theme.palette.background.avatar,
    },
    cost: {
        marginRight: '1em',
        color: theme.palette.text.primary,
    },
});

const OrderedProducts = ({OrderedProducts = [], translate, classes}) => (
    <Card className={classes.root}>
        <CardHeader title={'Ordered Stuff'}/>
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell numeric>Quantity</TableCell>
                    <TableCell numeric>Unit Cost</TableCell>
                    <TableCell numeric>Extended Cost</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {OrderedProducts.map(record => {
                    return (
                        <TableRow key={record.pID}>
                            <TableCell component="th" scope="row">
                                {record.pID}
                            </TableCell>
                            <TableCell>{record.productName}</TableCell>
                            <TableCell numeric>{record.quantity}</TableCell>
                            <TableCell numeric>{record.unitCost}</TableCell>
                            <TableCell numeric>{record.extendedCost}</TableCell>
                        </TableRow>
                    );

                })}

            </TableBody>
        </Table>

    </Card>
);

const enhance = compose(
    withStyles(style),
    translate
);

export default enhance(OrderedProducts);
