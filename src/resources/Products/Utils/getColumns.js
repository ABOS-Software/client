import CurrencyFormatter from '../../Formatters/CurrencyFormatter';
import MUINumberEditor from '../../Editors/MUINumberEditor';

function getHumanProductIdColumn () {
  return {
    key: 'humanProductId',
    name: 'ID',
    resizable: true

  };
}

function getProductNameColumn () {
  return {
    key: 'productName',
    name: 'Name',
    editable: false,
    resizable: true
  };
}

function getSizeColumn () {
  return {
    key: 'unitSize',
    name: 'Size',
    editable: false,
    resizable: true
  };
}

function getCostColumn () {
  return {
    key: 'unitCost',
    name: 'Unit Cost',
    editable: false,
    formatter: CurrencyFormatter,
    resizable: true
  };
}

function getQuantityColumn () {
  return {
    key: 'quantity',
    name: 'Quantity',
    editable: true,
    editor: MUINumberEditor,
    resizable: true
  };
}

function getExtendedCostColumn () {
  return {
    key: 'extended_cost',
    name: 'Extended Cost',
    editable: false,
    formatter: CurrencyFormatter,
    resizable: true

  };
}

export function getColumns () {
  return [
    getHumanProductIdColumn(),
    getProductNameColumn(),
    getSizeColumn(),
    getCostColumn(),
    getQuantityColumn(),
    getExtendedCostColumn()
  ];
}
