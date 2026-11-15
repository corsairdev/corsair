import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['forms.get'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['forms.get'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['forms.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.get',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: JotformEndpoints['forms.create'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['forms.create'].parse(input);
	const response = await makeJotformRequest('/form', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = JotformEndpointOutputSchemas['forms.create'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.create',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const createForms: JotformEndpoints['forms.createForms'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.createForms'].parse(input);
	const response = await makeJotformRequest('/form', ctx.key, {
		method: 'PUT',
		body: parsedInput.formContent,
	});
	const parsed =
		JotformEndpointOutputSchemas['forms.createForms'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.createForms',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const deleteForm: JotformEndpoints['forms.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JotformEndpointInputSchemas['forms.delete'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed = JotformEndpointOutputSchemas['forms.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.delete',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const clone: JotformEndpoints['forms.clone'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['forms.clone'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/clone`,
		ctx.key,
		{ method: 'POST' },
	);
	const parsed = JotformEndpointOutputSchemas['forms.clone'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.clone',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getFiles: JotformEndpoints['forms.getFiles'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getFiles'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/files`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['forms.getFiles'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getFiles',
		{
			formId: parsedInput.id,
			count: Array.isArray(parsed.content) ? parsed.content.length : 0,
		},
		'completed',
	);
	return parsed;
};

export const getQuestions: JotformEndpoints['forms.getQuestions'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getQuestions'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/questions`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getQuestions'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getQuestions',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getQuestion: JotformEndpoints['forms.getQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getQuestion'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/question/${encodeURIComponent(parsedInput.qid)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getQuestion'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getQuestion',
		{ formId: parsedInput.id, qid: parsedInput.qid },
		'completed',
	);
	return parsed;
};

export const createQuestion: JotformEndpoints['forms.createQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.createQuestion'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/questions`,
		ctx.key,
		{ method: 'POST', body: parsedInput.question },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.createQuestion'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.createQuestion',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const createQuestions: JotformEndpoints['forms.createQuestions'] =
	async (ctx, input) => {
		const parsedInput =
			JotformEndpointInputSchemas['forms.createQuestions'].parse(input);
		const response = await makeJotformRequest(
			`/form/${encodeURIComponent(parsedInput.id)}/questions`,
			ctx.key,
			{ method: 'PUT', body: parsedInput.questions },
		);
		const parsed =
			JotformEndpointOutputSchemas['forms.createQuestions'].parse(response);
		await logEventFromContext(
			ctx,
			'jotform.forms.createQuestions',
			{ formId: parsedInput.id },
			'completed',
		);
		return parsed;
	};

export const updateQuestion: JotformEndpoints['forms.updateQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.updateQuestion'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/question/${encodeURIComponent(parsedInput.qid)}`,
		ctx.key,
		{ method: 'POST', body: parsedInput.question },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.updateQuestion'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.updateQuestion',
		{ formId: parsedInput.id, qid: parsedInput.qid },
		'completed',
	);
	return parsed;
};

export const deleteQuestion: JotformEndpoints['forms.deleteQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.deleteQuestion'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/question/${encodeURIComponent(parsedInput.qid)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.deleteQuestion'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.deleteQuestion',
		{ formId: parsedInput.id, qid: parsedInput.qid },
		'completed',
	);
	return parsed;
};

export const getProperties: JotformEndpoints['forms.getProperties'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getProperties'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/properties`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getProperties'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getProperties',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getProperty: JotformEndpoints['forms.getProperty'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getProperty'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/properties/${encodeURIComponent(parsedInput.key)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getProperty'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getProperty',
		{ formId: parsedInput.id, key: parsedInput.key },
		'completed',
	);
	return parsed;
};

export const setProperties: JotformEndpoints['forms.setProperties'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.setProperties'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/properties`,
		ctx.key,
		{ method: 'POST', body: parsedInput.properties },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.setProperties'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.setProperties',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getReports: JotformEndpoints['forms.getReports'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getReports'].parse(input);
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/reports`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getReports'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getReports',
		{
			formId: parsedInput.id,
			count: Array.isArray(parsed.content) ? parsed.content.length : 0,
		},
		'completed',
	);
	return parsed;
};

export const createReport: JotformEndpoints['forms.createReport'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.createReport'].parse(input);
	const body: Record<string, string> = {
		title: parsedInput.title,
		list_type: parsedInput.list_type,
		...(parsedInput.fields ? { fields: parsedInput.fields } : {}),
	};
	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/reports`,
		ctx.key,
		{ method: 'POST', body },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.createReport'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.createReport',
		{ formId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getSubmissions: JotformEndpoints['forms.getSubmissions'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['forms.getSubmissions'].parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.filter !== undefined) query.filter = parsedInput.filter;
	if (parsedInput.orderby !== undefined) query.orderby = parsedInput.orderby;

	const response = await makeJotformRequest(
		`/form/${encodeURIComponent(parsedInput.id)}/submissions`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsed =
		JotformEndpointOutputSchemas['forms.getSubmissions'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.forms.getSubmissions',
		{
			formId: parsedInput.id,
			count: Array.isArray(parsed.content) ? parsed.content.length : 0,
		},
		'completed',
	);
	return parsed;
};

export const createSubmission: JotformEndpoints['forms.createSubmission'] =
	async (ctx, input) => {
		const parsedInput =
			JotformEndpointInputSchemas['forms.createSubmission'].parse(input);
		const response = await makeJotformRequest(
			`/form/${encodeURIComponent(parsedInput.id)}/submissions`,
			ctx.key,
			{ method: 'POST', body: parsedInput.submission },
		);
		const parsed =
			JotformEndpointOutputSchemas['forms.createSubmission'].parse(response);
		await logEventFromContext(
			ctx,
			'jotform.forms.createSubmission',
			{ formId: parsedInput.id },
			'completed',
		);
		return parsed;
	};

export const createSubmissions: JotformEndpoints['forms.createSubmissions'] =
	async (ctx, input) => {
		const parsedInput =
			JotformEndpointInputSchemas['forms.createSubmissions'].parse(input);
		const response = await makeJotformRequest(
			`/form/${encodeURIComponent(parsedInput.id)}/submissions`,
			ctx.key,
			{ method: 'PUT', body: parsedInput.submissions },
		);
		const parsed =
			JotformEndpointOutputSchemas['forms.createSubmissions'].parse(response);
		await logEventFromContext(
			ctx,
			'jotform.forms.createSubmissions',
			{ formId: parsedInput.id, count: parsedInput.submissions.length },
			'completed',
		);
		return parsed;
	};
