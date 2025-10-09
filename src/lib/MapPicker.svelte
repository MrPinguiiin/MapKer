<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { MapManager } from './mapUtils.js';
	import type { MapPickerProps, Location } from './types.js';

	let {
		width = '100%',
		height = '400px',
		center = [-6.2, 106.816666],
		zoom = 13,
		selectedLocation = $bindable(),
		placeholder = 'Click on the map to select a location',
		showCoordinates = true,
		enableSearch = false,
		showEmbedCode = false,
	}: MapPickerProps = $props();

	let mapContainer: HTMLDivElement;
	let mapManager: MapManager | null = null;

	const handleLocationSelected = (location: Location): void => { selectedLocation = location; };

	onMount(async () => {
		if (!browser) return;
		mapManager = new MapManager();
		await mapManager.initialize(mapContainer, center, zoom, enableSearch);
		mapManager.addClickHandler(handleLocationSelected);
		if (selectedLocation) mapManager.setInitialMarker(selectedLocation);
	});

	onDestroy(() => mapManager?.destroy());

	$effect(() => {
		if (browser && mapManager && selectedLocation) {
			mapManager.updateMarker(selectedLocation);
			mapManager.updateView(selectedLocation);
		}
	});

	let formattedCoords = $derived(selectedLocation ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}` : placeholder);
	
	let embedCode = $derived(selectedLocation ? `<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng-0.01},${selectedLocation.lat-0.01},${selectedLocation.lng+0.01},${selectedLocation.lat+0.01}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}" width="600" height="400" frameborder="0"></iframe>` : '');
</script>

<div class="map-picker">
	<div
		bind:this={mapContainer}
		style="width: {width}; height: {height};"
		class="map-container"
		role="application"
		aria-label="Interactive map for location selection"
	></div>

	{#if showCoordinates}
		<div class="coordinates-display">
			<span class="coordinates-label">Selected Location:</span>
			<span class="coordinates-value">{formattedCoords}</span>
		</div>
	{/if}

	{#if showEmbedCode && selectedLocation}
		<div class="embed-section">
			<h4>Embed Code:</h4>
			<div class="embed-preview">
				<iframe 
					src="https://www.openstreetmap.org/export/embed.html?bbox={selectedLocation.lng-0.01},{selectedLocation.lat-0.01},{selectedLocation.lng+0.01},{selectedLocation.lat+0.01}&layer=mapnik&marker={selectedLocation.lat},{selectedLocation.lng}" 
					width="100%" 
					height="200" 
					frameborder="0"
					title="OpenStreetMap embed showing selected location">
				</iframe>
			</div>
			<div class="embed-code">
				<label for="embed-textarea">HTML Code:</label>
				<textarea id="embed-textarea" readonly>{embedCode}</textarea>
				<button onclick={() => navigator.clipboard.writeText(embedCode)}>Copy Code</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.map-picker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.map-container {
		border: 1px solid #ddd;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.coordinates-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.coordinates-label {
		font-weight: 500;
		color: #495057;
	}

	.coordinates-value {
		color: #007bff;
		font-weight: 600;
	}

	.embed-section {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
	}

	.embed-section h4 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1rem;
	}

	.embed-preview {
		margin-bottom: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.embed-code {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.embed-code label {
		font-weight: 500;
		color: #495057;
		font-size: 0.875rem;
	}

	.embed-code textarea {
		width: 100%;
		height: 80px;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.75rem;
		resize: vertical;
		background-color: #f8f9fa;
	}

	.embed-code button {
		align-self: flex-start;
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s;
	}

	.embed-code button:hover {
		background-color: #0056b3;
	}
</style>
