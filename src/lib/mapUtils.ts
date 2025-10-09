import type { Location, MapInstance } from './types.js';

export class MapManager {
	private mapInstance: MapInstance | null = null;
	private mapContainer: HTMLElement | null = null;

	async initialize(
		container: HTMLElement,
		center: [number, number],
		zoom: number,
		enableSearch: boolean
	): Promise<MapInstance> {
		// Dynamic imports to avoid SSR issues
		const leaflet = await import('leaflet');
		const geosearch = await import('leaflet-geosearch');
		await import('leaflet/dist/leaflet.css');
		await import('leaflet-geosearch/dist/geosearch.css');

		const L = leaflet.default;
		const OpenStreetMapProvider = geosearch.OpenStreetMapProvider;
		const GeoSearchControl = geosearch.GeoSearchControl;

		// Fix for default markers in Leaflet with bundlers
		this.fixLeafletIcons(L);

		// Initialize map
		const map = L.map(container).setView(center, zoom);

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19,
		}).addTo(map);

		// Add search control if enabled
		if (enableSearch) {
			const provider = new OpenStreetMapProvider();
			const searchControl = GeoSearchControl({
				provider: provider,
				style: 'bar',
				showMarker: false,
				searchLabel: 'Search for places...',
			});
			map.addControl(searchControl);
		}

		this.mapInstance = {
			map,
			marker: null,
			L,
			OpenStreetMapProvider,
			GeoSearchControl,
		};

		this.mapContainer = container;
		return this.mapInstance;
	}

	private fixLeafletIcons(L: any): void {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
		});
	}

	addClickHandler(callback: (location: Location) => void): void {
		if (!this.mapInstance) return;

		this.mapInstance.map.on('click', (e: any) => {
			const { lat, lng } = e.latlng;
			this.updateMarker({ lat, lng });
			callback({ lat, lng });
		});
	}

	updateMarker(location: Location): void {
		if (!this.mapInstance) return;

		const { map, marker, L } = this.mapInstance;

		// Remove existing marker
		if (marker) {
			map.removeLayer(marker);
		}

		// Add new marker
		this.mapInstance.marker = L.marker([location.lat, location.lng]).addTo(map);
	}

	setInitialMarker(location: Location): void {
		if (!this.mapInstance) return;

		const { map, L } = this.mapInstance;
		this.mapInstance.marker = L.marker([location.lat, location.lng]).addTo(map);
	}

	updateView(location: Location): void {
		if (!this.mapInstance) return;

		const { map } = this.mapInstance;
		map.setView([location.lat, location.lng], map.getZoom());
	}

	destroy(): void {
		if (this.mapInstance?.map) {
			this.mapInstance.map.remove();
			this.mapInstance = null;
		}
		this.mapContainer = null;
	}

	getInstance(): MapInstance | null {
		return this.mapInstance;
	}
}
