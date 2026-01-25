# Label Marquee Component - Complete Marquee Solution

A complete, self-contained solution for labels with automatic marquee animation detection and application.

## Features

- **Complete Solution**: Component, utilities, mixins, and directives all in one place
- **Automatic Detection**: Automatically detects when text needs marquee animation
- **Multi-language Support**: Different character limits for different locales
- **Dynamic Duration**: Calculates animation duration based on text length
- **Self-contained**: Everything is included in the component directory
- **Easy to Use**: Multiple ways to use the functionality

## Usage

### Basic Usage

```vue
<template>
  <label-marquee :text="'Scrolling label text'" :locale="$i18n.locale" />
</template>

<script>
import LabelMarquee from '@/components/label-marquee/label-marquee.vue'

export default {
  components: {
    LabelMarquee
  }
}
</script>
```

### With Custom Container Width

```vue
<label-marquee 
  :text="'Long label text...'" 
  :locale="$i18n.locale"
  :container-width="220"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | String | `''` | The text to display |
| `locale` | String | `'en'` | Current locale for character limits |
| `containerWidth` | Number | `200` | Container width in rpx |
| `fontSize` | Number | `28` | Font size in rpx |
| `color` | String | `#333` | Text color |
| `speed` | Number | `15` | Animation duration in seconds |
| `direction` | String | `'left'` | Marquee direction: 'left' or 'right' |
| `threshold` | Number | `10` | Minimum characters before marquee triggers |

## Component Structure

```
components/label-marquee/
├── label-marquee.vue      # Main component
├── utils.js               # Utility functions
├── mixins.js              # Vue mixins
├── directives.js          # Vue directives
├── index.js               # Main export file
└── README.md              # This file
```

## Utilities

The component includes its own utility functions in `utils.js`:

### `checkLabelMarquee(label, locale)`

Main function to check if marquee is needed and get duration.

```js
import { checkLabelMarquee } from '@/components/label-marquee/utils.js'
const config = checkLabelMarquee('Label Text', 'en')
// Returns: { needsMarquee: boolean, duration: number }
```

### `needsMarquee(text, maxLength, containerWidth, fontSize)`

Check if text needs marquee based on length and container width.

```js
import { needsMarquee } from '@/components/label-marquee/utils.js'
const needsAnimation = needsMarquee('Long text', 10, 200, 28)
// Returns: true/false
```

### `getMarqueeDuration(text, baseDuration, speedFactor)`

Calculate animation duration based on text length.

```js
import { getMarqueeDuration } from '@/components/label-marquee/utils.js'
const duration = getMarqueeDuration('Long text', 15, 0.5)
// Returns: number (seconds)
```

### `getLocaleLimit(locale)`

Get character limit for specific locale.

```js
import { getLocaleLimit } from '@/components/label-marquee/utils.js'
const limit = getLocaleLimit('zh') // Returns: 8
```

### `getEstimatedTextWidth(text, fontSize)`

Calculate estimated text width.

```js
import { getEstimatedTextWidth } from '@/components/label-marquee/utils.js'
const width = getEstimatedTextWidth('Text', 28) // Returns: estimated width in rpx
```

## Locale Limits

Different character limits for different languages:

| Locale | Limit | Description |
|--------|-------|-------------|
| `en` | 10 | English |
| `zh` | 8 | Chinese |
| `th` | 10 | Thai |
| `default` | 10 | Fallback |

## CSS Classes

The component automatically applies these CSS classes:

- `.label-marquee-container` - Main container
- `.label-marquee-content` - Marquee content
- `.label-marquee-static` - Static label styling
- `.label-marquee-blur` - Blur effects

## Animation

The marquee animation uses CSS keyframes:

```css
@keyframes label-marquee-loop {
  0%   { transform: translateX(0); }
  70.6% { transform: translateX(-50%); }
  100% { transform: translateX(-50%); }
}
```

## Complete Import

Import everything from the component:

```js
import LabelMarquee, { 
  LabelMarquee as Component,
  checkLabelMarquee,
  labelMarqueeMixin,
  marqueeDirective,
  registerMarqueeDirective
} from '@/components/label-marquee/index.js'
```

## Mixins

The component includes its own mixin:

```js
import { labelMarqueeMixin } from '@/components/label-marquee/mixins.js'
export default {
  mixins: [labelMarqueeMixin],
  computed: {
    processedItems() {
      return this.processLabelItems(this.items)
    }
  }
}
```

## Directives

The component includes its own directive:

```js
import { registerMarqueeDirective } from '@/components/label-marquee/directives.js'
// Register in main.js
registerMarqueeDirective(Vue)
// Use in template
<div v-marquee="{ text: 'Long text', locale: 'en', containerWidth: 200 }">
  <!-- Content will be automatically replaced with marquee -->
</div>
```

## Performance

- Character length check is performed first (fast)
- Text width estimation is approximate but efficient
- Animation duration is calculated once per text
- Component is optimized for Vue's reactivity system

## Examples

### List Usage

```vue
<template>
  <view class="label-list">
    <view v-for="item in items" :key="item.name" class="label-item">
      <label-marquee :text="$t(item.name)" :locale="$i18n.locale" />
    </view>
  </view>
</template>

<script>
import LabelMarquee from '@/components/label-marquee/label-marquee.vue'
export default {
  components: { LabelMarquee },
  data() {
    return {
      items: [
        { name: 'short' },
        { name: 'very_long_label_name' }
      ]
    }
  }
}
</script>
```

### Custom Styling

```vue
<template>
  <label-marquee 
    :text="label" 
    :locale="locale"
    :container-width="220"
    class="custom-label-marquee"
  />
</template>

<style scoped>
.custom-label-marquee {
  /* Custom styles */
  margin: 10rpx 0;
}
</style>
``` 