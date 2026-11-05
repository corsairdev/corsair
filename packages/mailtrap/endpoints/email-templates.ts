import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheEmailTemplate, evictEntity } from './persist';
import { accountPath, compactBody, mailtrapCall } from './shared';
import type { MailtrapEmailTemplate } from './types';

/** Lists email templates. Confirmed live to return a bare array. */
export const list: MailtrapEndpoints['emailTemplatesList'] = async (ctx) => {
	const path = await accountPath(ctx, '/email_templates');
	const result = await mailtrapCall<MailtrapEmailTemplate[]>(ctx, path);

	await Promise.all(
		(result ?? []).map((template) =>
			cacheEmailTemplate(ctx.db?.emailTemplates, template),
		),
	);

	await logEventFromContext(
		ctx,
		'mailtrap.emailTemplates.list',
		{},
		'completed',
	);
	return result ?? [];
};

/**
 * Creates an email template.
 *
 * Wrapped under a top-level `email_template` key — confirmed live, unlike
 * `contactLists.create`/`contactFields.create`.
 */
export const create: MailtrapEndpoints['emailTemplatesCreate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/email_templates');
	const result = await mailtrapCall<MailtrapEmailTemplate>(ctx, path, {
		method: 'POST',
		body: {
			email_template: compactBody({
				name: input.name,
				subject: input.subject,
				category: input.category,
				body_html: input.body_html,
				body_text: input.body_text,
			}),
		},
	});

	await cacheEmailTemplate(ctx.db?.emailTemplates, result);

	await logEventFromContext(
		ctx,
		'mailtrap.emailTemplates.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Gets an email template by id. */
export const get: MailtrapEndpoints['emailTemplatesGet'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/email_templates/${input.template_id}`);
	const result = await mailtrapCall<MailtrapEmailTemplate>(ctx, path);

	await cacheEmailTemplate(ctx.db?.emailTemplates, result);

	await logEventFromContext(
		ctx,
		'mailtrap.emailTemplates.get',
		auditPayload(input, ['template_id']),
		'completed',
	);
	return result;
};

/** Updates an email template. Omitted fields are left unchanged. */
export const update: MailtrapEndpoints['emailTemplatesUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/email_templates/${input.template_id}`);
	const result = await mailtrapCall<MailtrapEmailTemplate>(ctx, path, {
		method: 'PATCH',
		body: {
			email_template: compactBody({
				name: input.name,
				subject: input.subject,
				category: input.category,
				body_html: input.body_html,
				body_text: input.body_text,
			}),
		},
	});

	await cacheEmailTemplate(ctx.db?.emailTemplates, result);

	await logEventFromContext(
		ctx,
		'mailtrap.emailTemplates.update',
		auditPayload(input, ['template_id']),
		'completed',
	);
	return result;
};

/** Permanently deletes an email template. [DESTRUCTIVE] */
export const remove: MailtrapEndpoints['emailTemplatesDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/email_templates/${input.template_id}`);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'mailtrap.emailTemplates.delete',
		auditPayload(input, ['template_id']),
		'completed',
	);

	await evictEntity(
		ctx.db?.emailTemplates,
		String(input.template_id),
		'email template',
	);

	return {};
};
