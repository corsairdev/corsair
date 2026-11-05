import { BotbabaSchema } from './schema';

describe('BotbabaSchema', () => {
	it('declares a semver version', () => {
		expect(BotbabaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('persists Composio-documented entities', () => {
		expect(Object.keys(BotbabaSchema.entities).sort()).toEqual([
			'broadcasts',
			'contacts',
			'flows',
			'messages',
			'tags',
			'templates',
			'webhooks',
		]);
	});
});
