export const calculateDiscountedPrice = (originalPrice, discount) => {
  // if (!originalPrice) {
  //   return 0;
  // }

  if (!discount) {
    return Number(originalPrice);
  }

  return Math.round(Number(originalPrice) * (1 - Number(discount) / 100));
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
