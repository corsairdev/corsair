import { WaboxappSchema } from './schema';
import { WaboxappAccount, WaboxappMessage } from './schema/database';

describe('Waboxapp schema', () => {
	it('declares a semver version', () => {
		expect(WaboxappSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares labeled entities from the REST API', () => {
		expect(Object.keys(WaboxappSchema.entities)).toEqual([
			'accounts',
			'messages',
		]);
		expect(WaboxappSchema.entities.accounts).toBe(WaboxappAccount);
		expect(WaboxappSchema.entities.messages).toBe(WaboxappMessage);
	});
});
