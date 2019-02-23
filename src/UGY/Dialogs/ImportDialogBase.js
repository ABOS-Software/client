import React from 'react';
import Wizard from '../../Reports/Wizard';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {FileField, FileInput, required, SelectInput, showNotification} from 'react-admin';
import convert from 'xml-js';
import parse from 'csv-parse/lib/sync';

const importSteps = () => [
  'Import Type', 'File Selection'
];
const requiredValidate = required();
const CustomSelectInput = ({onChangeCustomHandler, ...rest}) => (
  <SelectInput onChange={(event, key, payload) => {
    onChangeCustomHandler(key);
  }} {...rest}/>
);
const styles = theme => ({});
const convertFileToText = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsText(file.rawFile);

  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});
class ImportDialogBase extends React.Component {
  state = {
    action: '',
    importType: '',
    users: []
  };

  setImportType = type => {
    this.setState({importType: type});
  };
  import = (record, redirect) => {
    const {convertCSV, convertXML} = this.props;
    console.log(this.props);
    if (record.action === 'CSV') {
      convertFileToText(record.file).then(input => {
        let records = parse(input, {columns: true, quote: false, delimiter: ';', relax: true});

        convertCSV(records);
      });
    } else {
      convertFileToText(record.file).then(input => {
        let records = convert.xml2js(input, {compact: true});

        convertXML(records);
      });
    }
    this.setState({
      action: '',
      importType: '',
      users: []
    });
  };

  stepsContent () {
    this.setState({
      importStepsContent: [

        [
          <CustomSelectInput
            source='action' choices={[{id: 'CSV', name: 'Import From CSV'}, {
              id: 'XML',
              name: 'Import From XML'
            }]} validate={requiredValidate} onChangeCustomHandler={(key) => this.setImportType(key)}/>

        ], [<FileInput source='file' label='Import File'>
          <FileField source='src' title='title'/>
        </FileInput>

        ]

      ]
    }
    );
  }

  componentWillMount () {
    this.stepsContent();
  }

  render () {
    return (
      <Dialog
        key={'importDialog'}
        open={this.props.importDialogOpen}
        onClose={this.props.closeImportDialog}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Import</DialogTitle>
        <DialogContent>
          <DialogContentText/>
          <Wizard {...this.props} steps={importSteps()} stepContents={this.state.importStepsContent}
            save={this.import}
            formName={'record-form'}/>
        </DialogContent>

      </Dialog>
    );
  }
}

ImportDialogBase.propTypes = {
  closeImportDialog: PropTypes.func.isRequired,
  importDialogOpen: PropTypes.bool.isRequired,
  convertXML: PropTypes.func.isRequired,
  convertCSV: PropTypes.func.isRequired
};

export default connect(null, {
  push,
  showNotification

})(withStyles(styles, {withTheme: true})(ImportDialogBase));
