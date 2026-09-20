import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
	BugsnagTeamEntity,
} from './database';

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
