import React from 'react';
import {
    addField,
    BooleanInput,
    fetchUtils,
    FormDataConsumer,
    GET_LIST,
    ImageField,
    ImageInput,
    required,
    SelectArrayInput,
    SelectInput,
    TextInput
} from 'react-admin';
import {withStyles} from "@material-ui/core";
import {change} from 'redux-form';
import AddressInput from '../resources/Customers/addressInput';

import Wizard from './Wizard'
import download from 'downloadjs';
import restClient from "../grailsRestClient";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Divider from "@material-ui/core/Divider/Divider";
import Typography from "@material-ui/core/Typography/Typography";
import hostURL from "../host";

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = restClient;

const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
    <SelectInput onChange={(event, key, payload) => {
        onChangeCustomHandler(key)
    }}
                 {...rest}
    />
);
const AddrInput = addField(({input, meta: {touched, error}, updateAddress, ...props}) => (
    <AddressInput updateAddress={address => {
        console.log(address);
        updateAddress(address)
    }}/>
));

const steps = () => [
    "Pick Report Template", "Fill In Details"
];
const convertFileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const requiredValidate = required();

const formValidate = required();
const styles = {
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
        alignItems: 'center',
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
class reportsWizard extends React.Component {
    //users: {}, years: {}, customers: {}
    state = {update: false, address: '', zipCode: '', city: '', state: '', updateAddress: 0};

    constructor(props) {
        super(props);

    }


    save = (record, redirect) => {
        console.log(record);
        let options = {};
        let url = hostURL + '/reports';
        if (!options.headers) {
            options.headers = new Headers({Accept: 'application/pdf'});
        }
        const token = localStorage.getItem('token');
        options.headers.set('Authorization', `${token}`);
        if (record.LogoLocation) {
            convertFileToBase64(record.LogoLocation).then(b64 => {
                    record.LogoLocation.base64 = b64;
                    fetch(url, {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "same-origin", // include, same-origin, *omit
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                            'Authorization': `${token}`
                            // "Content-Type": "application/x-www-form-urlencoded",
                        },
                        redirect: "follow", // manual, *follow, error
                        referrer: "no-referrer", // no-referrer, *client
                        body: JSON.stringify(record),
                    }).then(response => {
                        let filename = "report.pdf";
                        const disposition = response.headers.get("content-disposition");
                        if (disposition && disposition.indexOf('attachment') !== -1) {
                            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            let matches = filenameRegex.exec(disposition);
                            if (matches != null && matches[1]) {
                                filename = matches[1].replace(/['"]/g, '');
                            }
                        }
                        response.blob().then(blob => {
                            download(blob, filename, "application/pdf")
                        })
                    })
                }
            )
        } else {
            fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin", // include, same-origin, *omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    'Authorization': `${token}`
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(record),
            }).then(response => {
                let filename = "report.pdf";
                const disposition = response.headers.get("content-disposition");
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                response.blob().then(blob => {
                    download(blob, filename, "application/pdf")
                })
            })
        }


        //console.log(fetchUtils.fetchJson(url, options));

    };

    updateIncludeSub = (event, key, payload) => {
        this.setState({includeSubUser: key, update: true});

    };

    getCustomersWithYearAndUser(Year, User, includeSub) {

        dataProvider(GET_LIST, 'customers', {
            filter: {year: Year, user_id: User, includeSub: includeSub},
            sort: {field: 'id', order: 'DESC'},
            pagination: {page: 1, perPage: 1000},
        }).then(response => {
            this.setState({customers: response.data})
        })

    }


    getCategoriesForYear(Year) {
        // this.setState({year: Year});

        dataProvider(GET_LIST, 'Categories', {
            filter: {year: Year},
            sort: {field: 'id', order: 'DESC'},
            pagination: {page: 1, perPage: 1000},
        }).then(response => {
            response.data.unshift({id: 'All', categoryName: 'All'});
            this.setState({categories: response.data})
        })


    }

    getUsers() {
        dataProvider(GET_LIST, 'User', {
            filter: {},
            sort: {field: 'id', order: 'DESC'},
            pagination: {page: 1, perPage: 1000},
        }).then(response => {
            this.setState({users: response.data})
        })


    }

    getYears() {
        dataProvider(GET_LIST, 'Years', {
            filter: {},
            sort: {field: 'id', order: 'DESC'},
            pagination: {page: 1, perPage: 1000},
        }).then(response => {
            this.setState({years: response.data})
        })


    }

    updateYear(year) {
        this.setState({year: year, update: true});
        // this.updateChoices();

    }

    updateUser(user) {
        this.setState({user: user, update: true});
        // this.updateChoices();
    }

    getCustomersWithUser(User, includeSub) {

        dataProvider(GET_LIST, 'customers', {
            filter: {user_id: User, includeSub: includeSub},
            sort: {field: 'id', order: 'DESC'},
            pagination: {page: 1, perPage: 1000},
        }).then(response => {
            response.data.reduceRight((acc, obj, i) => {
                acc[obj.customerName] ? response.data.splice(i, 1) : acc[obj.customerName] = true;
                return acc;
            }, Object.create(null));

            //response.data.sort((a, b) => b.customerName - a.customerName);
            this.setState({customers: response.data})
        })
    }

    updateReportType(ReportType) {
        switch (ReportType) {
            case 'customers_split':
                this.setState({
                    reportType: ReportType,
                    yearReq: true,
                    userReq: true,
                    custReq: false,
                    catReq: true,
                    dueReq: true
                });

                break;
            case 'Year Totals':
                this.setState({
                    reportType: ReportType,
                    yearReq: true,
                    userReq: true,
                    custReq: false,
                    catReq: true,
                    dueReq: true
                });

                break;
            case 'Customer Year Totals':
                this.setState({
                    reportType: ReportType,
                    yearReq: true,
                    userReq: true,
                    custReq: true,
                    catReq: true,
                    dueReq: true
                });

                break;
            case 'Customer All-Time Totals':
                this.setState({
                    reportType: ReportType,
                    yearReq: false,
                    userReq: true,
                    custReq: true,
                    catReq: false,
                    dueReq: false
                });

                break;
        }

        // this.updateChoices();
    }

    updateAddress = (address) => {
        let addressObj = {address: '', zipCode: '', city: '', state: '', bldgNum: '', street: ''};
        for (let i = 0; i < address.address_components.length; i++) {
            let addressType = address.address_components[i].types[0];
            let val = address.address_components[i]['short_name'];

            switch (addressType) {
                case "street_address":
                    addressObj.address = val;
                    break;
                case "street_number":
                    addressObj.bldgNum = val;

                    break;
                case "route":
                    addressObj.street = val;

                    break;
                case "locality":
                    addressObj.city = val;

                    break;
                case "administrative_area_level_1":
                    addressObj.state = val;

                    break;
                case "country":

                    break;
                case "postal_code":
                    addressObj.zipCode = val;

                    break;
                case "postal_town":
                    addressObj.city = val;

                    break;
                case "sublocality_level_1":
                    addressObj.city = val;

                    break;
            }

        }
        if (!addressObj.address) {
            addressObj.address = addressObj.bldgNum + ' ' + addressObj.street;
        }
        this.setState({...addressObj, updateAddress: 1});
    };

    updateChoices() {
        if (this.state.update) {
            const year = this.state.year;
            const user = this.state.user;
            const includeSub = this.state.includeSubUser;
            if ((year && user) > -1) {
                this.getCustomersWithYearAndUser(year, user, includeSub);

            }
            if (year) {
                this.getCategoriesForYear(year);

            }
            if (user && this.state.reportType === 'Customer All-Time Totals') {
                this.getCustomersWithUser(user, includeSub);

            }
            this.setState({update: false})

        }
    }
    stepsContent() {
        const {classes} = this.props;
        this.setState({
            stepsContent: [<CustomSelectInput
                source="template" choices={[{id: 'customers_split', name: 'Year; Split by Customer'}, {
                    id: 'Year Totals',
                    name: 'Year Totals'
                }, {id: 'Customer Year Totals', name: 'Customer Year Totals'}, {
                    id: 'Customer All-Time Totals',
                    name: 'Customer All-Time Totals'
            }]} validate={requiredValidate} onChangeCustomHandler={(key) => this.updateReportType(key)}/>,
                    [
                        <TextInput
                            source="Scout_name" validate={requiredValidate}/>,
                        <div className={classes.addressContainerLabeled}>
                            <FormLabel variant={"headline"}>Search For Address</FormLabel>
                            <AddrInput updateAddress={this.updateAddress}/>
                        </div>,
                        <div className={classes.dividerContainer}>
                            <Divider className={classes.halfDivider}/>
                            <Typography className={classes.orText}>OR</Typography>
                            <Divider className={classes.halfDivider}/>

                        </div>,
                        <FormDataConsumer className={classes.addressComponent}>
                            {({formData, ...rest}) => {

                                if (this.state.updateAddress === 1) {
                                    this.setState({updateAddress: 0});
                                    rest.dispatch(change('record-form', "Scout_address", this.state.address));
                                    rest.dispatch(change('record-form', "Scout_Town", this.state.city));
                                    rest.dispatch(change('record-form', "Scout_State", this.state.state));
                                    rest.dispatch(change('record-form', "Scout_Zip", this.state.zipCode));
                                }
                                return (


                                    <div className={classes.addressContainerLabeled}>
                                        <FormLabel variant={"headline"}>Enter an Address manually</FormLabel>
                                        <div className={classes.addressContainer}>

                                            <TextInput source="Scout_address" className={classes.addressComponent}
                                                       value={this.state.address} validate={requiredValidate}/>


                                            <TextInput source="Scout_Town" className={classes.addressComponent}
                                                       validate={requiredValidate}/>
                                            <TextInput source="Scout_State" className={classes.addressComponent}
                                                       validate={requiredValidate}/>
                                            <TextInput source="Scout_Zip" className={classes.addressComponent}
                                                       validate={requiredValidate}/>
                                        </div>
                                    </div>
                                )
                            }}
                        </FormDataConsumer>,

                        <TextInput
                            source="Scout_Phone" validate={requiredValidate}/>,
                        <TextInput
                            source="Scout_Rank" validate={requiredValidate}/>,
                        <ImageInput
                            source="LogoLocation" accept="image/*">
                            <ImageField source="src" title="title"/>
                        </ImageInput>,

                        <FormDataConsumer>
                            {({formData, ...rest}) => {
                                if (this.state.yearReq) {
                                    return (
                                        <CustomSelectInput source={"Year"} label="Year" optionText="year"
                                                           optionValue="id" choices={this.state.years}
                                                           onChangeCustomHandler={(key) => this.updateYear(key)}
                                                           validate={requiredValidate}  {...rest}/>
                                    )
                                }
                            }}
                        </FormDataConsumer>,
                        <FormDataConsumer>
                            {({formData, ...rest}) => {
                                if (this.state.userReq) {

                                    return [<CustomSelectInput label="User" source="User" key="UserComboBox"
                                                               optionText={"fullName"}
                                                               optionValue={"id"}
                                                               choices={this.state.users}  {...rest}
                                                               onChangeCustomHandler={(key) => this.updateUser(key)}
                                                               validate={requiredValidate}/>,
                                        <BooleanInput key="Include_Sub_Users"
                                                      source="Include_Sub_Users" onChange={this.updateIncludeSub}/>]
                                }
                            }
                            }
                        </FormDataConsumer>,



                        <FormDataConsumer>
                            {({formData, ...rest}) => {
                                if (this.state.year && this.state.catReq) {
                                    //console.log(this.state.year);

                                    return <SelectInput source="Category" optionText={"categoryName"}
                                                        optionValue={"categoryName"}
                                                        choices={this.state.categories} {...rest}
                                                        validate={requiredValidate}/>


                                }

                            }
                            }
                        </FormDataConsumer>,

                        <FormDataConsumer>
                            {({formData, ...rest}) => {

                                if ((this.state.year && this.state.user && this.state.custReq) || (this.state.reportType === 'Customer All-Time Totals' && this.state.user && this.state.custReq)) {
                                    return <SelectArrayInput source="Customer" optionText={"customerName"}
                                                             optionValue={"id"} choices={
                                        this.state.customers} {...rest} validate={requiredValidate}/>


                                }
                            }
                            }
                        </FormDataConsumer>,

                        <FormDataConsumer>
                            {({formData, ...rest}) => {
                                if (this.state.dueReq) {
                                    return <BooleanInput
                                        source="Print_Due_Header"/>
                                }
                            }}
                        </FormDataConsumer>

                    ]]
            }
        )
    }

    componentWillReceiveProps() {
        this.getUsers();
        this.getYears();

    }

    componentWillMount() {
        this.stepsContent();

    }

    render() {

        this.updateChoices();
        return (
            <Wizard {...this.props} steps={steps()} stepContents={this.state.stepsContent} save={this.save}
                    formName={"record-form"}/>
        )
    }
}

export default withStyles(styles)(reportsWizard);

