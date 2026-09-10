import { z } from 'zod';

/**
 * WGS 84 position on a HERE search or routing result.
 * Official: https://docs.here.com/geocoding-and-search/docs/get-started-with-here-geocoding-and-search-api-v7
 */
export const HerePosition = z
	.object({
		lat: z.number(),
		lng: z.number(),
	})
	.loose();

export type HerePosition = z.infer<typeof HerePosition>;

/**
 * Address breakdown from Geocoding & Search v7 items[].address.
 * Official: https://docs.here.com/geocoding-and-search/docs/get-started-with-here-geocoding-and-search-api-v7
 */
export const HereAddress = z
	.object({
		label: z.string().optional(),
		countryCode: z.string().optional(),
		countryName: z.string().optional(),
		state: z.string().optional(),
		stateCode: z.string().optional(),
		county: z.string().optional(),
		city: z.string().optional(),
		district: z.string().optional(),
		street: z.string().optional(),
		postalCode: z.string().optional(),
		houseNumber: z.string().optional(),
	})
	.loose();

export type HereAddress = z.infer<typeof HereAddress>;

/**
 * Location item from /geocode, /revgeocode, /discover, /browse, /autosuggest, /lookup.
 * Official: https://docs.here.com/geocoding-and-search/docs/get-started-with-here-geocoding-and-search-api-v7
 */
export const HerePlace = z
	.object({
		title: z.string().optional(),
		id: z.string().optional(),
		resultType: z.string().optional(),
		address: HereAddress.optional(),
		position: HerePosition.optional(),
		access: z.array(HerePosition).optional(),
		distance: z.number().optional(),
	})
	.loose();

export type HerePlace = z.infer<typeof HerePlace>;

/**
 * Routing v8 route envelope (routes[]).
 * Official: https://docs.here.com/routing/docs/routing-v8-get-started
 */
export const HereRoute = z
	.object({
		id: z.string().optional(),
		sections: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export type HereRoute = z.infer<typeof HereRoute>;

/**
 * Destination Weather v3 place row (places[]).
 * Official: https://docs.here.com/destination-weather/docs/resource-report-1
 */
export const HereWeatherPlace = z
	.object({
		id: z.string().optional(),
		countryCode: z.string().optional(),
		timezone: z.number().optional(),
	})
	.loose();

export type HereWeatherPlace = z.infer<typeof HereWeatherPlace>;

/**
 * Traffic v7 results[] row for /flow and /incidents.
 * Official: https://docs.here.com/traffic-api/docs/introduction-to-here-traffic-api-v7
 */
export const HereTrafficResult = z
	.object({
		location: z.record(z.string(), z.unknown()).optional(),
		currentFlow: z.record(z.string(), z.unknown()).optional(),
		incidentDetails: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type HereTrafficResult = z.infer<typeof HereTrafficResult>;
