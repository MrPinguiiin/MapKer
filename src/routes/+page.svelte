<script lang="ts">
	import { MapPicker } from '$lib/index.js';

	// State untuk lokasi yang dipilih
	let selectedLocation1: { lat: number; lng: number } | null = null;
	let selectedLocation2: { lat: number; lng: number } | null = null;
	let selectedLocation3: { lat: number; lng: number } | null = null;

	// Reactive statements to handle location changes
	$effect(() => {
		if (selectedLocation1) {
			console.log('Map 1 - Selected location:', selectedLocation1);
		}
	});

	$effect(() => {
		if (selectedLocation2) {
			console.log('Map 2 - Selected location:', selectedLocation2);
		}
	});

	$effect(() => {
		if (selectedLocation3) {
			console.log('Map 3 - Selected location:', selectedLocation3);
		}
	});
</script>

<svelte:head>
	<title>Mapker - Free Map Picker for Svelte</title>
	<meta name="description" content="A free and open-source map picker component for Svelte using OpenStreetMap and Leaflet">
</svelte:head>

<div class="container">
	<header class="hero">
		<h1>🗺️ Mapker</h1>
		<p class="subtitle">A free and open-source map picker component for Svelte using OpenStreetMap and Leaflet</p>
		<div class="badges">
			<span class="badge">MIT License</span>
			<span class="badge">TypeScript</span>
			<span class="badge">Zero Cost</span>
		</div>
	</header>

	<section class="demo-section">
		<h2>🎯 Basic Usage</h2>
		<p>Click anywhere on the map to select a location. The coordinates will be displayed below.</p>

		<div class="map-demo">
			<MapPicker
				bind:selectedLocation={selectedLocation1}
				width="100%"
				height="400px"
				center={[-6.2, 106.816666]}
				zoom={13}
				placeholder="Click on the map to select a location"
				showCoordinates={true}
				enableSearch={false}
			/>
		</div>

		{#if selectedLocation1}
			<div class="result">
				<strong>Selected Location:</strong> {selectedLocation1.lat.toFixed(6)}, {selectedLocation1.lng.toFixed(6)}
			</div>
		{/if}
	</section>

	<section class="demo-section">
		<h2>🔍 With Search Functionality</h2>
		<p>This map includes location search powered by OpenStreetMap Nominatim API.</p>

		<div class="map-demo">
			<MapPicker
				bind:selectedLocation={selectedLocation2}
				width="100%"
				height="400px"
				center={[40.7128, -74.0060]}
				zoom={12}
				enableSearch={true}
				placeholder="Search for New York landmarks..."
				showCoordinates={true}
			/>
		</div>

		{#if selectedLocation2}
			<div class="result">
				<strong>Selected Location:</strong> {selectedLocation2.lat.toFixed(6)}, {selectedLocation2.lng.toFixed(6)}
			</div>
		{/if}
	</section>

	<section class="demo-section">
		<h2>🎨 Custom Styling</h2>
		<p>The component is fully customizable with CSS. This example shows a compact map without coordinate display.</p>

		<div class="map-demo compact">
			<MapPicker
				bind:selectedLocation={selectedLocation3}
				width="100%"
				height="300px"
				center={[51.505, -0.09]}
				zoom={15}
				showCoordinates={false}
				placeholder="Click on the map to select a location"
				enableSearch={false}
			/>
		</div>

		{#if selectedLocation3}
			<div class="result">
				<strong>London Location:</strong> {selectedLocation3.lat.toFixed(6)}, {selectedLocation3.lng.toFixed(6)}
			</div>
		{/if}
	</section>

	<section class="features">
		<h2>✨ Features</h2>
		<div class="feature-grid">
			<div class="feature">
				<div class="feature-icon">🚀</div>
				<h3>Free & Open Source</h3>
				<p>Built with OpenStreetMap and Leaflet - no API keys required, completely free to use.</p>
			</div>
			<div class="feature">
				<div class="feature-icon">📱</div>
				<h3>Responsive</h3>
				<p>Works perfectly on all screen sizes - from mobile phones to desktop computers.</p>
			</div>
			<div class="feature">
				<div class="feature-icon">🎨</div>
				<h3>Customizable</h3>
				<p>Flexible styling options and configuration to match your application's design.</p>
			</div>
			<div class="feature">
				<div class="feature-icon">🏷️</div>
				<h3>TypeScript</h3>
				<p>Full TypeScript support with comprehensive type definitions included.</p>
			</div>
		</div>
	</section>

	<section class="code-example">
		<h2>📝 Installation & Usage</h2>
		<div class="code-block">
			<h3>Install the package:</h3>
			<pre><code>npm install mapker leaflet @types/leaflet</code></pre>
		</div>

		<div class="code-block">
			<h3>Basic usage in your Svelte component:</h3>
			<pre><code>&lt;script lang="ts"&gt;
  import &#123; MapPicker &#125; from 'mapker';

  let selectedLocation = null;

  function handleLocation(event) &#123;
    const &#123; lat, lng &#125; = event.detail;
    console.log('Location:', lat, lng);
  &#125;
&lt;/script&gt;

&lt;MapPicker
  bind:selectedLocation
  on:locationSelected=&#123;handleLocation&#125;
  width="100%"
  height="400px"
/&gt;</code></pre>
		</div>
	</section>

	<footer class="footer">
		<p>Made with ❤️ using OpenStreetMap and Leaflet. <a href="https://github.com/MrPinguiiin/MapKer">View on GitHub</a></p>
	</footer>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.badges {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.badge {
		background: #f0f0f0;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.demo-section {
		margin-bottom: 4rem;
	}

	.demo-section h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.demo-section p {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.map-demo {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}

	.map-demo.compact {
		max-width: 600px;
		margin: 0 auto 1rem auto;
	}

	.result {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 4px;
		border-left: 4px solid #007bff;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.features {
		margin-bottom: 4rem;
	}

	.features h2 {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.feature {
		text-align: center;
		padding: 2rem;
		background: #f8f9fa;
		border-radius: 8px;
		transition: transform 0.2s;
	}

	.feature:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.feature-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.feature h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.feature p {
		color: #666;
		line-height: 1.5;
	}

	.code-example {
		margin-bottom: 4rem;
	}

	.code-example h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.code-block {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.code-block h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #333;
	}

	.code-block pre {
		background: #2d3748;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0;
	}

	.code-block code {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
	}

	.footer {
		text-align: center;
		padding: 2rem 0;
		border-top: 1px solid #e9ecef;
		color: #666;
	}

	.footer a {
		color: #007bff;
		text-decoration: none;
	}

	.footer a:hover {
		text-decoration: underline;
	}
</style>
