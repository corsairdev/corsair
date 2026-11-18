import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['companiesList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.companiesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesList']
	>('/companies', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesList.parse(response);

	// Company rows may embed lead emails; only the page size is recorded.
	await logEventFromContext(
		ctx,
		'hunterio.companies.list',
		{ count: parsedResponse.data.companies.length },
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['companiesCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesCreate']
	>('/companies', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.companies.create', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['companiesGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.companiesGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesGet']
	>(`/companies/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['companiesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesDelete']
	>(`/companies/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const tag: HunterioEndpoints['companiesTag'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.companiesTag.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesTag']
	>(`/companies/${id}/tags`, ctx.key, { method: 'POST', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesTag.parse(response);

	await logEventFromContext(ctx, 'hunterio.companies.tag', { id }, 'completed');

	return parsedResponse;
};

export const untag: HunterioEndpoints['companiesUntag'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesUntag.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesUntag']
	>(`/companies/${parsed.id}/tags/${parsed.tag_id}`, ctx.key, {
		method: 'DELETE',
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesUntag.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.untag',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const bulkMove: HunterioEndpoints['companiesBulkMove'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesBulkMove.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesBulkMove']
	>('/companies/bulk/move', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesBulkMove.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.bulkMove',
		{ companyCount: parsed.company_ids?.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkCopy: HunterioEndpoints['companiesBulkCopy'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesBulkCopy.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesBulkCopy']
	>('/companies/bulk/copy', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesBulkCopy.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.bulkCopy',
		{ companyCount: parsed.company_ids?.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkDelete: HunterioEndpoints['companiesBulkDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesBulkDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesBulkDelete']
	>('/companies/bulk/delete', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesBulkDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.bulkDelete',
		{ companyCount: parsed.company_ids?.length },
		'completed',
	);

	return parsedResponse;
};

export const bulkTag: HunterioEndpoints['companiesBulkTag'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companiesBulkTag.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companiesBulkTag']
	>('/companies/bulk/tag', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companiesBulkTag.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companies.bulkTag',
		{ companyCount: parsed.company_ids?.length },
		'completed',
	);

	return parsedResponse;
};
