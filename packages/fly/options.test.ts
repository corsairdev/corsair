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
		{ riskLevel: string; irreversible?: boolean }
	>;
	it('marks billed add-on changes and the password reset destructive', () => {
		expect(meta['addOns.create']?.riskLevel).toBe('destructive');
		expect(meta['addOns.update']?.riskLevel).toBe('destructive');
		expect(meta['addOns.resetPassword']?.riskLevel).toBe('destructive');
	});
	it('flags deletes as irreversible so approvals say so', () => {
		for (const path of [
			'organizations.delete',
			'wireguard.removePeer',
			'addOns.delete',
			'addOns.resetPassword',
			'thirdParty.delete',
		]) {
			expect(meta[path]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
		expect(meta['apps.list']?.irreversible).toBeUndefined();
	});
});
