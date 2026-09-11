export const calculateDiscount = (amount: number, discountPercent: number): number => {
    const discountedPrice = amount - (discountPercent ? (amount * discountPercent) / 100 : 0);
    return discountedPrice;
}