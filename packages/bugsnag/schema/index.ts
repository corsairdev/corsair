import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
	BugsnagTeamEntity,
} from './database';

/**
 * Four entities, all structural.
 *
 * What is absent is the deliberate part. Errors, events, trends, pivots, releases,
 * feature flags and event fields are all reachable through this plugin and none of
 * them is mirrored - see `schema/responses.ts` for why each one stays remote.
 */
export const BugsnagSchema = {
	version: '1.0.0',
	entities: {
		organizations: BugsnagOrganizationEntity,
		projects: BugsnagProjectEntity,
		collaborators: BugsnagCollaboratorEntity,
		teams: BugsnagTeamEntity,
	},
} as const;

export * from './database';
export * from './responses';
