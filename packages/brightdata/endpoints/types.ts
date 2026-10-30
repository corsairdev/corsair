import { z } from 'zod';
import {
	BrightDataCities,
	BrightDataCountries,
	BrightDataDataset,
	BrightDataSerpResult,
	BrightDataSnapshotProgress,
	BrightDataSnapshotRef,
	BrightDataSnapshotResults,
	BrightDataUnlockerResult,
	BrightDataZone,
} from '../schema';

export const ListDatasetsInputSchema = z.object({});
export type ListDatasetsInput = z.infer<typeof ListDatasetsInputSchema>;
export const ListDatasetsOutputSchema = z.array(BrightDataDataset);
export type ListDatasetsOutput = z.infer<typeof ListDatasetsOutputSchema>;

export const GetSnapshotStatusInputSchema = z.object({
	snapshot_id: z
		.string()
		.describe(
			'Official path {snapshot_id} on GET /datasets/v3/progress/{snapshot_id}',
		),
});
export type GetSnapshotStatusInput = z.infer<
	typeof GetSnapshotStatusInputSchema
>;
export const GetSnapshotStatusOutputSchema = BrightDataSnapshotProgress;
export type GetSnapshotStatusOutput = BrightDataSnapshotProgress;

export const GetSnapshotResultsInputSchema = z.object({
	snapshot_id: z
		.string()
		.describe(
			'Official path {snapshot_id} on GET /datasets/v3/snapshot/{snapshot_id}',
		),
	format: z.enum(['json', 'ndjson', 'jsonl', 'csv']).optional(),
	compress: z.boolean().optional(),
	batch_size: z.number().int().min(1000).optional(),
	part: z.number().int().min(1).optional(),
});
export type GetSnapshotResultsInput = z.infer<
	typeof GetSnapshotResultsInputSchema
>;
export const GetSnapshotResultsOutputSchema = BrightDataSnapshotResults;
export type GetSnapshotResultsOutput = BrightDataSnapshotResults;

export const FilterDatasetInputSchema = z.object({
	dataset_id: z.string(),
	filter: z.record(z.string(), z.unknown()),
	records_limit: z.number().int().min(1).optional(),
});
export type FilterDatasetInput = z.infer<typeof FilterDatasetInputSchema>;
export const FilterDatasetOutputSchema = BrightDataSnapshotRef;
export type FilterDatasetOutput = BrightDataSnapshotRef;

export const GetAvailableCitiesInputSchema = z.object({
	country: z.string().describe('Official query: ?country='),
	pool_ip_type: z.enum(['dc', 'static_res']).optional(),
});
export type GetAvailableCitiesInput = z.infer<
	typeof GetAvailableCitiesInputSchema
>;
export const GetAvailableCitiesOutputSchema = BrightDataCities;
export type GetAvailableCitiesOutput = BrightDataCities;

export const GetAvailableCountriesInputSchema = z.object({});
export type GetAvailableCountriesInput = z.infer<
	typeof GetAvailableCountriesInputSchema
>;
export const GetAvailableCountriesOutputSchema = BrightDataCountries;
export type GetAvailableCountriesOutput = BrightDataCountries;

export const ListWebUnlockerZonesInputSchema = z.object({});
export type ListWebUnlockerZonesInput = z.infer<
	typeof ListWebUnlockerZonesInputSchema
>;
export const ListWebUnlockerZonesOutputSchema = z.array(BrightDataZone);
export type ListWebUnlockerZonesOutput = z.infer<
	typeof ListWebUnlockerZonesOutputSchema
>;

export const SerpSearchInputSchema = z.object({
	zone: z.string(),
	q_keywords: z.string(),
	search_engine: z
		.enum(['google', 'bing', 'yahoo', 'yandex', 'duckduckgo'])
		.optional(),
	format: z.enum(['json', 'raw']).optional(),
	method: z.string().optional(),
	country: z.string().optional(),
	data_format: z.enum(['markdown', 'screenshot']).optional(),
});
export type SerpSearchInput = z.infer<typeof SerpSearchInputSchema>;
export const SerpSearchOutputSchema = z.union([
	z.string(),
	BrightDataSerpResult,
]);
export type SerpSearchOutput = z.infer<typeof SerpSearchOutputSchema>;

export const CrawlApiInputSchema = z.object({
	dataset_id: z.string().describe('Official query: ?dataset_id='),
	items: z.array(z.record(z.string(), z.unknown())),
	include_errors: z.boolean().optional(),
	custom_output_fields: z.string().optional(),
});
export type CrawlApiInput = z.infer<typeof CrawlApiInputSchema>;
export const CrawlApiOutputSchema = BrightDataSnapshotRef;
export type CrawlApiOutput = BrightDataSnapshotRef;

export const WebUnlockerInputSchema = z.object({
	url: z.string(),
	zone: z.string(),
	format: z.enum(['json', 'raw']).optional(),
	country: z.string().optional(),
	data_format: z.enum(['markdown', 'screenshot']).optional(),
});
export type WebUnlockerInput = z.infer<typeof WebUnlockerInputSchema>;
export const WebUnlockerOutputSchema = BrightDataUnlockerResult;
export type WebUnlockerOutput = BrightDataUnlockerResult;

export type BrightDataEndpointInputs = {
	listDatasets: ListDatasetsInput;
	getSnapshotStatus: GetSnapshotStatusInput;
	getSnapshotResults: GetSnapshotResultsInput;
	filterDataset: FilterDatasetInput;
	getAvailableCities: GetAvailableCitiesInput;
	getAvailableCountries: GetAvailableCountriesInput;
	listWebUnlockerZones: ListWebUnlockerZonesInput;
	serpSearch: SerpSearchInput;
	crawlApi: CrawlApiInput;
	webUnlocker: WebUnlockerInput;
};

export type BrightDataEndpointOutputs = {
	listDatasets: ListDatasetsOutput;
	getSnapshotStatus: GetSnapshotStatusOutput;
	getSnapshotResults: GetSnapshotResultsOutput;
	filterDataset: FilterDatasetOutput;
	getAvailableCities: GetAvailableCitiesOutput;
	getAvailableCountries: GetAvailableCountriesOutput;
	listWebUnlockerZones: ListWebUnlockerZonesOutput;
	serpSearch: SerpSearchOutput;
	crawlApi: CrawlApiOutput;
	webUnlocker: WebUnlockerOutput;
};

export const BrightDataEndpointInputSchemas = {
	listDatasets: ListDatasetsInputSchema,
	getSnapshotStatus: GetSnapshotStatusInputSchema,
	getSnapshotResults: GetSnapshotResultsInputSchema,
	filterDataset: FilterDatasetInputSchema,
	getAvailableCities: GetAvailableCitiesInputSchema,
	getAvailableCountries: GetAvailableCountriesInputSchema,
	listWebUnlockerZones: ListWebUnlockerZonesInputSchema,
	serpSearch: SerpSearchInputSchema,
	crawlApi: CrawlApiInputSchema,
	webUnlocker: WebUnlockerInputSchema,
} as const;

export const BrightDataEndpointOutputSchemas = {
	listDatasets: ListDatasetsOutputSchema,
	getSnapshotStatus: GetSnapshotStatusOutputSchema,
	getSnapshotResults: GetSnapshotResultsOutputSchema,
	filterDataset: FilterDatasetOutputSchema,
	getAvailableCities: GetAvailableCitiesOutputSchema,
	getAvailableCountries: GetAvailableCountriesOutputSchema,
	listWebUnlockerZones: ListWebUnlockerZonesOutputSchema,
	serpSearch: SerpSearchOutputSchema,
	crawlApi: CrawlApiOutputSchema,
	webUnlocker: WebUnlockerOutputSchema,
} as const;
