import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {ContextMenu, ContextMenuTrigger, MenuItem, SubMenu} from "react-contextmenu";

// Create the context menu.
// Use this.props.rowIdx and this.props.idx to get the row/column where the menu is shown.
class ProductsContextMenu extends React.Component {
    static propTypes = {
        onRowDelete: PropTypes.func.isRequired,
        onRowInsertAbove: PropTypes.func.isRequired,
        onRowInsertBelow: PropTypes.func.isRequired,
        rowIdx: PropTypes.number,
        idx: PropTypes.number,
        id: PropTypes.string.isRequired
    };

    onRowDelete = (e, data) => {
        if (typeof(this.props.onRowDelete) === 'function') {
            this.props.onRowDelete(e, data);
        }
    };

    onRowInsertAbove = (e, data) => {
        if (typeof(this.props.onRowInsertAbove) === 'function') {
            this.props.onRowInsertAbove(e, data);
        }
    };

    onRowInsertBelow = (e, data) => {
        if (typeof(this.props.onRowInsertBelow) === 'function') {
            this.props.onRowInsertBelow(e, data);
        }
    };

    render() {
        const {idx, id, rowIdx} = this.props;

        return (
            <ContextMenu id={id}>
                <MenuItem data={{rowIdx, idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>
                {/* <SubMenu title="Insert Row">
                    <MenuItem data={{rowIdx, idx}} onClick={this.onRowInsertAbove}>Above</MenuItem>
                    <MenuItem data={{rowIdx, idx}} onClick={this.onRowInsertBelow}>Below</MenuItem>
                </SubMenu>*/}
            </ContextMenu>
        );
    }
}

export default ProductsContextMenu