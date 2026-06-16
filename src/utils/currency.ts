/** Indian rupee formatting - en-IN digit grouping (₹1,49,900 style). */
export const formatINR = (amount: number): string =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

/** % OFF helper for MRP/discount badges (Tata 1mg-style). */
export const percentOff = (mrp: number, price: number): number =>
  Math.round(((mrp - price) / mrp) * 100);
