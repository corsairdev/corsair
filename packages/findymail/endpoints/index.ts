import type { z } from 'zod';
import { makeFindymailRequest } from '../client';
import type { FindymailContext } from '../index';
import * as schemas from './types';

export const verification_verify = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.verification_verifyInput>,
): Promise<z.output<typeof schemas.verification_verifyOutput>> => {
	const input = schemas.verification_verifyInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/verify',
		body: { email: input['email'] },
		mediaType: 'application/json',
	});
	return schemas.verification_verifyOutput.parse(raw);
};

export const lists_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.lists_listInput>,
): Promise<z.output<typeof schemas.lists_listOutput>> => {
	const input = schemas.lists_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/lists',
	});
	return schemas.lists_listOutput.parse(raw);
};

export const lists_create = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.lists_createInput>,
): Promise<z.output<typeof schemas.lists_createOutput>> => {
	const input = schemas.lists_createInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/lists',
		body: { name: input['name'] },
		mediaType: 'application/json',
	});
	return schemas.lists_createOutput.parse(raw);
};

export const lists_replace = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.lists_replaceInput>,
): Promise<z.output<typeof schemas.lists_replaceOutput>> => {
	const input = schemas.lists_replaceInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'PUT',
		url: '/api/lists/{id}',
		path: { id: input['id'] },
		body: { name: input['name'], isShared: input['isShared'] },
		mediaType: 'application/json',
	});
	return schemas.lists_replaceOutput.parse(raw);
};

export const lists_delete = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.lists_deleteInput>,
): Promise<z.output<typeof schemas.lists_deleteOutput>> => {
	const input = schemas.lists_deleteInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'DELETE',
		url: '/api/lists/{id}',
		path: { id: input['id'] },
	});
	return schemas.lists_deleteOutput.parse(raw);
};

export const contacts_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.contacts_listInput>,
): Promise<z.output<typeof schemas.contacts_listOutput>> => {
	const input = schemas.contacts_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/contacts/get/{id}',
		path: { id: input['id'] },
	});
	return schemas.contacts_listOutput.parse(raw);
};

export const search_name = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_nameInput>,
): Promise<z.output<typeof schemas.search_nameOutput>> => {
	const input = schemas.search_nameInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/name',
		body: {
			name: input['name'],
			domain: input['domain'],
			webhook_url: input['webhook_url'],
		},
		mediaType: 'application/json',
	});
	return schemas.search_nameOutput.parse(raw);
};

export const search_businessProfile = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_businessProfileInput>,
): Promise<z.output<typeof schemas.search_businessProfileOutput>> => {
	const input = schemas.search_businessProfileInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/business-profile',
		body: {
			linkedin_url: input['linkedin_url'],
			webhook_url: input['webhook_url'],
		},
		mediaType: 'application/json',
	});
	return schemas.search_businessProfileOutput.parse(raw);
};

export const exclusionLists_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.exclusionLists_listInput>,
): Promise<z.output<typeof schemas.exclusionLists_listOutput>> => {
	const input = schemas.exclusionLists_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/intellimatch/exclusion-lists',
	});
	return schemas.exclusionLists_listOutput.parse(raw);
};

export const exclusionLists_create = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.exclusionLists_createInput>,
): Promise<z.output<typeof schemas.exclusionLists_createOutput>> => {
	const input = schemas.exclusionLists_createInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/intellimatch/exclusion-lists',
		body: { name: input['name'], is_shared: input['is_shared'] },
		mediaType: 'application/json',
	});
	return schemas.exclusionLists_createOutput.parse(raw);
};

export const exclusionLists_get = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.exclusionLists_getInput>,
): Promise<z.output<typeof schemas.exclusionLists_getOutput>> => {
	const input = schemas.exclusionLists_getInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/intellimatch/exclusion-lists/{excludedDomainList_id}',
		path: { excludedDomainList_id: input['excludedDomainList_id'] },
	});
	return schemas.exclusionLists_getOutput.parse(raw);
};

export const exclusionLists_update = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.exclusionLists_updateInput>,
): Promise<z.output<typeof schemas.exclusionLists_updateOutput>> => {
	const input = schemas.exclusionLists_updateInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'PUT',
		url: '/api/intellimatch/exclusion-lists/{excludedDomainList_id}',
		path: { excludedDomainList_id: input['excludedDomainList_id'] },
		body: { name: input['name'], is_shared: input['is_shared'] },
		mediaType: 'application/json',
	});
	return schemas.exclusionLists_updateOutput.parse(raw);
};

export const exclusionLists_delete = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.exclusionLists_deleteInput>,
): Promise<z.output<typeof schemas.exclusionLists_deleteOutput>> => {
	const input = schemas.exclusionLists_deleteInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'DELETE',
		url: '/api/intellimatch/exclusion-lists/{excludedDomainList_id}',
		path: { excludedDomainList_id: input['excludedDomainList_id'] },
	});
	return schemas.exclusionLists_deleteOutput.parse(raw);
};

export const excludedDomains_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.excludedDomains_listInput>,
): Promise<z.output<typeof schemas.excludedDomains_listOutput>> => {
	const input = schemas.excludedDomains_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/intellimatch/domains',
		query: {
			query: input['query'],
			list_id: input['list_id'],
			per_page: input['per_page'],
			page: input['page'],
		},
	});
	return schemas.excludedDomains_listOutput.parse(raw);
};

export const excludedDomains_add = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.excludedDomains_addInput>,
): Promise<z.output<typeof schemas.excludedDomains_addOutput>> => {
	const input = schemas.excludedDomains_addInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/intellimatch/domains',
		body: { domains: input['domains'], list_id: input['list_id'] },
		mediaType: 'application/json',
	});
	return schemas.excludedDomains_addOutput.parse(raw);
};

export const excludedDomains_remove = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.excludedDomains_removeInput>,
): Promise<z.output<typeof schemas.excludedDomains_removeOutput>> => {
	const input = schemas.excludedDomains_removeInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'DELETE',
		url: '/api/intellimatch/domains',
		body: { ids: input['ids'] },
		mediaType: 'application/json',
	});
	return schemas.excludedDomains_removeOutput.parse(raw);
};

export const intellimatch_search = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.intellimatch_searchInput>,
): Promise<z.output<typeof schemas.intellimatch_searchOutput>> => {
	const input = schemas.intellimatch_searchInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/intellimatch/search',
		body: {
			query: input['query'],
			limit: input['limit'],
			config: input['config'],
		},
		mediaType: 'application/json',
	});
	return schemas.intellimatch_searchOutput.parse(raw);
};

export const intellimatch_status = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.intellimatch_statusInput>,
): Promise<z.output<typeof schemas.intellimatch_statusOutput>> => {
	const input = schemas.intellimatch_statusInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/intellimatch/status',
		query: { hash: input['hash'] },
	});
	return schemas.intellimatch_statusOutput.parse(raw);
};

export const intellimatch_results = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.intellimatch_resultsInput>,
): Promise<z.output<typeof schemas.intellimatch_resultsOutput>> => {
	const input = schemas.intellimatch_resultsInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/intellimatch/data',
		query: {
			hash: input['hash'],
			page: input['page'],
			per_page: input['per_page'],
		},
	});
	return schemas.intellimatch_resultsOutput.parse(raw);
};

export const intellimatch_lookalikes = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.intellimatch_lookalikesInput>,
): Promise<z.output<typeof schemas.intellimatch_lookalikesOutput>> => {
	const input = schemas.intellimatch_lookalikesInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/lookalike/search',
		body: {
			seed: input['seed'],
			same_country: input['same_country'],
			same_size: input['same_size'],
			limit: input['limit'],
			exclusion_list_ids: input['exclusion_list_ids'],
		},
		mediaType: 'application/json',
	});
	return schemas.intellimatch_lookalikesOutput.parse(raw);
};

export const search_reverseEmail = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_reverseEmailInput>,
): Promise<z.output<typeof schemas.search_reverseEmailOutput>> => {
	const input = schemas.search_reverseEmailInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/reverse-email',
		body: { email: input['email'], with_profile: input['with_profile'] },
		mediaType: 'application/json',
	});
	return schemas.search_reverseEmailOutput.parse(raw);
};

export const search_company = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_companyInput>,
): Promise<z.output<typeof schemas.search_companyOutput>> => {
	const input = schemas.search_companyInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/company',
		body: {
			linkedin_url: input['linkedin_url'],
			domain: input['domain'],
			name: input['name'],
		},
		mediaType: 'application/json',
	});
	return schemas.search_companyOutput.parse(raw);
};

export const search_employees = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_employeesInput>,
): Promise<z.output<typeof schemas.search_employeesOutput>> => {
	const input = schemas.search_employeesInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/employees',
		body: {
			website: input['website'],
			job_titles: input['job_titles'],
			count: input['count'],
		},
		mediaType: 'application/json',
	});
	return schemas.search_employeesOutput.parse(raw);
};

export const search_phone = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.search_phoneInput>,
): Promise<z.output<typeof schemas.search_phoneOutput>> => {
	const input = schemas.search_phoneInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/search/phone',
		body: { linkedin_url: input['linkedin_url'] },
		mediaType: 'application/json',
	});
	return schemas.search_phoneOutput.parse(raw);
};

export const signals_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.signals_listInput>,
): Promise<z.output<typeof schemas.signals_listOutput>> => {
	const input = schemas.signals_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/signals',
		query: {
			signal_type: input['signal_type'],
			monitor_id: input['monitor_id'],
			date_from: input['date_from'],
			date_to: input['date_to'],
			relevance_scores: input['relevance_scores'],
			page: input['page'],
			per_page: input['per_page'],
		},
	});
	return schemas.signals_listOutput.parse(raw);
};

export const monitors_list = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.monitors_listInput>,
): Promise<z.output<typeof schemas.monitors_listOutput>> => {
	const input = schemas.monitors_listInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/signals/monitors',
		query: { ownership: input['ownership'] },
	});
	return schemas.monitors_listOutput.parse(raw);
};

export const monitors_create = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.monitors_createInput>,
): Promise<z.output<typeof schemas.monitors_createOutput>> => {
	const input = schemas.monitors_createInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/signals/monitors',
		body: {
			name: input['name'],
			signal_type: input['signal_type'],
			keywords: input['keywords'],
			webhook_url: input['webhook_url'],
			post_url: input['post_url'],
			profile_url: input['profile_url'],
			engagement_types: input['engagement_types'],
			enrichment_level: input['enrichment_level'],
			lead_list_id: input['lead_list_id'],
			ai_relevance_prompt: input['ai_relevance_prompt'],
			max_matches: input['max_matches'],
			target_companies: input['target_companies'],
			is_shared: input['is_shared'],
			icp_filters: input['icp_filters'],
			job_offer_title_keywords: input['job_offer_title_keywords'],
		},
		mediaType: 'application/json',
	});
	return schemas.monitors_createOutput.parse(raw);
};

export const monitors_update = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.monitors_updateInput>,
): Promise<z.output<typeof schemas.monitors_updateOutput>> => {
	const input = schemas.monitors_updateInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'PATCH',
		url: '/api/signals/monitors/{id}',
		path: { id: input['id'] },
		body: {
			name: input['name'],
			keywords: input['keywords'],
			webhook_url: input['webhook_url'],
			engagement_types: input['engagement_types'],
			enrichment_level: input['enrichment_level'],
			lead_list_id: input['lead_list_id'],
			ai_relevance_prompt: input['ai_relevance_prompt'],
			max_matches: input['max_matches'],
			target_companies: input['target_companies'],
			is_shared: input['is_shared'],
			icp_filters: input['icp_filters'],
			job_offer_title_keywords: input['job_offer_title_keywords'],
		},
		mediaType: 'application/json',
	});
	return schemas.monitors_updateOutput.parse(raw);
};

export const monitors_delete = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.monitors_deleteInput>,
): Promise<z.output<typeof schemas.monitors_deleteOutput>> => {
	const input = schemas.monitors_deleteInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'DELETE',
		url: '/api/signals/monitors/{id}',
		path: { id: input['id'] },
	});
	return schemas.monitors_deleteOutput.parse(raw);
};

export const signals_get = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.signals_getInput>,
): Promise<z.output<typeof schemas.signals_getOutput>> => {
	const input = schemas.signals_getInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/signals/{id}',
		path: { id: input['id'] },
	});
	return schemas.signals_getOutput.parse(raw);
};

export const technologies_search = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.technologies_searchInput>,
): Promise<z.output<typeof schemas.technologies_searchOutput>> => {
	const input = schemas.technologies_searchInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/technologies/search',
		query: { q: input['q'] },
	});
	return schemas.technologies_searchOutput.parse(raw);
};

export const technologies_lookup = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.technologies_lookupInput>,
): Promise<z.output<typeof schemas.technologies_lookupOutput>> => {
	const input = schemas.technologies_lookupInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/api/technologies',
		body: { domain: input['domain'], technologies: input['technologies'] },
		mediaType: 'application/json',
	});
	return schemas.technologies_lookupOutput.parse(raw);
};

export const usage_credits = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.usage_creditsInput>,
): Promise<z.output<typeof schemas.usage_creditsOutput>> => {
	const input = schemas.usage_creditsInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/credits',
		query: { type: input['type'] },
	});
	return schemas.usage_creditsOutput.parse(raw);
};

export const usage_summary = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.usage_summaryInput>,
): Promise<z.output<typeof schemas.usage_summaryOutput>> => {
	const input = schemas.usage_summaryInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/credits/report/summary',
		query: { from: input['from'], to: input['to'] },
	});
	return schemas.usage_summaryOutput.parse(raw);
};

export const usage_teamSummary = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.usage_teamSummaryInput>,
): Promise<z.output<typeof schemas.usage_teamSummaryOutput>> => {
	const input = schemas.usage_teamSummaryInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'GET',
		url: '/api/credits/report/team-summary',
		query: { from: input['from'], to: input['to'] },
	});
	return schemas.usage_teamSummaryOutput.parse(raw);
};

export const lists_update = async (
	ctx: FindymailContext,
	args: z.input<typeof schemas.lists_updateInput>,
): Promise<z.output<typeof schemas.lists_updateOutput>> => {
	const input = schemas.lists_updateInput.parse(args);
	const raw = await makeFindymailRequest<unknown>(ctx.key, {
		method: 'PATCH',
		url: '/api/lists/{id}',
		path: { id: input['id'] },
		body: { name: input['name'], isShared: input['isShared'] },
		mediaType: 'application/json',
	});
	return schemas.lists_updateOutput.parse(raw);
};
