import { z } from 'zod';

export const EnvelopeSchema = z.object({
	envelopeId: z.string(),
	status: z.string(),
	statusDateTime: z.string().optional(),
	uri: z.string().optional(),
});

export const TemplateSchema = z.object({
	templateId: z.string(),
	name: z.string(),
	shared: z.string().optional(),
	created: z.string().optional(),
});
