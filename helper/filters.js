/**
 * Number formatting filter
 * Formats numbers with proper decimal places
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} Formatted number string
 */
export function numFilter(value, decimals = 4) {
    if (value === null || value === undefined || value === '') {
        return '0'
    }
    
    const num = Number(value)
    if (isNaN(num)) {
        return '0'
    }
    
    return num.toFixed(decimals)
}

/**
 * Currency formatting filter
 * Formats numbers as currency with proper decimal places
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export function currencyFilter(value, decimals = 2) {
    if (value === null || value === undefined || value === '') {
        return '0.00'
    }
    
    const num = Number(value)
    if (isNaN(num)) {
        return '0.00'
    }
    
    return num.toFixed(decimals)
}

/**
 * Percentage formatting filter
 * Formats numbers as percentages with proper decimal places
 * @param {number|string} value - The number to format (as decimal, e.g., 0.05 for 5%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export function percentFilter(value, decimals = 2) {
    if (value === null || value === undefined || value === '') {
        return '0.00%'
    }
    
    const num = Number(value)
    if (isNaN(num)) {
        return '0.00%'
    }
    
    return (num * 100).toFixed(decimals) + '%'
}

/**
 * Price formatting filter
 * Formats prices with proper decimal places
 * @param {number|string} value - The price to format
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} Formatted price string
 */
export function priceFilter(value, decimals = 4) {
    if (value === null || value === undefined || value === '') {
        return '0.0000'
    }
    
    const num = Number(value)
    if (isNaN(num)) {
        return '0.0000'
    }
    
    return num.toFixed(decimals)
}
