import { bigpictureio } from './index';
import { BigpictureioSchema } from './schema';

describe('Bigpictureio schema and plugin', () => {
	it('declares a semver version', () => {
		expect(BigpictureioSchema.version).toBeDefined();
		expect(BigpictureioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(BigpictureioSchema.entities).toEqual({});
	});

	it('instantiates with an api key and company.find', () => {
		const plugin = bigpictureio({ key: 'test_api_key' });
		expect(plugin.id).toBe('bigpictureio');
		expect(typeof plugin.endpoints?.company.find).toBe('function');
		expect(typeof plugin.endpoints?.company.stream).toBe('function');
		expect(typeof plugin.endpoints?.ip.find).toBe('function');
		expect(plugin.webhooks).toEqual({});
	});
});
