import CloudListCommand from './list.command';

describe('CloudListCommand', () => {
	const originalUrl = process.env.CORSAIR_CLOUD_URL;
	const originalKey = process.env.CORSAIR_CLOUD_KEY;

	beforeEach(() => {
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_URL;
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_KEY;
	});

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
		jest.restoreAllMocks();
	});

	it('rejects when the url is missing', async () => {
		const command = new CloudListCommand();
		await expect(
			command.action({ args: [], options: { key: 'ck_cloud_x' } }),
		).rejects.toThrow(/--url|CORSAIR_CLOUD_URL/);
	});

	it('fetches the op tree and prints it', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			json: async () => ({
				plugins: { slack: ['messages.post', 'users.list'] },
			}),
		}) as unknown as typeof fetch;
		const log = jest.spyOn(console, 'log').mockImplementation(() => {});

		const command = new CloudListCommand();
		await command.action({
			args: [],
			options: { url: 'https://vm.corsair.cloud', key: 'ck_cloud_x' },
		});

		expect(log).toHaveBeenCalledWith('slack\n  messages.post\n  users.list');
	});
});
