export function formatCurrency(amount, compact = false) {
    if (amount === undefined || amount === null) return "₹0";

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    }).format(amount);
}
