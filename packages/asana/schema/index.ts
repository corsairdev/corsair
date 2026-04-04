import {
	AsanaProject,
	AsanaSection,
	AsanaStory,
	AsanaTag,
	AsanaTask,
	AsanaTeam,
	AsanaUser,
} from './database';

export const AsanaSchema = {
	version: '1.0.0',
	entities: {
		tasks: AsanaTask,
		projects: AsanaProject,
		sections: AsanaSection,
		users: AsanaUser,
		teams: AsanaTeam,
		tags: AsanaTag,
		stories: AsanaStory,
	},
} as const;
