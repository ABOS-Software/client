import React from 'react';
// import mapPropsOnChange from 'recompose/mapPropsOnChange';
//import { Motion } from 'react-motion';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    marker: {
        backgroundImage: 'url(' + process.env.PUBLIC_URL + '/mapIcon.svg' + ')',
        position: 'absolute',
        cursor: 'pointer',
        width: '49px',
        height: '64px',
        top: '-64px',
        left: '-24.5px',
        transformOrigin: '24.5px 64px',
        margin: '0',
        padding: '0',


        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    text: {
        top: '-64px',
        left: '-24.5px',
        transformOrigin: '24.5px 64px',
    }
});

class simpleMarker extends React.Component {
    render() {
        const {
            classes,
            defaultMotionStyle, motionStyle, text, onClick
        } = this.props;
        return (
            <div onClick={onClick}>

                <div className={classes.marker}>
                    <div className={classes.text}>
                        {text}
                    </div>
                </div>


            </div>
        );
    }
}

simpleMarker.defaultProps = {
    initialScale: 0.3,
    defaultScale: 0.6,
    hoveredScale: 0.7,
};

export default withStyles(styles, {withTheme: true})(simpleMarker);


