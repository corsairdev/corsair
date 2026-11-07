import { asRecord } from 'corsair/core';
import type { CommCareEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// v0.5 list helper: flatten the Tastypie next-page link. Some CommCare
// listings answer a bare array instead of the `{ meta, objects }` envelope;
// both normalize to `{ objects }`.
function listWithMeta(raw: unknown): unknown {
	if (Array.isArray(raw)) return { objects: raw };
	const record = raw as {
		objects?: unknown;
		meta?: { next?: string } | null;
		nextPageUrl?: string;
	} | null;
	if (!record || typeof record !== 'object') return raw;
	return {
		...record,
		nextPageUrl: record.meta?.next ?? undefined,
	};
}

export const listWebUsers: CommCareEndpoints['webUsersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webUsers.list',
			input: Inputs.webUsersList,
			output: Outputs.webUsersList,
		},
		input,
		(domain, { limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/web-user/v1/`,
			query: { limit, offset },
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const listLocations: CommCareEndpoints['locationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.list',
			input: Inputs.locationsList,
			output: Outputs.locationsList,
		},
		input,
		(domain, { siteCode, name, locationTypeCode, limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/location/v2/`,
			query: {
				site_code: siteCode,
				name,
				location_type_code: locationTypeCode,
				limit,
				offset,
			},
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const getLocation: CommCareEndpoints['locationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.get',
			input: Inputs.locationsGet,
			output: Outputs.locationsGet,
		},
		input,
		(domain, { locationId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/location/v2/${segment(locationId)}/`,
			replaySafe: true,
		}),
	);

export const listLocationTypes: CommCareEndpoints['locationTypesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'locationTypes.list',
			input: Inputs.locationTypesList,
			output: Outputs.locationTypesList,
		},
		input,
		(domain, { limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/location_type/v1/`,
			query: { limit, offset },
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const getLocationType: CommCareEndpoints['locationTypesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'locationTypes.get',
			input: Inputs.locationTypesGet,
			output: Outputs.locationTypesGet,
		},
		input,
		(domain, { typeId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/location_type/v1/${segment(typeId)}/`,
			replaySafe: true,
		}),
	);

export const listFixtures: CommCareEndpoints['fixturesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fixtures.list',
			input: Inputs.fixturesList,
			output: Outputs.fixturesList,
		},
		input,
		(domain, { fixtureType, limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/fixture/v1/`,
			query: {
				...(fixtureType !== undefined ? { fixture_type: fixtureType } : {}),
			},
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const getFixtureItem: CommCareEndpoints['fixturesGetItem'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'fixtures.getItem',
			input: Inputs.fixturesGetItem,
			output: Outputs.fixturesGetItem,
		},
		input,
		(domain, { itemId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/fixture/v1/${segment(itemId)}/`,
			replaySafe: true,
		}),
	);

export const listLookupTables: CommCareEndpoints['lookupTablesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lookupTables.list',
			input: Inputs.lookupTablesList,
			output: Outputs.lookupTablesList,
		},
		input,
		(domain, { limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/lookup_table/v1/`,
			query: { limit, offset },
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const getLookupTable: CommCareEndpoints['lookupTablesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lookupTables.get',
			input: Inputs.lookupTablesGet,
			output: Outputs.lookupTablesGet,
		},
		input,
		(domain, { tableId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/lookup_table/v1/${segment(tableId)}/`,
			replaySafe: true,
		}),
	);

// The configurable report data endpoint takes the report's own filter
// parameters alongside offset and limit; those extra keys pass through.
export const listReports: CommCareEndpoints['reportsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.list',
			input: Inputs.reportsList,
			output: Outputs.reportsList,
		},
		input,
		(domain) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/simplereportconfiguration/v1/`,
			query: { format: 'json' },
			replaySafe: true,
		}),
		{
			// The endpoint answers a bare array of report configurations.
			shape: (raw) => ({
				reports: Array.isArray(raw)
					? raw
					: ((asRecord(raw)?.objects as unknown[] | undefined) ?? []),
			}),
			log: (_, result) => ({ count: result.reports.length }),
		},
	);

export const getReportData: CommCareEndpoints['reportsGetData'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.getData',
			input: Inputs.reportsGetData,
			output: Outputs.reportsGetData,
		},
		input,
		(domain, { reportId, offset, limit, filters }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/configurablereportdata/v1/${segment(reportId)}/`,
			query: { offset, limit, ...filters },
			replaySafe: true,
		}),
		{
			log: (parsed, result) => ({
				reportId: parsed.reportId,
				rows: result.data?.length ?? 0,
			}),
		},
	);

export const listDetExports: CommCareEndpoints['detExportsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'detExports.list',
			input: Inputs.detExportsList,
			output: Outputs.detExportsList,
		},
		input,
		(domain, { limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/det_export_instance/v1/`,
			query: { limit, offset },
			replaySafe: true,
		}),
		{
			shape: (raw) => ({
				detExports: Array.isArray(raw)
					? raw
					: ((asRecord(raw)?.objects as unknown[] | undefined) ?? []),
			}),
			log: (_, result) => ({ count: result.detExports.length }),
		},
	);
