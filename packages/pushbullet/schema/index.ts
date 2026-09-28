import { PushbulletDevice, PushbulletPush } from './database';

export const PushbulletSchema = {
	version: '1.0.0',
	entities: {
		pushes: PushbulletPush,
		devices: PushbulletDevice,
	},
} as const;

export * from './database';
