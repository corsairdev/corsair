import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** Update or create guide drafts by filePath. */
export const guidesUpsertDraft: HexEndpoints['guidesUpsertDraft'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.guidesUpsertDraft.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['guidesUpsertDraft']
	>(`/v1/guides/draft`, ctx.key, {
		method: 'PUT',
		body: {
			forceWrite: parsedInput.forceWrite,
			files: parsedInput.files,
		},
	});
	const parsed = HexEndpointOutputSchemas.guidesUpsertDraft.parse(response);
	await logEventFromContext(
		ctx,
		'hex.guides.upsertDraft',
		{ operation: 'guides.upsertDraft' },
		'completed',
	);
	return parsed;
};

export const guidesDeleteDraft: HexEndpoints['guidesDeleteDraft'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.guidesDeleteDraft.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['guidesDeleteDraft']
	>(
		`/v1/guides/draft/${encodeURIComponent(String(parsedInput.orgGuideFileId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed = HexEndpointOutputSchemas.guidesDeleteDraft.parse(response);
	await logEventFromContext(
		ctx,
		'hex.guides.deleteDraft',
		{ operation: 'guides.deleteDraft' },
		'completed',
	);
	return parsed;
};

/** List draft guides */
export const guidesListDrafts: HexEndpoints['guidesListDrafts'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.guidesListDrafts.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['guidesListDrafts']>(
		`/v1/guides/draft/list`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				limit: parsedInput.limit,
				after: parsedInput.after,
				before: parsedInput.before,
				externalSource: parsedInput.externalSource,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.guidesListDrafts.parse(response);
	await logEventFromContext(
		ctx,
		'hex.guides.listDrafts',
		{ operation: 'guides.listDrafts' },
		'completed',
	);
	return parsed;
};

/** Publish all currently drafted guides. */
export const guidesPublish: HexEndpoints['guidesPublish'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.guidesPublish.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['guidesPublish']>(
		`/v1/guides/publish`,
		ctx.key,
		{
			method: 'POST',
			body: {
				orgGuideFileIds: parsedInput.orgGuideFileIds,
				publishAllDraftGuides: parsedInput.publishAllDraftGuides,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.guidesPublish.parse(response);
	await logEventFromContext(
		ctx,
		'hex.guides.publish',
		{ operation: 'guides.publish' },
		'completed',
	);
	return parsed;
};
