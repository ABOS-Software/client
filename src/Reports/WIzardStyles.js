import commonStyles from '../Styles/commonStyles';

export const styles = theme => ({
  main: commonStyles(theme).main,
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
