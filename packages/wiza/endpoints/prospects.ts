import { logEventFromContext } from 'corsair/core';
import { makeWizaRequest } from '../client';
import type { WizaEndpoints } from '../index';
import type { ProspectSearchResponse } from './types';

export const search: WizaEndpoints['prospectsSearch'] = async (ctx, input) => {
	const response = await makeWizaRequest<ProspectSearchResponse>(
		'/api/prospects/search',
		ctx.key,
		{ method: 'POST', body: input },
	);

	for (const profile of response.data.profiles ?? []) {
		if (!profile.linkedin_url) continue;
		await ctx.db.prospects.upsertByEntityId(profile.linkedin_url, {
			linkedin_url: profile.linkedin_url,
			full_name: profile.full_name,
			job_title: profile.job_title,
			job_company_name: profile.job_company_name,
			industry: profile.industry,
			location_name: profile.location_name,
			updatedAt: new Date(),
		});
	}

	await logEventFromContext(
		ctx,
		'wiza.prospects.search',
		{ total: response.data.total },
		'completed',
	);

	return response;
};

export const Prospects = { search };
