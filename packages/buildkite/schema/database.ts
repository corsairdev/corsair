import { z } from 'zod';

/**
 * Access token used for the current request.
 * Official: GET /v2/access-token
 * https://buildkite.com/docs/apis/rest-api/access-token
 */
export const BuildkiteAccessToken = z
	.object({
		uuid: z.string(),
		scopes: z.array(z.string()),
		description: z.string().nullable().optional(),
		created_at: z.string().optional(),
		expires_at: z.string().nullable().optional(),
		user: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export type BuildkiteAccessToken = z.infer<typeof BuildkiteAccessToken>;

/**
 * Buildkite API metadata (webhook egress CIDRs).
 * Official: GET /v2/meta
 * https://buildkite.com/docs/apis/rest-api/meta
 */
export const BuildkiteMeta = z
	.object({
		webhook_ips: z.array(z.string()),
	})
	.loose();

export type BuildkiteMeta = z.infer<typeof BuildkiteMeta>;

/**
 * User account that owns the API token.
 * Official: GET /v2/user
 * https://buildkite.com/docs/apis/rest-api/user
 */
export const BuildkiteUser = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		name: z.string(),
		email: z.string(),
		avatar_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type BuildkiteUser = z.infer<typeof BuildkiteUser>;

/**
 * Organization accessible to the token.
 * Official: GET /v2/organizations
 * https://buildkite.com/docs/apis/rest-api/organizations
 */
export const BuildkiteOrganization = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		url: z.string().optional(),
		web_url: z.string().optional(),
		name: z.string(),
		slug: z.string(),
		pipelines_url: z.string().optional(),
		agents_url: z.string().optional(),
		emojis_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type BuildkiteOrganization = z.infer<typeof BuildkiteOrganization>;

/**
 * Connected or stopping agent for an organization.
 * Official: GET /v2/organizations/{org.slug}/agents
 * https://buildkite.com/docs/apis/rest-api/agents
 */
export const BuildkiteAgent = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		url: z.string().optional(),
		web_url: z.string().optional(),
		name: z.string(),
		connection_state: z.string(),
		hostname: z.string().optional(),
		ip_address: z.string().optional(),
		user_agent: z.string().optional(),
		version: z.string().optional(),
		os_id: z.string().optional(),
		arch: z.string().optional(),
		queue: z.string().optional(),
		creator: BuildkiteUser.nullable().optional(),
		created_at: z.string().optional(),
		connected_at: z.string().nullable().optional(),
		disconnected_at: z.string().nullable().optional(),
		lost_at: z.string().nullable().optional(),
		stopped_at: z.string().nullable().optional(),
		job: z.unknown().nullable().optional(),
		last_job_finished_at: z.string().nullable().optional(),
		priority: z.number().nullable().optional(),
		meta_data: z.array(z.string()).optional(),
	})
	.loose();

export type BuildkiteAgent = z.infer<typeof BuildkiteAgent>;
