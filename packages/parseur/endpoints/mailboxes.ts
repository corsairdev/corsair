import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import {
	CopyMailboxInputSchema,
	CopyMailboxOutputSchema,
	CreateMailboxInputSchema,
	CreateMailboxOutputSchema,
	DeleteMailboxInputSchema,
	DeleteMailboxOutputSchema,
	GetMailboxInputSchema,
	GetMailboxOutputSchema,
	GetMailboxSchemaInputSchema,
	GetMailboxSchemaOutputSchema,
	ListMailboxesInputSchema,
	ListMailboxesOutputSchema,
	UpdateMailboxInputSchema,
	UpdateMailboxOutputSchema,
} from './types';

export const listMailboxes: ParseurEndpoints['listMailboxes'] = async (
	ctx,
	input,
) => {
	const parsed = ListMailboxesInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>('/parser', {
		apiKey: ctx.key,
		method: 'GET',
		query: {
			page: parsed.page,
			page_size: parsed.page_size,
			search: parsed.search,
			ordering: parsed.ordering,
		},
	});

	const output = ListMailboxesOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.listMailboxes',
		{ page: parsed.page, search: parsed.search },
		'completed',
	);

	return output;
};

export const createMailbox: ParseurEndpoints['createMailbox'] = async (
	ctx,
	input,
) => {
	const parsed = CreateMailboxInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>('/parser', {
		apiKey: ctx.key,
		method: 'POST',
		body: parsed,
	});

	const output = CreateMailboxOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.createMailbox',
		{ name: parsed.name },
		'completed',
	);

	return output;
};

export const getMailbox: ParseurEndpoints['getMailbox'] = async (
	ctx,
	input,
) => {
	const parsed = GetMailboxInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(`/parser/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'GET',
	});

	const output = GetMailboxOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.getMailbox',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const updateMailbox: ParseurEndpoints['updateMailbox'] = async (
	ctx,
	input,
) => {
	const parsed = UpdateMailboxInputSchema.parse(input);
	const { id, ...body } = parsed;
	const response = await makeParseurRequest<unknown>(`/parser/${id}`, {
		apiKey: ctx.key,
		method: 'PUT',
		body,
	});

	const output = UpdateMailboxOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.updateMailbox',
		{ id },
		'completed',
	);

	return output;
};

export const deleteMailbox: ParseurEndpoints['deleteMailbox'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteMailboxInputSchema.parse(input);
	await makeParseurRequest<unknown>(`/parser/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.deleteMailbox',
		{ id: parsed.id },
		'completed',
	);

	return DeleteMailboxOutputSchema.parse({ success: true });
};

export const getMailboxSchema: ParseurEndpoints['getMailboxSchema'] = async (
	ctx,
	input,
) => {
	const parsed = GetMailboxSchemaInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/schema`,
		{
			apiKey: ctx.key,
			method: 'GET',
		},
	);

	const output = GetMailboxSchemaOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.getMailboxSchema',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const copyMailbox: ParseurEndpoints['copyMailbox'] = async (
	ctx,
	input,
) => {
	const parsed = CopyMailboxInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/copy`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = CopyMailboxOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.mailboxes.copyMailbox',
		{ id: parsed.id },
		'completed',
	);

	return output;
};
