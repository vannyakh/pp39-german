import { checkLabelMarquee } from './utils.js'

/**
 * Marquee directive for automatic text animation
 * Usage: v-marquee="{ text: 'Your text', locale: 'en', containerWidth: 200 }"
 */
export const marqueeDirective = {
    bind(el, binding) {
        const { text, locale = 'en', containerWidth = 200 } = binding.value || {};
        if (!text) return;
        const marqueeConfig = checkLabelMarquee(text, locale);
        if (marqueeConfig.needsMarquee) {
            el.classList.add('label-marquee-container');
            el.style.overflow = 'hidden';
            el.style.position = 'relative';
            el.style.width = containerWidth + 'rpx';
            // Create marquee content
            const marqueeContent = document.createElement('div');
            marqueeContent.className = 'label-marquee-content';
            marqueeContent.style.cssText = `
                display: flex;
                width: max-content;
                animation: label-marquee-loop ${marqueeConfig.duration}s linear infinite;
                white-space: nowrap;
            `;
            marqueeContent.innerHTML = `
                <span style=\"padding-right: 40rpx;\">${text}</span>
                <span style=\"padding-right: 40rpx;\">${text}</span>
            `;
            // Add blur effects
            const leftBlur = document.createElement('div');
            leftBlur.className = 'label-marquee-blur-left';
            leftBlur.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 20rpx;
                height: 100%;
                background: linear-gradient(to right, rgba(46,46,46,0), rgba(255,255,255,0));
                z-index: 1;
                pointer-events: none;
            `;
            const rightBlur = document.createElement('div');
            rightBlur.className = 'label-marquee-blur-right';
            rightBlur.style.cssText = `
                position: absolute;
                top: 0;
                right: 0;
                width: 20rpx;
                height: 100%;
                background: linear-gradient(to left, rgba(46,46,46,0), rgba(255,255,255,0));
                z-index: 1;
                pointer-events: none;
            `;
            el.innerHTML = '';
            el.appendChild(marqueeContent);
            el.appendChild(leftBlur);
            el.appendChild(rightBlur);
            // Add CSS animation if not already present
            if (!document.getElementById('label-marquee-animation-style')) {
                const style = document.createElement('style');
                style.id = 'label-marquee-animation-style';
                style.textContent = `
                    @keyframes label-marquee-loop {
                        0%   { transform: translateX(0); }
                        70.6% { transform: translateX(-50%); }
                        100% { transform: translateX(-50%); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    },
    update(el, binding) {
        this.bind(el, binding);
    }
}

/**
 * Register marquee directive globally
 * @param {Vue} Vue - Vue instance
 */
export function registerMarqueeDirective(Vue) {
    Vue.directive('marquee', marqueeDirective);
} 