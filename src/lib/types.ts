export interface Location {
	lat: number;
	lng: number;
}

export interface MapPickerProps {
	width?: string;
	height?: string;
	center?: [number, number];
	zoom?: number;
	selectedLocation?: Location | null;
	placeholder?: string;
	showCoordinates?: boolean;
	enableSearch?: boolean;
	showEmbedCode?: boolean;
}

export interface MapInstance {
	map: any;
	marker: any;
	L: any;
	OpenStreetMapProvider: any;
	GeoSearchControl: any;
}
