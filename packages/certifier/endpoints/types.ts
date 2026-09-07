import { z } from 'zod';
import {
	CertifierAttribute,
	CertifierCredential,
	CertifierCredentialInteraction,
	CertifierDesign,
	CertifierEmailTemplate,
	CertifierGroup,
	certifierPage,
} from '../schema/database';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const PageInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().min(1).optional(),
});

const RecipientInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
});

const CreateIssueSendInputSchema = z.object({
	groupId: z.string().min(1),
	recipient: RecipientInputSchema,
	issueDate: isoDate.optional(),
	expiryDate: isoDate.optional(),
	customAttributes: z.record(z.string(), z.string()).optional(),
});

const CreateIssueSendResponseSchema = CertifierCredential;

const ListAttributesInputSchema = PageInputSchema;
const ListAttributesResponseSchema = certifierPage(CertifierAttribute);

const ListCredentialInteractionsInputSchema = PageInputSchema.extend({
	credentialId: z.string().min(1).optional(),
});
const ListCredentialInteractionsResponseSchema = certifierPage(
	CertifierCredentialInteraction,
);

const ListCredentialsInputSchema = PageInputSchema;
const ListCredentialsResponseSchema = certifierPage(CertifierCredential);

const ListDesignsInputSchema = PageInputSchema;
const ListDesignsResponseSchema = certifierPage(CertifierDesign);

const ListEmailTemplatesInputSchema = PageInputSchema;
const ListEmailTemplatesResponseSchema = certifierPage(CertifierEmailTemplate);

const ListGroupsInputSchema = PageInputSchema;
const ListGroupsResponseSchema = certifierPage(CertifierGroup);

const SearchCredentialsInputSchema = z.object({
	filter: z.record(z.string(), z.unknown()),
	sort: z
		.object({
			property: z.enum([
				'id',
				'createdAt',
				'updatedAt',
				'issueDate',
				'expiryDate',
			]),
			order: z.enum(['asc', 'desc']),
		})
		.optional(),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().min(1).optional(),
});
const SearchCredentialsResponseSchema = certifierPage(CertifierCredential);

const SendCredentialInputSchema = z.object({
	id: z.string().min(1),
	deliveryMethod: z.literal('email'),
});
const SendCredentialResponseSchema = CertifierCredential;

export type CreateIssueSendInput = z.infer<typeof CreateIssueSendInputSchema>;
export type CreateIssueSendResponse = z.infer<
	typeof CreateIssueSendResponseSchema
>;
export type ListAttributesInput = z.infer<typeof ListAttributesInputSchema>;
export type ListAttributesResponse = z.infer<
	typeof ListAttributesResponseSchema
>;
export type ListCredentialInteractionsInput = z.infer<
	typeof ListCredentialInteractionsInputSchema
>;
export type ListCredentialInteractionsResponse = z.infer<
	typeof ListCredentialInteractionsResponseSchema
>;
export type ListCredentialsInput = z.infer<typeof ListCredentialsInputSchema>;
export type ListCredentialsResponse = z.infer<
	typeof ListCredentialsResponseSchema
>;
export type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;
export type ListDesignsResponse = z.infer<typeof ListDesignsResponseSchema>;
export type ListEmailTemplatesInput = z.infer<
	typeof ListEmailTemplatesInputSchema
>;
export type ListEmailTemplatesResponse = z.infer<
	typeof ListEmailTemplatesResponseSchema
>;
export type ListGroupsInput = z.infer<typeof ListGroupsInputSchema>;
export type ListGroupsResponse = z.infer<typeof ListGroupsResponseSchema>;
export type SearchCredentialsInput = z.infer<
	typeof SearchCredentialsInputSchema
>;
export type SearchCredentialsResponse = z.infer<
	typeof SearchCredentialsResponseSchema
>;
export type SendCredentialInput = z.infer<typeof SendCredentialInputSchema>;
export type SendCredentialResponse = z.infer<
	typeof SendCredentialResponseSchema
>;

export type CertifierEndpointInputs = {
	createIssueSend: CreateIssueSendInput;
	listAttributes: ListAttributesInput;
	listCredentialInteractions: ListCredentialInteractionsInput;
	listCredentials: ListCredentialsInput;
	listDesigns: ListDesignsInput;
	listEmailTemplates: ListEmailTemplatesInput;
	listGroups: ListGroupsInput;
	searchCredentials: SearchCredentialsInput;
	sendCredential: SendCredentialInput;
};

export type CertifierEndpointOutputs = {
	createIssueSend: CreateIssueSendResponse;
	listAttributes: ListAttributesResponse;
	listCredentialInteractions: ListCredentialInteractionsResponse;
	listCredentials: ListCredentialsResponse;
	listDesigns: ListDesignsResponse;
	listEmailTemplates: ListEmailTemplatesResponse;
	listGroups: ListGroupsResponse;
	searchCredentials: SearchCredentialsResponse;
	sendCredential: SendCredentialResponse;
};

export const CertifierEndpointInputSchemas = {
	createIssueSend: CreateIssueSendInputSchema,
	listAttributes: ListAttributesInputSchema,
	listCredentialInteractions: ListCredentialInteractionsInputSchema,
	listCredentials: ListCredentialsInputSchema,
	listDesigns: ListDesignsInputSchema,
	listEmailTemplates: ListEmailTemplatesInputSchema,
	listGroups: ListGroupsInputSchema,
	searchCredentials: SearchCredentialsInputSchema,
	sendCredential: SendCredentialInputSchema,
} as const;

export const CertifierEndpointOutputSchemas = {
	createIssueSend: CreateIssueSendResponseSchema,
	listAttributes: ListAttributesResponseSchema,
	listCredentialInteractions: ListCredentialInteractionsResponseSchema,
	listCredentials: ListCredentialsResponseSchema,
	listDesigns: ListDesignsResponseSchema,
	listEmailTemplates: ListEmailTemplatesResponseSchema,
	listGroups: ListGroupsResponseSchema,
	searchCredentials: SearchCredentialsResponseSchema,
	sendCredential: SendCredentialResponseSchema,
} as const;
