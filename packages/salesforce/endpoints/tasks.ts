import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const createTask: SalesforceEndpoints['createTask'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		id: string;
		success?: boolean;
	}>('sobjects/Task', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(ctx, 'salesforce.task.create', input, 'completed');
	return response;
};

export const completeTask: SalesforceEndpoints['completeTask'] = async (
	ctx,
	input,
) => {
	const body: Record<string, unknown> = { Status: 'Completed' };
	if (input.completionNotes) {
		body.Description = input.completionNotes;
	}

	await makeSalesforceRequest<void>(`sobjects/Task/${input.taskId}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'salesforce.task.complete',
		input,
		'completed',
	);
	return { success: true };
};

export const logCall: SalesforceEndpoints['logCall'] = async (ctx, input) => {
	const body = {
		Subject: input.Subject,
		Status: 'Completed',
		TaskSubtype: 'Call',
		CallDurationInSeconds: input.CallDurationInSeconds,
		CallType: input.CallType,
		CallDisposition: input.CallDisposition,
		Description: input.Description,
		WhoId: input.WhoId,
		WhatId: input.WhatId,
	};

	const response = await makeSalesforceRequest<{ id: string }>(
		'sobjects/Task',
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'salesforce.task.log_call',
		input,
		'completed',
	);
	return response;
};

export const logEmailActivity: SalesforceEndpoints['logEmailActivity'] = async (
	ctx,
	input,
) => {
	const body = {
		Subject: input.Subject,
		TextBody: input.TextBody,
		HtmlBody: input.HtmlBody,
		FromAddress: input.FromAddress,
		ToAddress: input.ToAddress,
		RelatedToId: input.RelatedToId,
	};

	const response = await makeSalesforceRequest<{ id: string }>(
		'sobjects/EmailMessage',
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'salesforce.task.log_email',
		input,
		'completed',
	);
	return response;
};
