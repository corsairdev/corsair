import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type {
	GongEngageFlowsInputs,
	GongEngageFlowsOutputs,
} from './engage-flows-types';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';

type LocalGongContext = GongFamilyContext;
type Endpoint<K extends keyof GongEngageFlowsInputs> = (
	ctx: LocalGongContext,
	input: GongEngageFlowsInputs[K],
) => Promise<GongEngageFlowsOutputs[K]>;
function request<T>(
	ctx: LocalGongContext,
	method: 'GET' | 'POST' | 'PATCH',
	path: string,
	input: Record<string, unknown>,
	query?: Record<string, unknown>,
	body?: unknown,
): Promise<T> {
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials = gongCredentials(ctx);
	return gongRequest<T>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method,
		path,
		query,
		body,
	});
}
async function logged<T>(
	ctx: LocalGongContext,
	id: string,
	input: Record<string, unknown>,
	run: () => Promise<T>,
): Promise<T> {
	const result = await run();
	await logEventFromContext(
		ctx,
		`gong.engageFlows.${id}`,
		{ input },
		'completed',
	);
	return result;
}
function safePath(value: string, label: string): string {
	if (!value || value === '.' || value === '..' || /[\/\\"']/.test(value))
		throw new Error(`Unsafe Gong ${label}`);
	return encodeURIComponent(value);
}

export const getFlowSteps: Endpoint<'getFlowSteps'> = (ctx, input) =>
	logged(ctx, 'getFlowSteps', input, () =>
		request<GongEngageFlowsOutputs['getFlowSteps']>(
			ctx,
			'POST',
			'/v2/flows/steps',
			input,
			undefined,
			input,
		),
	);
export const getProspectsAssignedFlows: Endpoint<
	'getProspectsAssignedFlows'
> = (ctx, input) =>
	logged(ctx, 'getProspectsAssignedFlows', input, () =>
		request<GongEngageFlowsOutputs['getProspectsAssignedFlows']>(
			ctx,
			'POST',
			'/v2/flows/prospects',
			input,
			undefined,
			input,
		),
	);
export const unassignFlows: Endpoint<'unassignFlows'> = (ctx, input) =>
	logged(ctx, 'unassignFlows', input, () =>
		request<GongEngageFlowsOutputs['unassignFlows']>(
			ctx,
			'POST',
			'/v2/flows/prospects/unassign-flows-by-instance-id',
			input,
			undefined,
			input,
		),
	);
export const unassignProspectFlows: Endpoint<'unassignProspectFlows'> = (
	ctx,
	input,
) =>
	logged(ctx, 'unassignProspectFlows', input, () =>
		request<GongEngageFlowsOutputs['unassignProspectFlows']>(
			ctx,
			'POST',
			'/v2/flows/prospects/unassign-flows-by-crm-id',
			input,
			undefined,
			input,
		),
	);
export const submitFlowProspectsBulkAssignment: Endpoint<
	'submitFlowProspectsBulkAssignment'
> = (ctx, input) =>
	logged(ctx, 'submitFlowProspectsBulkAssignment', input, () =>
		request<GongEngageFlowsOutputs['submitFlowProspectsBulkAssignment']>(
			ctx,
			'POST',
			'/v2/flows/prospects/bulk-assignments',
			input,
			undefined,
			input,
		),
	);
export const assignProspects: Endpoint<'assignProspects'> = (ctx, input) =>
	logged(ctx, 'assignProspects', input, () =>
		request<GongEngageFlowsOutputs['assignProspects']>(
			ctx,
			'POST',
			'/v2/flows/prospects/assign',
			input,
			undefined,
			input,
		),
	);
export const listFlows: Endpoint<'listFlows'> = (ctx, input) =>
	logged(ctx, 'listFlows', input, () =>
		request<GongEngageFlowsOutputs['listFlows']>(
			ctx,
			'GET',
			'/v2/flows',
			input,
			input,
		),
	);
export const searchFlows: Endpoint<'searchFlows'> = (ctx, input) =>
	logged(ctx, 'searchFlows', input, () =>
		request<GongEngageFlowsOutputs['searchFlows']>(
			ctx,
			'GET',
			'/v2/flows/search',
			input,
			input,
		),
	);
export const getFlowProspectsBulkAssignment: Endpoint<
	'getFlowProspectsBulkAssignment'
> = (ctx, input) =>
	logged(ctx, 'getFlowProspectsBulkAssignment', input, () =>
		request<GongEngageFlowsOutputs['getFlowProspectsBulkAssignment']>(
			ctx,
			'GET',
			`/v2/flows/prospects/bulk-assignments/${safePath(input.id, 'bulk assignment id')}`,
			input,
		),
	);
export const listFlowsFolders: Endpoint<'listFlowsFolders'> = (ctx, input) =>
	logged(ctx, 'listFlowsFolders', input, () =>
		request<GongEngageFlowsOutputs['listFlowsFolders']>(
			ctx,
			'GET',
			'/v2/flows/folders',
			input,
			input,
		),
	);
