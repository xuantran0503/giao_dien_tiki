export const calculateDiscountedPrice = (
  originalPrice: number | string,
  discount?: number | string
): number => {
  const numOriginalPrice = Number(originalPrice);

  if (!discount) {
    return numOriginalPrice;
  }

  const numDiscount = Number(discount);

  // Calculate discounted price
  const discountedPrice = numOriginalPrice * (1 - numDiscount / 100);

  return Math.round(discountedPrice);
};

export const formatPrice = (price: number | string): string => {
  return new Intl.NumberFormat("vi-VN").format(price as number);
};
