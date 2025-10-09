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
		showLocationInfo = false,
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

	async function getLocationInfo(lat: number, lng: number): Promise<{name: string, address: string}> {
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
			const data = await response.json();
			
			const name = data.display_name?.split(',')[0] || 'Selected Location';
			const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
			
			return { name, address };
		} catch (error) {
			return {
				name: 'Selected Location',
				address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
			};
		}
	}

	// Update location info when selected (only if name/address not already set)
	$effect(() => {
		if (selectedLocation && showLocationInfo && !selectedLocation.name) {
			const { lat, lng } = selectedLocation;
			getLocationInfo(lat, lng).then(info => {
				selectedLocation = {
					lat,
					lng,
					name: info.name,
					address: info.address
				};
			});
		}
	});
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

	{#if showLocationInfo && selectedLocation}
		<div class="location-info-card">
			<div class="location-header">
				<h3 class="location-name">{selectedLocation.name || 'Selected Location'}</h3>
				<button class="close-btn" onclick={() => showLocationInfo = false}>×</button>
			</div>
			<div class="location-details">
				<p class="location-address">{selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}</p>
				<div class="location-actions">
					<button class="action-btn" onclick={() => selectedLocation && window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`, '_blank')}>
						🗺️ Directions
					</button>
					<button class="action-btn" onclick={() => selectedLocation && window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`, '_blank')}>
						📍 View on Google Maps
					</button>
				</div>
			</div>
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
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}

	.map-container:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.coordinates-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
		font-size: 0.875rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.coordinates-label {
		font-weight: 500;
		color: #495057;
	}

	.coordinates-value {
		color: #2196f3;
		font-weight: 600;
		background: linear-gradient(135deg, #2196f3, #64b5f6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.embed-section {
		margin-top: 1rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.embed-section h4 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1rem;
	}

	.embed-preview {
		margin-bottom: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
		padding: 0.75rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
		font-size: 0.75rem;
		resize: vertical;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: border-color 0.2s ease;
	}

	.embed-code textarea:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(33, 150, 243, 0.2);
	}

	.embed-code button {
		align-self: flex-start;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
		transition: all 0.2s ease;
	}

	.embed-code button:hover {
		background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
		box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
		transform: translateY(-1px);
	}

	.embed-code button:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
	}

	.location-info-card {
		margin-top: 1rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border: 1px solid #e0e0e0;
		overflow: hidden;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.location-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border-bottom: 1px solid #e0e0e0;
	}

	.location-name {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #666;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		background-color: #f0f0f0;
		color: #333;
	}

	.location-details {
		padding: 1.5rem;
	}

	.location-address {
		margin: 0 0 1rem 0;
		color: #666;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.location-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.action-btn {
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
	}

	.action-btn:hover {
		background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
		box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
		transform: translateY(-1px);
	}

	.action-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
	}
</style>
