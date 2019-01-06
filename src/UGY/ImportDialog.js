import React from "react";
import Wizard from "../Reports/Wizard";
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
/*import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';*/
import parse from 'csv-parse/lib/sync';
import convert from 'xml-js';

import {
    BooleanInput,
    CREATE,
    fetchUtils,
    FileField,
    FileInput,
    FormDataConsumer,
    GET_LIST,
    ImageField,
    ImageInput,
    ReferenceArrayInput,
    ReferenceInput,
    required,
    SelectArrayInput,
    SelectInput,
    showNotification,
    SimpleForm,
    TextInput
} from 'react-admin';
import {rowStatus} from "./ProductsGrid";

const importSteps = () => [
    "Import Type", "File Selection"
];
const requiredValidate = required();
const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
    <SelectInput onChange={(event, key, payload) => {
        onChangeCustomHandler(key)
    }}
                 {...rest}
    />
);
const formValidate = required();
const styles = theme => ({});
const convertFileToText = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
class ImportDialog extends React.Component {
    state = {
        action: '',
        importType: '',
        products: [],
        newRowIndex: 0,
        categories: []
    };

    updateAction = (value) => {
        this.setState({action: value})
    };

    setImportType = type => {
        this.setState({importType: type})

    };
    import = (record, redirect) => {
        let newRowIndex = this.state.newRowIndex;
        let products = [];
        if (record.action === 'CSV') {
            convertFileToText(record.file).then(input => {

                let records = parse(input, {columns: true, quote: false, delimiter: ';', relax: true});
                let newRowIndex = this.state.newRowIndex;
                let products = [];
                records.forEach(product => {
                    let cat = (this.props.categories.find(cat => cat.name === product.Category) || {id: -1}).id;
                    products.push(
                        {
                            humanProductId: product.ProductID,
                            id: 'i-' + this.props.importNumber + '-' + newRowIndex,
                            year: {id: this.props.year},
                            productName: product.ProductName,
                            unitSize: product.Size,
                            unitCost: product.UnitCost,
                            category: cat,
                            status: rowStatus.INSERT
                        }
                    );
                    newRowIndex++;
                });
                this.setState({products: products, newRowIndex: newRowIndex});
                this.props.addProducts(products);

            });
        } else {
            convertFileToText(record.file).then(input => {
                let records = convert.xml2js(input, {compact: true});
                let newRowIndex = this.state.newRowIndex;
                let products = [];
                let categories = [];
                /*records.categories.forEach(cat => {
                    categories.push({
                        categoryName: cat.categoryName,
                        deliveryDate: cat.deliveryDate,
                        id: 'i-' + this.props.importNumber + '-' + newRowIndex,

                    })
                });*/
                let recordsProds = [];

                if (records.Export.Products) {
                    recordsProds = records.Export.Products;
                    recordsProds.forEach(product => {
                        let cat = (this.props.categories.find(cat => cat.name === (product.category._text)) || {id: -1}).id;
                        products.push(
                            {
                                humanProductId: product.humanProductId._text,
                                id: 'i-' + this.props.importNumber + '-' + newRowIndex,
                                year: {id: this.props.year},
                                productName: product.productName._text,
                                unitSize: product.unitSize._text,
                                unitCost: product.unitCost._text,
                                category: cat,
                                status: rowStatus.INSERT
                            }
                        );
                        newRowIndex++;
                    });
                } else if (records.LawnGarden && records.LawnGarden.Products) {
                    recordsProds = records.LawnGarden.Products;
                    recordsProds.forEach(product => {
                        let cat = (this.props.categories.find(cat => cat.name === (product.Category._text)) || {id: -1}).id;
                        products.push(
                            {
                                humanProductId: product.ProductID._text,
                                id: 'i-' + this.props.importNumber + '-' + newRowIndex,
                                year: {id: this.props.year},
                                productName: product.ProductName._text,
                                unitSize: product.Size._text,
                                unitCost: product.UnitCost._text,
                                category: cat,
                                status: rowStatus.INSERT
                            }
                        );
                        newRowIndex++;
                    });
                }

                this.setState({products: products, newRowIndex: newRowIndex, categories: categories});
                this.props.addProducts(products);
            });
        }
        this.setState({
            action: '',
            importType: '',
            products: [],
            categories: []
        });

    };
    showStep = (step) => {
        return true;
    };

    finalStepsContent() {
        this.setState({
                importStepsContent: [

                    [
                        <CustomSelectInput
                            source="action" choices={[{id: 'CSV', name: 'Import From CSV'}, {
                            id: 'XML',
                            name: 'Import From XML'
                        }]} validate={requiredValidate} onChangeCustomHandler={(key) => this.setImportType(key)}/>

                    ]
                        [<Typography>Please wait while the products are imported</Typography>,
                        <LinearProgress/>]


                ]
            }
        )
    }
    stepsContent() {

        this.setState({
                importStepsContent: [

                    [
                        <CustomSelectInput
                            source="action" choices={[{id: 'CSV', name: 'Import From CSV'}, {
                            id: 'XML',
                            name: 'Import From XML'
                        }]} validate={requiredValidate} onChangeCustomHandler={(key) => this.setImportType(key)}/>

                    ], [<FileInput source="file" label="Import File">
                        <FileField source="src" title="title"/>
                    </FileInput>

                    ]


                ]
            }
        )
    }

    componentWillMount() {
        this.stepsContent();
    }

    render() {
        return (
            <Dialog
                key={"importDialog"}
                open={this.props.importDialogOpen}
                onClose={this.props.closeImportDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <Wizard {...this.props} steps={importSteps()} stepContents={this.state.importStepsContent}
                            save={this.import}
                            formName={"record-form"}/>
                </DialogContent>

            </Dialog>
        )
    }
}

ImportDialog.propTypes = {
    /*    closeImportDialog: PropTypes.func.required,
        importDialogOpen: PropTypes.bool.required,
        importNumber: PropTypes.number.required,
        categories: PropTypes.array.required,
        year: PropTypes.number.required,
        addProducts: PropTypes.func.required*/
};

export default connect(null, {
    push,
    showNotification,

})(withStyles(styles, {withTheme: true})(ImportDialog));