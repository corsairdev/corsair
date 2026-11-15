import { fly } from './index';

describe('Fly plugin options', () => {
	it('uses the default auth type without claiming caller-supplied options', () => {
		expect(fly().options).toEqual({ authType: 'api_key' });
		expect(fly({ key: 'token' }).options).toEqual({
			authType: 'api_key',
			key: 'token',
		});
	});
});

// Supplying a generic with required fields must not allow omitting its argument.
if (false) {
	// @ts-expect-error The required key cannot be provided by the empty default.
	fly<{ key: string }>();
}

describe('Fly endpoint metadata', () => {
	const meta = fly().endpointMeta as Record<
		string,
		{ riskLevel: string; irreversible?: boolean; description?: string }
	>;
	it('marks operations that spend money or run arbitrary commands destructive', () => {
		for (const path of [
			'machines.create',
			'machines.update',
			'machines.exec',
			'volumes.create',
			'volumes.extend',
			'volumes.createSnapshot',
			'certificates.request',
			'ipAssignments.create',
			'secrets.set',
			'secrets.update',
		]) {
			expect(meta[path]?.riskLevel).toBe('destructive');
		}
	});
	it('flags deletes as irreversible so approvals say so', () => {
		const deletes = Object.keys(meta).filter((path) =>
			path.endsWith('.delete'),
		);
		expect(deletes).toHaveLength(6);
		for (const path of [...deletes, 'machines.deleteMetadataKey']) {
			expect(meta[path]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
		expect(meta['apps.list']?.irreversible).toBeUndefined();
	});
	it('keeps reads read and gives every operation a description', () => {
		for (const path of [
			'apps.list',
			'machines.wait',
			'machines.listProcesses',
			'tokens.current',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});
});
