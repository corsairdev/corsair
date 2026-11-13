import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import { safeEventPayload } from '../safe-event';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Forms & Users family: create_form, get_form, update_form,
// form_questions_editor, create_form_submission, get_user_context,
// list_users_and_teams.
export const formsCreate: MondayMcpEndpoints['forms.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['forms.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_form', parsed);
	const output = MondayMcpEndpointOutputSchemas['forms.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.forms.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const formsGet: MondayMcpEndpoints['forms.get'] = async (ctx, input) => {
	const parsed = MondayMcpEndpointInputSchemas['forms.get'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'get_form', parsed);
	const output = MondayMcpEndpointOutputSchemas['forms.get'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.forms.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const formsUpdate: MondayMcpEndpoints['forms.update'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['forms.update'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'update_form', parsed);
	const output = MondayMcpEndpointOutputSchemas['forms.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.forms.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const formsEditQuestions: MondayMcpEndpoints['forms.editQuestions'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['forms.editQuestions'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'form_questions_editor',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['forms.editQuestions'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.forms.editQuestions',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const formsCreateSubmission: MondayMcpEndpoints['forms.createSubmission'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['forms.createSubmission'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'create_form_submission',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['forms.createSubmission'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.forms.createSubmission',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const usersGetContext: MondayMcpEndpoints['users.getContext'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['users.getContext'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'get_user_context',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['users.getContext'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.users.getContext',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersListAndTeams: MondayMcpEndpoints['users.listAndTeams'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['users.listAndTeams'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'list_users_and_teams',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['users.listAndTeams'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.users.listAndTeams',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
