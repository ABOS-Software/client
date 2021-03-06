import React from 'react';

import {Edit, TabbedForm} from 'react-admin';
import PaymentsTab from './PaymentTab';
import InfoTab from './InfoTab';
import OrderTab from './OrderTab';
import NotesTab from './NotesTab';

class CustomerEdit extends React.Component {
  render () {
    const {...props} = this.props;

    return (
      <Edit {...props}>

        <TabbedForm submitOnEnter={false}>
          <InfoTab edit/>
          <OrderTab edit path={'orders'}/>
          <PaymentsTab path={'payments'}/>
          <NotesTab path={'notes'}/>

        </TabbedForm>
      </Edit>
    );
  }
}

export default CustomerEdit;
