import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
} from './database';

export const BugsnagSchema = {
	version: '1.0.0',
	entities: {
		organizations: BugsnagOrganizationEntity,
		projects: BugsnagProjectEntity,
		collaborators: BugsnagCollaboratorEntity,
	},
} as const;

export * from './database';
