import { z } from 'zod';

/**
 * Marketplace dataset list item.
 * Official: GET /datasets/list — DatasetListItem
 * https://docs.brightdata.com/api-reference/marketplace-dataset-api/get-dataset-list
 */
export const BrightDataDataset = z
	.object({
		id: z.string(),
		name: z.string(),
		size: z.number().optional(),
	})
	.loose();

export type BrightDataDataset = z.infer<typeof BrightDataDataset>;

/**
 * Snapshot created by trigger or filter.
 * Official: POST /datasets/v3/trigger and POST /datasets/filter
 * https://docs.brightdata.com/api-reference/rest-api/scraper/asynchronous-requests
 */
export const BrightDataSnapshotRef = z
	.object({
		snapshot_id: z.string(),
	})
	.loose();

export type BrightDataSnapshotRef = z.infer<typeof BrightDataSnapshotRef>;

/**
 * Snapshot collection status.
 * Official: GET /datasets/v3/progress/{snapshot_id}
 * https://docs.brightdata.com/api-reference/scrapers/management-apis/monitor-progress
 */
export const BrightDataSnapshotProgress = z
	.object({
		snapshot_id: z.string().optional(),
		dataset_id: z.string().optional(),
		status: z.enum(['starting', 'running', 'ready', 'failed', 'canceled']),
	})
	.loose();

export type BrightDataSnapshotProgress = z.infer<
	typeof BrightDataSnapshotProgress
>;

/**
 * Downloaded snapshot payload (JSON array or CSV/NDJSON text).
 * Official: GET /datasets/v3/snapshot/{snapshot_id}
 * https://docs.brightdata.com/api-reference/scrapers/delivery-apis/download-snapshot
 */
export const BrightDataSnapshotResults = z.union([
	z.array(z.record(z.string(), z.unknown())),
	z.string(),
]);

export type BrightDataSnapshotResults = z.infer<
	typeof BrightDataSnapshotResults
>;

/**
 * Active zone.
 * Official: GET /zone/get_active_zones — Zone
 * https://docs.brightdata.com/api-reference/account-management-api/Get_active_Zones
 */
export const BrightDataZone = z
	.object({
		name: z.string(),
		type: z.string().optional(),
	})
	.loose();

export type BrightDataZone = z.infer<typeof BrightDataZone>;

/**
 * Countries grouped by zone type.
 * Official: GET /countrieslist
 * https://docs.brightdata.com/api-reference/account-management-api/Get_Available_Countries
 */
export const BrightDataCountryCodes = z
	.object({
		country_codes: z.array(z.string()),
	})
	.loose();

export const BrightDataCountries = z
	.object({
		zone_types: z.record(z.string(), BrightDataCountryCodes).optional(),
	})
	.loose();

export type BrightDataCountries = z.infer<typeof BrightDataCountries>;

/**
 * Static-network city slugs for a country.
 * Official: GET /zone/static/cities
 * https://docs.brightdata.com/api-reference/account-management-api/Get_list_of_available_cities_of_static_network_per_country
 */
export const BrightDataCities = z.array(z.string());

export type BrightDataCities = z.infer<typeof BrightDataCities>;

/**
 * Web Unlocker JSON response.
 * Official: POST /request — SuccessfulUnlockerResponse
 * https://docs.brightdata.com/api-reference/rest-api/unlocker/unlock-website
 */
export const BrightDataUnlockerJson = z
	.object({
		status_code: z.number().optional(),
		headers: z.record(z.string(), z.unknown()).optional(),
		body: z.unknown().optional(),
	})
	.loose();

export const BrightDataUnlockerResult = z.union([
	z.string(),
	BrightDataUnlockerJson,
]);

export type BrightDataUnlockerResult = z.infer<typeof BrightDataUnlockerResult>;

/**
 * SERP structured JSON (organic listings, ads, knowledge).
 * Official: POST /request — SuccessfulSERPResponse
 * https://docs.brightdata.com/api-reference/rest-api/serp/serp-api
 */
export const BrightDataSerpResult = z
	.object({
		general: z.record(z.string(), z.unknown()).optional(),
		input: z.record(z.string(), z.unknown()).optional(),
		organic: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export type BrightDataSerpResult = z.infer<typeof BrightDataSerpResult>;
