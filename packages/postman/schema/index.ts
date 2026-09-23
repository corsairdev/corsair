import {
	PostmanCollection,
	PostmanEnvironment,
	PostmanMock,
	PostmanMonitor,
	PostmanWorkspace,
} from './database';

export * from './database';

export const PostmanSchema = {
	version: '1.0.0',
	entities: {
		collection: PostmanCollection,
		workspace: PostmanWorkspace,
		environment: PostmanEnvironment,
		monitor: PostmanMonitor,
		mock: PostmanMock,
	},
} as const;
