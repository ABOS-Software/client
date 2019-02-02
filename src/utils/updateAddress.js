export const updateAddress = (address) => {
  let addressObj = {address: '', zipCode: '', city: '', state: '', bldgNum: '', street: ''};
  for (let i = 0; i < address.address_components.length; i++) {
    let addressType = address.address_components[i].types[0];
    let val = address.address_components[i]['short_name'];

    switch (addressType) {
    case 'street_address':
      addressObj.address = val;
      break;
    case 'street_number':
      addressObj.bldgNum = val;

      break;
    case 'route':
      addressObj.street = val;

      break;
    case 'locality':
      addressObj.city = val;

      break;
    case 'administrative_area_level_1':
      addressObj.state = val;

      break;
    case 'country':

      break;
    case 'postal_code':
      addressObj.zipCode = val;

      break;
    case 'postal_town':
      addressObj.city = val;

      break;
    case 'sublocality_level_1':
      addressObj.city = val;

      break;
    }
  }
  if (!addressObj.address) {
    addressObj.address = addressObj.bldgNum + ' ' + addressObj.street;
  }
  return addressObj;
};
