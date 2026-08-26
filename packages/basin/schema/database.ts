import { z } from 'zod';

export const safeDate = z.preprocess((val) => {
	// `0` is a valid numeric timestamp (the Unix epoch) and must survive the
	// falsy guard below, which exists to drop null, undefined and ''.
	if (val === 0) return new Date(0);
	if (!val) return undefined;
	if (val instanceof Date) return !isNaN(val.getTime()) ? val : undefined;
	if (typeof val === 'string' || typeof val === 'number') {
		const d = new Date(val);
		return !isNaN(d.getTime()) ? d : undefined;
	}
	return undefined;
}, z.date().nullable().optional());

export const BasinForm = z
	.object({
		id: z.union([z.number(), z.string()]),
		uuid: z.string().nullable().optional(),
		name: z.string().optional(),
		project_id: z.number().optional(),
		project_name: z.string().optional(),
		timezone: z.string().optional(),
		redirect_url: z.string().nullable().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		autoreply: z.boolean().optional(),
		created_at: safeDate,
		updated_at: safeDate,
		inbox_count: z.number().optional(),
		spam_count: z.number().optional(),
		trash_count: z.number().optional(),
	})
	.passthrough();
export type BasinForm = z.infer<typeof BasinForm>;

export const BasinSubmission = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.number().optional(),
		email: z.string().nullable().optional(),
		spam: z.boolean().optional(),
		read: z.boolean().optional(),
		trash: z.boolean().optional(),
		spam_reason: z.string().nullable().optional(),
		webhook_sent_at: safeDate,
		ip: z.string().nullable().optional(),
		referrer: z.string().nullable().optional(),
		user_agent: z.string().nullable().optional(),
		payload_params: z.record(z.string(), z.unknown()).optional(),
		attachments: z.array(z.unknown()).nullable().optional(),
		created_at: safeDate,
		updated_at: safeDate,
	})
	.passthrough();
export type BasinSubmission = z.infer<typeof BasinSubmission>;

export const BasinProject = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string().optional(),
		created_at: safeDate,
		updated_at: safeDate,
	})
	.passthrough();
export type BasinProject = z.infer<typeof BasinProject>;

export const BasinFormWebhook = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.number().optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
		failure_count: z.number().optional(),
		last_failure_at: safeDate,
		created_at: safeDate,
		updated_at: safeDate,
	})
	.passthrough();
export type BasinFormWebhook = z.infer<typeof BasinFormWebhook>;

export const BasinFormView = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.number().optional(),
		name: z.string().nullable().optional(),
		status: z.string().optional(),
		embed_code: z.string().optional(),
		created_at: safeDate,
		updated_at: safeDate,
	})
	.passthrough();
export type BasinFormView = z.infer<typeof BasinFormView>;

export const BasinDomain = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
		created_at: safeDate,
		updated_at: safeDate,
	})
	.passthrough();
export type BasinDomain = z.infer<typeof BasinDomain>;
