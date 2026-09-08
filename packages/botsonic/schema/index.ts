import { botsonicEntities } from './database';

export const BotsonicSchema = {
	version: '1.0.0',
	entities: botsonicEntities,
} as const;
