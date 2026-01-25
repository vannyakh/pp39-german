# App Header Profile Component

A flexible and customizable header profile component for user information display.

## Features

- ✅ Customizable user avatar (image or text placeholder)
- ✅ Username masking for privacy
- ✅ Verification status with badge
- ✅ Online status indicator
- ✅ Action button with different types
- ✅ Multiple sizes (small, medium, large)
- ✅ Light/Dark theme support
- ✅ Click events for all interactive elements
- ✅ Uses theme variables for consistent styling

## Props

### User Information
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | String | `''` | User's username |
| `greeting` | String | `'Hello'` | Greeting text |
| `avatarUrl` | String | `''` | URL of user's avatar image |
| `avatarText` | String | `'U'` | Text to show when no avatar image |
| `userData` | Object | `{}` | Complete user data object from API |

### Verification
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVerified` | Boolean | `false` | Whether user is verified |
| `verifiedText` | String | `'Verified'` | Text for verified status |

### Status
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `statusText` | String | `''` | Custom status text |
| `showOnlineStatus` | Boolean | `false` | Show online status indicator |
| `onlineStatus` | String | `'online'` | Online status: `online`, `offline`, `away` |

### Action Button
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actionType` | String | `'support'` | Action type: `support`, `settings`, `notification`, `custom` |
| `actionIcon` | String | `'🎧'` | Icon for action button (emoji or uView icon name) |
| `actionIconType` | String | `'emoji'` | Type of icon: 'emoji' or 'uview' |
| `actionIconSize` | String/Number | `24` | Size of uView icon |
| `actionIconColor` | String | `''` | Color of uView icon (empty = auto) |

### Appearance
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | String | `'medium'` | Component size: `small`, `medium`, `large` |
| `theme` | String | `'light'` | Theme: `light`, `dark` |

### Privacy
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maskUsername` | Boolean | `true` | Mask username for privacy |
| `maskPattern` | String | `'****'` | Pattern to use for masking |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `avatar-click` | `{ username, avatarUrl, userData }` | Fired when avatar is clicked |
| `content-click` | `{ username, isVerified, userData }` | Fired when content area is clicked |
| `action-click` | `{ actionType, actionIcon, actionIconType, userData }` | Fired when action button is clicked |

## Usage Examples

### Using API Data Object (Recommended)
```vue
<template>
  <app-header-profile
    :user-data="apiUserData"
    @avatar-click="handleAvatarClick"
    @action-click="handleSupportClick"
  />
</template>

<script>
import AppHeaderProfile from '@/components/app-header-profile/app-header-profile.vue'

export default {
  components: {
    AppHeaderProfile
  },
  data() {
    return {
      // Your API response data
      apiUserData: {
        id: 2,
        cds_code: "034553341",
        mobile: "1888888888",
        username: "1888888888",
        avatar: "",
        xinyu: 100,
        m_prefix: "60",
        is_auth: true
      }
    }
  },
  methods: {
    handleAvatarClick(data) {
      console.log('Avatar clicked:', data)
      // data contains: { username, avatarUrl, userData }
    },
    handleSupportClick(data) {
      console.log('Support clicked:', data)
      // data contains: { actionType, actionIcon, userData }
    }
  }
}
</script>
```

### Basic Usage with Individual Props
```vue
<template>
  <app-header-profile
    username="13512345678"
    greeting="Hello"
    is-verified
    @avatar-click="handleAvatarClick"
    @action-click="handleSupportClick"
  />
</template>

<script>
import AppHeaderProfile from '@/components/app-header-profile/app-header-profile.vue'

export default {
  components: {
    AppHeaderProfile
  },
  methods: {
    handleAvatarClick(data) {
      console.log('Avatar clicked:', data)
    },
    handleSupportClick(data) {
      console.log('Support clicked:', data)
    }
  }
}
</script>
```

### With Avatar Image
```vue
<app-header-profile
  username="john_doe"
  avatar-url="https://example.com/avatar.jpg"
  is-verified
  show-online-status
  online-status="online"
/>
```

### Custom Action Button
```vue
<app-header-profile
  username="jane_smith"
  action-type="settings"
  action-icon="⚙️"
  @action-click="openSettings"
/>
```

### Large Size with Custom Status
```vue
<app-header-profile
  username="admin_user"
  size="large"
  status-text="Administrator"
  action-type="notification"
  action-icon="🔔"
  :mask-username="false"
/>
```

### Dark Theme
```vue
<app-header-profile
  username="night_user"
  theme="dark"
  is-verified
  action-type="custom"
  action-icon="⭐"
/>
```

## Styling

The component uses CSS variables from your theme system:

- `--primary`: Primary color for verified badge and action buttons
- `--secondary`: Secondary color for action buttons
- `--white`: Background and text colors
- `--text-color`: Main text color
- `--text-primary`: Primary text color (dark theme)
- `--card-background`: Card background (dark theme)

## Customization

You can customize the component by:

1. **Modifying CSS variables** in your theme files
2. **Using different action types** with custom icons
3. **Adjusting size** for different use cases
4. **Handling events** for user interactions
5. **Customizing masking patterns** for privacy
