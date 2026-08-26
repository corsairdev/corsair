import { z } from 'zod';

export const EnvelopeSchema = z.object({
	envelopeId: z.string(),
	status: z.string(),
	emailSubject: z.string().optional(),
	createdDateTime: z.string().optional(),
	statusChangedDateTime: z.string().optional(),
});

export const TemplateSchema = z.object({
	templateId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
});

export const DocusignSchema = {
	envelope: EnvelopeSchema,
	template: TemplateSchema,
};

export const docusignSchema = DocusignSchema;

export default DocusignSchema;
