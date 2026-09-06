import { BoltIotCommand, BoltIotDevice } from './database';

export const BoltIotSchema = {
	version: '1.0.0',
	entities: {
		devices: BoltIotDevice,
		commands: BoltIotCommand,
	},
} as const;

export { BoltIotCommand, BoltIotDevice } from './database';
