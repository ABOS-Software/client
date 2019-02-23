import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  marker: {
    position: 'absolute',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    left: '-20px',
    top: -'20px',
    border: '5px solid #004336',
    borderRadius: '50%',
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#333',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    initialScale: '0.6',
    defaultScale: '1',
    hoveredScale: '1.15',
    hovered: 'false',
    stiffness: '320',
    damping: '7',
    precision: '0.001'
  }
});

class clusterMarker extends React.Component {
  render () {
    const {classes} = this.props;

    return (
      <div>

        <div className={classes.marker}>
          <div className={classes.text}>
            {this.props.numPoints}
          </div>
        </div>

      </div>
    );
  }
}

clusterMarker.defaultProps = {
  text: '0'

};
export default withStyles(styles)(clusterMarker);
