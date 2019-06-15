import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Title} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import version from '../version';

const styles = {
  label: {width: '10em', display: 'inline-block'},
  button: {margin: '1em'}
};

const About = ({
  classes

}) => (
  <Card>
    <Title title={'About'}/>
    <CardContent>
      <Typography>Version {version}</Typography>
    </CardContent>
    <CardContent>
      <div className={classes.label}>Licensing</div>
      <Typography>Both the server and client are licensed under the MIT License.</Typography>
      <Typography>More details about the software used for the client can be found <a
        href={'/license-client.html'}>here</a></Typography>
      <Typography>More details about the software used for the server can be found <a
        href={'/license-server.html'}>here</a></Typography>
    </CardContent>
  </Card>
);

export default withStyles(styles)(About);
