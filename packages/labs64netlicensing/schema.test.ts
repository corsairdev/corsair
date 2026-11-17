import { NetLicensingSchema } from './schema';
import {
	NetLicensingLicenseEntity,
	NetLicensingProductEntity,
} from './schema/database';

describe('NetLicensing schema', () => {
	it('declares a semver version and the documented entities', () => {
		expect(NetLicensingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(NetLicensingSchema.entities).sort()).toEqual([
			'licenses',
			'products',
		]);
	});

	it('accepts a license and rejects one with no number', () => {
		expect(
			NetLicensingLicenseEntity.parse({ number: 'L001', active: true }).number,
		).toBe('L001');
		expect(NetLicensingLicenseEntity.safeParse({ active: true }).success).toBe(
			false,
		);
	});

	it('accepts a product and rejects one with no number', () => {
		const parsed = NetLicensingProductEntity.parse({
			number: 'P001',
			name: 'Product Numero Uno',
			version: 'v1.0',
			active: true,
		});
		expect(parsed.version).toBe('v1.0');
		expect(NetLicensingProductEntity.safeParse({ name: 'x' }).success).toBe(
			false,
		);
	});
});
