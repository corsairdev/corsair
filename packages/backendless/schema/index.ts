import {
	BackendlessDataObject,
	BackendlessFile,
	BackendlessMessageStatus,
	BackendlessUser,
} from './database';

export const BackendlessSchema = {
	version: '1.0.0',
	entities: {
		users: BackendlessUser,
		files: BackendlessFile,
		dataObjects: BackendlessDataObject,
		messages: BackendlessMessageStatus,
	},
} as const;

export {
	BackendlessDataObject,
	BackendlessFile,
	BackendlessMessageStatus,
	BackendlessUser,
} from './database';
