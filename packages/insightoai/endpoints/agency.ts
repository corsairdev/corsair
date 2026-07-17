import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createAgency: InsightoaiEndpoints['createAgency'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createAgency']
	>('/api/v1/agency', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.agency.createAgency',
		{ orgId: input.org_id },
		'completed',
	);
	return result;
};

export const getAgencyBrandingById: InsightoaiEndpoints['getAgencyBrandingById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getAgencyBrandingById']
		>(`/api/v1/agency/${input.agency_id}/branding`, ctx.key, {
			method: 'GET',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.agency.getAgencyBrandingById',
			{ agencyId: input.agency_id },
			'completed',
		);
		return result;
	};

export const getAgencyBillingPlan: InsightoaiEndpoints['getAgencyBillingPlan'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getAgencyBillingPlan']
		>(`/api/v1/agency/billing/${input.billing_plan_id}`, ctx.key, {
			method: 'GET',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.agency.getAgencyBillingPlan',
			{ billingPlanId: input.billing_plan_id },
			'completed',
		);
		return result;
	};

// Insighto documents this as POST /api/v1/pricing with an optional body of
// model/voice IDs (llm_model_id, voice_stt_id, voice_tts_id) — not a bare GET.
// Verified against the public operation surface (docs.insighto.ai + Composio
// Insighto toolkit mirror of the same op names).
export const getPricingForUser: InsightoaiEndpoints['getPricingForUser'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getPricingForUser']
		>('/api/v1/pricing', ctx.key, {
			method: 'POST',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.agency.getPricingForUser',
			{},
			'completed',
		);
		return result;
	};

export const getAgentList: InsightoaiEndpoints['getAgentList'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getAgentList']
	>('/api/v1/user/get_agent_list', ctx.key, {
		method: 'GET',
		query: { page: input.page, size: input.size },
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.agency.getAgentList',
		{},
		'completed',
	);
	return result;
};

// Never logs the full profile payload (may include address, Stripe/billing details) — only
// the user id being updated.
export const updateUserProfile: InsightoaiEndpoints['updateUserProfile'] =
	async (ctx, input) => {
		const { user_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateUserProfile']
		>(`/api/v1/user/${user_id}`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.agency.updateUserProfile',
			{ userId: user_id },
			'completed',
		);
		return result;
	};

export const retrieveUserMonthlyUsagesAggregation: InsightoaiEndpoints['retrieveUserMonthlyUsagesAggregation'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['retrieveUserMonthlyUsagesAggregation']
		>('/api/v1/user_usage/user_monthly_usages', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.agency.retrieveUserMonthlyUsagesAggregation',
			{},
			'completed',
		);
		return result;
	};
