import { asRecord } from 'corsair/core';
import type { HappyScribeContext, HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

// Transcription objects carry `_links` HATEOAS maps; expose them as `links`.
function withLinks(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || record._links === undefined) return raw;
	return { ...record, links: record._links };
}

function listWithLinks(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) return raw;
	const results = Array.isArray(record.results) ? record.results : [];
	return {
		...record,
		results: results.map((item) => withLinks(item)),
		nextPageUrl: asRecord(asRecord(record._links)?.next)?.url,
	};
}

export const list: HappyScribeEndpoints['transcriptionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transcriptions.list',
			input: Inputs.transcriptionsList,
			output: Outputs.transcriptionsList,
		},
		input,
		({
			organizationId,
			folderId,
			page,
			perPage,
			personId,
			personEmail,
			companyId,
			companyDomain,
		}) => ({
			method: 'GET',
			path: '/transcriptions',
			query: {
				organization_id: organizationId,
				folder_id: folderId,
				page,
				per_page: perPage,
				person_id: personId,
				person_email: personEmail,
				company_id: companyId,
				company_domain: companyDomain,
			},
			replaySafe: true,
		}),
		{
			shape: listWithLinks,
			log: (_, result) => ({ count: result.results.length, hasMore: result.nextPageUrl !== undefined }),
		},
	);

export const create: HappyScribeEndpoints['transcriptionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transcriptions.create',
			input: Inputs.transcriptionsCreate,
			output: Outputs.transcriptionsCreate,
		},
		input,
		({ organizationId, name, language, tmpUrl, isSubtitle, folderId, tags }) => ({
			method: 'POST',
			path: '/transcriptions',
			body: {
				transcription: {
					name,
					language,
					tmp_url: tmpUrl,
					is_subtitle: isSubtitle,
					organization_id: organizationId,
					folder_id: folderId,
					tags,
				},
			},
		}),
		{
			shape: withLinks,
			log: (parsed, result) => ({
				fileId: result.id,
				name: parsed.name,
				language: parsed.language,
			}),
		},
	);

export const getDetails: HappyScribeEndpoints['transcriptionsGetDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transcriptions.getDetails',
			input: Inputs.transcriptionsGetDetails,
			output: Outputs.transcriptionsGetDetails,
		},
		input,
		({ fileId }) => ({
			method: 'GET',
			path: `/transcriptions/${segment(fileId)}`,
			replaySafe: true,
		}),
		{ shape: withLinks },
	);

export const getSummary: HappyScribeEndpoints['transcriptionsGetSummary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transcriptions.getSummary',
			input: Inputs.transcriptionsGetSummary,
			output: Outputs.transcriptionsGetSummary,
		},
		input,
		({ fileId }) => ({
			method: 'GET',
			path: `/transcriptions/${segment(fileId)}/summary`,
			replaySafe: true,
		}),
	);

export const updateDetails: HappyScribeEndpoints['transcriptionsUpdateDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transcriptions.updateDetails',
			input: Inputs.transcriptionsUpdateDetails,
			output: Outputs.transcriptionsUpdateDetails,
		},
		input,
		({ fileId, organizationId, sharingEnabled }) => ({
			method: 'PATCH',
			path: `/transcriptions/${segment(fileId)}`,
			body: {
				transcription: {
					organization_id: organizationId,
					sharing_enabled: sharingEnabled,
				},
			},
		}),
	);

export const remove: HappyScribeEndpoints['transcriptionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transcriptions.delete',
			input: Inputs.transcriptionsDelete,
			output: Outputs.transcriptionsDelete,
		},
		input,
		({ fileId }) => ({
			method: 'DELETE',
			path: `/transcriptions/${segment(fileId)}`,
		}),
		{
			// The deletion carries no body.
			shape: (raw) => raw ?? {},
			log: ({ fileId }) => ({ fileId }),
		},
	);
