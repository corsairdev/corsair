import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import {
	FORM_URLENCODED,
	makeJotformEndpointRequest,
	nestSubmissionKeys,
	toJotformFormBody,
} from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['user.get'] = async (ctx, input) => {
	JotformEndpointInputSchemas['user.get'].parse(input);
	const response = await makeJotformEndpointRequest(ctx, '/user', ctx.key, {
		method: 'GET',
	});
	const parsed = JotformEndpointOutputSchemas['user.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.get',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const getForms: JotformEndpoints['user.getForms'] = async (
	ctx,
	input,
) => {
	const parsedInput = JotformEndpointInputSchemas['user.getForms'].parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.filter !== undefined) query.filter = parsedInput.filter;
	if (parsedInput.orderby !== undefined) query.orderby = parsedInput.orderby;

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/forms',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed = JotformEndpointOutputSchemas['user.getForms'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getForms',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getSubmissions: JotformEndpoints['user.getSubmissions'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['user.getSubmissions'].parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.filter !== undefined) query.filter = parsedInput.filter;
	if (parsedInput.orderby !== undefined) query.orderby = parsedInput.orderby;

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/submissions',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getSubmissions'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getSubmissions',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getFolders: JotformEndpoints['user.getFolders'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getFolders'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/folders',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getFolders'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getFolders',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const getHistory: JotformEndpoints['user.getHistory'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['user.getHistory'].parse(input);
	const query: Record<string, string | undefined> = {};
	if (parsedInput.action !== undefined) query.action = parsedInput.action;
	if (parsedInput.date !== undefined) query.date = parsedInput.date;
	if (parsedInput.sortBy !== undefined) query.sortBy = parsedInput.sortBy;
	if (parsedInput.startDate !== undefined)
		query.startDate = parsedInput.startDate;
	if (parsedInput.endDate !== undefined) query.endDate = parsedInput.endDate;

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/history',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getHistory'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getHistory',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getSettings: JotformEndpoints['user.getSettings'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getSettings'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/settings',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getSettings'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getSettings',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const updateSettings: JotformEndpoints['user.updateSettings'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['user.updateSettings'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/settings',
		ctx.key,
		{
			method: 'POST',
			body: toJotformFormBody(parsedInput),
			contentType: FORM_URLENCODED,
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.updateSettings'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.updateSettings',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const getSettingByKey: JotformEndpoints['user.getSettingByKey'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['user.getSettingByKey'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/user/settings/${encodeURIComponent(parsedInput.key)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getSettingByKey'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getSettingByKey',
		{ key: parsedInput.key },
		'completed',
	);
	return parsed;
};

export const getSubusers: JotformEndpoints['user.getSubusers'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getSubusers'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/subusers',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getSubusers'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getSubusers',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getUsage: JotformEndpoints['user.getUsage'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getUsage'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/usage',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = JotformEndpointOutputSchemas['user.getUsage'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getUsage',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const getReports: JotformEndpoints['user.getReports'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getReports'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/reports',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getReports'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getReports',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getInvoices: JotformEndpoints['user.getInvoices'] = async (
	ctx,
	input,
) => {
	JotformEndpointInputSchemas['user.getInvoices'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/invoices',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		JotformEndpointOutputSchemas['user.getInvoices'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getInvoices',
		{ count: Array.isArray(parsed.content) ? parsed.content.length : 0 },
		'completed',
	);
	return parsed;
};

export const getLabels: JotformEndpoints['user.getLabels'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['user.getLabels'].parse(input);
	const query: Record<string, string | undefined> = {};
	if (parsedInput.addResources !== undefined) {
		query.addResources = String(parsedInput.addResources);
	}

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/labels',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed = JotformEndpointOutputSchemas['user.getLabels'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.getLabels',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const login: JotformEndpoints['user.login'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['user.login'].parse(input);
	// Urlencoded body as required by Jotform login endpoint
	const body = new URLSearchParams({
		username: parsedInput.username,
		password: parsedInput.password,
		...(parsedInput.appName ? { appName: parsedInput.appName } : {}),
		...(parsedInput.access ? { access: parsedInput.access } : {}),
	}).toString();

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/login',
		undefined, // keyless public route
		{
			method: 'POST',
			body,
			contentType: 'application/x-www-form-urlencoded',
		},
	);
	const parsed = JotformEndpointOutputSchemas['user.login'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.login',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const logout: JotformEndpoints['user.logout'] = async (ctx, input) => {
	JotformEndpointInputSchemas['user.logout'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/logout',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['user.logout'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.logout',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const register: JotformEndpoints['user.register'] = async (
	ctx,
	input,
) => {
	const parsedInput = JotformEndpointInputSchemas['user.register'].parse(input);
	const body = new URLSearchParams({
		username: parsedInput.username,
		password: parsedInput.password,
		email: parsedInput.email,
	}).toString();

	const response = await makeJotformEndpointRequest(
		ctx,
		'/user/register',
		undefined, // keyless public route
		{
			method: 'POST',
			body,
			contentType: 'application/x-www-form-urlencoded',
		},
	);
	const parsed = JotformEndpointOutputSchemas['user.register'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.user.register',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};
