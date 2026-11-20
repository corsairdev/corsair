import { logEventFromContext } from 'corsair/core';
import type { LemlistQueryValue } from '../client';
import { makeLemlistRequest } from '../client';
import type { LemlistPluginContext } from '../index';
import type {
	UnsubscribesBulkUnsubscribeVariablesInput,
	UnsubscribesBulkUnsubscribeVariablesResponse,
	UnsubscribesExportContactsInput,
	UnsubscribesExportContactsResponse,
	UnsubscribesExportVariablesInput,
	UnsubscribesExportVariablesResponse,
	UnsubscribesGetContactStatusInput,
	UnsubscribesGetContactStatusResponse,
	UnsubscribesGetVariableInput,
	UnsubscribesGetVariableResponse,
	UnsubscribesListVariablesInput,
	UnsubscribesListVariablesResponse,
	UnsubscribesResubscribeContactInput,
	UnsubscribesResubscribeContactResponse,
	UnsubscribesResubscribeVariableInput,
	UnsubscribesResubscribeVariableResponse,
	UnsubscribesUnsubscribeContactInput,
	UnsubscribesUnsubscribeContactResponse,
	UnsubscribesUnsubscribeVariableInput,
	UnsubscribesUnsubscribeVariableResponse,
} from './types';
import {
	LemlistEndpointInputSchemas,
	LemlistEndpointOutputSchemas,
} from './types';

type LemlistCall = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	url: string;
	// `unknown` because request bodies vary per endpoint.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, LemlistQueryValue>;
};

export const Unsubscribes = {
	listVariables: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesListVariablesInput,
	): Promise<UnsubscribesListVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesListVariables.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/v2/unsubscribes/variables',
			query: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesListVariables.parse(response);
		const logFn: (
			_input: UnsubscribesListVariablesInput,
			_res: UnsubscribesListVariablesResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.listVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	bulkUnsubscribeVariables: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesBulkUnsubscribeVariablesInput,
	): Promise<UnsubscribesBulkUnsubscribeVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesBulkUnsubscribeVariables.parse(
				input,
			);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: '/v2/unsubscribes/variables',
			body: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
			text: true,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesBulkUnsubscribeVariables.parse(
				response,
			);
		const logFn: (
			_input: UnsubscribesBulkUnsubscribeVariablesInput,
			_res: UnsubscribesBulkUnsubscribeVariablesResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			count: input.values.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.bulkUnsubscribeVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getVariable: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesGetVariableInput,
	): Promise<UnsubscribesGetVariableResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesGetVariable.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/v2/unsubscribes/variables/${encodeURIComponent(input.value)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesGetVariable.parse(response);
		const logFn: (
			_input: UnsubscribesGetVariableInput,
			_res: UnsubscribesGetVariableResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.getVariable',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	unsubscribeVariable: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesUnsubscribeVariableInput,
	): Promise<UnsubscribesUnsubscribeVariableResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesUnsubscribeVariable.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/v2/unsubscribes/variables/${encodeURIComponent(input.value)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesUnsubscribeVariable.parse(
				response,
			);
		const logFn: (
			_input: UnsubscribesUnsubscribeVariableInput,
			_res: UnsubscribesUnsubscribeVariableResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.unsubscribeVariable',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	resubscribeVariable: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesResubscribeVariableInput,
	): Promise<UnsubscribesResubscribeVariableResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesResubscribeVariable.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/v2/unsubscribes/variables/${encodeURIComponent(input.value)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
			text: true,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesResubscribeVariable.parse(
				response,
			);
		const logFn: (
			_input: UnsubscribesResubscribeVariableInput,
			_res: UnsubscribesResubscribeVariableResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.resubscribeVariable',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getContactStatus: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesGetContactStatusInput,
	): Promise<UnsubscribesGetContactStatusResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesGetContactStatus.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/v2/unsubscribes/contacts/${encodeURIComponent(input.contactId)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesGetContactStatus.parse(response);
		const logFn: (
			_input: UnsubscribesGetContactStatusInput,
			_res: UnsubscribesGetContactStatusResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			contactId: input.contactId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.getContactStatus',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	unsubscribeContact: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesUnsubscribeContactInput,
	): Promise<UnsubscribesUnsubscribeContactResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesUnsubscribeContact.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/v2/unsubscribes/contacts/${encodeURIComponent(input.contactId)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
			text: true,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesUnsubscribeContact.parse(
				response,
			);
		const logFn: (
			_input: UnsubscribesUnsubscribeContactInput,
			_res: UnsubscribesUnsubscribeContactResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			contactId: input.contactId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.unsubscribeContact',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	resubscribeContact: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesResubscribeContactInput,
	): Promise<UnsubscribesResubscribeContactResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesResubscribeContact.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/v2/unsubscribes/contacts/${encodeURIComponent(input.contactId)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
			text: true,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesResubscribeContact.parse(
				response,
			);
		const logFn: (
			_input: UnsubscribesResubscribeContactInput,
			_res: UnsubscribesResubscribeContactResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			contactId: input.contactId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.resubscribeContact',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	exportVariables: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesExportVariablesInput,
	): Promise<UnsubscribesExportVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesExportVariables.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/v2/unsubscribes/exports/variables',
			query: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesExportVariables.parse(response);
		const logFn: (
			_input: UnsubscribesExportVariablesInput,
			_res: UnsubscribesExportVariablesResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.exportVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	exportContacts: async (
		ctx: LemlistPluginContext,
		input: UnsubscribesExportContactsInput,
	): Promise<UnsubscribesExportContactsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.unsubscribesExportContacts.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/v2/unsubscribes/exports/contacts',
			query: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.unsubscribesExportContacts.parse(response);
		const logFn: (
			_input: UnsubscribesExportContactsInput,
			_res: UnsubscribesExportContactsResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.unsubscribes.exportContacts',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
};
