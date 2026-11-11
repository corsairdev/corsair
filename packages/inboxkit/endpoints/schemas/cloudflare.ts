import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const CloudflareInputSchemas = {
	cloudflareConnect: z
		.object({
			workspaceId: WorkspaceId,
			auth_type: z
				.enum(['api_token', 'global_api_key'])
				.describe('Authentication method to use with Cloudflare'),
			api_token: z
				.string()
				.max(500)
				.optional()
				.describe(
					'Cloudflare API token. Required when `auth_type` is `api_token`. Must have Zone:Read and DNS:Edit permissions.',
				),
			email: z
				.string()
				.max(255)
				.optional()
				.describe(
					'Cloudflare account email. Required when `auth_type` is `global_api_key`.',
				),
			global_api_key: z
				.string()
				.max(500)
				.optional()
				.describe(
					'Cloudflare Global API Key. Required when `auth_type` is `global_api_key`.',
				),
			label: z
				.string()
				.max(100)
				.optional()
				.describe('Optional human-readable label for the credentials'),
			connect_all: z
				.boolean()
				.optional()
				.describe(
					'Connect all active zones accessible with the credentials. Mutually exclusive with `domains`. Default false.',
				),
			domains: z
				.array(z.string())
				.max(500)
				.optional()
				.describe(
					'Specific domain names to connect. Mutually exclusive with `connect_all`.',
				),
			validateDNS: z
				.boolean()
				.optional()
				.describe(
					"When `true`, each domain's existing DNS is checked before connecting. Default false.",
				),
		})
		.strict(),
	cloudflareList: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Page number for pagination'),
			limit: z.number().int().optional().describe('Number of results per page'),
			keyword: z
				.string()
				.optional()
				.describe(
					'Search keyword to filter domains by name (case-insensitive partial match)',
				),
		})
		.strict(),
	cloudflareGet: z
		.object({
			workspaceId: WorkspaceId,
			uid: z
				.string()
				.optional()
				.describe(
					'Unique domain identifier. Provide either `uid` or `domain`.',
				),
			domain: z
				.string()
				.optional()
				.describe(
					'Domain name (case-insensitive). Provide either `uid` or `domain`.',
				),
		})
		.strict(),
	cloudflareDisconnect: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.max(50)
				.optional()
				.describe('Domain UIDs to disconnect'),
			domains: z
				.array(z.string())
				.max(50)
				.optional()
				.describe('Domain names to disconnect (case-insensitive)'),
		})
		.strict(),
	cloudflareListZones: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Page number for pagination'),
			per_page: z
				.number()
				.int()
				.optional()
				.describe('Number of zones per page'),
			search: z.string().optional().describe('Search zones by name'),
		})
		.strict(),
} as const;

export const CloudflareOutputSchemas = {
	cloudflareConnect: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Summary of the operation result'),
			connected_count: num.describe(
				'Total number of successfully connected domains (including reconnected)',
			),
			reconnected_count: num.describe(
				'Number of previously disconnected domains that were reconnected',
			),
			failed_count: num.describe('Number of domains that failed to connect'),
			skipped_count: num.describe(
				'Number of domains that were skipped (already connected)',
			),
			total_zones: num.describe(
				'Total number of zones accessible with the provided credentials',
			),
			domains: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							status: str,
							reconnected: bool,
						})
						.loose(),
				)
				.nullish()
				.describe('List of successfully connected domains'),
			results: z
				.array(
					z
						.object({
							zone_name: str,
							success: bool,
							uid: str,
							error: str,
							reconnected: bool,
							dns_conflict: z
								.object({
									has_conflict: bool,
									labels: z.array(str).nullish(),
									records: z.array(obj).nullish(),
									message: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('Detailed per-zone results including failures'),
			skipped: z
				.array(
					z
						.object({
							name: str,
							reason: str,
							domain_uid: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Domains that were skipped because they are already connected',
				),
		})
		.loose(),
	cloudflareList: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Human-readable response message'),
			domains: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							status: str,
							connection_mode: str,
							credential_status: str,
							assigned_mailboxes: num,
							available_mailboxes: num,
							nameservers: z.array(str).nullish(),
							createdAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe('List of connected Cloudflare domains'),
			total: num.describe('Total number of matching domains across all pages'),
			pages: num.describe('Total number of pages'),
			current_page: num.describe('Current page number'),
			limit: num.describe('Number of results per page'),
		})
		.loose(),
	cloudflareGet: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Human-readable response message'),
			domain: z
				.object({
					uid: str.describe('Unique domain identifier'),
					name: str.describe('Domain name'),
					status: str.describe('Current domain status'),
					connection_mode: str.describe('How the domain is connected'),
					cf_zone_id: str.describe('Cloudflare Zone ID for this domain'),
					credential_status: str.describe(
						'Status of the associated Cloudflare credentials',
					),
					last_credential_validation: str.describe(
						'When the credentials were last validated against Cloudflare',
					),
					assigned_mailboxes: num.describe(
						'Number of mailboxes currently assigned to this domain',
					),
					available_mailboxes: num.describe(
						'Number of mailbox slots available on this domain',
					),
					nameservers: z
						.array(str)
						.nullish()
						.describe('Cloudflare nameservers assigned to this domain'),
					createdAt: str.describe('When the domain was first connected'),
				})
				.loose()
				.nullish()
				.describe('Detailed domain information'),
			credential: z
				.object({
					auth_type: str.describe('Authentication method used'),
					status: str.describe('Current credential status'),
					label: str.describe('User-defined label for these credentials'),
					last_validated: str.describe(
						'When the credentials were last validated',
					),
				})
				.loose()
				.nullish()
				.describe(
					'Non-sensitive metadata about the Cloudflare credentials used for this domain. Null if credentials not found.',
				),
		})
		.loose(),
	cloudflareDisconnect: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Summary of the operation result'),
			disconnected: z
				.array(
					z
						.object({
							uid: str,
							name: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Domains that were successfully disconnected'),
			failed: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							reason: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Domains that could not be disconnected'),
		})
		.loose(),
	cloudflareListZones: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Human-readable response message'),
			zones: z
				.array(
					z
						.object({
							zone_id: str,
							zone_name: str,
							status: str,
							name_servers: z.array(str).nullish(),
							already_connected: bool,
							reconnectable: bool,
							domain_uid: str,
						})
						.loose(),
				)
				.nullish()
				.describe('List of Cloudflare zones'),
			pagination: z
				.object({
					page: num.describe('Current page number'),
					per_page: num.describe('Number of results per page'),
					total_count: num.describe('Total number of zones across all pages'),
					total_pages: num.describe('Total number of pages'),
				})
				.loose()
				.nullish()
				.describe('Pagination metadata'),
		})
		.loose(),
} as const;
