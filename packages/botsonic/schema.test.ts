import { BotsonicSchema } from './schema';
import { botsonicEntities } from './schema/database';

describe('Botsonic schema', () => {
	it('declares a semver version', () => {
		expect(BotsonicSchema.version).toBeDefined();
		expect(BotsonicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(BotsonicSchema.entities).toBe(botsonicEntities);
		expect(BotsonicSchema.entities).toEqual({});
	});
});
