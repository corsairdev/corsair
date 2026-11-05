import { z } from 'zod';

/**
 * Soft persistence shapes for Docker Hub entities (`ctx.db.*`).
 * Field names match Hub API v2 OpenAPI `components.schemas` plus live
 * list/get payloads. `.catchall` keeps future Hub fields.
 *
 * @see https://docs.docker.com/reference/api/hub/latest/
 * @see https://raw.githubusercontent.com/docker/docs/main/content/reference/api/hub/latest.yaml
 */

const DockerHubPermissions = z
	.object({
		read: z.boolean().optional(),
		write: z.boolean().optional(),
		admin: z.boolean().optional(),
	})
	.catchall(z.unknown());

const DockerHubCategory = z
	.object({
		name: z.string().optional(),
		slug: z.string().optional(),
	})
	.catchall(z.unknown());

const DockerHubImmutableTagsSettings = z
	.object({
		enabled: z.boolean().optional(),
		rules: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

/**
 * Hub `repository_info` / `repository_list_entry`
 * (`GET /v2/namespaces/{namespace}/repositories[/{repository}]`).
 */
export const DockerHubRepository = z
	.object({
		user: z.string().optional(),
		name: z.string(),
		namespace: z.string().optional(),
		repository_type: z.string().nullable().optional(),
		status: z.number().optional(),
		status_description: z.string().optional(),
		description: z.string().nullable().optional(),
		is_private: z.boolean().optional(),
		is_automated: z.boolean().optional(),
		star_count: z.number().optional(),
		pull_count: z.number().optional(),
		last_updated: z.string().nullable().optional(),
		last_modified: z.string().nullable().optional(),
		date_registered: z.string().optional(),
		collaborator_count: z.number().optional(),
		affiliation: z.string().nullable().optional(),
		hub_user: z.string().nullable().optional(),
		has_starred: z.boolean().optional(),
		full_description: z.string().nullable().optional(),
		permissions: DockerHubPermissions.optional(),
		media_types: z.array(z.string()).optional(),
		content_types: z.array(z.string()).optional(),
		categories: z.array(DockerHubCategory).optional(),
		immutable_tags_settings: DockerHubImmutableTagsSettings.optional(),
		storage_size: z.number().nullable().optional(),
		source: z.unknown().optional(),
	})
	.catchall(z.unknown());
export type DockerHubRepository = z.infer<typeof DockerHubRepository>;

/** Hub `image` (platform variant nested under a tag). */
export const DockerHubImage = z
	.object({
		architecture: z.string().optional(),
		features: z.string().optional(),
		variant: z.string().nullable().optional(),
		digest: z.string().nullable().optional(),
		os: z.string().optional(),
		os_features: z.string().optional(),
		os_version: z.string().nullable().optional(),
		size: z.number().optional(),
		status: z.string().optional(),
		last_pulled: z.string().nullable().optional(),
		last_pushed: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type DockerHubImage = z.infer<typeof DockerHubImage>;

/**
 * Hub `tag` plus live fields (`digest`, `media_type`, `content_type`, `tag_status`)
 * returned by `GET .../tags` today but incomplete in OpenAPI.
 */
export const DockerHubTag = z
	.object({
		id: z.number().optional(),
		name: z.string(),
		repository: z.number().optional(),
		creator: z.number().optional(),
		last_updater: z.number().optional(),
		last_updater_username: z.string().optional(),
		last_updated: z.string().nullable().optional(),
		full_size: z.number().optional(),
		v2: z.union([z.string(), z.boolean()]).optional(),
		digest: z.string().optional(),
		media_type: z.string().optional(),
		content_type: z.string().optional(),
		tag_status: z.string().optional(),
		tag_last_pulled: z.string().nullable().optional(),
		tag_last_pushed: z.string().nullable().optional(),
		images: z.array(DockerHubImage).optional(),
	})
	.catchall(z.unknown());
export type DockerHubTag = z.infer<typeof DockerHubTag>;

/** Hub `user` (org/profile base). */
export const DockerHubUser = z
	.object({
		id: z.string().optional(),
		username: z.string().optional(),
		company: z.string().optional(),
		date_joined: z.string().optional(),
		full_name: z.string().optional(),
		gravatar_email: z.string().optional(),
		gravatar_url: z.string().optional(),
		location: z.string().optional(),
		profile_url: z.string().optional(),
		type: z.enum(['User', 'Org']).optional(),
	})
	.catchall(z.unknown());
export type DockerHubUser = z.infer<typeof DockerHubUser>;

/**
 * Hub org row from `GET /v2/user/orgs/` (live Hub REST; not in public OpenAPI).
 * `orgname` is the follow-up key for org/group calls.
 */
export const DockerHubOrganization = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		orgname: z.string().optional(),
		username: z.string().optional(),
		company: z.string().optional(),
		location: z.string().optional(),
		full_name: z.string().optional(),
		profile_url: z.string().optional(),
		gravatar_email: z.string().optional(),
		gravatar_url: z.string().optional(),
		type: z.string().optional(),
		badge: z.string().optional(),
		date_joined: z.string().optional(),
	})
	.catchall(z.unknown());
export type DockerHubOrganization = z.infer<typeof DockerHubOrganization>;

/** Hub `org_member`. */
export const DockerHubOrgMember = z
	.object({
		id: z.string().optional(),
		username: z.string().optional(),
		company: z.string().optional(),
		date_joined: z.string().optional(),
		full_name: z.string().optional(),
		gravatar_email: z.string().optional(),
		gravatar_url: z.string().optional(),
		location: z.string().optional(),
		profile_url: z.string().optional(),
		type: z.enum(['User', 'Org']).optional(),
		email: z.string().optional(),
		role: z.string().optional(),
		groups: z.array(z.string()).optional(),
		is_guest: z.boolean().optional(),
		primary_email: z.string().optional(),
		last_logged_in_at: z.string().optional(),
		last_seen_at: z.string().optional(),
		last_desktop_version: z.string().optional(),
	})
	.catchall(z.unknown());
export type DockerHubOrgMember = z.infer<typeof DockerHubOrgMember>;

/** Hub `org_group` (team). */
export const DockerHubTeam = z
	.object({
		id: z.number().optional(),
		uuid: z.string().optional(),
		name: z.string(),
		description: z.string().optional(),
		member_count: z.number().optional(),
	})
	.catchall(z.unknown());
export type DockerHubTeam = z.infer<typeof DockerHubTeam>;

/** Hub `group_member`. */
export const DockerHubTeamMember = z
	.object({
		id: z.string().optional(),
		username: z.string().optional(),
		company: z.string().optional(),
		date_joined: z.string().optional(),
		full_name: z.string().optional(),
		gravatar_email: z.string().optional(),
		gravatar_url: z.string().optional(),
		location: z.string().optional(),
		profile_url: z.string().optional(),
		type: z.enum(['User', 'Org']).optional(),
		email: z.string().optional(),
	})
	.catchall(z.unknown());
export type DockerHubTeamMember = z.infer<typeof DockerHubTeamMember>;

/** Hub `orgAccessToken`. */
export const DockerHubOrgAccessToken = z
	.object({
		id: z.string(),
		label: z.string().optional(),
		created_by: z.string().optional(),
		is_active: z.boolean().optional(),
		created_at: z.string().optional(),
		expires_at: z.string().nullable().optional(),
		last_used_at: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type DockerHubOrgAccessToken = z.infer<typeof DockerHubOrgAccessToken>;

/** Hub `invite`. */
export const DockerHubInvite = z
	.object({
		id: z.string().optional(),
		inviter_username: z.string().optional(),
		invitee: z.string().optional(),
		org: z.string().optional(),
		team: z.string().optional(),
		created_at: z.string().optional(),
	})
	.catchall(z.unknown());
export type DockerHubInvite = z.infer<typeof DockerHubInvite>;
