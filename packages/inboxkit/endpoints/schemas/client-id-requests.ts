import { z } from 'zod';
import { bool, freeForm, num, str, WorkspaceId } from '../schema-helpers';

export const ClientIdRequestsInputSchemas = {
	clientIdRequestsInitiate: z
		.object({
			workspaceId: WorkspaceId,
			domain: z
				.string()
				.describe(
					'Domain name the client ID is authorized on. Must exist in your workspace and have an admin mailbox.',
				),
			client_id: z
				.string()
				.describe(
					'The app to authorize. On GOOGLE, the OAuth 2.0 client ID (numeric, or ending in .apps.googleusercontent.com). On MICROSOFT/AZURE, the Entra application id, which is a GUID.',
				),
			request_data: freeForm()
				.optional()
				.describe('Optional metadata or additional data for the request'),
			delegated: z
				.boolean()
				.optional()
				.describe(
					'GOOGLE only. When false (default) the client ID is marked as a trusted app in Google Admin; when true it is registered under domain-wide delegation with the scopes given.',
				),
			scopes: z
				.array(z.string())
				.optional()
				.describe(
					'Delegated OAuth scopes to grant - permissions that apply when a signed-in user acts through the app.',
				),
			platform: z
				.enum(['GOOGLE', 'MICROSOFT', 'AZURE'])
				.optional()
				.describe(
					"Which platform this client ID is for. Only needed when the domain has admin mailboxes on more than one platform - otherwise the platform is read from the domain's admin mailbox and a value that contradicts it is…",
				),
			app_roles: z
				.array(z.string())
				.optional()
				.describe(
					'MICROSOFT/AZURE only. Application permissions to grant, assigned as appRoleAssignments so the app can act as itself with a client-credentials (app-only) token.',
				),
		})
		.strict(),
	clientIdRequestsGetStatus: z
		.object({
			workspaceId: WorkspaceId,
			requestId: z
				.string()
				.min(1)
				.describe('Unique identifier of the client ID request'),
		})
		.strict(),
	clientIdRequestsList: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number for pagination (default: 1)'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Number of items per page (default: 10, max: 100)'),
			status: z
				.enum([
					'queued',
					'pending',
					'processing',
					'completed',
					'failed',
					'errored',
					'cancelled',
				])
				.optional()
				.describe('Filter by request status'),
			domain_name: z.string().optional().describe('Filter by domain name'),
		})
		.strict(),
} as const;

export const ClientIdRequestsOutputSchemas = {
	clientIdRequestsInitiate: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Success message'),
			data: z
				.object({
					uid: str.describe('Unique identifier for the client ID request'),
					status: str.describe('Current status of the request'),
					domain_name: str.describe('Domain name'),
					client_id: str.describe('Client ID that will be added'),
					created_at: str.describe('Timestamp when the request was created'),
					delegated: bool.describe(
						'Whether the request was registered as a domain-wide delegation',
					),
					scopes: z
						.array(str)
						.nullish()
						.describe(
							'OAuth scopes granted. Empty when delegated is false, or when the default set was applied.',
						),
					platform: str.describe(
						"Platform this request was resolved to, based on the domain's admin mailbox.",
					),
					app_roles: z
						.array(str)
						.nullish()
						.describe(
							'Application permissions recorded on the request (MICROSOFT/AZURE only). Empty when none were requested.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	clientIdRequestsGetStatus: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str.describe('Unique identifier for the request'),
					status: str.describe('Current status of the request'),
					domain_name: str.describe('Domain name'),
					client_id: str.describe('Client ID that was added'),
					created_at: str.describe('When the request was created'),
					updated_at: str.describe('When the request was last updated'),
					completed_at: str.describe(
						'When the request was completed (null if not completed)',
					),
					error_message: str.describe('Error message if the request failed'),
					delegated: bool.describe(
						'Whether the request was registered as a domain-wide delegation',
					),
					scopes: z
						.array(str)
						.nullish()
						.describe(
							'OAuth scopes granted. Empty when delegated is false, or when the default set was applied.',
						),
					platform: str.describe(
						"Platform this request was resolved to, based on the domain's admin mailbox.",
					),
					app_roles: z
						.array(str)
						.nullish()
						.describe(
							'Application permissions recorded on the request (MICROSOFT/AZURE only). Empty when none were requested.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	clientIdRequestsList: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							domain_name: str,
							client_id: str,
							created_at: str,
							updated_at: str,
							completed_at: str,
							error_message: str,
							delegated: bool,
							scopes: z.array(str).nullish(),
							platform: str,
							app_roles: z.array(str).nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('Array of client ID requests'),
			pagination: z
				.object({
					current_page: num,
					total_pages: num,
					total_items: num,
					limit: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;
