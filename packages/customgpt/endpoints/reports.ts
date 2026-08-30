import { logEventFromContext } from 'corsair/core';
import type { CustomGPTEndpoints } from '..';
import type { CustomGPTQueryValue } from '../client';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity } from './shared';
import type {
	CustomGPTEndpointInputs,
	CustomGPTEndpointOutputs,
} from './types';

/**
 * Intelligence-report filters are declared in the spec with a literal `[]`
 * suffix in the parameter name (`content_source[]`, `user_emotion[]`, …).
 * Inputs use the bare name for ergonomics and are re-keyed here.
 */
const INTELLIGENCE_ARRAY_FILTERS = [
	'content_source',
	'stakeholder_status',
	'user_emotion',
	'user_intent',
	'human_request',
	'language',
	'external_id',
	'country',
	'tools',
	'leads',
	'request_source',
	'risk_fidelity',
	'risk_jailbreak',
	'risk_prompt_leakage',
	'risk_profanity',
] as const satisfies readonly (keyof CustomGPTEndpointInputs['getReportIntelligence'])[];

export const getReportAnalysis: CustomGPTEndpoints['getReportAnalysis'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getReportAnalysis']
		>(`projects/${input.projectId}/reports/analysis`, ctx.key, {
			method: 'GET',
			query: { filters: input.filters, interval: input.interval },
		});

		await logEventFromContext(
			ctx,
			'customgpt.reports.analysis',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportConversations: CustomGPTEndpoints['getReportConversations'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getReportConversations']
		>(`projects/${input.projectId}/reports/conversations`, ctx.key, {
			method: 'GET',
			query: { filters: input.filters },
		});

		await logEventFromContext(
			ctx,
			'customgpt.reports.conversations',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportTraffic: CustomGPTEndpoints['getReportTraffic'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getReportTraffic']
	>(`projects/${input.projectId}/reports/traffic`, ctx.key, {
		method: 'GET',
		query: { filters: input.filters },
	});

	await logEventFromContext(
		ctx,
		'customgpt.reports.traffic',
		{ ...input },
		'completed',
	);
	return response;
};

export const getReportIntelligence: CustomGPTEndpoints['getReportIntelligence'] =
	async (ctx, input) => {
		const query: Record<string, CustomGPTQueryValue> = {
			page: input.page,
			limit: input.limit,
			start_date: input.start_date,
			end_date: input.end_date,
			accuracy: input.accuracy,
		};
		for (const filter of INTELLIGENCE_ARRAY_FILTERS) {
			const value = input[filter];
			if (value?.length) {
				query[`${filter}[]`] = value;
			}
		}

		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getReportIntelligence']
		>(`projects/${input.projectId}/reports/intelligence`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'customgpt.reports.intelligence',
			{ projectId: input.projectId, page: input.page, limit: input.limit },
			'completed',
		);
		return response;
	};

export const exportLeads: CustomGPTEndpoints['exportLeads'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['exportLeads']
	>(`projects/${input.projectId}/reports/leads`, ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			page: input.page,
			limit: input.limit,
			session_id: input.session_id,
		},
	});

	for (const lead of response.data?.data ?? []) {
		// Leads carry no single identifier; the session and query pair is unique.
		if (!lead.session_id || lead.query_id === undefined || !ctx.db.leads) {
			continue;
		}
		const entityId = `${lead.session_id}:${lead.query_id}`;
		await cacheEntity('lead', () =>
			ctx.db.leads.upsertByEntityId(entityId, {
				...lead,
				id: entityId,
				syncedAt: new Date(),
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'customgpt.reports.leads',
		{ projectId: input.projectId, page: input.page, limit: input.limit },
		'completed',
	);
	return response;
};
