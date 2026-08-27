import { AppVeyorClient } from './index';

describe('AppVeyorClient', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('throws an error when initialized without an API key', () => {
		expect(() => new AppVeyorClient({ apiKey: '' })).toThrow(
			'AppVeyor API key is required.',
		);
	});

	it('instantiates correctly with valid configuration', () => {
		const client = new AppVeyorClient({ apiKey: 'test-token' });

		expect(client).toBeInstanceOf(AppVeyorClient);
	});

	it('fetches projects list successfully with authentication header', async () => {
		const mockProjects = [
			{
				projectId: 1,
				accountName: 'test-user',
				name: 'test-repo',
				slug: 'test-repo',
				repositoryType: 'git',
				repositoryName: 'test-user/test-repo',
			},
		];

		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			json: async () => mockProjects,
		} as Response);

		const client = new AppVeyorClient({ apiKey: 'test-token' });
		const result = await client.getProjects();

		expect(result).toEqual(mockProjects);

		expect(global.fetch).toHaveBeenCalledWith(
			'https://ci.appveyor.com/api/projects',
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
				}),
			}),
		);
	});

	it('fetches the last build status for a project', async () => {
		const mockBuildData = {
			project: {
				projectId: 1,
				accountName: 'test-user',
				name: 'test-repo',
				slug: 'test-repo',
				repositoryType: 'git',
				repositoryName: 'test-user/test-repo',
			},
			build: {
				buildId: 101,
				buildNumber: 5,
				version: '1.0.5',
				message: 'Initial commit',
				branch: 'main',
				status: 'success',
			},
		};

		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			json: async () => mockBuildData,
		} as Response);

		const client = new AppVeyorClient({ apiKey: 'test-token' });

		const result = await client.getLastBuild('test-user', 'test-repo');

		expect(result.build.status).toBe('success');
		expect(result.build.buildNumber).toBe(5);

		expect(global.fetch).toHaveBeenCalledWith(
			'https://ci.appveyor.com/api/projects/test-user/test-repo',
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
				}),
			}),
		);
	});

	it('throws an ApiError when the API request fails', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found',
			headers: new Headers(),
			text: async () => 'Project not found',
		} as Response);

		const client = new AppVeyorClient({ apiKey: 'test-token' });

		await expect(
			client.getLastBuild('test-user', 'nonexistent'),
		).rejects.toMatchObject({
			status: 404,
			message: 'AppVeyor API Error [404 Not Found]: Project not found',
		});
	});

	it('preserves Retry-After metadata for HTTP 429 responses', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'Retry-After': '3',
			}),
			text: async () => 'Rate limit exceeded',
		} as Response);

		const client = new AppVeyorClient({ apiKey: 'test-token' });

		await expect(
			client.getLastBuild('test-user', 'test-repo'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 3000,
			message:
				'AppVeyor API Error [429 Too Many Requests]: Rate limit exceeded',
		});
	});
});
