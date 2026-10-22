import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import {
	compactQuery,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

/**
 * Read-only reference/configuration data (pipeline stages, requisitions,
 * recruiters, legal entities, custom attributes, disqualification reasons,
 * permission sets, employee fields, timeoff categories/balances, work
 * schedules, scheduled events). None of these are cached locally - they're
 * account configuration or point-in-time data, not entities this plugin
 * creates or updates, so there's nothing to keep a local mirror in sync for.
 */

export const stagesList: WorkableEndpoints['stagesList'] = async (
	ctx,
	input,
) => {
	parseEndpointInput(WorkableEndpointInputSchemas.stagesList, input);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<WorkableEndpointOutputs['stagesList']>(
		'/stages',
		ctx.key,
		account,
	);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.stagesList,
		raw,
	);
	await logEventFromContext(ctx, 'workable.stages.list', {}, 'completed');
	return response;
};

export const requisitionsList: WorkableEndpoints['requisitionsList'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.requisitionsList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['requisitionsList']
	>('/requisitions', ctx.key, account, {
		query: compactQuery({
			limit: valid.limit,
			since_id: valid.since_id,
			max_id: valid.max_id,
		}),
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.requisitionsList,
		raw,
	);
	await logEventFromContext(ctx, 'workable.requisitions.list', {}, 'completed');
	return response;
};

export const recruitersList: WorkableEndpoints['recruitersList'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.recruitersList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['recruitersList']
	>('/recruiters', ctx.key, account, {
		query: compactQuery({ shortcode: valid.shortcode }),
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.recruitersList,
		raw,
	);
	await logEventFromContext(ctx, 'workable.recruiters.list', {}, 'completed');
	return response;
};

export const legalEntitiesList: WorkableEndpoints['legalEntitiesList'] = async (
	ctx,
	input,
) => {
	parseEndpointInput(WorkableEndpointInputSchemas.legalEntitiesList, input);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['legalEntitiesList']
	>('/legal_entities', ctx.key, account);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.legalEntitiesList,
		raw,
	);
	await logEventFromContext(
		ctx,
		'workable.legal_entities.list',
		{},
		'completed',
	);
	return response;
};

export const customAttributesList: WorkableEndpoints['customAttributesList'] =
	async (ctx, input) => {
		parseEndpointInput(
			WorkableEndpointInputSchemas.customAttributesList,
			input,
		);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['customAttributesList']
		>('/custom_attributes', ctx.key, account);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.customAttributesList,
			raw,
		);
		await logEventFromContext(
			ctx,
			'workable.custom_attributes.list',
			{},
			'completed',
		);
		return response;
	};

export const disqualificationReasonsList: WorkableEndpoints['disqualificationReasonsList'] =
	async (ctx, input) => {
		parseEndpointInput(
			WorkableEndpointInputSchemas.disqualificationReasonsList,
			input,
		);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['disqualificationReasonsList']
		>('/disqualification_reasons', ctx.key, account);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.disqualificationReasonsList,
			raw,
		);
		await logEventFromContext(
			ctx,
			'workable.disqualification_reasons.list',
			{},
			'completed',
		);
		return response;
	};

export const permissionSetsList: WorkableEndpoints['permissionSetsList'] =
	async (ctx, input) => {
		parseEndpointInput(WorkableEndpointInputSchemas.permissionSetsList, input);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['permissionSetsList']
		>('/permission_sets', ctx.key, account);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.permissionSetsList,
			raw,
		);
		await logEventFromContext(
			ctx,
			'workable.permission_sets.list',
			{},
			'completed',
		);
		return response;
	};

export const employeeFieldsList: WorkableEndpoints['employeeFieldsList'] =
	async (ctx, input) => {
		parseEndpointInput(WorkableEndpointInputSchemas.employeeFieldsList, input);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['employeeFieldsList']
		>('/employee_fields', ctx.key, account);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.employeeFieldsList,
			raw,
		);
		await logEventFromContext(
			ctx,
			'workable.employee_fields.list',
			{},
			'completed',
		);
		return response;
	};

export const timeoffCategoriesList: WorkableEndpoints['timeoffCategoriesList'] =
	async (ctx, input) => {
		parseEndpointInput(
			WorkableEndpointInputSchemas.timeoffCategoriesList,
			input,
		);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['timeoffCategoriesList']
		>('/timeoff/categories', ctx.key, account);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.timeoffCategoriesList,
			raw,
		);
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
		const valid = parseEndpointInput(
			WorkableEndpointInputSchemas.timeoffBalancesList,
			input,
		);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['timeoffBalancesList']
		>('/timeoff/balances', ctx.key, account, {
			query: compactQuery({ employee_id: valid.employee_id }),
		});
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.timeoffBalancesList,
			raw,
		);
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
	input,
) => {
	parseEndpointInput(WorkableEndpointInputSchemas.workSchedulesList, input);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['workSchedulesList']
	>('/work_schedules', ctx.key, account);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.workSchedulesList,
		raw,
	);
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
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.eventsList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<WorkableEndpointOutputs['eventsList']>(
		'/events',
		ctx.key,
		account,
		{
			query: compactQuery({
				type: valid.type,
				limit: valid.limit,
				start_date: valid.start_date,
				end_date: valid.end_date,
				candidate_id: valid.candidate_id,
				shortcode: valid.shortcode,
				member_id: valid.member_id,
				context: valid.context,
				include_cancelled: valid.include_cancelled,
				since_id: valid.since_id,
				max_id: valid.max_id,
			}),
		},
	);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.eventsList,
		raw,
	);
	await logEventFromContext(ctx, 'workable.events.list', {}, 'completed');
	return response;
};
