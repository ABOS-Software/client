export function deriveCustomerObject (customer) {
  return {
    customerName: customer.customerName,
    phone: customer.phone,
    email: customer.custEmail,
    id: customer.id,
    year: customer.year.id,
    address: customer.address,
    donation: customer.donation,
    years: []
  };
}
