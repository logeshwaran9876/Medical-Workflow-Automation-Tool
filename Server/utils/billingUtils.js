export const generateInvoiceNumber = (billing) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const idPart = billing._id.toString().slice(-4).toUpperCase();
  
  return `INV-${year}${month}${day}-${idPart}`;
};

export const calculateBillingAmounts = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const tax = items.reduce((sum, item) => sum + (item.rate * item.quantity * (item.taxRate || 0) / 100), 0);
  const totalAmount = subtotal + tax - discount;
  
  return { subtotal, tax, totalAmount };
};