import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { compactQuery, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

/**
 * Read-only reference/configuration data (pipeline stages, requisitions,
 * recruiters, legal entities, custom attributes, disqualification reasons,
 * permission sets, employee fields, timeoff categories/balances, work
 * schedules, scheduled events). None of these are cached locally - they're
 * account configuration or point-in-time data, not entities this plugin
 * creates or updates, so there's nothing to keep a local mirror in sync for.
 */

export const stagesList: WorkableEndpoints['stagesList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['stagesList']
	>('/stages', ctx.key, account);
	await logEventFromContext(ctx, 'workable.stages.list', {}, 'completed');
	return response;
};

export const requisitionsList: WorkableEndpoints['requisitionsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['requisitionsList']
	>('/requisitions', ctx.key, account, {
		query: compactQuery({
			limit: input.limit,
			since_id: input.since_id,
			max_id: input.max_id,
		}),
	});
	await logEventFromContext(ctx, 'workable.requisitions.list', {}, 'completed');
	return response;
};

export const recruitersList: WorkableEndpoints['recruitersList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['recruitersList']
	>('/recruiters', ctx.key, account, {
		query: compactQuery({ shortcode: input.shortcode }),
	});
	await logEventFromContext(ctx, 'workable.recruiters.list', {}, 'completed');
	return response;
};

export const legalEntitiesList: WorkableEndpoints['legalEntitiesList'] = async (
	ctx,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['legalEntitiesList']
	>('/legal_entities', ctx.key, account);
	await logEventFromContext(
		ctx,
		'workable.legal_entities.list',
		{},
		'completed',
	);
	return response;
};

export const customAttributesList: WorkableEndpoints['customAttributesList'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['customAttributesList']
		>('/custom_attributes', ctx.key, account);
		await logEventFromContext(
			ctx,
			'workable.custom_attributes.list',
			{},
			'completed',
		);
		return response;
	};

export const disqualificationReasonsList: WorkableEndpoints['disqualificationReasonsList'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['disqualificationReasonsList']
		>('/disqualification_reasons', ctx.key, account);
		await logEventFromContext(
			ctx,
			'workable.disqualification_reasons.list',
			{},
			'completed',
		);
		return response;
	};

export const permissionSetsList: WorkableEndpoints['permissionSetsList'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['permissionSetsList']
		>('/permission_sets', ctx.key, account);
		await logEventFromContext(
			ctx,
			'workable.permission_sets.list',
			{},
			'completed',
		);
		return response;
	};

export const employeeFieldsList: WorkableEndpoints['employeeFieldsList'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['employeeFieldsList']
		>('/employee_fields', ctx.key, account);
		await logEventFromContext(
			ctx,
			'workable.employee_fields.list',
			{},
			'completed',
		);
		return response;
	};

export const timeoffCategoriesList: WorkableEndpoints['timeoffCategoriesList'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['timeoffCategoriesList']
		>('/timeoff/categories', ctx.key, account);
		await logEventFromContext(
			ctx,
			'workable.timeoff_categories.list',
			{},
			'completed',
		);
		return response;
	};

export const timeoffBalancesList: WorkableEndpoints['timeoffBalancesList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['timeoffBalancesList']
		>('/timeoff/balances', ctx.key, account, {
			query: compactQuery({ employee_id: input.employee_id }),
		});
		await logEventFromContext(
			ctx,
			'workable.timeoff_balances.list',
			{},
			'completed',
		);
		return response;
	};

export const workSchedulesList: WorkableEndpoints['workSchedulesList'] = async (
	ctx,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['workSchedulesList']
	>('/work_schedules', ctx.key, account);
	await logEventFromContext(
		ctx,
		'workable.work_schedules.list',
		{},
		'completed',
	);
	return response;
};

export const eventsList: WorkableEndpoints['eventsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['eventsList']
	>('/events', ctx.key, account, {
		query: compactQuery({
			type: input.type,
			limit: input.limit,
			start_date: input.start_date,
			end_date: input.end_date,
			candidate_id: input.candidate_id,
			shortcode: input.shortcode,
			member_id: input.member_id,
			context: input.context,
			include_cancelled: input.include_cancelled,
			since_id: input.since_id,
			max_id: input.max_id,
		}),
	});
	await logEventFromContext(ctx, 'workable.events.list', {}, 'completed');
	return response;
};
