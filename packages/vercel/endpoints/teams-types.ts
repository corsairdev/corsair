import { z } from 'zod';
import {
	optBool,
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
} from './common';

const teamInPath = z
	.string()
	.min(1)
	.optional()
	.describe('Team id (team_…) or team slug. Defaults to the connected team.');

const teamRole = z.enum([
	'OWNER',
	'MEMBER',
	'DEVELOPER',
	'SECURITY',
	'BILLING',
	'VIEWER',
	'VIEWER_FOR_PLUS',
	'CONTRIBUTOR',
]);

// Responses: documented core fields, tolerant of nulls and absence. A
// `limited` team (the token can't see all of it) carries fewer fields.
export const TeamSchema = z
	.object({
		id: z.string(),
		slug: optStr(),
		name: optStr(),
		avatar: optStr(),
		description: optStr(),
		creatorId: optStr(),
		createdAt: optNum(),
		updatedAt: optNum(),
		limited: optBool(),
		stagingPrefix: optStr(),
		// Nested Vercel objects passed through as is: their fields change often.
		billing: z.record(z.string(), z.unknown()).nullable().optional(),
		membership: z
			.object({
				uid: optStr(),
				role: optStr(),
				confirmed: optBool(),
				createdAt: optNum(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

export const TeamMemberSchema = z
	.object({
		uid: z.string(),
		username: optStr(),
		name: optStr(),
		email: optStr(),
		avatar: optStr(),
		role: optStr(),
		confirmed: optBool(),
		membershipSource: optStr(),
		createdAt: optNum(),
		accessRequestedAt: optNum(),
		// Nested Vercel objects passed through as is: their fields change often.
		projects: z.array(z.unknown()).nullable().optional(),
	})
	.passthrough();

export const VercelTeamsInputSchemas = {
	getTeams: z.object({
		...paginationInput,
	}),
	getTeam: z.object({
		teamId: teamInPath,
	}),
	getTeamMembers: z.object({
		teamId: teamInPath,
		...paginationInput,
		search: z
			.string()
			.optional()
			.describe('Search members by name, username or email.'),
		role: teamRole.optional().describe('Only members with this team role.'),
		excludeProject: z
			.string()
			.optional()
			.describe('Leave out members of this project (id or name).'),
		eligibleMembersForProjectId: z
			.string()
			.optional()
			.describe('Only members who can be added to this project.'),
	}),
} as const;

export const VercelTeamsOutputSchemas = {
	getTeams: z
		.object({
			teams: z.array(TeamSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getTeam: TeamSchema,
	getTeamMembers: z
		.object({
			members: z.array(TeamMemberSchema),
			// Nested Vercel objects passed through as is: their fields change often.
			emailInviteCodes: z.array(z.unknown()).nullable().optional(),
			pagination: PaginationSchema.nullable().optional(),
			totalCount: optNum(),
		})
		.passthrough(),
} as const;

export type VercelTeamsInputs = {
	[K in keyof typeof VercelTeamsInputSchemas]: z.input<
		(typeof VercelTeamsInputSchemas)[K]
	>;
};
export type VercelTeamsOutputs = {
	[K in keyof typeof VercelTeamsOutputSchemas]: z.infer<
		(typeof VercelTeamsOutputSchemas)[K]
	>;
};
