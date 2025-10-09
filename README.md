# Mapker 🗺️

A free and open-source map picker component for Svelte using OpenStreetMap and Leaflet. Perfect for location selection in forms, geolocation features, and mapping applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/mapker.svg)](https://www.npmjs.com/package/mapker)

## ✨ Features

- 🚀 **Free & Open Source** - Built with OpenStreetMap and Leaflet
- 🎯 **Easy Location Selection** - Click to select locations on the map
- 🔍 **Optional Search** - Integrated location search functionality
- 📱 **Responsive** - Works great on all screen sizes
- 🎨 **Customizable** - Flexible styling and configuration options
- 🏷️ **TypeScript Support** - Full TypeScript definitions included
- ⚡ **Lightweight** - Minimal dependencies, optimized for performance

## 📦 Installation

```bash
# Using npm
npm install mapker leaflet @types/leaflet

# Using yarn
yarn add mapker leaflet @types/leaflet

# Using pnpm
pnpm add mapker leaflet @types/leaflet

# Using bun
bun add mapker leaflet @types/leaflet
```

### Optional Dependencies

For search functionality, also install:

```bash
npm install leaflet-geosearch
```

## 🚀 Quick Start

```svelte
<script lang="ts">
  import { MapPicker } from 'mapker';

  let selectedLocation = null;

  function handleLocationSelected(event) {
    const { lat, lng } = event.detail;
    console.log('Selected location:', lat, lng);
  }
</script>

<MapPicker
  bind:selectedLocation
  on:locationSelected={handleLocationSelected}
  width="100%"
  height="400px"
  center={[-6.2, 106.816666]}  <!-- Jakarta coordinates -->
  zoom={13}
/>
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'100%'` | Width of the map container |
| `height` | `string` | `'400px'` | Height of the map container |
| `center` | `[number, number]` | `[-6.2, 106.816666]` | Initial map center coordinates [lat, lng] |
| `zoom` | `number` | `13` | Initial map zoom level |
| `selectedLocation` | `{ lat: number; lng: number } \| null` | `null` | Currently selected location |
| `placeholder` | `string` | `'Click on the map to select a location'` | Placeholder text when no location is selected |
| `showCoordinates` | `boolean` | `true` | Whether to display selected coordinates |
| `enableSearch` | `boolean` | `false` | Enable location search functionality |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `locationSelected` | `{ lat: number; lng: number }` | Fired when a location is selected |

### Styling

The component includes default styles but can be customized by overriding the CSS classes:

```css
/* Customize the map container */
.map-container {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Customize the coordinates display */
.coordinates-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

## 🌍 Advanced Usage

### With Search Functionality

```svelte
<script lang="ts">
  import { MapPicker } from 'mapker';

  let selectedLocation = null;
</script>

<MapPicker
  bind:selectedLocation
  enableSearch={true}
  width="100%"
  height="500px"
  center={[40.7128, -74.0060]}  <!-- New York coordinates -->
  zoom={12}
/>
```

### Custom Center and Zoom

```svelte
<MapPicker
  center={[51.505, -0.09]}  <!-- London coordinates -->
  zoom={15}
  bind:selectedLocation
/>
```

### Handling Location Changes

```svelte
<script lang="ts">
  import { MapPicker } from 'mapker';

  let selectedLocation = null;

  $: if (selectedLocation) {
    console.log('New location selected:', selectedLocation);
    // Save to database, update form, etc.
  }
</script>

<MapPicker bind:selectedLocation />
```

### Integration with Forms

```svelte
<script lang="ts">
  import { MapPicker } from 'mapker';

  let formData = {
    location: null,
    address: '',
    notes: ''
  };

  function handleLocationSelected(event) {
    formData.location = event.detail;
  }

  async function submitForm() {
    if (!formData.location) {
      alert('Please select a location on the map');
      return;
    }

    // Submit form data
    console.log('Submitting:', formData);
  }
</script>

<form on:submit|preventDefault={submitForm}>
  <div>
    <label for="address">Address:</label>
    <input id="address" bind:value={formData.address} required />
  </div>

  <div>
    <label>Location:</label>
    <MapPicker
      bind:selectedLocation={formData.location}
      on:locationSelected={handleLocationSelected}
      showCoordinates={true}
    />
  </div>

  <div>
    <label for="notes">Notes:</label>
    <textarea id="notes" bind:value={formData.notes}></textarea>
  </div>

  <button type="submit">Submit</button>
</form>
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mapker.git
cd mapker

# Install dependencies
bun install

# Start development server
bun run dev

# Build the library
bun run build

# Run tests
bun run check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) - The free wiki world map
- [Leaflet](https://leafletjs.com/) - An open-source JavaScript library for mobile-friendly interactive maps
- [Leaflet GeoSearch](https://github.com/smeijer/leaflet-geosearch) - Search functionality for Leaflet
- [Svelte](https://svelte.dev/) - Cybernetically enhanced web apps

## 📞 Support

If you have any questions or need help, please:

- Open an issue on [GitHub](https://github.com/yourusername/mapker/issues)
- Join our community discussions

---

Made with ❤️ and free mapping data
