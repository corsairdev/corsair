import type { CommCareEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

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
		(domain, { caseIds, fields, fieldsProperties }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/case/v2/bulk-fetch/`,
			query: {
				case_ids: caseIds.join(','),
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
		(domain, { externalId, caseType }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/case/v2/ext/${segment(externalId)}/`,
			query: { ...(caseType !== undefined ? { case_type: caseType } : {}) },
			replaySafe: true,
		}),
	);
