import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { escapeSoql } from '../utils';
import { flattenFields, salesforceCall } from './shared';

export const createTask: SalesforceEndpoints['createTask'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/Task', { method: 'POST', body: flattenFields(input) });

	await logEventFromContext(ctx, 'salesforce.task.create', input, 'completed');
	return response;
};

export const completeTask: SalesforceEndpoints['completeTask'] = async (
	ctx,
	input,
) => {
	const body: Record<string, unknown> = { Status: 'Completed' };
	if (input.completionNotes) {
		const current = await salesforceCall<{ Description?: string | null }>(
			ctx,
			`sobjects/Task/${input.taskId}`,
			{ method: 'GET', query: { fields: 'Description' } },
		);
		const existing =
			typeof current.Description === 'string' ? current.Description : '';
		body.Description = existing
			? `${existing}\n${input.completionNotes}`
			: input.completionNotes;
	}

	await salesforceCall<void>(ctx, `sobjects/Task/${input.taskId}`, {
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

	const response = await salesforceCall<{ id: string }>(ctx, 'sobjects/Task', {
		method: 'POST',
		body,
	});

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

	const response = await salesforceCall<{ id: string }>(
		ctx,
		'sobjects/EmailMessage',
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

export const updateTask: SalesforceEndpoints['updateTask'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Task/${id}`, {
		method: 'PATCH',
		body,
	});
	await logEventFromContext(ctx, 'salesforce.task.update', { id }, 'completed');
	return { success: true };
};

export const searchTasks: SalesforceEndpoints['searchTasks'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.subject)
		terms.push(`Subject LIKE '%${escapeSoql(input.subject)}%'`);
	if (input.status) terms.push(`Status = '${escapeSoql(input.status)}'`);
	if (input.priority) terms.push(`Priority = '${escapeSoql(input.priority)}'`);
	if (input.whoId) terms.push(`WhoId = '${escapeSoql(input.whoId)}'`);
	if (input.whatId) terms.push(`WhatId = '${escapeSoql(input.whatId)}'`);
	const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const q = `SELECT Id, Subject, Status, Priority, WhoId, WhatId, ActivityDate FROM Task${whereStr} LIMIT ${input.limit ?? 50}`;
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });
	await logEventFromContext(ctx, 'salesforce.task.search', input, 'completed');
	return { records: response.records ?? [] };
};

export const sendEmail: SalesforceEndpoints['sendEmail'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<unknown>(
		ctx,
		'actions/standard/emailSimple',
		{
			method: 'POST',
			body: {
				inputs: [
					{
						emailAddresses: input.toAddresses?.join(','),
						emailSubject: input.subject,
						emailBody: input.body,
						senderType: input.senderType ?? 'CurrentUser',
					},
				],
			},
		},
	);
	await logEventFromContext(ctx, 'salesforce.email.send', input, 'completed');
	return { result: response };
};

export const sendEmailFromTemplate: SalesforceEndpoints['sendEmailFromTemplate'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			'actions/standard/emailSimple',
			{
				method: 'POST',
				body: {
					inputs: [
						{
							emailAddresses: input.toAddresses?.join(','),
							emailTemplateId: input.templateId,
							senderType: input.senderType ?? 'CurrentUser',
							targetObjectId: input.targetObjectId,
						},
					],
				},
			},
		);
		await logEventFromContext(
			ctx,
			'salesforce.email.send_from_template',
			input,
			'completed',
		);
		return { result: response };
	};

export const sendMassEmail: SalesforceEndpoints['sendMassEmail'] = async (
	ctx,
	input,
) => {
	const addresses = input.toAddresses ?? [];
	const item: Record<string, unknown> = {
		emailAddresses: addresses.join(','),
	};
	if (input.templateId) {
		item.emailTemplateId = input.templateId;
		const recipient = addresses.find((a) => /^[a-zA-Z0-9]{15,18}$/.test(a));
		if (recipient) item.recipientId = recipient;
	} else {
		item.emailSubject = input.subject;
		item.emailBody = input.body;
	}
	const response = await salesforceCall<unknown>(
		ctx,
		'actions/standard/emailSimple',
		{
			method: 'POST',
			body: {
				inputs: [item],
			},
		},
	);
	await logEventFromContext(
		ctx,
		'salesforce.email.send_mass',
		input,
		'completed',
	);
	return { result: response };
};
