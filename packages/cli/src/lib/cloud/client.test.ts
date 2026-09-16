import { fetchCloudOpTree, resolveCloudConfig } from './client';

describe('resolveCloudConfig', () => {
	const originalUrl = process.env.CORSAIR_CLOUD_URL;
	const originalKey = process.env.CORSAIR_CLOUD_KEY;

	afterEach(() => {
		if (originalUrl === undefined) {
			// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
			delete process.env.CORSAIR_CLOUD_URL;
		} else {
			process.env.CORSAIR_CLOUD_URL = originalUrl;
		}
		if (originalKey === undefined) {
			// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
			delete process.env.CORSAIR_CLOUD_KEY;
		} else {
			process.env.CORSAIR_CLOUD_KEY = originalKey;
		}
	});

	it('throws naming --url when neither flag nor env is set', () => {
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_URL;
		expect(() => resolveCloudConfig({ key: 'ck_cloud_x' })).toThrow(
			/--url|CORSAIR_CLOUD_URL/,
		);
	});

	it('throws naming --key when neither flag nor env is set', () => {
		process.env.CORSAIR_CLOUD_URL = 'https://vm.corsair.cloud';
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_KEY;
		expect(() => resolveCloudConfig({})).toThrow(/--key|CORSAIR_CLOUD_KEY/);
	});

	it('prefers flags over env and strips a trailing slash from the url', () => {
		process.env.CORSAIR_CLOUD_URL = 'https://env.corsair.cloud';
		process.env.CORSAIR_CLOUD_KEY = 'ck_cloud_env';
		const config = resolveCloudConfig({
			url: 'https://flag.corsair.cloud/',
			key: 'ck_cloud_flag',
		});
		expect(config).toEqual({
			url: 'https://flag.corsair.cloud',
			key: 'ck_cloud_flag',
		});
	});

	it('falls back to env when no flags are given', () => {
		process.env.CORSAIR_CLOUD_URL = 'https://env.corsair.cloud';
		process.env.CORSAIR_CLOUD_KEY = 'ck_cloud_env';
		expect(resolveCloudConfig({})).toEqual({
			url: 'https://env.corsair.cloud',
			key: 'ck_cloud_env',
		});
	});

	it('rejects a non-https url', () => {
		expect(() =>
			resolveCloudConfig({ url: 'http://attacker.example', key: 'ck_cloud_x' }),
		).toThrow(/https/);
	});

	it('allows http for loopback hosts', () => {
		expect(
			resolveCloudConfig({ url: 'http://localhost:4000', key: 'ck_cloud_x' }),
		).toEqual({ url: 'http://localhost:4000', key: 'ck_cloud_x' });
	});
});

describe('fetchCloudOpTree', () => {
	const config = { url: 'https://vm.corsair.cloud', key: 'ck_cloud_x' };

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('GETs /call with a bearer token and returns the plugin tree', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			json: async () => ({ plugins: { slack: ['messages.post'] } }),
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		const tree = await fetchCloudOpTree(config);

		expect(fetchMock).toHaveBeenCalledWith('https://vm.corsair.cloud/call', {
			headers: { authorization: 'Bearer ck_cloud_x' },
		});
		expect(tree).toEqual({ slack: ['messages.post'] });
	});

	it('throws with the status on a non-ok response', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 403,
			statusText: 'Forbidden',
			json: async () => ({}),
		}) as unknown as typeof fetch;

		await expect(fetchCloudOpTree(config)).rejects.toThrow(/403/);
	});
});
