import React from 'react';
import {Datagrid, DateField, FormTab, ReferenceManyField, TextField} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import NoteCreateButton from './NoteCreateButton';
import NoteEditButton from './NoteEditButton';

const styles = () => ({});

class NotesTab extends React.Component {
  state = {};

  render () {
    return <FormTab label='Notes Log' {...this.props}>

      <ReferenceManyField
        addLabel={false}
        sort={{field: 'updated_at', order: 'DESC'}}
        reference='Notes'
        target='customer_id'
      >
        <Datagrid>

          <TextField label='Note' source='note'/>
          <TextField label='Code' source='note_code.name'/>
          <DateField label='Last Updated' source='updated_at'/>
          <NoteEditButton/>
        </Datagrid>
      </ReferenceManyField>
      <NoteCreateButton/>
    </FormTab>;
  }
}

NotesTab.propTypes = {};

export default (withStyles(styles, {withTheme: true})(NotesTab));
