import type { CommCareEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// v0.5/v1 listings answer `{ meta: { next, … }, objects }`; flatten the
// next-page link for the caller. A missing `objects` array is left as-is
// so the output schema rejects a malformed body.
// unknown: the raw body is an untyped envelope until the output schema
// validates it; objects and meta are narrowed below.
function listWithMeta(raw: unknown): unknown {
	// unknown: the envelope is untyped until the output schema validates it.
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

export const list: CommCareEndpoints['formsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.list',
			input: Inputs.formsList,
			output: Outputs.formsList,
		},
		input,
		(domain, { limit, offset, indexedOnStart, indexedOnEnd, xmlns }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/form/v1/`,
			query: {
				limit,
				offset,
				indexed_on_start: indexedOnStart,
				indexed_on_end: indexedOnEnd,
				xmlns,
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

export const get: CommCareEndpoints['formsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.get',
			input: Inputs.formsGet,
			output: Outputs.formsGet,
		},
		input,
		(domain, { formId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/form/v1/${segment(formId)}/`,
			replaySafe: true,
		}),
	);

export const bulkAction: CommCareEndpoints['formsBulkAction'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.bulkAction',
			input: Inputs.formsBulkAction,
			output: Outputs.formsBulkAction,
		},
		input,
		(domain, { action, formIds }) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/api/form/v1/bulk-action/`,
			body: { action, form_ids: formIds },
		}),
		{
			log: (parsed, result) => ({
				actionId: result.id ?? undefined,
				action: parsed.action,
				forms: parsed.formIds.length,
			}),
		},
	);

export const bulkActionStatus: CommCareEndpoints['formsBulkActionStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'forms.bulkActionStatus',
			input: Inputs.formsBulkActionStatus,
			output: Outputs.formsBulkActionStatus,
		},
		input,
		(domain, { actionId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/form/v1/bulk-action/${segment(actionId)}/`,
			replaySafe: true,
		}),
	);
