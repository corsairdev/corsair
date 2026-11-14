import { CustomjsEndpointOutputSchemas } from './endpoints/types';
import { CustomjsSchema } from './schema';

describe('Customjs schema', () => {
	it('declares a semver version', () => {
		expect(CustomjsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Every CustomJS operation is a render or a request: PDFs, PNGs and text come
	// back in the response and nothing is stored between calls, so there is no
	// entity to sync. Asserted on the value itself, because Object.keys on a list
	// is always an array and can never fail.
	it('stores no entities, because nothing is kept between calls', () => {
		expect(Array.isArray(CustomjsSchema.entities)).toBe(false);
		expect(CustomjsSchema.entities).toEqual({});
	});

	// A read that returns a credential lets a read-only caller mint one, so the
	// key and the JWT are stripped rather than passed through. This is the one
	// output schema that is not `.loose()`, because `.loose()` would keep them.
	it('strips the key and JWT the auth answer carries', () => {
		const parsed = CustomjsEndpointOutputSchemas.authCheck.parse({
			workspaceId: 'ws_1',
			name: 'Default',
			apiKey: 'secret',
			apiKeyData: { id: 'x', value: 'secret' },
			jwt: { sub: 'user' },
		});

		expect(parsed).toEqual({ workspaceId: 'ws_1', name: 'Default' });
		expect(JSON.stringify(parsed)).not.toContain('secret');
	});
});
