export const styles = {
  flex: {display: 'flex'},
  flexColumn: {display: 'flex', flexDirection: 'column'},
  leftCol: {flex: 1, marginRight: '1em'},
  rightCol: {flex: 1, marginLeft: '1em'},
  singleCol: {marginTop: '2em', marginBottom: '2em'},
  inlineBlock: {display: 'inline-flex', marginRight: '1rem'},
  fullWidth: {width: '100%'},
  block: {display: 'block'},
  halfDivider: {
    flexGrow: 1,
    height: '2px',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  dividerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'middle',
    alignItems: 'center'
  },
  orText: {
    margin: '10px'
  },
  addressContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  },
  addressContainerLabeled: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column'
  },
  addressComponent: {
    flexGrow: '1',
    marginRight: '1rem'
  }
};
