import { logEventFromContext } from 'corsair/core';
import type { AktaEndpoints } from '..';
import { csv, makeAktaRequest } from '../client';
import { AktaEndpointInputSchemas, AktaEndpointOutputSchemas } from './types';

export const search: AktaEndpoints['companySearch'] = async (ctx, input) => {
	const { query } = AktaEndpointInputSchemas.companySearch.parse(input);

	// 204 (no match) has no body.
	const raw = await makeAktaRequest('v1/company/search/', ctx.key, {
		query,
	});
	const result = AktaEndpointOutputSchemas.companySearch.parse(
		raw ?? { data: [], credits_consumed: 0 },
	);

	if (ctx.db.companies) {
		try {
			for (const company of result.data) {
				const existing = await ctx.db.companies.findByEntityId(company.uuid);
				await ctx.db.companies.upsertByEntityId(company.uuid, {
					...existing?.data,
					uuid: company.uuid,
					name: company.name,
					website: company.website ?? existing?.data.website,
					productCategory:
						company.product_category ?? existing?.data.productCategory,
					companyStatus: company.company_status ?? existing?.data.companyStatus,
					parentCompanyUuid:
						company.parent_company?.uuid ?? existing?.data.parentCompanyUuid,
				});
			}
		} catch (error) {
			console.warn('Failed to save Akta companies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'akta.company.search',
		{ resultCount: result.data.length },
		'completed',
	);
	return result;
};

export const enrich: AktaEndpoints['companyEnrich'] = async (ctx, input) => {
	const parsed = AktaEndpointInputSchemas.companyEnrich.parse(input);

	const raw = await makeAktaRequest('v1/company/enrichment/', ctx.key, {
		company: parsed.company,
		sections: csv(parsed.sections),
	});
	const result = AktaEndpointOutputSchemas.companyEnrich.parse(raw);

	const firmographic = result.data.firmographic;
	if (ctx.db.companies && firmographic) {
		try {
			const existing = await ctx.db.companies.findByEntityId(result.data.uuid);
			await ctx.db.companies.upsertByEntityId(result.data.uuid, {
				...existing?.data,
				uuid: result.data.uuid,
				name: firmographic.name ?? existing?.data.name ?? result.data.uuid,
				website: firmographic.website ?? existing?.data.website,
				foundedYear: firmographic.founded_year ?? existing?.data.foundedYear,
				headcountRange:
					firmographic.headcount_range ?? existing?.data.headcountRange,
				descriptionShort:
					firmographic.company_description_short ??
					existing?.data.descriptionShort,
			});
		} catch (error) {
			console.warn('Failed to save Akta company to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'akta.company.enrich',
		{
			sections: parsed.sections,
			creditsConsumed: result.credits_consumed,
		},
		'completed',
	);
	return result;
};

export const employeeReviews: AktaEndpoints['companyEmployeeReviews'] = async (
	ctx,
	input,
) => {
	const parsed = AktaEndpointInputSchemas.companyEmployeeReviews.parse(input);

	const raw = await makeAktaRequest('v1/company/employee-reviews/', ctx.key, {
		company: parsed.company,
		limit: parsed.limit,
		offset: parsed.offset,
	});
	const result = AktaEndpointOutputSchemas.companyEmployeeReviews.parse(raw);

	await logEventFromContext(
		ctx,
		'akta.company.employeeReviews',
		{
			reviewCount: result.data.employee_reviews.reviews?.data.length ?? 0,
			offset: result.offset,
			creditsConsumed: result.credits_consumed,
		},
		'completed',
	);
	return result;
};

export const productReviews: AktaEndpoints['companyProductReviews'] = async (
	ctx,
	input,
) => {
	const parsed = AktaEndpointInputSchemas.companyProductReviews.parse(input);

	const raw = await makeAktaRequest('v1/company/product-reviews/', ctx.key, {
		company: parsed.company,
		products: csv(parsed.products),
		limit: parsed.limit,
		offset: parsed.offset,
	});
	const result = AktaEndpointOutputSchemas.companyProductReviews.parse(raw);

	await logEventFromContext(
		ctx,
		'akta.company.productReviews',
		{
			productCount: (result.data.product_reviews ?? result.data.product ?? [])
				.length,
			offset: result.offset,
			creditsConsumed: result.credits_consumed,
		},
		'completed',
	);
	return result;
};
