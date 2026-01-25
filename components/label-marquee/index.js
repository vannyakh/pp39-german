// Label Marquee Component - Complete Marquee Solution
// Export the main component
export { default as LabelMarquee } from './label-marquee.vue'

// Export utility functions
export {
    checkLabelMarquee,
    needsMarquee,
    getMarqueeDuration,
    getLocaleLimit,
    getEstimatedTextWidth
} from './utils.js'

// Export mixins
export { labelMarqueeMixin } from './mixins.js'

// Export directives
export { marqueeDirective, registerMarqueeDirective } from './directives.js' 