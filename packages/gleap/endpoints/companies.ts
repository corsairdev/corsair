import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	CompaniesCreateOrUpdateOutput,
	CompaniesDeleteOutput,
	CompaniesGetOutput,
	CompaniesListOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const list: GleapEndpoints['companiesList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.companiesList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		skip: parsed.skip,
		limit: parsed.limit,
		search: parsed.search,
	};
	const response = await makeGleapRequest<CompaniesListOutput>(
		'/companies',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project,
		},
	);
	const output = GleapEndpointOutputSchemas.companiesList.parse(response);
	const count = Array.isArray(output)
		? output.length
		: output.companies.length;
	await logEventFromContext(
		ctx,
		'gleap.companies.list',
		{ count },
		'completed',
	);
	return output;
};

export const get: GleapEndpoints['companiesGet'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.companiesGet.parse(input);
	const response = await makeGleapRequest<CompaniesGetOutput>(
		`/companies/${encodeURIComponent(parsed.companyId)}`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project,
		},
	);
	const output = GleapEndpointOutputSchemas.companiesGet.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.companies.get',
		{ companyId: parsed.companyId },
		'completed',
	);
	return output;
};

export const createOrUpdate: GleapEndpoints['companiesCreateOrUpdate'] =
	async (ctx, input) => {
		const parsed =
			GleapEndpointInputSchemas.companiesCreateOrUpdate.parse(input);
		const { companyId, project, ...body } = parsed;
		const response = await makeGleapRequest<CompaniesCreateOrUpdateOutput>(
			`/companies/${encodeURIComponent(companyId)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
				projectId: project,
			},
		);
		const output =
			GleapEndpointOutputSchemas.companiesCreateOrUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'gleap.companies.createOrUpdate',
			{ companyId },
			'completed',
		);
		return output;
	};

export const del: GleapEndpoints['companiesDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.companiesDelete.parse(input);
	const response = await makeGleapRequest<CompaniesDeleteOutput>(
		`/companies/${encodeURIComponent(parsed.companyId)}`,
		ctx.key,
		{
			method: 'DELETE',
			projectId: parsed.project,
		},
	);
	const output = GleapEndpointOutputSchemas.companiesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.companies.delete',
		{ companyId: parsed.companyId },
		'completed',
	);
	return output;
};
