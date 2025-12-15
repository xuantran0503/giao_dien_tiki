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


export const formatPrice = (price: number | string): string => {
    // const numPrice = Number(price);

    // if (isNaN(numPrice)) {
    //     console.warn("Invalid price value provided for formatting");
    //     return "0";
    // }

    return new Intl.NumberFormat("vi-VN").format(price as number);
};


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