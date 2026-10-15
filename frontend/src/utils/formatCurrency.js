/**
 * Formats a numeric price into Indian Rupee (INR) currency format.
 * Example: 74999 -> "₹74,999"
 * Uses standard Indian numbering system (Lakhs and Crores: 1,00,000)
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatINR;
