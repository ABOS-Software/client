import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';

let optionPropType = PropTypes.shape({
    id: PropTypes.required,
    title: PropTypes.string
});

const styles = theme => ({
    select: {
        border: '0 !important',
        flexGrow: 1

    },
    wrapper: {
        display: 'flex',
        flexGrow: 1
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    menuItem: {}
});

class MUISelectEditorRaw extends React.Component {

    static propTypes = {
        onChange: PropTypes.func,

        value: PropTypes.any,
        height: PropTypes.number,

        onKeyDown: PropTypes.func,

    };

    static defaultProps = {
        resultIdentifier: 'id'
    };

    state = {
        open: true,

    };
    handleClose = () => {
        this.setState({open: false});
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    /*
        getLabel = (item: any): string => {
            let label = this.props.label != null ? this.props.label : 'title';
            if (typeof label === 'function') {
                return label(item);
            } else if (typeof label === 'string') {
                return item[label];
            }
        };

        hasResults = (): boolean => {
            return this.autoComplete.state.results.length > 0;
        };

        isFocusedOnSuggestion = (): boolean => {
            let autoComplete = this.autoComplete;
            return autoComplete.state.focusedValue != null;
        };

        constuctValueFromParams = (obj: any, props: ?Array<string>) => {
            if (!props) {
                return '';
            }

            let ret = [];
            for (let i = 0, ii = props.length; i < ii; i++) {
                ret.push(obj[props[i]]);
            }
            return ret.join('|');
        };*/
    renderOptions(): Array<ReactElement> {
        let options = [];
        //options.push(<MenuItem value={-1}/>);

        this.props.options.forEach(function (name) {
            if (typeof(name) === 'string') {
                options.push(<option key={"category-dropDown-" + name} value={name}>{name}</option>);
            } else {
                options.push(<option key={"category-dropDown-" + name.id}
                                     value={name.id}>{name.text || name.value || name.name}</option>);
            }
        }, this);
        return options;
    }


    render(): ?ReactElement {
        const {classes} = this.props;
        return (<div onKeyDown={this.props.onKeyDown} className={classes.wrapper}>
            <Select
                //open={true}
                //defaultValue={this.props.value}
                open
                native
                value={this.props.value}
                onChange={this.props.onChange}
                inputProps={{
                    name: 'category',
                    id: 'category-simple',
                }}

                /*               name= 'category'
                               id ='category-simple'*/

                className={classes.select}
            >
                {this.renderOptions()}
            </Select>

        </div>);
    }

}

export default (withStyles(styles, {withTheme: true})(MUISelectEditorRaw));