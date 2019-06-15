export const styles = theme => ({
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
    },
    height: '100% !important',
    width: '100%'

  },
  dataGrid: {
    width: '100%'
  },
  'react-grid-Grid': {
    height: '100% !important'
  },
  contextMenu: {
    zIndex: 80000,
    backgroundColor: '#FFF'
  }

});
