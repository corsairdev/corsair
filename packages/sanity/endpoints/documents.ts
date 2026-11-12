import { randomUUID } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { documentIdsPath, makeSanityRequest, SanityError } from '../client';
import type { SanityEndpoints } from '../index';
import { draftIdOf, publishedIdOf, resolveTarget } from './shared';
import {
	SanityEndpointInputSchemas as Inputs,
	SanityEndpointOutputSchemas as Outputs,
	PATCH_OPERATION_KEYS,
} from './types';

// unknown: an Actions API action; each builder below sets its fields and Sanity validates them.
type Action = Record<string, unknown>;

/** Runs Actions API actions in one transaction. */
async function runActions(
	token: string,
	projectId: string,
	dataset: string,
	actions: Action[],
	dryRun?: boolean,
) {
	return makeSanityRequest<{ transactionId?: string }>(
		token,
		{ projectId },
		`/data/actions/${dataset}`,
		{ method: 'POST', body: { actions, dryRun: dryRun || undefined } },
	);
}

// unknown: picks only the patch operations out of a validated input.
function patchOf(input: Record<string, unknown>): Record<string, unknown> {
	const patch: Record<string, unknown> = {};
	for (const key of PATCH_OPERATION_KEYS) {
		if (input[key] !== undefined) patch[key] = input[key];
	}
	return patch;
}

// unknown: optional revision guards, passed to Sanity as given.
function publishAction(id: string, guards: Record<string, unknown> = {}) {
	return {
		actionType: 'sanity.action.document.publish',
		publishedId: id,
		versionId: draftIdOf(id),
		...guards,
	};
}

export const query: SanityEndpoints['documentsQuery'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsQuery.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const perspective = Array.isArray(input.perspective)
		? input.perspective.join(',')
		: input.perspective;
	// POST so a long query or large params never hit a URL length limit.
	const response = Outputs.documentsQuery.parse(
		await makeSanityRequest(ctx.key, { projectId }, `/data/query/${dataset}`, {
			method: 'POST',
			query: { perspective, returnQuery: false },
			body: { query: input.query, params: input.params },
		}),
	);
	await logEventFromContext(
		ctx,
		'sanity.documents.query',
		{ dataset, perspective },
		'completed',
	);
	return response;
};

export const get: SanityEndpoints['documentsGet'] = async (ctx, rawInput) => {
	const input = Inputs.documentsGet.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const response = Outputs.documentsGet.parse(
		await makeSanityRequest(
			ctx.key,
			{ projectId },
			`/data/doc/${dataset}/${documentIdsPath(input.ids)}`,
		),
	);
	await logEventFromContext(
		ctx,
		'sanity.documents.get',
		{ dataset, count: input.ids.length },
		'completed',
	);
	return response;
};

export const create: SanityEndpoints['documentsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsCreate.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const id = input.document._id
		? publishedIdOf(input.document._id)
		: randomUUID();
	const draftId = draftIdOf(id);
	const actions: Action[] = [
		{
			actionType: 'sanity.action.document.create',
			publishedId: id,
			document: { ...input.document, _id: draftId },
			ifExists: input.ifExists ?? 'fail',
		},
	];
	if (input.publish) actions.push(publishAction(id));
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		actions,
		input.dryRun,
	);
	const response = Outputs.documentsCreate.parse({
		transactionId: receipt?.transactionId,
		id,
		draftId,
		published: Boolean(input.publish),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.create',
		{ dataset, id, type: input.document._type, published: response.published },
		'completed',
	);
	return response;
};

export const edit: SanityEndpoints['documentsEdit'] = async (ctx, rawInput) => {
	const input = Inputs.documentsEdit.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const id = publishedIdOf(input.id);
	// The edit action patches the draft, making one from the published
	// document first when there is no draft yet.
	const actions: Action[] = [
		{
			actionType: 'sanity.action.document.edit',
			publishedId: id,
			versionId: draftIdOf(id),
			patch: patchOf(input),
		},
	];
	if (input.publish) actions.push(publishAction(id));
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		actions,
		input.dryRun,
	);
	const response = Outputs.documentsEdit.parse({
		transactionId: receipt?.transactionId,
		id,
		draftId: draftIdOf(id),
		published: Boolean(input.publish),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.edit',
		{ dataset, id, published: response.published },
		'completed',
	);
	return response;
};

export const patch: SanityEndpoints['documentsPatch'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsPatch.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const result = await makeSanityRequest<{
		transactionId?: string;
		// unknown: the patched document, validated by the output schema below.
		results?: { document?: unknown }[];
	}>(ctx.key, { projectId }, `/data/mutate/${dataset}`, {
		method: 'POST',
		query: {
			returnDocuments: true,
			dryRun: input.dryRun || undefined,
		},
		body: {
			mutations: [
				{
					patch: {
						id: input.id,
						...patchOf(input),
						ifRevisionID: input.ifRevisionId,
					},
				},
			],
		},
	});
	const response = Outputs.documentsPatch.parse({
		transactionId: result?.transactionId,
		document: result?.results?.[0]?.document ?? null,
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.patch',
		{ dataset, id: input.id },
		'completed',
	);
	return response;
};

export const publish: SanityEndpoints['documentsPublish'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsPublish.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const id = publishedIdOf(input.id);
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		[
			publishAction(id, {
				ifVersionRevisionId: input.ifDraftRevisionId,
				ifPublishedRevisionId: input.ifPublishedRevisionId,
			}),
		],
		input.dryRun,
	);
	const response = Outputs.documentsPublish.parse({
		transactionId: receipt?.transactionId,
		id,
		draftId: draftIdOf(id),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.publish',
		{ dataset, id },
		'completed',
	);
	return response;
};

export const unpublish: SanityEndpoints['documentsUnpublish'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsUnpublish.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const id = publishedIdOf(input.id);
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		[
			{
				actionType: 'sanity.action.document.unpublish',
				publishedId: id,
				versionId: draftIdOf(id),
			},
		],
		input.dryRun,
	);
	const response = Outputs.documentsUnpublish.parse({
		transactionId: receipt?.transactionId,
		id,
		draftId: draftIdOf(id),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.unpublish',
		{ dataset, id },
		'completed',
	);
	return response;
};

export const discardDraft: SanityEndpoints['documentsDiscardDraft'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsDiscardDraft.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const id = publishedIdOf(input.id);
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		[
			{
				actionType: 'sanity.action.document.version.discard',
				versionId: draftIdOf(id),
				purge: input.purge || undefined,
			},
		],
		input.dryRun,
	);
	const response = Outputs.documentsDiscardDraft.parse({
		transactionId: receipt?.transactionId,
		id,
		draftId: draftIdOf(id),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.discardDraft',
		{ dataset, id },
		'completed',
	);
	return response;
};

export const deleteDocuments: SanityEndpoints['documentsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsDelete.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const ids = [...new Set(input.ids.map(publishedIdOf))];
	const receipt = await runActions(
		ctx.key,
		projectId,
		dataset,
		ids.map((id) => ({
			actionType: 'sanity.action.document.delete',
			publishedId: id,
			includeDrafts: [draftIdOf(id)],
			purge: input.purge || undefined,
		})),
		input.dryRun,
	);
	const response = Outputs.documentsDelete.parse({
		transactionId: receipt?.transactionId,
		ids,
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.delete',
		{ dataset, ids },
		'completed',
	);
	return response;
};

export const mutate: SanityEndpoints['documentsMutate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsMutate.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const response = Outputs.documentsMutate.parse(
		await makeSanityRequest(ctx.key, { projectId }, `/data/mutate/${dataset}`, {
			method: 'POST',
			query: {
				returnIds: true,
				returnDocuments: input.returnDocuments || undefined,
				visibility: input.visibility,
				autoGenerateArrayKeys: input.autoGenerateArrayKeys || undefined,
				dryRun: input.dryRun || undefined,
			},
			body: {
				mutations: input.mutations,
				transactionId: input.transactionId,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'sanity.documents.mutate',
		{
			dataset,
			count: input.mutations.length,
			kinds: input.mutations.map((mutation) => Object.keys(mutation)[0]),
		},
		'completed',
	);
	return response;
};

export const history: SanityEndpoints['documentsHistory'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsHistory.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	// unknown: past versions of a document, validated by the output schema below.
	const result = await makeSanityRequest<{ documents?: unknown[] }>(
		ctx.key,
		{ projectId },
		`/data/history/${dataset}/documents/${encodeURIComponent(input.id)}`,
		{
			query: {
				revision: input.revision,
				time: input.time,
				lastRevision: input.lastRevision || undefined,
			},
		},
	);
	const response = Outputs.documentsHistory.parse({
		document: result?.documents?.[0] ?? null,
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.history',
		{ dataset, id: input.id },
		'completed',
	);
	return response;
};

/** Parses the NDJSON the transactions export answers with, one object a line. */
// unknown: each line is a transaction object, validated by the caller.
export function parseNdjson(text: string): unknown[] {
	const out: unknown[] = [];
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			out.push(JSON.parse(trimmed));
		} catch {
			throw new SanityError(
				'Sanity answered the transactions export with a line that is not JSON.',
				'bad_response',
			);
		}
	}
	return out;
}

export const transactions: SanityEndpoints['documentsTransactions'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.documentsTransactions.parse(rawInput);
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const text = await makeSanityRequest<string>(
		ctx.key,
		{ projectId },
		`/data/history/${dataset}/transactions/${documentIdsPath(input.ids)}`,
		{
			accept: 'ndjson',
			query: {
				fromTime: input.fromTime,
				toTime: input.toTime,
				fromTransaction: input.fromTransaction,
				toTransaction: input.toTransaction,
				limit: input.limit ?? 20,
				reverse: input.reverse || undefined,
				authors: input.authors?.join(','),
				// Required: without it the export answers 403.
				excludeContent: true,
			},
		},
	);
	const response = Outputs.documentsTransactions.parse({
		transactions: parseNdjson(text ?? ''),
	});
	await logEventFromContext(
		ctx,
		'sanity.documents.transactions',
		{ dataset, ids: input.ids },
		'completed',
	);
	return response;
};
