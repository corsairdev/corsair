import type { ContactOutEndpoints } from '..';
import { saveCompany } from './cache';
import { call } from './call';

export const search: ContactOutEndpoints['companySearch'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'companySearch',
		'company.search',
		'POST',
		'v1/company/search',
		input,
	);
	for (const company of result.companies) await saveCompany(ctx, company);
	return result;
};

export const enrichDomains: ContactOutEndpoints['companyEnrichDomains'] =
	async (ctx, input) => {
		const result = await call(
			ctx,
			'companyEnrichDomains',
			'company.enrichDomains',
			'POST',
			'v1/domain/enrich',
			input,
		);
		const byDomain = Array.isArray(result.companies)
			? result.companies
			: [result.companies];
		for (const entry of byDomain) {
			for (const company of Object.values(entry)) {
				await saveCompany(ctx, company);
			}
		}
		return result;
	};
