/**
 *
 * @param {number} originalPrice
 * @param {number} discount
 * @returns {number}
 */
export const calculateDiscountedPrice = (originalPrice, discount) => {
  // if (!originalPrice) {
  //   return 0;
  // }

  if (!discount) {
    return Number(originalPrice);
  }
  //
  return Math.round(Number(originalPrice) * (1 - Number(discount) / 100));
};

/**
 *
 * @param {number} price - Giá cần format
 * @returns {string} - Giá đã được format
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
