export function createMarkerList (customers) {
  let mapMarkers = [];

  Object.keys(customers).forEach(address => {
    let customer = customers[address];

    /* mapMarkers.push(<MapMarker key={customer.id} lat={customer.latitude} lng={customer.longitude}
                                       customer={customer}/>); */
    mapMarkers.push({
      id: customer.id,
      lat: customer.latitude,
      lng: customer.longitude,
      text: '',
      customer: customer
    });
  });
  return mapMarkers;
}
