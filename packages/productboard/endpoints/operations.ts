import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { ProductboardContext } from '..';
import { makeProductboardRequest } from '../client';
import type {
	ProductboardJsonObject,
	ProductboardOperationInput,
	ProductboardOutput,
	ProductboardRequestBody,
} from './types';
import {
	ProductboardConnectionSearchBodySchema,
	ProductboardJsonObjectSchema,
	ProductboardListOutputSchema,
	ProductboardNoContentOutputSchema,
	ProductboardNoteCreateBodySchema,
	ProductboardRequestBodySchema,
	ProductboardResourceOutputSchema,
	ProductboardTeamSearchBodySchema,
	ProductboardTeamsListOutputSchema,
	ProductboardWebhookCreateBodySchema,
	ProductboardWebhookCreateOutputSchema,
	ProductboardWebhookDeleteOutputSchema,
	ProductboardWebhookGetOutputSchema,
	ProductboardWebhookListOutputSchema,
} from './types';

type PathField =
	| 'id'
	| 'type'
	| 'targetId'
	| 'targetType'
	| 'fieldId'
	| 'valueId'
	| 'integrationId'
	| 'entityId'
	| 'webhookId';

export type ProductboardOperation = {
	name: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	doc: string;
	pathFields?: PathField[];
	query?: boolean;
	body?: boolean;
	bodyDataFields?: readonly string[];
	bodySchema?: z.ZodType<NonNullable<ProductboardOperationInput['body']>>;
	outputSchema?: z.ZodType<ProductboardOutput>;
	outputKind?: 'list' | 'resource';
	noContent?: true;
	riskLevel: 'read' | 'write' | 'destructive';
	description: string;
};

type ProductboardOperationBodyInput<Operation extends ProductboardOperation> =
	NonNullable<Operation['bodySchema']> extends z.ZodType
		? z.input<NonNullable<Operation['bodySchema']>>
		: ProductboardRequestBody;

type ProductboardRequiredPathInput<Operation extends ProductboardOperation> =
	Operation['pathFields'] extends readonly PathField[]
		? { [Field in Operation['pathFields'][number]]: string }
		: {};

export type ProductboardOperationCallerInput<
	Operation extends ProductboardOperation,
> =
	// Distribute over operation unions so each variant receives only its own
	// required path/body fields instead of merging every variant's inputs.
	Operation extends unknown
		? ProductboardRequiredPathInput<Operation> &
				(Operation['query'] extends true
					? { query?: ProductboardJsonObject }
					: {}) &
				(Operation['body'] extends true
					? { body: ProductboardOperationBodyInput<Operation> }
					: {})
		: never;

export function productboardOperationInputSchema(
	operation: ProductboardOperation,
): z.ZodType<ProductboardOperationInput> {
	let schema = z.object({}).strict();
	for (const field of operation.pathFields ?? []) {
		schema = schema.extend({ [field]: z.string().min(1) });
	}
	if (operation.query) {
		schema = schema.extend({ query: ProductboardJsonObjectSchema.optional() });
	}
	if (operation.body) {
		let bodySchema = operation.bodySchema ?? ProductboardRequestBodySchema;
		if (operation.bodyDataFields) {
			bodySchema = bodySchema.superRefine((body, context) => {
				if (!operation.bodyDataFields) return;
				if (!('data' in body)) return;
				for (const field of Object.keys(body.data)) {
					if (!operation.bodyDataFields.includes(field)) {
						context.addIssue({
							code: 'custom',
							path: ['data', field],
							message: 'Undocumented Productboard request field',
						});
					}
				}
			});
		}
		schema = schema.extend({ body: bodySchema });
	}
	return schema;
}

const READ_API = 'https://developer.productboard.com/reference/';

const operationDefinitions = {
	'notes.list': {
		name: 'notes.list',
		method: 'GET',
		path: '/notes',
		doc: `${READ_API}listnotes`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List notes using documented filters and cursor pagination.',
	},
	'notes.search': {
		name: 'notes.search',
		method: 'POST',
		path: '/notes/search',
		doc: `${READ_API}performnotessearch`,
		query: true,
		body: true,
		outputKind: 'list',
		bodyDataFields: ['search', 'filter', 'return'],
		riskLevel: 'read',
		description: 'Search notes with structured filters and relationships.',
	},
	'notes.create': {
		name: 'notes.create',
		method: 'POST',
		path: '/notes',
		doc: `${READ_API}createnote`,
		body: true,
		bodyDataFields: ['type', 'fields', 'metadata', 'relationships'],
		bodySchema: ProductboardNoteCreateBodySchema,
		outputKind: 'resource',
		riskLevel: 'write',
		description:
			'Create a text or conversation note, optionally with relationships.',
	},
	'notes.get': {
		name: 'notes.get',
		method: 'GET',
		path: '/notes/{id}',
		doc: `${READ_API}getnote`,
		pathFields: ['id'],
		query: true,
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get a note by UUID.',
	},
	'notes.update': {
		name: 'notes.update',
		method: 'PATCH',
		path: '/notes/{id}',
		doc: `${READ_API}updatenote`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields', 'patch'],
		riskLevel: 'write',
		description: 'Update note fields or apply documented patch operations.',
	},
	'notes.delete': {
		name: 'notes.delete',
		method: 'DELETE',
		path: '/notes/{id}',
		doc: `${READ_API}deletenote`,
		pathFields: ['id'],
		noContent: true,
		riskLevel: 'destructive',
		description: 'Permanently delete a note.',
	},
	'notes.configurations.list': {
		name: 'notes.configurations.list',
		method: 'GET',
		path: '/notes/configurations',
		doc: `${READ_API}listnoteconfigurations`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List note-type configuration metadata.',
	},
	'notes.configurations.get': {
		name: 'notes.configurations.get',
		method: 'GET',
		path: '/notes/configurations/{type}',
		doc: `${READ_API}getnoteconfiguration`,
		pathFields: ['type'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get configuration metadata for one note type.',
	},
	'notes.relationships.list': {
		name: 'notes.relationships.list',
		method: 'GET',
		path: '/notes/{id}/relationships',
		doc: `${READ_API}listnoterelationships`,
		pathFields: ['id'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List a note’s customer and product-link relationships.',
	},
	'notes.relationships.create': {
		name: 'notes.relationships.create',
		method: 'POST',
		path: '/notes/{id}/relationships',
		doc: `${READ_API}createnoterelationship`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['type', 'target'],
		riskLevel: 'write',
		description: 'Create a customer or product-link relationship for a note.',
	},
	'notes.relationships.setCustomer': {
		name: 'notes.relationships.setCustomer',
		method: 'PUT',
		path: '/notes/{id}/relationships/customer',
		doc: `${READ_API}replacenotecustomerrelationship`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['target'],
		riskLevel: 'write',
		description: 'Replace a note’s single customer relationship.',
	},
	'notes.relationships.delete': {
		name: 'notes.relationships.delete',
		method: 'DELETE',
		path: '/notes/{id}/relationships/{targetType}/{targetId}',
		doc: `${READ_API}delete-note-relationship`,
		pathFields: ['id', 'targetType', 'targetId'],
		noContent: true,
		riskLevel: 'write',
		description: 'Remove a note relationship.',
	},
	'entities.list': {
		name: 'entities.list',
		method: 'GET',
		path: '/entities',
		doc: `${READ_API}listentities`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List entities across configured workspace resource types.',
	},
	'entities.search': {
		name: 'entities.search',
		method: 'POST',
		path: '/entities/search',
		doc: `${READ_API}performentitiessearch`,
		query: true,
		body: true,
		outputKind: 'list',
		bodyDataFields: ['filter', 'return'],
		riskLevel: 'read',
		description: 'Search entities using structured filters.',
	},
	'entities.create': {
		name: 'entities.create',
		method: 'POST',
		path: '/entities',
		doc: `${READ_API}createentity`,
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['type', 'fields', 'metadata', 'relationships'],
		riskLevel: 'write',
		description: 'Create a workspace-configured Productboard entity.',
	},
	'entities.get': {
		name: 'entities.get',
		method: 'GET',
		path: '/entities/{id}',
		doc: `${READ_API}getentity`,
		pathFields: ['id'],
		query: true,
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get an entity by UUID.',
	},
	'entities.update': {
		name: 'entities.update',
		method: 'PATCH',
		path: '/entities/{id}',
		doc: `${READ_API}updateentity`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields', 'patch', 'metadata'],
		riskLevel: 'write',
		description: 'Update entity fields or patch operations.',
	},
	'entities.delete': {
		name: 'entities.delete',
		method: 'DELETE',
		path: '/entities/{id}',
		doc: `${READ_API}deleteentity`,
		pathFields: ['id'],
		noContent: true,
		riskLevel: 'destructive',
		description: 'Permanently delete an entity.',
	},
	'entities.configurations.list': {
		name: 'entities.configurations.list',
		method: 'GET',
		path: '/entities/configurations',
		doc: `${READ_API}listentityconfigurations`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List workspace-specific entity configurations.',
	},
	'entities.configurations.get': {
		name: 'entities.configurations.get',
		method: 'GET',
		path: '/entities/configurations/{type}',
		doc: `${READ_API}getentityconfiguration`,
		pathFields: ['type'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get configuration for an entity type.',
	},
	'entities.relationships.list': {
		name: 'entities.relationships.list',
		method: 'GET',
		path: '/entities/{id}/relationships',
		doc: `${READ_API}listentityrelationships`,
		pathFields: ['id'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List an entity’s parent, child, and linked relationships.',
	},
	'entities.relationships.create': {
		name: 'entities.relationships.create',
		method: 'POST',
		path: '/entities/{id}/relationships',
		doc: `${READ_API}createentityrelationship`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['type', 'target', 'fields'],
		riskLevel: 'write',
		description: 'Create a relationship between two entities.',
	},
	'entities.relationships.setParent': {
		name: 'entities.relationships.setParent',
		method: 'PUT',
		path: '/entities/{id}/relationships/parent',
		doc: `${READ_API}replaceentityrelationship`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['type', 'target'],
		riskLevel: 'write',
		description: 'Replace an entity’s parent relationship.',
	},
	'entities.relationships.delete': {
		name: 'entities.relationships.delete',
		method: 'DELETE',
		path: '/entities/{id}/relationships/{type}/{targetId}',
		doc: `${READ_API}deleteentityrelationship`,
		pathFields: ['id', 'type', 'targetId'],
		noContent: true,
		riskLevel: 'write',
		description: 'Delete an entity relationship.',
	},
	'entities.fieldValues.list': {
		name: 'entities.fieldValues.list',
		method: 'GET',
		path: '/entities/fields/{fieldId}/values',
		doc: `${READ_API}listentityfieldvalues`,
		pathFields: ['fieldId'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List paginated select, tag, or status field values.',
	},
	'entities.fieldValues.create': {
		name: 'entities.fieldValues.create',
		method: 'POST',
		path: '/entities/fields/{fieldId}/values',
		doc: `${READ_API}createentityfieldvalue`,
		pathFields: ['fieldId'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'write',
		description: 'Create a value for a select-type or tag field (not STATUS).',
	},
	'entities.fieldValues.update': {
		name: 'entities.fieldValues.update',
		method: 'PATCH',
		path: '/entities/fields/{fieldId}/values/{valueId}',
		doc: `${READ_API}updateentityfieldvalue`,
		pathFields: ['fieldId', 'valueId'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'write',
		description: 'Update a select-type or tag value (not STATUS).',
	},
	'entities.fieldValues.delete': {
		name: 'entities.fieldValues.delete',
		method: 'DELETE',
		path: '/entities/fields/{fieldId}/values/{valueId}',
		doc: `${READ_API}deleteentityfieldvalue`,
		pathFields: ['fieldId', 'valueId'],
		query: true,
		noContent: true,
		riskLevel: 'destructive',
		description: 'Delete a select-type or tag value (not STATUS).',
	},
	'entities.customerScore': {
		name: 'entities.customerScore',
		method: 'GET',
		path: '/entities/{id}/score',
		doc: `${READ_API}getcustomerscore`,
		pathFields: ['id'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Read the documented beta aggregated customer score.',
	},
	'analytics.memberActivities': {
		name: 'analytics.memberActivities',
		method: 'GET',
		path: '/analytics/member-activities',
		doc: `${READ_API}listmemberactivities`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description:
			'List member activities with date filters and cursor pagination.',
	},
	'members.list': {
		name: 'members.list',
		method: 'GET',
		path: '/members',
		doc: `${READ_API}listmembers`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List workspace members; PII may be redacted by Productboard.',
	},
	'members.search': {
		name: 'members.search',
		method: 'POST',
		path: '/members/search',
		doc: `${READ_API}performmemberssearch`,
		query: true,
		body: true,
		outputKind: 'list',
		bodyDataFields: ['filter', 'search', 'return'],
		riskLevel: 'read',
		description: 'Search or batch-lookup workspace members.',
	},
	'members.get': {
		name: 'members.get',
		method: 'GET',
		path: '/members/{id}',
		doc: `${READ_API}getmember`,
		pathFields: ['id'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get one workspace member.',
	},
	'teams.list': {
		name: 'teams.list',
		method: 'GET',
		path: '/teams',
		doc: `${READ_API}listteams`,
		query: true,
		outputSchema: ProductboardTeamsListOutputSchema,
		riskLevel: 'read',
		description: 'List teams with cursor pagination and filters.',
	},
	'teams.search': {
		name: 'teams.search',
		method: 'POST',
		path: '/teams/search',
		doc: `${READ_API}performteamssearch`,
		query: true,
		body: true,
		bodySchema: ProductboardTeamSearchBodySchema,
		bodyDataFields: ['filter', 'search'],
		outputSchema: ProductboardTeamsListOutputSchema,
		riskLevel: 'read',
		description: 'Search or batch-lookup teams.',
	},
	'teams.create': {
		name: 'teams.create',
		method: 'POST',
		path: '/teams',
		doc: `${READ_API}createteam`,
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'write',
		description: 'Create a team.',
	},
	'teams.get': {
		name: 'teams.get',
		method: 'GET',
		path: '/teams/{id}',
		doc: `${READ_API}getteam`,
		pathFields: ['id'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get one team.',
	},
	'teams.update': {
		name: 'teams.update',
		method: 'PATCH',
		path: '/teams/{id}',
		doc: `${READ_API}updateteam`,
		pathFields: ['id'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields', 'patch'],
		riskLevel: 'write',
		description: 'Update team fields or member assignments.',
	},
	'teams.delete': {
		name: 'teams.delete',
		method: 'DELETE',
		path: '/teams/{id}',
		doc: `${READ_API}deleteteam`,
		pathFields: ['id'],
		noContent: true,
		riskLevel: 'destructive',
		description: 'Permanently delete a team and its memberships.',
	},
	'teams.members': {
		name: 'teams.members',
		method: 'GET',
		path: '/teams/{id}/members',
		doc: `${READ_API}listteammembers`,
		pathFields: ['id'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List a team’s members with cursor pagination.',
	},
	'jiraIntegrations.list': {
		name: 'jiraIntegrations.list',
		method: 'GET',
		path: '/jira-integrations',
		doc: `${READ_API}listjiraintegrations`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List Jira integrations with cursor pagination.',
	},
	'jiraIntegrations.get': {
		name: 'jiraIntegrations.get',
		method: 'GET',
		path: '/jira-integrations/{id}',
		doc: `${READ_API}getjiraintegration`,
		pathFields: ['id'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get one Jira integration.',
	},
	'jiraIntegrations.connections': {
		name: 'jiraIntegrations.connections',
		method: 'GET',
		path: '/jira-integrations/{integrationId}/connections',
		doc: `${READ_API}listjiraintegrationconnections`,
		pathFields: ['integrationId'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List feature-to-Jira issue connections.',
	},
	'jiraIntegrations.connection': {
		name: 'jiraIntegrations.connection',
		method: 'GET',
		path: '/jira-integrations/{integrationId}/connections/{entityId}',
		doc: `${READ_API}getjiraintegrationconnection`,
		pathFields: ['integrationId', 'entityId'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get one feature-to-Jira issue connection.',
	},
	'pluginIntegrations.list': {
		name: 'pluginIntegrations.list',
		method: 'GET',
		path: '/plugin-integrations',
		doc: `${READ_API}listpluginintegrations`,
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List configured plugin integrations with cursor pagination.',
	},
	'pluginIntegrations.create': {
		name: 'pluginIntegrations.create',
		method: 'POST',
		path: '/plugin-integrations',
		doc: `${READ_API}createpluginintegration`,
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'write',
		description:
			'Create an integration; Productboard probes its configured action URL.',
	},
	'pluginIntegrations.get': {
		name: 'pluginIntegrations.get',
		method: 'GET',
		path: '/plugin-integrations/{integrationId}',
		doc: `${READ_API}getpluginintegration`,
		pathFields: ['integrationId'],
		outputKind: 'resource',
		riskLevel: 'read',
		description:
			'Get an integration; its action authorization secret is write-only.',
	},
	'pluginIntegrations.update': {
		name: 'pluginIntegrations.update',
		method: 'PATCH',
		path: '/plugin-integrations/{integrationId}',
		doc: `${READ_API}updatepluginintegration`,
		pathFields: ['integrationId'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'write',
		description:
			'Update integration fields; changing an enabled action URL triggers a probe.',
	},
	'pluginIntegrations.delete': {
		name: 'pluginIntegrations.delete',
		method: 'DELETE',
		path: '/plugin-integrations/{integrationId}',
		doc: `${READ_API}deletepluginintegration`,
		pathFields: ['integrationId'],
		noContent: true,
		riskLevel: 'destructive',
		description: 'Delete an integration and all associated connections.',
	},
	'pluginIntegrations.connections.list': {
		name: 'pluginIntegrations.connections.list',
		method: 'GET',
		path: '/plugin-integrations/{integrationId}/connections',
		doc: `${READ_API}listpluginintegrationconnections`,
		pathFields: ['integrationId'],
		query: true,
		outputKind: 'list',
		riskLevel: 'read',
		description: 'List non-initial connections with cursor pagination.',
	},
	'pluginIntegrations.connections.search': {
		name: 'pluginIntegrations.connections.search',
		method: 'POST',
		path: '/plugin-integrations/{integrationId}/connections/search',
		doc: `${READ_API}searchpluginintegrationconnections`,
		pathFields: ['integrationId'],
		query: true,
		body: true,
		bodySchema: ProductboardConnectionSearchBodySchema,
		outputKind: 'list',
		bodyDataFields: ['filter'],
		riskLevel: 'read',
		description: 'Search connections by documented state or entity-ID filters.',
	},
	'pluginIntegrations.connections.get': {
		name: 'pluginIntegrations.connections.get',
		method: 'GET',
		path: '/plugin-integrations/{integrationId}/connections/{entityId}',
		doc: `${READ_API}getpluginintegrationconnection`,
		pathFields: ['integrationId', 'entityId'],
		outputKind: 'resource',
		riskLevel: 'read',
		description: 'Get one connection; missing links return the initial state.',
	},
	'pluginIntegrations.connections.update': {
		name: 'pluginIntegrations.connections.update',
		method: 'PUT',
		path: '/plugin-integrations/{integrationId}/connections/{entityId}',
		doc: `${READ_API}updatepluginintegrationconnectionstate`,
		pathFields: ['integrationId', 'entityId'],
		body: true,
		outputKind: 'resource',
		bodyDataFields: ['fields'],
		riskLevel: 'destructive',
		description:
			'Create or replace a connection state via upsert; setting it to initial permanently resets the connection.',
	},
	'pluginIntegrations.connections.delete': {
		name: 'pluginIntegrations.connections.delete',
		method: 'DELETE',
		path: '/plugin-integrations/{integrationId}/connections/{entityId}',
		doc: `${READ_API}deletepluginintegrationconnection`,
		pathFields: ['integrationId', 'entityId'],
		noContent: true,
		riskLevel: 'destructive',
		description: 'Reset a connection to its initial state.',
	},
	'webhooks.list': {
		name: 'webhooks.list',
		method: 'GET',
		path: '/webhooks',
		doc: `${READ_API}listwebhooks`,
		query: true,
		outputSchema: ProductboardWebhookListOutputSchema,
		riskLevel: 'read',
		description: 'List webhook subscriptions with cursor pagination.',
	},
	'webhooks.create': {
		name: 'webhooks.create',
		method: 'POST',
		path: '/webhooks',
		doc: `${READ_API}createwebhook`,
		body: true,
		bodyDataFields: ['fields'],
		bodySchema: ProductboardWebhookCreateBodySchema,
		outputSchema: ProductboardWebhookCreateOutputSchema,
		riskLevel: 'write',
		description:
			'Create a webhook subscription at a public HTTPS notification URL.',
	},
	'webhooks.get': {
		name: 'webhooks.get',
		method: 'GET',
		path: '/webhooks/{webhookId}',
		doc: `${READ_API}getwebhook`,
		pathFields: ['webhookId'],
		outputSchema: ProductboardWebhookGetOutputSchema,
		riskLevel: 'read',
		description: 'Get a webhook subscription by UUID.',
	},
	'webhooks.delete': {
		name: 'webhooks.delete',
		method: 'DELETE',
		path: '/webhooks/{webhookId}',
		doc: `${READ_API}deletewebhook`,
		pathFields: ['webhookId'],
		noContent: true,
		outputSchema: ProductboardWebhookDeleteOutputSchema,
		riskLevel: 'destructive',
		description: 'Permanently delete a webhook subscription.',
	},
} satisfies Record<string, ProductboardOperation>;

export const ProductboardOperations = operationDefinitions;

export type ProductboardOperationName = keyof typeof ProductboardOperations;

export function productboardOperationOutputSchema(
	operation: ProductboardOperation,
): z.ZodType<ProductboardOutput> {
	if (operation.outputSchema) return operation.outputSchema;
	if (operation.noContent) return ProductboardNoContentOutputSchema;
	if (operation.outputKind === 'list') return ProductboardListOutputSchema;
	if (operation.outputKind === 'resource')
		return ProductboardResourceOutputSchema;
	throw new Error(
		`Missing Productboard response contract for ${operation.name}`,
	);
}

export function createProductboardEndpoint<
	const Operation extends ProductboardOperation,
>(
	operation: Operation,
): CorsairEndpoint<
	ProductboardContext,
	ProductboardOperationCallerInput<Operation>,
	ProductboardOutput
> {
	const inputSchema = productboardOperationInputSchema(operation);
	const endpoint: CorsairEndpoint<
		ProductboardContext,
		ProductboardOperationCallerInput<Operation>,
		ProductboardOutput
	> = async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		let path = operation.path;
		for (const field of operation.pathFields ?? []) {
			const pathValue = parsedInput[field];
			if (!pathValue) {
				throw new Error('Invalid Productboard path input');
			}
			path = path.replace(`{${field}}`, encodeURIComponent(pathValue));
		}
		const rawResponse = await makeProductboardRequest<
			ProductboardOutput | undefined
		>(path, ctx.key, {
			method: operation.method,
			query: operation.query ? parsedInput.query : undefined,
			body: operation.body ? parsedInput.body : undefined,
		});
		const response = productboardOperationOutputSchema(operation).parse(
			operation.noContent && rawResponse === undefined ? null : rawResponse,
		);
		await logEventFromContext(
			ctx,
			`productboard.${operation.name}`,
			{ operation: operation.name },
			'completed',
		);
		return response;
	};
	return endpoint;
}
