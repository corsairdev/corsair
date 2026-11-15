import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import { toBracketQuery } from './query';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['leadsList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsList']
	>('/leads', ctx.key, { method: 'GET', query: toBracketQuery(parsed) });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsList.parse(response);

	// Lead records are PII; only the page size is recorded.
	await logEventFromContext(
		ctx,
		'hunterio.leads.list',
		{ count: parsedResponse.data.leads.length },
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['leadsCreate'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsCreate']
	>('/leads', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.leads.create', {}, 'completed');

	return parsedResponse;
};

export const upsert: HunterioEndpoints['leadsUpsert'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsUpsert.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsUpsert']
	>('/leads', ctx.key, { method: 'PUT', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsUpsert.parse(response);

	await logEventFromContext(ctx, 'hunterio.leads.upsert', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['leadsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsGet']
	>(`/leads/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse = HunterioEndpointOutputSchemas.leadsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leads.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['leadsUpdate'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsUpdate']
	>(`/leads/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsUpdate.parse(response);

	await logEventFromContext(ctx, 'hunterio.leads.update', { id }, 'completed');

	return parsedResponse;
};

export const replace: HunterioEndpoints['leadsReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsReplace']
	>(`/leads/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsReplace.parse(response);

	await logEventFromContext(ctx, 'hunterio.leads.replace', { id }, 'completed');

	return parsedResponse;
};

export const remove: HunterioEndpoints['leadsDelete'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsDelete']
	>(`/leads/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leads.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const enrich: HunterioEndpoints['leadsEnrich'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsEnrich.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsEnrich']
	>(`/leads/${parsed.id}/enrich`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsEnrich.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leads.enrich',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const exist: HunterioEndpoints['leadsExist'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsExist.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsExist']
	>('/leads/exist', ctx.key, { method: 'GET', query: { email: parsed.email } });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsExist.parse(response);

	// The checked address is PII and the response says whether it exists;
	// the event carries no payload.
	await logEventFromContext(ctx, 'hunterio.leads.exist', {}, 'completed');

	return parsedResponse;
};

export const bulkExist: HunterioEndpoints['leadsBulkExist'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsBulkExist.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsBulkExist']
	>('/leads/bulk/exist', ctx.key, {
		method: 'GET',
		query: { 'emails[]': parsed.emails },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsBulkExist.parse(response);

	// Addresses are PII; only the batch size is recorded.
	await logEventFromContext(
		ctx,
		'hunterio.leads.bulkExist',
		{ count: parsed.emails.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkUpsert: HunterioEndpoints['leadsBulkUpsert'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsBulkUpsert.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsBulkUpsert']
	>('/leads/bulk', ctx.key, { method: 'PUT', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsBulkUpsert.parse(response);

	// Lead rows are PII; only the batch size is recorded.
	await logEventFromContext(
		ctx,
		'hunterio.leads.bulkUpsert',
		{ count: parsed.leads.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkMove: HunterioEndpoints['leadsBulkMove'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsBulkMove.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsBulkMove']
	>('/leads/bulk/move', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsBulkMove.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leads.bulkMove',
		{ leadCount: parsed.lead_ids?.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkDelete: HunterioEndpoints['leadsBulkDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsBulkDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsBulkDelete']
	>('/leads/bulk/delete', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsBulkDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leads.bulkDelete',
		{ leadCount: parsed.lead_ids?.length },
		'completed',
	);

	return parsedResponse;
};

export const importCsv: HunterioEndpoints['leadsImportCsv'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsImportCsv.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsImportCsv']
	>('/leads-imports', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsImportCsv.parse(response);

	// The CSV content is PII; only the fact that the draft import was
	// created is recorded.
	await logEventFromContext(ctx, 'hunterio.leads.importCsv', {}, 'completed');

	return parsedResponse;
};
