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
    }

  },
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 24,
    marginRight: 24,
    position: 'relative'
  },
  instructions: {
    padding: 8 * 3
  }

});
