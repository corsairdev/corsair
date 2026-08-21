import { z } from 'zod';

export const UnioneTemplate = z.object({
	id: z.string(),
	name: z.string().optional(),
	subject: z.string().optional(),
	from_email: z.string().optional(),
	editor_type: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneWebhook = z.object({
	id: z.union([z.string(), z.number()]),
	url: z.string(),
	status: z.string().optional(),
	events: z.unknown().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneSuppression = z.object({
	email: z.string(),
	cause: z.string().optional(),
	source: z.string().optional(),
	is_deletable: z.boolean().optional(),
	created: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneEventDump = z.object({
	dump_id: z.string(),
	dump_status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneDomain = z.object({
	domain: z.string(),
	verification_status: z.string().optional(),
	dkim_status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneTag = z.object({
	tag_id: z.number(),
	tag: z.string(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneAccount = z.object({
	user_id: z.union([z.string(), z.number()]),
	email: z.string().optional(),
	emails_included: z.number().optional(),
	emails_sent: z.number().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export type UnioneTemplate = z.infer<typeof UnioneTemplate>;
export type UnioneWebhook = z.infer<typeof UnioneWebhook>;
export type UnioneSuppression = z.infer<typeof UnioneSuppression>;
export type UnioneEventDump = z.infer<typeof UnioneEventDump>;
export type UnioneDomain = z.infer<typeof UnioneDomain>;
export type UnioneTag = z.infer<typeof UnioneTag>;
export type UnioneAccount = z.infer<typeof UnioneAccount>;
