import CurrencyFormatter from '../../Formatters/CurrencyFormatter';
import MUINumberEditor from '../../Editors/MUINumberEditor';

export function getColumns () {
  return [
    {
      key: 'humanProductId',
      name: 'ID',
      resizable: true

    },
    {
      key: 'productName',
      name: 'Name',
      editable: false,
      resizable: true
    },
    {
      key: 'unitSize',
      name: 'Size',
      editable: false,
      resizable: true
    },
    {
      key: 'unitCost',
      name: 'Unit Cost',
      editable: false,
      formatter: CurrencyFormatter,
      resizable: true
    },
    {
      key: 'quantity',
      name: 'Quantity',
      editable: false,
      editor: MUINumberEditor,
      resizable: true
    },
    {
      key: 'extended_cost',
      name: 'Extended Cost',
      editable: false,
      formatter: CurrencyFormatter,
      resizable: true

    }
  ];
}
