import { z } from 'zod';

export const BasinForm = z.object({
	id: z.union([z.string(), z.number()]),
	uuid: z.string().nullable().optional(),
	name: z.string().optional(),
	timezone: z.string().optional(),
	redirect_url: z.string().nullable().optional(),
	use_ajax: z.boolean().optional(),
	notification_emails: z.string().optional(),
	autoreply: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const BasinSubmission = z.object({
	id: z.union([z.string(), z.number()]),
	form_id: z.union([z.string(), z.number()]).optional(),
	email: z.string().nullable().optional(),
	spam: z.boolean().optional(),
	read: z.boolean().optional(),
	trash: z.boolean().optional(),
	payload_params: z.record(z.string(), z.unknown()).optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const BasinProject = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const BasinFormWebhook = z.object({
	id: z.union([z.string(), z.number()]),
	form_id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	url: z.string().optional(),
	format: z.string().optional(),
	trigger_when_spam: z.boolean().optional(),
	enabled: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const BasinDomain = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	domain: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const BasinFormView = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	form_id: z.union([z.string(), z.number()]).optional(),
	name: z.string().nullable().optional(),
	status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BasinForm = z.infer<typeof BasinForm>;
export type BasinSubmission = z.infer<typeof BasinSubmission>;
export type BasinProject = z.infer<typeof BasinProject>;
export type BasinFormWebhook = z.infer<typeof BasinFormWebhook>;
export type BasinDomain = z.infer<typeof BasinDomain>;
export type BasinFormView = z.infer<typeof BasinFormView>;
