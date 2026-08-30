import { AttioRecord, AttioWorkspaceMember } from './database';

export const AttioSchema = {
	version: '1.0.0',
	entities: {
		workspaceMembers: AttioWorkspaceMember,
		records: AttioRecord,
	},
} as const;
