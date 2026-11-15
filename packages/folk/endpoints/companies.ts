import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import type { FolkQueryValue } from '../client';
import { flattenFilter, makeFolkRequest } from '../client';
import type {
	CompaniesCreateResponse,
	CompaniesDeleteResponse,
	CompaniesGetResponse,
	CompaniesListResponse,
	CompaniesUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['companiesList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.companiesList.parse(input);
	const query: Record<string, FolkQueryValue | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;
	if (parsedInput.combinator !== undefined)
		query.combinator = parsedInput.combinator;
	if (parsedInput.filter) {
		Object.assign(query, flattenFilter(parsedInput.filter));
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CompaniesListResponse>(
		'/companies',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.companiesList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.companies.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const get: FolkEndpoints['companiesGet'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.companiesGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CompaniesGetResponse>(
		`/companies/${encodeURIComponent(parsedInput.companyId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.companiesGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.companies.get',
		{ companyId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const create: FolkEndpoints['companiesCreate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.companiesCreate.parse(input);
	const { idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CompaniesCreateResponse>(
		'/companies',
		ctx.key,
		{
			method: 'POST',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.companiesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.companies.create',
		{ companyId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['companiesUpdate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.companiesUpdate.parse(input);
	const { companyId, idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CompaniesUpdateResponse>(
		`/companies/${encodeURIComponent(companyId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.companiesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.companies.update',
		{ companyId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const deleteCompany: FolkEndpoints['companiesDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = FolkEndpointInputSchemas.companiesDelete.parse(input);
	const headers: Record<string, string> = {};
	if (parsedInput.idempotencyKey) {
		headers['Idempotency-Key'] = parsedInput.idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CompaniesDeleteResponse>(
		`/companies/${encodeURIComponent(parsedInput.companyId)}`,
		ctx.key,
		{
			method: 'DELETE',
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.companiesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'folk.companies.delete',
		{ companyId: parsed.data.id },
		'completed',
	);

	return parsed;
};
