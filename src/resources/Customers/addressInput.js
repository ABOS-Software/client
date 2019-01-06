import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';

const styles = {
    dropDownFooterImage: {
        display: 'inline-block',
        width: '150px'
    },

    dropDownFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '4px',
    },
    suggesionItem: {},
    activeSuggesionItem: {},
    autoCompleteDropdown: {},
    locationInput: {},
};

class AddressInput extends React.Component {
    handleChange = address => {
        this.setState({address});
    };
    handleSelect = (address, placeId) => {
        let request = {
            placeId: placeId,
            sessionToken: this.state.sessionToken
        };

        new window.google.maps.places.PlacesService(document.createElement('div')).getDetails(request, (place, status) => {
            if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                this.props.updateAddress(place);
            } else {
            }
        });

        this.updateSessionToken();


    };
    updateSessionToken = () => {
        let sessionToken = new window.google.maps.places.AutocompleteSessionToken();
        this.setState({sessionToken: sessionToken});
    };

    constructor(props) {
        super(props);
        this.state = {address: ''};
    }

    componentWillMount() {
        this.updateSessionToken();
    }

    render() {
        const {classes} = this.props;
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={{sessionToken: this.state.sessionToken}}
            >
                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                    <div>
                        <TextField
                            InputProps={{
                                ...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: classes.locationInput,
                                })
                            }}
                            fullWidth

                        />
                        {suggestions.length > 0 && (
                            <Paper className={classes.autoCompleteDropdown}>
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? classes.activeSuggesionItem
                                        : classes.suggesionItem;
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                        : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <MenuItem>
                                                <strong>
                                                    {suggestion.formattedSuggestion.mainText + ' '}
                                                </strong>
                                                <strong> </strong>
                                                <small>
                                                    {suggestion.formattedSuggestion.secondaryText}
                                                </small>
                                            </MenuItem>
                                        </div>
                                    );
                                })}
                                <div className={classes.dropDownFooter}>
                                    <div>
                                        <img
                                            src={process.env.PUBLIC_URL + '/powered_by_google_on_white_hdpi.png'}
                                            className={classes.dropDownFooterImage}
                                        />
                                    </div>
                                </div>
                            </Paper>
                        )}
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

AddressInput.PropTypes = {
    updateAddress: PropTypes.func
};

export default withStyles(styles)(AddressInput)