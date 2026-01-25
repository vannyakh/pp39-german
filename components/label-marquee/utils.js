// Label Marquee Utilities

/**
 * Check if text needs marquee animation based on length and container width
 * @param {string} text - The text to check
 * @param {number} maxLength - Maximum characters before marquee is needed (default: 10)
 * @param {number} containerWidth - Container width in rpx (default: 200)
 * @param {number} fontSize - Font size in rpx (default: 28)
 * @returns {boolean} - True if marquee is needed
 */
export const needsMarquee = (text, maxLength = 10, containerWidth = 200, fontSize = 28) => {
    if (!text || typeof text !== 'string') {
        return false;
    }
    if (text.length > maxLength) {
        return true;
    }
    const estimatedTextWidth = text.length * fontSize * 0.6;
    const maxWidth = containerWidth;
    return estimatedTextWidth > maxWidth;
}

/**
 * Get marquee animation duration based on text length
 * @param {string} text - The text to calculate duration for
 * @param {number} baseDuration - Base duration in seconds (default: 15)
 * @param {number} speedFactor - Speed factor per character (default: 0.5)
 * @returns {number} - Animation duration in seconds
 */
export const getMarqueeDuration = (text, baseDuration = 15, speedFactor = 0.5) => {
    if (!text || typeof text !== 'string') {
        return baseDuration;
    }
    const textLength = text.length;
    const duration = baseDuration + (textLength * speedFactor);
    return Math.max(8, Math.min(30, duration));
}

/**
 * Get character limit for specific locale
 * @param {string} locale - Current locale
 * @returns {number} - Character limit
 */
export const getLocaleLimit = (locale = 'en') => {
    const localeLimits = {
        'en': 10,
        'zh': 8,
        'th': 10,
        'default': 10
    };
    return localeLimits[locale] || localeLimits.default;
}

/**
 * Calculate estimated text width
 * @param {string} text - The text
 * @param {number} fontSize - Font size in rpx (default: 28)
 * @returns {number} - Estimated width in rpx
 */
export const getEstimatedTextWidth = (text, fontSize = 28) => {
    if (!text || typeof text !== 'string') return 0;
    return text.length * fontSize * 0.6;
}

/**
 * Check if label needs marquee and get duration
 * @param {string} label - The label text
 * @param {string} locale - Current locale
 * @returns {object} - { needsMarquee, duration }
 */
export const checkLabelMarquee = (label, locale = 'en') => {
    if (!label) {
        return { needsMarquee: false, duration: 15 };
    }
    const maxLength = getLocaleLimit(locale);
    const needsMarqueeAnimation = needsMarquee(label, maxLength);
    const duration = needsMarqueeAnimation ? getMarqueeDuration(label) : 15;
    return {
        needsMarquee: needsMarqueeAnimation,
        duration: duration
    };
} 