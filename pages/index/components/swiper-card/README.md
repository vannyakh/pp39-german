# Swiper Card Component

A flexible and reusable swiper component for Vue.js applications with support for multiple content modes, custom styling, and slot-based customization.

## Features

- 🎯 **Multiple Content Modes**: Icon+Text, Image Content, Custom Slots
- 🎨 **Flexible Styling**: Large, Default, Small card types
- 🔄 **Auto-play Support**: Configurable autoplay with custom intervals
- 📊 **Numeric Indicators**: Shows current position (e.g., "2 / 5")
- 🖼️ **Image Overlay Slots**: Custom overlay content on image swipers
- 🎛️ **Custom Icon Sizing**: Adjustable icon/image sizes
- 📱 **Responsive Design**: Works across different screen sizes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `swiperData` | Array | `[]` | **Required** - Array of swiper items |
| `cardType` | String | `'default'` | Card size: `'default'`, `'large'`, `'small'` |
| `autoplay` | Boolean | `true` | Enable/disable autoplay |
| `interval` | Number | `3000` | Autoplay interval in milliseconds |
| `duration` | Number | `500` | Transition duration in milliseconds |
| `showIndicator` | Boolean | `true` | Show/hide numeric indicator |
| `iconSize` | String/Number | `null` | Custom icon size (e.g., `'100rpx'` or `100`) |

## Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `change` | Fired when swiper changes | `currentIndex` |
| `click` | Fired when swiper is clicked | - |

## Slots

| Slot | Description | Props |
|------|-------------|-------|
| `image-overlay` | Custom overlay for image content | `item`, `index`, `currentIndex` |
| `default` | Custom content for individual items | `item`, `index` |

## Data Structure

### Icon + Text Mode
```javascript
{
  icon: '/static/imgs/icon.png',  // Image path
  title: 'Title Text',
  description: 'Description text'
}
```

### Image Content Mode
```javascript
{
  image: '/static/imgs/banner.jpg',  // Main image
  title: 'Optional Title',           // For default overlay
  description: 'Optional Description' // For default overlay
}
```

## Examples

### 1. Basic Icon + Text Swiper

```vue
<template>
  <swiper-card
    :swiper-data="iconSwiperData"
    card-type="default"
    :autoplay="true"
    :interval="3000"
    :show-indicator="true"
    @click="handleSwiperClick"
  />
</template>

<script>
export default {
  data() {
    return {
      iconSwiperData: [
        {
          icon: '/static/imgs/index/opened.png',
          title: 'Open Account',
          description: 'Start your investment journey'
        },
        {
          icon: '/static/imgs/index/trade.png',
          title: 'First Trade',
          description: 'Make your first investment'
        },
        {
          icon: '/static/imgs/index/invest.png',
          title: 'Invest Smart',
          description: 'Grow your portfolio'
        }
      ]
    }
  },
  methods: {
    handleSwiperClick() {
      console.log('Swiper clicked!')
    }
  }
}
</script>
```

### 2. Image Content Swiper

```vue
<template>
  <swiper-card
    :swiper-data="imageSwiperData"
    card-type="large"
    :autoplay="true"
    :interval="4000"
    :show-indicator="true"
    @change="handleSwiperChange"
  />
</template>

<script>
export default {
  data() {
    return {
      imageSwiperData: [
        {
          image: '/static/imgs/banner1.jpg',
          title: 'Market Insights',
          description: 'Stay updated with latest trends'
        },
        {
          image: '/static/imgs/banner2.jpg',
          title: 'Investment Tips',
          description: 'Expert advice for better returns'
        }
      ]
    }
  },
  methods: {
    handleSwiperChange(currentIndex) {
      console.log('Current slide:', currentIndex)
    }
  }
}
</script>
```

### 3. Custom Image Overlay

```vue
<template>
  <swiper-card
    :swiper-data="customImageData"
    card-type="large"
    :autoplay="false"
    :show-indicator="true"
    @click="handleCustomClick"
  >
    <template #image-overlay="{ item, index, currentIndex }">
      <view class="custom-overlay">
        <!-- Badge -->
        <view class="overlay-badge" :class="`badge-${item.overlayData.badge.toLowerCase()}`">
          {{ item.overlayData.badge }}
        </view>
        
        <!-- Rating -->
        <view class="overlay-rating">
          <text class="rating-stars">⭐⭐⭐⭐⭐</text>
          <text class="rating-value">{{ item.overlayData.rating }}</text>
        </view>
        
        <!-- Price -->
        <view class="overlay-price">
          {{ item.overlayData.price }}
        </view>
        
        <!-- Content -->
        <view class="overlay-content">
          <view class="overlay-title">{{ item.title }}</view>
          <view class="overlay-description">{{ item.description }}</view>
        </view>
        
        <!-- Index -->
        <view class="overlay-index">
          {{ index + 1 }} / {{ customImageData.length }}
        </view>
      </view>
    </template>
  </swiper-card>
</template>

<script>
export default {
  data() {
    return {
      customImageData: [
        {
          image: '/static/imgs/product1.jpg',
          title: 'Premium Investment',
          description: 'High-return investment opportunity',
          overlayData: {
            badge: 'HOT',
            rating: '4.9',
            price: '$299/month'
          }
        },
        {
          image: '/static/imgs/product2.jpg',
          title: 'Starter Package',
          description: 'Perfect for beginners',
          overlayData: {
            badge: 'NEW',
            rating: '4.7',
            price: '$99/month'
          }
        }
      ]
    }
  },
  methods: {
    handleCustomClick() {
      console.log('Custom overlay clicked!')
    }
  }
}
</script>

<style scoped>
.custom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20rpx;
  border-radius: var(--radius-lg);
}

.overlay-badge {
  align-self: flex-start;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: bold;
  color: white;
}

.badge-hot {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
}

.badge-new {
  background: linear-gradient(45deg, #4ecdc4, #6dd5ed);
}

.overlay-rating {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.rating-stars {
  font-size: 24rpx;
}

.rating-value {
  color: white;
  font-weight: bold;
  font-size: 24rpx;
}

.overlay-price {
  color: #ffd700;
  font-size: 32rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
}

.overlay-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.overlay-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.8);
}

.overlay-description {
  color: rgba(255,255,255,0.9);
  font-size: 24rpx;
  line-height: 1.4;
  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.8);
}

.overlay-index {
  align-self: flex-end;
  color: rgba(255,255,255,0.7);
  font-size: 20rpx;
  background: rgba(0,0,0,0.3);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}
</style>
```

### 4. Custom Icon Size

```vue
<template>
  <swiper-card
    :swiper-data="largeIconData"
    card-type="default"
    :icon-size="120"
    :autoplay="true"
    :interval="2500"
  />
</template>

<script>
export default {
  data() {
    return {
      largeIconData: [
        {
          icon: '/static/imgs/large-icon1.png',
          title: 'Big Feature',
          description: 'With large custom icon'
        },
        {
          icon: '/static/imgs/large-icon2.png',
          title: 'Another Feature',
          description: 'Also with large icon'
        }
      ]
    }
  }
}
</script>
```

### 5. Different Card Types

```vue
<template>
  <view class="card-examples">
    <!-- Large Card -->
    <swiper-card
      :swiper-data="largeCardData"
      card-type="large"
      class="example-card"
    />
    
    <!-- Default Card -->
    <swiper-card
      :swiper-data="defaultCardData"
      card-type="default"
      class="example-card"
    />
    
    <!-- Small Card -->
    <swiper-card
      :swiper-data="smallCardData"
      card-type="small"
      class="example-card"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      largeCardData: [
        { icon: '/static/imgs/icon1.png', title: 'Large', description: 'Big card' }
      ],
      defaultCardData: [
        { icon: '/static/imgs/icon2.png', title: 'Default', description: 'Normal card' }
      ],
      smallCardData: [
        { icon: '/static/imgs/icon3.png', title: 'Small', description: 'Compact card' }
      ]
    }
  }
}
</script>

<style scoped>
.card-examples {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  gap: 20rpx;
  height: 400rpx;
}

.example-card {
  width: 100%;
  height: 100%;
}
</style>
```

## CSS Variables

The component uses CSS variables for consistent theming:

```scss
:root {
  --card-glass-bg: rgba(255, 255, 255, 0.1);
  --radius-lg: 20rpx;
  --radius-md: 12rpx;
  --text-color: #333;
  --transition-smooth: all 0.3s ease;
}
```

## Best Practices

1. **Image Optimization**: Use optimized images for better performance
2. **Content Length**: Keep titles and descriptions concise for better readability
3. **Autoplay**: Consider disabling autoplay for accessibility
4. **Touch Interaction**: Ensure touch targets are large enough (minimum 44rpx)
5. **Loading States**: Consider adding loading states for image content

## Browser Support

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ WeChat Mini Program
- ✅ H5 Browsers
- ✅ App (uni-app)

## License

MIT License - Feel free to use in your projects!
