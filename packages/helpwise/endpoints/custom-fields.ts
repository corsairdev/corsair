import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { makeHelpwiseRequest } from '../client';
import type {
	CustomFieldsCreateResponse,
	CustomFieldsDeleteResponse,
	CustomFieldsGetResponse,
	CustomFieldsListByInboxResponse,
	CustomFieldsListResponse,
	CustomFieldsUpdateByInboxResponse,
	CustomFieldsUpdateResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const list: HelpwiseEndpoint<'customFields.list'> = async (
	ctx,
	input,
) => {
	HelpwiseEndpointInputSchemas['customFields.list'].parse(input);
	const response = await makeHelpwiseRequest<CustomFieldsListResponse>(
		'/customFields',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HelpwiseEndpoint<'customFields.get'> = async (ctx, input) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.get'].parse(input);
	const response = await makeHelpwiseRequest<CustomFieldsGetResponse>(
		`/customFields/${encodeURIComponent(parsedInput.fieldId)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.get'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.get',
		{ id: parsedInput.fieldId },
		'completed',
	);
	return parsed;
};

export const create: HelpwiseEndpoint<'customFields.create'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.create'].parse(input);
	const response = await makeHelpwiseRequest<CustomFieldsCreateResponse>(
		'/customFields',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.create'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.create',
		{ name: parsedInput.name },
		'completed',
	);
	return parsed;
};

export const update: HelpwiseEndpoint<'customFields.update'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.update'].parse(input);
	const { fieldId, ...body } = parsedInput;

	const response = await makeHelpwiseRequest<CustomFieldsUpdateResponse>(
		`/customFields/${encodeURIComponent(fieldId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.update'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.update',
		{ id: fieldId },
		'completed',
	);
	return parsed;
};

export const deleteField: HelpwiseEndpoint<'customFields.delete'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.delete'].parse(input);
	const response = await makeHelpwiseRequest<CustomFieldsDeleteResponse>(
		`/customFields/${encodeURIComponent(parsedInput.fieldId)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.delete',
		{ id: parsedInput.fieldId },
		'completed',
	);
	return parsed;
};

export const listByInbox: HelpwiseEndpoint<'customFields.listByInbox'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.listByInbox'].parse(input);
	const response = await makeHelpwiseRequest<CustomFieldsListByInboxResponse>(
		`/customFields/inbox/${encodeURIComponent(parsedInput.inboxId)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.listByInbox'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.listByInbox',
		{ inboxId: parsedInput.inboxId },
		'completed',
	);
	return parsed;
};

export const updateByInbox: HelpwiseEndpoint<
	'customFields.updateByInbox'
> = async (ctx, input) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['customFields.updateByInbox'].parse(input);
	const { inboxId, ...body } = parsedInput;

	const response = await makeHelpwiseRequest<CustomFieldsUpdateByInboxResponse>(
		`/customFields/inbox/${encodeURIComponent(inboxId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['customFields.updateByInbox'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.customFields.updateByInbox',
		{ inboxId },
		'completed',
	);
	return parsed;
};
