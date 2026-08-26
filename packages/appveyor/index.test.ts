import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppVeyorClient } from './index';

describe('AppVeyorClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
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

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
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

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
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

	it('throws formatted error when API request fails', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found',
			text: async () => 'Project not found',
		} as Response);

		const client = new AppVeyorClient({ apiKey: 'test-token' });
		await expect(
			client.getLastBuild('test-user', 'nonexistent'),
		).rejects.toThrow('AppVeyor API Error [404 Not Found]: Project not found');
	});
});
