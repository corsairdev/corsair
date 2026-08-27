import { z } from 'zod';

export const CreateEnvelopeInputSchema = z.object({
	templateId: z.string().optional(),
	emailSubject: z.string(),
	status: z.enum(['sent', 'created']).default('sent'),
	templateRoles: z
		.array(
			z.object({
				email: z.string(),
				name: z.string(),
				roleName: z.string(),
			}),
		)
		.optional(),
	documents: z
		.array(
			z.object({
				documentId: z.string(),
				name: z.string(),
				fileExtension: z.string().optional(),
				documentBase64: z.string().optional(),
			}),
		)
		.optional(),
	recipients: z
		.object({
			signers: z
				.array(
					z.object({
						email: z.string(),
						name: z.string(),
						recipientId: z.string(),
						routingOrder: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

export const GetEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const SendEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const CreateRecipientViewUrlInputSchema = z.object({
	envelopeId: z.string(),
	userName: z.string(),
	email: z.string(),
	returnUrl: z.string(),
	authenticationMethod: z.string().optional().default('none'),
	recipientId: z.string().optional().default('1'),
	clientUserId: z.string().optional(),
});

export const ListTemplatesInputSchema = z
	.object({
		count: z.number().optional(),
		startPosition: z.number().optional(),
	})
	.optional();

export const GetTemplateInputSchema = z.object({
	templateId: z.string(),
});

export const CreateEnvelopeOutputSchema = z
	.object({
		envelopeId: z.string(),
		status: z.string(),
		statusDateTime: z.string().optional(),
		uri: z.string().optional(),
	})
	.passthrough();

export const GetEnvelopeOutputSchema = z
	.object({
		envelopeId: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const SendEnvelopeOutputSchema = z
	.object({
		envelopeId: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const CreateRecipientViewUrlOutputSchema = z
	.object({
		url: z.string().optional(),
	})
	.passthrough();

export const ListTemplatesOutputSchema = z
	.object({
		envelopeTemplates: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GetTemplateOutputSchema = z
	.object({
		templateId: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const EndpointInputSchemas = {
	createEnvelope: CreateEnvelopeInputSchema,
	getEnvelope: GetEnvelopeInputSchema,
	sendEnvelope: SendEnvelopeInputSchema,
	createRecipientViewUrl: CreateRecipientViewUrlInputSchema,
	listTemplates: ListTemplatesInputSchema,
	getTemplate: GetTemplateInputSchema,
};

export const EndpointOutputSchemas = {
	createEnvelope: CreateEnvelopeOutputSchema,
	getEnvelope: GetEnvelopeOutputSchema,
	sendEnvelope: SendEnvelopeOutputSchema,
	createRecipientViewUrl: CreateRecipientViewUrlOutputSchema,
	listTemplates: ListTemplatesOutputSchema,
	getTemplate: GetTemplateOutputSchema,
};

export const docusignEndpointInputSchemas = EndpointInputSchemas;
export const docusignEndpointOutputSchemas = EndpointOutputSchemas;
export const DocusignEndpointInputSchemas = EndpointInputSchemas;
export const DocusignEndpointOutputSchemas = EndpointOutputSchemas;

export type CreateEnvelopeParams = z.infer<typeof CreateEnvelopeInputSchema>;
export type GetEnvelopeParams = z.infer<typeof GetEnvelopeInputSchema>;
export type SendEnvelopeParams = z.infer<typeof SendEnvelopeInputSchema>;
export type CreateRecipientViewUrlParams = z.infer<
	typeof CreateRecipientViewUrlInputSchema
>;
export type ListTemplatesParams = NonNullable<
	z.infer<typeof ListTemplatesInputSchema>
>;
export type GetTemplateParams = z.infer<typeof GetTemplateInputSchema>;

export type DocusignEndpointInputs = {
	createEnvelope: z.infer<typeof CreateEnvelopeInputSchema>;
	getEnvelope: z.infer<typeof GetEnvelopeInputSchema>;
	sendEnvelope: z.infer<typeof SendEnvelopeInputSchema>;
	createRecipientViewUrl: z.infer<typeof CreateRecipientViewUrlInputSchema>;
	listTemplates: z.infer<typeof ListTemplatesInputSchema>;
	getTemplate: z.infer<typeof GetTemplateInputSchema>;
};

export type DocusignEndpointOutputs = {
	createEnvelope: z.infer<typeof CreateEnvelopeOutputSchema>;
	getEnvelope: z.infer<typeof GetEnvelopeOutputSchema>;
	sendEnvelope: z.infer<typeof SendEnvelopeOutputSchema>;
	createRecipientViewUrl: z.infer<typeof CreateRecipientViewUrlOutputSchema>;
	listTemplates: z.infer<typeof ListTemplatesOutputSchema>;
	getTemplate: z.infer<typeof GetTemplateOutputSchema>;
};

export type EndpointInputs = DocusignEndpointInputs;
export type EndpointOutputs = DocusignEndpointOutputs;
