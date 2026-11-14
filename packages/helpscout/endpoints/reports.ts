import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const getConversations: HelpScoutEndpoints['reports.getConversations'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['reports.getConversations'].parse(input);
		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['reports.getConversations']
		>('/reports/conversations', ctx.key, {
			method: 'GET',
			query: {
				start: parsedInput.start,
				end: parsedInput.end,
				previousStart: parsedInput.previousStart,
				previousEnd: parsedInput.previousEnd,
				mailboxes: parsedInput.mailboxes,
				tags: parsedInput.tags,
				types: parsedInput.types,
				folders: parsedInput.folders,
			},
		});

		const parsed =
			HelpScoutEndpointOutputSchemas['reports.getConversations'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'helpscout.reports.getConversations',
			{ success: true },
			'completed',
		);

		return parsed;
	};

export const getCompany: HelpScoutEndpoints['reports.getCompany'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['reports.getCompany'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['reports.getCompany']
	>('/reports/company', ctx.key, {
		method: 'GET',
		query: {
			start: parsedInput.start,
			end: parsedInput.end,
			previousStart: parsedInput.previousStart,
			previousEnd: parsedInput.previousEnd,
			mailboxes: parsedInput.mailboxes,
			tags: parsedInput.tags,
			types: parsedInput.types,
			folders: parsedInput.folders,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['reports.getCompany'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.reports.getCompany',
		{ success: true },
		'completed',
	);

	return parsed;
};

export const getEmail: HelpScoutEndpoints['reports.getEmail'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['reports.getEmail'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['reports.getEmail']
	>('/reports/email', ctx.key, {
		method: 'GET',
		query: {
			start: parsedInput.start,
			end: parsedInput.end,
			previousStart: parsedInput.previousStart,
			previousEnd: parsedInput.previousEnd,
			mailboxes: parsedInput.mailboxes,
			tags: parsedInput.tags,
			types: parsedInput.types,
			folders: parsedInput.folders,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['reports.getEmail'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.reports.getEmail',
		{ success: true },
		'completed',
	);

	return parsed;
};

export const getChat: HelpScoutEndpoints['reports.getChat'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['reports.getChat'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['reports.getChat']
	>('/reports/chat', ctx.key, {
		method: 'GET',
		query: {
			start: parsedInput.start,
			end: parsedInput.end,
			previousStart: parsedInput.previousStart,
			previousEnd: parsedInput.previousEnd,
			mailboxes: parsedInput.mailboxes,
			tags: parsedInput.tags,
			types: parsedInput.types,
			folders: parsedInput.folders,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['reports.getChat'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.reports.getChat',
		{ success: true },
		'completed',
	);

	return parsed;
};

export const getDocs: HelpScoutEndpoints['reports.getDocs'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['reports.getDocs'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['reports.getDocs']
	>('/reports/docs', ctx.key, {
		method: 'GET',
		query: {
			start: parsedInput.start,
			end: parsedInput.end,
			previousStart: parsedInput.previousStart,
			previousEnd: parsedInput.previousEnd,
			mailboxes: parsedInput.mailboxes,
			tags: parsedInput.tags,
			types: parsedInput.types,
			folders: parsedInput.folders,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['reports.getDocs'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.reports.getDocs',
		{ success: true },
		'completed',
	);

	return parsed;
};
