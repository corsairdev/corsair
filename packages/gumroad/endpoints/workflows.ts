import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['workflowsList'] = (ctx, input) =>
	call(ctx, 'workflowsList', 'workflows.list', '/workflows', input);

export const get: GumroadEndpoints['workflowsGet'] = (ctx, input) =>
	call(
		ctx,
		'workflowsGet',
		'workflows.get',
		`/workflows/${encodeURIComponent(input.id)}`,
		input,
	);

export const emailsAdd: GumroadEndpoints['workflowsEmailsAdd'] = (ctx, input) =>
	call(
		ctx,
		'workflowsEmailsAdd',
		'workflows.emailsAdd',
		`/workflows/${encodeURIComponent(input.workflow_id)}/emails`,
		input,
		{
			method: 'POST',
			toForm: (parsed) =>
				formEntries({
					subject: parsed.subject,
					body: parsed.body,
					delay_amount: parsed.delay_amount,
					delay_unit: parsed.delay_unit,
				}),
		},
	);

export const emailsUpdate: GumroadEndpoints['workflowsEmailsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workflowsEmailsUpdate',
		'workflows.emailsUpdate',
		`/workflows/${encodeURIComponent(input.workflow_id)}/emails/${encodeURIComponent(input.email_id)}`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) =>
				formEntries({
					subject: parsed.subject,
					body: parsed.body,
					delay_amount: parsed.delay_amount,
					delay_unit: parsed.delay_unit,
				}),
		},
	);
