import { bravesearch } from './index';

type Builder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function builder(options: Parameters<typeof bravesearch>[0] = {}): Builder {
	return bravesearch(options).keyBuilder as unknown as Builder;
}

function ctx(stored: () => Promise<string | null>) {
	return { authType: 'api_key', keys: { get_api_key: stored } };
}

describe('keyBuilder', () => {
	it('uses the key option first', async () => {
		await expect(
			builder({ key: 'opt-key' })(
				ctx(async () => 'stored'),
				'endpoint',
			),
		).resolves.toBe('opt-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			builder()(
				ctx(async () => 'stored'),
				'endpoint',
			),
		).resolves.toBe('stored');
	});

	it('treats an account without a DEK as no stored key', async () => {
		const noDek = async () => {
			throw new Error(
				'No DEK found for account (tenant: "t", integration: "bravesearch")',
			);
		};
		await expect(builder()(ctx(noDek), 'endpoint')).rejects.toThrow(/api_key/);
	});

	it('lets other key-store failures through', async () => {
		const broken = async () => {
			throw new Error('database is down');
		};
		await expect(builder()(ctx(broken), 'endpoint')).rejects.toThrow(
			'database is down',
		);
	});

	it('throws AuthMissingError without any key', async () => {
		await expect(
			builder()(
				ctx(async () => null),
				'endpoint',
			),
		).rejects.toThrow(/api_key/);
	});

	it('has no webhook key', async () => {
		await expect(
			builder()(
				ctx(async () => 'stored'),
				'webhook',
			),
		).resolves.toBe('');
	});
});
