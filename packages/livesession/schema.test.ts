import { livesession } from './index';
import { LiveSessionSchema } from './schema';

describe('LiveSession schema', () => {
	it('declares a semver version', () => {
		expect(LiveSessionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map without persisting provider data locally', () => {
		expect(typeof LiveSessionSchema.entities).toBe('object');
		expect(Object.keys(LiveSessionSchema.entities)).toHaveLength(0);
	});
});

describe('LiveSession endpoint registry', () => {
	it('declares input and output schemas and metadata for every operation', () => {
		const plugin = livesession();
		const metaPaths = Object.keys(plugin.endpointMeta ?? {}).sort();
		const schemaPaths = Object.keys(plugin.endpointSchemas ?? {}).sort();

		expect(metaPaths).toHaveLength(10);
		expect(schemaPaths).toEqual(metaPaths);
		for (const path of metaPaths) {
			const schemas =
				plugin.endpointSchemas?.[path as keyof typeof plugin.endpointSchemas];
			expect(schemas?.input).toBeDefined();
			expect(schemas?.output).toBeDefined();
		}
	});

	it('uses the documented risk classification for write and destructive operations', () => {
		const meta = livesession().endpointMeta ?? {};

		expect(meta['sessions.list']?.riskLevel).toBe('read');
		expect(meta['alerts.create']?.riskLevel).toBe('write');
		expect(meta['alerts.delete']?.riskLevel).toBe('destructive');
		expect(meta['alerts.delete']?.irreversible).toBe(true);
		expect(meta['webhooks.delete']?.riskLevel).toBe('destructive');
		expect(meta['webhooks.delete']?.irreversible).toBe(true);
	});
});
