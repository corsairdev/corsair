import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import CloudPullCommand from './pull.command';

describe('CloudPullCommand', () => {
	const originalCwd = process.cwd();
	const originalUrl = process.env.CORSAIR_CLOUD_URL;
	const originalKey = process.env.CORSAIR_CLOUD_KEY;
	let dir: string;

	beforeEach(() => {
		dir = mkdtempSync(join(tmpdir(), 'corsair-cloud-pull-'));
		process.chdir(dir);
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_URL;
		// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
		delete process.env.CORSAIR_CLOUD_KEY;
	});

	afterEach(() => {
		process.chdir(originalCwd);
		rmSync(dir, { recursive: true, force: true });
		process.env.CORSAIR_CLOUD_URL = originalUrl;
		process.env.CORSAIR_CLOUD_KEY = originalKey;
		jest.restoreAllMocks();
	});

	it('rejects when the key is missing', async () => {
		const command = new CloudPullCommand();
		await expect(
			command.action({
				args: [],
				options: { url: 'https://vm.corsair.cloud' },
			}),
		).rejects.toThrow(/--key|CORSAIR_CLOUD_KEY/);
	});

	it('fetches the op tree and writes corsair-env.d.ts', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			json: async () => ({ plugins: { slack: ['messages.post'] } }),
		}) as unknown as typeof fetch;
		jest.spyOn(console, 'log').mockImplementation(() => {});

		const command = new CloudPullCommand();
		await command.action({
			args: [],
			options: { url: 'https://vm.corsair.cloud', key: 'ck_cloud_x' },
		});

		const written = readFileSync(join(dir, 'corsair-env.d.ts'), 'utf8');
		expect(written).toContain('declare module "corsair"');
		expect(written).toContain('slack: {');
		expect(written).toContain('post(args?: any): Promise<any>;');
	});
});
