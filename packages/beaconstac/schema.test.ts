import { BeaconstacSchema } from './schema';
import { BeaconstacQrCode } from './schema/database';

describe('Beaconstac schema', () => {
	it('declares a semver version', () => {
		expect(BeaconstacSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Uniqode entities', () => {
		expect(Object.keys(BeaconstacSchema.entities).sort()).toEqual([
			'bulkQrcodes',
			'organizations',
			'places',
			'qrTemplates',
			'qrcodes',
			'tags',
			'users',
		]);
	});

	it('treats QR Code password as a boolean', () => {
		expect(BeaconstacQrCode.parse({ password: true }).password).toBe(true);
		expect(() => BeaconstacQrCode.parse({ password: 'secret' })).toThrow();
	});
});
