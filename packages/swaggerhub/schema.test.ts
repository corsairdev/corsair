import { SwaggerhubSchema } from './schema';

describe('swaggerhub schema', () => {
	it('declares a version and no entities', () => {
		// The plugin stores nothing: the specs live in the registry, and syncing
		// them would duplicate the account.
		expect(SwaggerhubSchema.version).toBe('1.0.0');
		expect(SwaggerhubSchema.entities).toEqual({});
	});
});
