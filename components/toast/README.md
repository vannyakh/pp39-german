# Toast Component

A versatile toast notification component with smooth animations, icons, and multiple types.

## Features

- ✅ **Multiple Types**: success, error, warning, info, default
- ✅ **Icon Support**: Optional icons with automatic type-based icons
- ✅ **Smooth Animations**: Bounce and fade transitions
- ✅ **Customizable**: Duration, z-index, title, content, and custom icons
- ✅ **Auto-dismiss**: Automatically hides after specified duration
- ✅ **Backdrop Blur**: Modern glassmorphism effect

## Usage

### Basic Setup

Add the component to your page or global App.vue:

```vue
<template>
	<view>
		<!-- Your content -->
		<toast ref="toast" :zIndex="99999" />
	</view>
</template>

<script>
import Toast from '@/components/toast/toast.vue'

export default {
	components: {
		Toast
	},
	methods: {
		showToast() {
			this.$refs.toast.show({
				title: "Success!",
				icon: true,
				type: "success",
				duration: 2000
			})
		}
	}
}
</script>
```

### Examples

#### Simple Toast (No Icon)

```javascript
this.$refs.toast.show({
	title: "Operation completed",
	duration: 2000
})
```

#### Success Toast with Icon

```javascript
this.$refs.toast.show({
	title: "Success",
	content: "Your changes have been saved",
	icon: true,
	type: "success",
	duration: 3000
})
```

#### Error Toast

```javascript
this.$refs.toast.show({
	title: "Error",
	content: "Something went wrong",
	icon: true,
	type: "error",
	duration: 3000
})
```

#### Warning Toast

```javascript
this.$refs.toast.show({
	title: "Warning",
	content: "Please check your input",
	icon: true,
	type: "warning",
	duration: 2500
})
```

#### Info Toast

```javascript
this.$refs.toast.show({
	title: "Info",
	content: "New feature available",
	icon: true,
	type: "info",
	duration: 2000
})
```

#### Custom Icon

```javascript
this.$refs.toast.show({
	title: "Custom",
	content: "Using custom icon",
	icon: true,
	imgUrl: "/static/custom-icon.png",
	type: "default",
	duration: 2000
})
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `zIndex` | Number | `99999` | Z-index for the toast overlay |

## Methods

### `show(options)`

Shows the toast with specified options.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `""` | Toast title text |
| `content` | String | `""` | Toast content text (shown below title when icon is present) |
| `icon` | Boolean | `false` | Whether to show an icon |
| `imgUrl` | String | `""` | Custom icon image URL (auto-set based on type if not provided) |
| `duration` | Number | `2000` | Duration in milliseconds before auto-dismiss |
| `type` | String | `"default"` | Toast type: `"success"`, `"error"`, `"warning"`, `"info"`, `"default"` |

**Default Icons:**

- `success`: `/static/img/icons/success.png`
- `error`: `/static/img/icons/error.png`
- `warning`: `/static/img/icons/warning.png`
- `info`: `/static/img/icons/info.png`
- `default`: `/static/img/icons/info.png`

## Global Setup (Optional)

You can register it globally in `main.js`:

```javascript
import Toast from '@/components/toast/toast.vue'

Vue.component('toast', Toast)
```

Then use it in any component:

```vue
<template>
	<view>
		<toast ref="toast" />
	</view>
</template>
```

## Notes

- The component automatically handles multiple toasts (dismisses previous one when showing new)
- Icons are automatically set based on `type` if `icon: true` and no `imgUrl` is provided
- Custom z-index can be set via `$lib.zIndex.toast` or prop
- Animation duration is fixed (300ms) but display duration is configurable

