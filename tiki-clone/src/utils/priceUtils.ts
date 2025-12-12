/**
 * Utility functions for price calculations and formatting
 */

/**
 * Calculate discounted price based on original price and discount percentage
 * @param originalPrice - The original price of the item
 * @param discount - The discount percentage (0-100)
 * @returns The discounted price rounded to nearest integer
 */
export const calculateDiscountedPrice = (
    originalPrice: number | string,
    discount?: number | string
): number => {
    const numOriginalPrice = Number(originalPrice);

    // If no discount provided, return original price
    if (!discount) {
        return numOriginalPrice;
    }

    const numDiscount = Number(discount);

    // Validate inputs
    // if (isNaN(numOriginalPrice) || isNaN(numDiscount)) {
    //     console.warn("Invalid price or discount value provided");
    //     return numOriginalPrice;
    // }

    // Calculate discounted price
    const discountedPrice = numOriginalPrice * (1 - numDiscount / 100);

    return Math.round(discountedPrice);
};

/**
 * Format price according to Vietnamese locale
 * @param price - The price to format
 * @returns Formatted price string (e.g., "1.000.000")
 */
export const formatPrice = (price: number | string): string => {
    // const numPrice = Number(price);

    // if (isNaN(numPrice)) {
    //     console.warn("Invalid price value provided for formatting");
    //     return "0";
    // }

    return new Intl.NumberFormat("vi-VN").format(price as number);
};

/**
 * Format price with currency symbol
 * @param price - The price to format
 * @param currency - Currency code (default: VND)
 * @returns Formatted price with currency (e.g., "1.000.000 ₫")
 */
// export const formatPriceWithCurrency = (
//     price: number | string,
//     currency: string = "VND"
// ): string => {
//     const numPrice = Number(price);

//     if (isNaN(numPrice)) {
//         console.warn("Invalid price value provided for currency formatting");
//         return "0 ₫";
//     }

//     if (currency === "VND") {
//         return `${formatPrice(numPrice)} ₫`;
//     }

//     return new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: currency,
//     }).format(numPrice);
// };

/**
 * Calculate discount percentage between two prices
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns Discount percentage rounded to 1 decimal place
 */
// export const calculateDiscountPercentage = (
//     originalPrice: number | string,
//     discountedPrice: number | string
// ): number => {
//     const numOriginal = Number(originalPrice);
//     const numDiscounted = Number(discountedPrice);

//     if (isNaN(numOriginal) || isNaN(numDiscounted) || numOriginal === 0) {
//         return 0;
//     }

//     const discountPercentage = ((numOriginal - numDiscounted) / numOriginal) * 100;

//     return Math.round(discountPercentage * 10) / 10; // Round to 1 decimal place
// };

/**
 * Check if a price has a valid discount
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns True if there's a valid discount
 */
// export const hasValidDiscount = (
//     originalPrice: number | string,
//     discountedPrice: number | string
// ): boolean => {
//     const numOriginal = Number(originalPrice);
//     const numDiscounted = Number(discountedPrice);

//     return !isNaN(numOriginal) &&
//         !isNaN(numDiscounted) &&
//         numOriginal > 0 &&
//         numDiscounted > 0 &&
//         numDiscounted < numOriginal;
// };