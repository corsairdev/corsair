import { asRecord } from 'corsair/core';
import type { CommCareEndpoints } from '..';
import { COMMCARE_API_BASE, segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// The v2 list pages by cursor: `next` is a full URL whose `cursor` value is
// base64 and URL-encoded. Hand the decoded value back as `nextCursor` so a
// caller passes it straight to `cursor` instead of re-encoding the link text.
// unknown: the raw body is untyped until the output schema validates it.
function withNextCursor(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) return raw;
	const next = typeof record.next === 'string' ? record.next : undefined;
	let nextCursor: string | undefined;
	if (next) {
		try {
			nextCursor =
				new URL(next, COMMCARE_API_BASE).searchParams.get('cursor') ??
				undefined;
		} catch {
			nextCursor = undefined;
		}
	}
	return { ...record, nextCursor };
}

export const list: CommCareEndpoints['casesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cases.list',
			input: Inputs.casesList,
			output: Outputs.casesList,
		},
		input,
		(
			domain,
			{
				cursor,
				limit,
				caseType,
				ownerId,
				caseName,
				closed,
				externalId,
				indicesParent,
				indicesHost,
			},
		) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/case/v2/`,
			query: {
				cursor,
				limit,
				case_type: caseType,
				owner_id: ownerId,
				case_name: caseName,
				closed,
				external_id: externalId,
				'indices.parent': indicesParent,
				'indices.host': indicesHost,
			},
			replaySafe: true,
		}),
		{
			shape: withNextCursor,
			log: (_, result) => ({
				count: result.cases.length,
				matchingRecords: result.matching_records ?? undefined,
			}),
		},
	);

export const get: CommCareEndpoints['casesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cases.get',
			input: Inputs.casesGet,
			output: Outputs.casesGet,
		},
		input,
		(domain, { caseId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/case/v2/${segment(caseId)}`,
			replaySafe: true,
		}),
	);

export const bulkFetch: CommCareEndpoints['casesBulkFetch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cases.bulkFetch',
			input: Inputs.casesBulkFetch,
			output: Outputs.casesBulkFetch,
		},
		input,
		// The ids go in a JSON POST body; only the field filters ride on the
		// query string. A read, so a 5xx can be replayed.
		(domain, { caseIds, fields, fieldsProperties }) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/api/case/v2/bulk-fetch/`,
			body: { case_ids: caseIds },
			query: {
				...(fields?.length ? { fields: fields.join(',') } : {}),
				...(fieldsProperties?.length
					? { 'fields.properties': fieldsProperties.join(',') }
					: {}),
			},
			replaySafe: true,
		}),
		{
			log: (_, result) => ({ count: result.cases.length }),
		},
	);

export const getByExternalId: CommCareEndpoints['casesGetByExternalId'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'cases.getByExternalId',
			input: Inputs.casesGetByExternalId,
			output: Outputs.casesGetByExternalId,
		},
		input,
		// CommCare matches on the external id alone; when several cases share
		// it, the lookup answers 400 naming them.
		(domain, { externalId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/case/v2/ext/${segment(externalId)}/`,
			replaySafe: true,
		}),
	);
