import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	CreateCompanyResponse,
	GetCompanyResponse,
	GetManyCompaniesResponse,
	SearchCompanyByDomainResponse,
	UpdateCompanyResponse,
} from './types';

export const get: HubSpotEndpoints['companiesGet'] = async (ctx, input) => {
	const { companyId, ...queryParams } = input;
	const endpoint = `/crm/v3/objects/companies/${companyId}`;
	const result = await makeHubSpotRequest<GetCompanyResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.companies.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: HubSpotEndpoints['companiesGetMany'] = async (
	ctx,
	input,
) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/companies';
	const result = await makeHubSpotRequest<GetManyCompaniesResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result.results && ctx.db.companies) {
		try {
			for (const company of result.results) {
				await ctx.db.companies.upsertByEntityId(company.id, company);
			}
		} catch (error) {
			console.warn('Failed to save companies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.companies.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: HubSpotEndpoints['companiesCreate'] = async (
	ctx,
	input,
) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/companies';
	const result = await makeHubSpotRequest<CreateCompanyResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.companies.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: HubSpotEndpoints['companiesUpdate'] = async (
	ctx,
	input,
) => {
	const { companyId, ...body } = input;
	const endpoint = `/crm/v3/objects/companies/${companyId}`;
	const result = await makeHubSpotRequest<UpdateCompanyResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.companies.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteCompany: HubSpotEndpoints['companiesDelete'] = async (
	ctx,
	input,
) => {
	const { companyId } = input;
	const endpoint = `/crm/v3/objects/companies/${companyId}`;
	await makeHubSpotRequest<void>(endpoint, ctx.options.token, {
		method: 'DELETE',
	});

	if (ctx.db.companies) {
		try {
			await ctx.db.companies.deleteByEntityId(companyId);
		} catch (error) {
			console.warn('Failed to delete company from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.companies.delete',
		{ ...input },
		'completed',
	);
};

export const getRecentlyCreated: HubSpotEndpoints['companiesGetRecentlyCreated'] =
	async (ctx, input) => {
		const { ...queryParams } = input || {};
		const endpoint = '/crm/v3/objects/companies';
		const result = await makeHubSpotRequest<GetManyCompaniesResponse>(
			endpoint,
			ctx.options.token,
			{ query: queryParams },
		);

		if (result.results && ctx.db.companies) {
			try {
				for (const company of result.results) {
					await ctx.db.companies.upsertByEntityId(company.id, company);
				}
			} catch (error) {
				console.warn('Failed to save companies to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'hubspot.companies.getRecentlyCreated',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getRecentlyUpdated: HubSpotEndpoints['companiesGetRecentlyUpdated'] =
	async (ctx, input) => {
		const { ...queryParams } = input || {};
		const endpoint = '/crm/v3/objects/companies';
		const result = await makeHubSpotRequest<GetManyCompaniesResponse>(
			endpoint,
			ctx.options.token,
			{ query: queryParams },
		);

		if (result.results && ctx.db.companies) {
			try {
				for (const company of result.results) {
					await ctx.db.companies.upsertByEntityId(company.id, company);
				}
			} catch (error) {
				console.warn('Failed to save companies to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'hubspot.companies.getRecentlyUpdated',
			{ ...input },
			'completed',
		);
		return result;
	};

export const searchByDomain: HubSpotEndpoints['companiesSearchByDomain'] =
	async (ctx, input) => {
		const { domain, ...queryParams } = input;
		const endpoint = '/crm/v3/objects/companies/search';
		const result = await makeHubSpotRequest<SearchCompanyByDomainResponse>(
			endpoint,
			ctx.options.token,
			{
				query: {
					...queryParams,
					domain,
					properties: queryParams.properties?.join(','),
				} as any,
			},
		);

		await logEventFromContext(
			ctx,
			'hubspot.companies.searchByDomain',
			{ ...input },
			'completed',
		);
		return result;
	};
