import React from 'react';

import CurrencyFormatter from '../resources/Formatters/CurrencyFormatter';
import MUITextEditor from '../resources/Editors/MUITextEditor';
import MUICurrencyEditor from '../resources/Editors/MUICurrencyEditor';
import DropDownFormatter from '../resources/Formatters/DropDownFormatter';

import Editor from '../resources/Editors/Editor';

function humanIdColumn () {
  return {
    key: 'humanProductId',
    name: 'ID',
    editable: true,
    resizable: true,
    filterable: true,
    editor: MUITextEditor

  };
}

function productNameColumn () {
  return {
    key: 'productName',
    name: 'Name',
    editable: true,
    resizable: true,
    filterable: true,
    editor: MUITextEditor

  };
}

function unitSizeColumn () {
  return {
    key: 'unitSize',
    name: 'Size',
    editable: true,
    resizable: true,
    filterable: true,
    editor: MUITextEditor

  };
}

function unitCostColumn () {
  return {
    key: 'unitCost',
    name: 'Unit Cost',
    editable: true,
    formatter: CurrencyFormatter,
    resizable: true,
    filterable: true,
    editor: MUICurrencyEditor

  };
}

function categoriesColumn (categories) {
  return {
    key: 'category',
    name: 'Category',
    editable: true,
    resizable: true,
    filterable: true,
    editor: <Editor type='Select' options={categories}/>,
    formatter: <DropDownFormatter options={categories} value={'-1'}/>

  };
}

export function createColumns (categories) {
  return [
    humanIdColumn(),
    productNameColumn(),
    unitSizeColumn(),
    unitCostColumn(),
    categoriesColumn(categories)
  ];
}
