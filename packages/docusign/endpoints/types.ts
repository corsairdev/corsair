import { z } from 'zod';
import type { DocusignAuthOptions, DocusignClient } from '../client';
import {
	generatedEndpointSchemas,
	generatedInputSchemas,
	generatedOutputSchemas,
} from './generated';

export type DocusignExecutionContext =
	| DocusignClient
	| { client: DocusignClient }
	| DocusignAuthOptions
	| { options: DocusignAuthOptions };

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
	authenticationMethod: z.string().optional(),
	recipientId: z.string(),
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

export const ListOAuthUserInfoInputSchema = z
	.object({
		authServer: z.string().optional(),
	})
	.optional();

export const ListOAuthUserInfoOutputSchema = z.object({}).passthrough();

export type ListOAuthUserInfoParams = z.infer<
	typeof ListOAuthUserInfoInputSchema
>;

export const FetchRecipientNamesForEmailInputSchema = z.object({
	envelopeId: z.string(),
	email: z.string(),
});

export const FetchRecipientNamesForEmailOutputSchema = z
	.object({
		email: z.string(),
		names: z.array(z.string()),
		count: z.number(),
	})
	.passthrough();

export type FetchRecipientNamesForEmailParams = z.infer<
	typeof FetchRecipientNamesForEmailInputSchema
>;

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
	listOAuthUserInfo: ListOAuthUserInfoInputSchema,
	fetchRecipientNamesForEmail: FetchRecipientNamesForEmailInputSchema,
	...generatedInputSchemas,
};

export const EndpointOutputSchemas = {
	createEnvelope: CreateEnvelopeOutputSchema,
	getEnvelope: GetEnvelopeOutputSchema,
	sendEnvelope: SendEnvelopeOutputSchema,
	createRecipientViewUrl: CreateRecipientViewUrlOutputSchema,
	listTemplates: ListTemplatesOutputSchema,
	getTemplate: GetTemplateOutputSchema,
	listOAuthUserInfo: ListOAuthUserInfoOutputSchema,
	fetchRecipientNamesForEmail: FetchRecipientNamesForEmailOutputSchema,
	...generatedOutputSchemas,
};

export const docusignEndpointSchemas = {
	createEnvelope: {
		input: CreateEnvelopeInputSchema,
		output: CreateEnvelopeOutputSchema,
	},
	getEnvelope: {
		input: GetEnvelopeInputSchema,
		output: GetEnvelopeOutputSchema,
	},
	sendEnvelope: {
		input: SendEnvelopeInputSchema,
		output: SendEnvelopeOutputSchema,
	},
	createRecipientViewUrl: {
		input: CreateRecipientViewUrlInputSchema,
		output: CreateRecipientViewUrlOutputSchema,
	},
	listTemplates: {
		input: ListTemplatesInputSchema,
		output: ListTemplatesOutputSchema,
	},
	getTemplate: {
		input: GetTemplateInputSchema,
		output: GetTemplateOutputSchema,
	},
	listOAuthUserInfo: {
		input: ListOAuthUserInfoInputSchema,
		output: ListOAuthUserInfoOutputSchema,
	},
	fetchRecipientNamesForEmail: {
		input: FetchRecipientNamesForEmailInputSchema,
		output: FetchRecipientNamesForEmailOutputSchema,
	},
	...generatedEndpointSchemas,
};

export const endpointSchemas = docusignEndpointSchemas;
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
	listOAuthUserInfo: z.infer<typeof ListOAuthUserInfoInputSchema>;
	fetchRecipientNamesForEmail: z.infer<
		typeof FetchRecipientNamesForEmailInputSchema
	>;
} & Record<string, unknown>;

export type DocusignEndpointOutputs = {
	createEnvelope: z.infer<typeof CreateEnvelopeOutputSchema>;
	getEnvelope: z.infer<typeof GetEnvelopeOutputSchema>;
	sendEnvelope: z.infer<typeof SendEnvelopeOutputSchema>;
	createRecipientViewUrl: z.infer<typeof CreateRecipientViewUrlOutputSchema>;
	listTemplates: z.infer<typeof ListTemplatesOutputSchema>;
	getTemplate: z.infer<typeof GetTemplateOutputSchema>;
	listOAuthUserInfo: z.infer<typeof ListOAuthUserInfoOutputSchema>;
	fetchRecipientNamesForEmail: z.infer<
		typeof FetchRecipientNamesForEmailOutputSchema
	>;
} & Record<string, unknown>;

export type EndpointInputs = DocusignEndpointInputs;
export type EndpointOutputs = DocusignEndpointOutputs;
