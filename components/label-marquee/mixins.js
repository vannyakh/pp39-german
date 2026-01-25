import { checkLabelMarquee } from './utils.js'

/**
 * Mixin for components with label marquee
 */
export const labelMarqueeMixin = {
    methods: {
        /**
         * Get current locale from i18n
         * @returns {string} - Current locale
         */
        getCurrentLocale() {
            return this.$i18n ? this.$i18n.locale : 'en';
        },

        /**
         * Process items to add marquee information
         * @param {array} items - Items array
         * @returns {array} - Processed items with marquee info
         */
        processLabelItems(items) {
            if (!Array.isArray(items)) return [];
            return items.map(item => {
                const label = this.$t ? this.$t(item.name) : item.name;
                const marqueeInfo = checkLabelMarquee(label, this.getCurrentLocale());
                return {
                    ...item,
                    label,
                    marqueeInfo
                };
            });
        }
    }
} 