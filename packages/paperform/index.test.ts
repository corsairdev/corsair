import { AuthMissingError } from 'corsair/core';
import { paperform } from './index';

type Meta = Record<string, { riskLevel: string }>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

describe('Paperform plugin', () => {
	it('marks deletes destructive, other writes write, the rest read', () => {
		const meta = paperform().endpointMeta as unknown as Meta;
		expect(Object.keys(meta)).toHaveLength(24);
		const byRisk = (risk: string) =>
			Object.keys(meta)
				.filter((op) => meta[op]?.riskLevel === risk)
				.sort();
		expect(byRisk('destructive')).toEqual([
			'coupons.delete',
			'submissions.delete',
			'webhooks.delete',
		]);
		expect(byRisk('write')).toEqual([
			'coupons.create',
			'coupons.update',
			'products.update',
			'webhooks.create',
		]);
	});

	it('raises AuthMissingError when no key is stored', async () => {
		const keyBuilder = paperform().keyBuilder as unknown as KeyBuilder;
		await expect(
			keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
