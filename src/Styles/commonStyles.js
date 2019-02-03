const styles = theme => ({
  main: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    lineHeight: '1.428571429',
    '& *, &:before, &:after': {
      boxSizing: 'border-box'
    },
    '& .widget-HeaderCell__value': {
      margin: 0,
      padding: 0
    },
    '& .react-grid-HeaderCell__draggable': {
      margin: 0,
      padding: 0
    }

  }

});
export default styles;
