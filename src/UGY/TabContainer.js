import React from "react";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

export function TabContainer(props) {
  return (
    <Typography component='div' {...props}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};