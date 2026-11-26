import { z } from 'zod';
import { op } from './call';
import { IdSchema, OrganizationIdSchema, okEnvelope } from './common';

// Organization-level calls need a service account with an organization
// admin or owner role; a project-only service account gets 403 "User does
// not have permissions" (live). listForProject works with a project one.

const ServiceAccountSchema = z
	.object({
		id: z.number().nullish(),
		username: z.string().nullish(),
		last_used: z.string().nullish(),
		expires: z.string().nullish(),
		creator: z.number().nullish(),
		creator_name: z.string().nullish(),
		created: z.string().nullish(),
		user: z.number().nullish(),
		role: z.string().nullish(),
	})
	.loose();

const Role = z.enum(['owner', 'admin', 'analyst', 'consumer']);

const org = (id: number) => `/organizations/${id}/service-accounts`;

export const list = op({
	name: 'serviceAccounts.list',
	input: z.object({ organization_id: OrganizationIdSchema }),
	output: okEnvelope(z.array(ServiceAccountSchema)),
	meta: {
		riskLevel: 'read',
		description: "List the organization's service accounts",
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'GET',
		path: org(input.organization_id),
	}),
});

export const listForProject = op({
	name: 'serviceAccounts.listForProject',
	input: z.object({}),
	output: okEnvelope(z.array(ServiceAccountSchema)),
	meta: {
		riskLevel: 'read',
		description:
			'List the service accounts that can reach this project, with their roles',
	},
	toRequest: (_input, c) => ({
		service: 'app',
		method: 'GET',
		path: `/projects/${c.projectId}/service-accounts`,
	}),
	// Each row can include the creator's email: drop it before it reaches the
	// agent or the event log.
	shape: (raw) => {
		const record = raw as { results?: unknown } | null;
		if (!record || !Array.isArray(record.results)) return raw;
		return {
			...record,
			results: record.results.map((row) => {
				if (!row || typeof row !== 'object') return row;
				const { creator_email: _email, ...rest } = row as Record<
					string,
					unknown
				>;
				return rest;
			}),
		};
	},
});

export const get = op({
	name: 'serviceAccounts.get',
	input: z.object({
		organization_id: OrganizationIdSchema,
		service_account_id: IdSchema,
	}),
	output: ServiceAccountSchema,
	meta: {
		riskLevel: 'read',
		description: 'Get one service account of the organization',
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'GET',
		path: `${org(input.organization_id)}/${input.service_account_id}`,
	}),
	// Accept `{ status, results }` as well as the bare account.
	shape: (raw) => {
		const results = (raw as { results?: unknown } | null)?.results;
		return results && typeof results === 'object' ? results : raw;
	},
});

export const create = op({
	name: 'serviceAccounts.create',
	input: z.object({
		organization_id: OrganizationIdSchema,
		username: z.string().min(1).describe('A name for the service account.'),
		role: Role.optional().describe(
			'Organization role; defaults to Mixpanel default.',
		),
		expires: z
			.string()
			.optional()
			.describe('ISO 8601 expiry; omit for no expiry.'),
		projects: z
			.array(z.object({ id: IdSchema, role: Role }))
			.optional()
			.describe('Projects to grant, each with a role.'),
	}),
	output: okEnvelope(
		ServiceAccountSchema.extend({
			token: z
				.string()
				.nullish()
				.describe('The new secret. Mixpanel shows it once; store it now.'),
		}),
	),
	meta: {
		riskLevel: 'destructive',
		description:
			'Create a service account and return its secret once; this mints a new credential with the given role',
	},
	toRequest: ({ organization_id, ...body }) => ({
		service: 'app',
		method: 'POST',
		path: org(organization_id),
		body,
		mediaType: 'application/json',
	}),
});

export const remove = op({
	name: 'serviceAccounts.delete',
	input: z.object({
		organization_id: OrganizationIdSchema,
		service_account_id: IdSchema,
	}),
	output: z.object({}).loose(),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a service account; anything using its secret stops working (including this connection, if it is this one)',
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'DELETE',
		path: `${org(input.organization_id)}/${input.service_account_id}`,
	}),
});

export const addToProjects = op({
	name: 'serviceAccounts.addToProjects',
	input: z.object({
		organization_id: OrganizationIdSchema,
		service_account_ids: z.array(IdSchema).min(1),
		projects: z.array(z.object({ id: IdSchema, role: Role })).min(1),
	}),
	output: z.object({ status: z.string().nullish() }).loose(),
	meta: {
		riskLevel: 'write',
		description: 'Grant service accounts access to projects with a role',
	},
	toRequest: ({ organization_id, ...body }) => ({
		service: 'app',
		method: 'POST',
		path: `${org(organization_id)}/add-to-project`,
		body,
		mediaType: 'application/json',
	}),
});

export const removeFromProjects = op({
	name: 'serviceAccounts.removeFromProjects',
	input: z.object({
		organization_id: OrganizationIdSchema,
		projects: z
			.array(
				z.object({
					id: IdSchema,
					service_account_ids: z.array(IdSchema).min(1),
				}),
			)
			.min(1),
	}),
	output: z.object({ status: z.string().nullish() }).loose(),
	meta: {
		riskLevel: 'destructive',
		description:
			'Remove service accounts from projects; they lose access at once',
	},
	toRequest: ({ organization_id, ...body }) => ({
		service: 'app',
		method: 'POST',
		path: `${org(organization_id)}/remove-from-project`,
		body,
		mediaType: 'application/json',
	}),
});
