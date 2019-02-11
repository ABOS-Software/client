export function calculateMapCenter (customers) {
  let nCustomers = 1;
  let lat = 0;
  let lng = 0;
  if (Object.keys(customers).length > 0) {
    nCustomers = Object.keys(customers).length;
  }
  Object.keys(customers).forEach(address => {
    let customer = customers[address];
    lat += customer.latitude;
    lng += customer.longitude;
  });
  return {lat: lat / nCustomers, lng: lng / nCustomers};
}
