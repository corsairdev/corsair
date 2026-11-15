import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const accountGetSettings: JobNimbusEndpoints['accountGetSettings'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountGetSettings.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/settings',
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					field: parsedInput.field,
				}),
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountGetSettings.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.get_settings',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountGetGroups: JobNimbusEndpoints['accountGetGroups'] = async (
	ctx,
	input,
) => {
	JobNimbusEndpointInputSchemas.accountGetGroups.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/account/settings',
		ctx.key,
		{
			method: 'GET',
			query: { field: 'groups' },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed =
		JobNimbusEndpointOutputSchemas.accountGetGroups.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.account.get_groups',
		{ count: parsed.length },
		'completed',
	);

	return parsed;
};

export const accountGetUsers: JobNimbusEndpoints['accountGetUsers'] = async (
	ctx,
	input,
) => {
	JobNimbusEndpointInputSchemas.accountGetUsers.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/account/users',
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.accountGetUsers.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.account.get_users',
		{ count: parsed.users?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const accountGetUoms: JobNimbusEndpoints['accountGetUoms'] = async (
	ctx,
	input,
) => {
	JobNimbusEndpointInputSchemas.accountGetUoms.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/utility/uoms',
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.accountGetUoms.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.account.get_uoms',
		{ count: parsed.length },
		'completed',
	);

	return parsed;
};

export const accountCreateWorkflow: JobNimbusEndpoints['accountCreateWorkflow'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateWorkflow.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/workflow',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateWorkflow.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_workflow',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateWorkflowStatus: JobNimbusEndpoints['accountCreateWorkflowStatus'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateWorkflowStatus.parse(input);
		const { workflowid, ...body } = parsedInput;

		const response = await makeJobNimbusRequest<unknown>(
			`/account/workflow/${encodeURIComponent(workflowid)}/status`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateWorkflowStatus.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_workflow_status',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateLeadSource: JobNimbusEndpoints['accountCreateLeadSource'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateLeadSource.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/leadsource',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateLeadSource.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_lead_source',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateCustomField: JobNimbusEndpoints['accountCreateCustomField'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateCustomField.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/customfield',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateCustomField.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_custom_field',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateFileType: JobNimbusEndpoints['accountCreateFileType'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateFileType.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/filetype',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateFileType.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_file_type',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateTaskType: JobNimbusEndpoints['accountCreateTaskType'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateTaskType.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/tasktype',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateTaskType.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_task_type',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateActivityType: JobNimbusEndpoints['accountCreateActivityType'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateActivityType.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/activitytype',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateActivityType.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_activity_type',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const accountCreateLocation: JobNimbusEndpoints['accountCreateLocation'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.accountCreateLocation.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/account/location',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.accountCreateLocation.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.account.create_location',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const Account = {
	getSettings: accountGetSettings,
	getGroups: accountGetGroups,
	getUsers: accountGetUsers,
	getUoms: accountGetUoms,
	createWorkflow: accountCreateWorkflow,
	createWorkflowStatus: accountCreateWorkflowStatus,
	createLeadSource: accountCreateLeadSource,
	createCustomField: accountCreateCustomField,
	createFileType: accountCreateFileType,
	createTaskType: accountCreateTaskType,
	createActivityType: accountCreateActivityType,
	createLocation: accountCreateLocation,
};
