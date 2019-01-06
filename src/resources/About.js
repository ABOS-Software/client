import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { translate, changeLocale, Title } from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography/Typography";

const styles = {
    label: { width: '10em', display: 'inline-block' },
    button: { margin: '1em' },
};

const About = ({
                           classes,

                       }) => (
    <Card>
        <Title title={"About"} />
        <CardContent>
            <Typography>Version 2.3.1</Typography>
        </CardContent>
        <CardContent>
            <div className={classes.label}>Licensing</div>
            <Typography>Both the server and client are licensed under the AGPLv3.</Typography>
            <Typography>More details about the software used can be found <a href={"https://abos-software.gitlab.io/License"}>here</a></Typography>

        </CardContent>
    </Card>
);



export default withStyles(styles)(About);