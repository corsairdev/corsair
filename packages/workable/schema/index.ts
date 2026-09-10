import {
	WorkableCandidate,
	WorkableDepartment,
	WorkableEmployee,
	WorkableJob,
	WorkableMember,
} from './database';

export const WorkableSchema = {
	version: '1.0.0',
	entities: {
		departments: WorkableDepartment,
		employees: WorkableEmployee,
		members: WorkableMember,
		jobs: WorkableJob,
		candidates: WorkableCandidate,
	},
} as const;

export {
	WorkableCandidate,
	WorkableDepartment,
	WorkableEmployee,
	WorkableJob,
	WorkableMember,
} from './database';
