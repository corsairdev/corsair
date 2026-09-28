import { DatarobotAPIError, makeDatarobotRequest } from './client';
import { errorHandlers } from './error-handlers';
import { DatarobotSchema } from './schema';
import {
	DatarobotDataset,
	DatarobotDeployment,
	DatarobotProject,
} from './schema/database';
import { buildDatarobotPath, splitDatarobotInput } from './utils';

describe('DataRobot schema', () => {
	it('declares official catalog entities', () => {
		expect(DatarobotSchema.version).toBe('0.1.0');
		expect(DatarobotSchema.entities.project).toBe(DatarobotProject);
		expect(DatarobotSchema.entities.dataset).toBe(DatarobotDataset);
		expect(DatarobotSchema.entities.deployment).toBe(DatarobotDeployment);
	});

	it('accepts a live-shaped project with only id', () => {
		expect(DatarobotProject.parse({ id: 'abc', extra: true }).extra).toBe(true);
	});

	it('accepts an empty list-projects input', () => {
		const { DatarobotEndpointInputSchemas } = require('./endpoints/types');
		expect(DatarobotEndpointInputSchemas.projectsList.parse({})).toEqual({});
	});
});

describe('DataRobot path builder', () => {
	it('encodes path params', () => {
		expect(
			buildDatarobotPath('/api/v2/projects/{projectId}/', {
				projectId: 'a/b',
			}),
		).toBe('/api/v2/projects/a%2Fb/');
	});

	it('rejects missing path params', () => {
		expect(() =>
			buildDatarobotPath('/api/v2/projects/{projectId}/', {}),
		).toThrow(/projectId/);
	});
});

describe('DataRobot input split', () => {
	it('keeps path keys out of query and body', () => {
		const split = splitDatarobotInput(
			{ projectId: '1', offset: 0, name: 'x' },
			['projectId'],
			['offset'],
		);
		expect(split.query).toEqual({ offset: 0 });
		expect(split.body).toEqual({ name: 'x' });
	});

	it('treats OpenAPI path aliases as path keys', () => {
		const split = splitDatarobotInput(
			{
				authorizedProviderId: '1',
				authorizationID: '1',
			},
			['authorizedProviderId'],
			[],
		);
		expect(split.body).toBeUndefined();
	});
});

describe('DataRobot client errors', () => {
	it('rejects a missing API key', async () => {
		await expect(
			makeDatarobotRequest('/api/v2/version/', ''),
		).rejects.toBeInstanceOf(DatarobotAPIError);
	});

	it('rejects unresolved path templates', async () => {
		await expect(
			makeDatarobotRequest('/api/v2/projects/{projectId}/', 'token'),
		).rejects.toMatchObject({
			name: 'DatarobotAPIError',
			message: 'Unresolved DataRobot path parameter',
		});
	});

	it('rejects a non-HTTPS origin before sending', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		await expect(
			makeDatarobotRequest('/api/v2/version/', {
				key: 'token',
				options: { baseUrl: 'http://example.com' },
			}),
		).rejects.toMatchObject({
			message: 'DataRobot origin must be HTTPS',
		});
		await expect(
			makeDatarobotRequest('/api/v2/version/', {
				key: 'token',
				options: { host: 'http://example.com' },
			}),
		).rejects.toMatchObject({
			message: 'DataRobot origin must be HTTPS',
		});
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});

	it('rejects a malformed custom origin', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		await expect(
			makeDatarobotRequest('/api/v2/version/', {
				key: 'token',
				options: { baseUrl: 'http://[' },
			}),
		).rejects.toMatchObject({ message: 'Invalid DataRobot origin' });
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});

	it('sends JSON on DELETE when a body is provided', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		await makeDatarobotRequest(
			'/api/v2/version/',
			{ key: 'token', options: { baseUrl: 'https://app.datarobot.com' } },
			{ method: 'DELETE', body: { ids: ['1'] } },
		);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				body: JSON.stringify({ ids: ['1'] }),
			}),
		);
		fetchSpy.mockRestore();
	});

	it('rejects HTTP, protocol-relative, and cross-origin endpoints', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		const ctx = {
			key: 'token',
			options: { baseUrl: 'https://app.datarobot.com' },
		};
		await expect(
			makeDatarobotRequest('http://app.datarobot.com/api/v2/version/', ctx),
		).rejects.toBeInstanceOf(DatarobotAPIError);
		await expect(
			makeDatarobotRequest('//evil.example/api/v2/version/', ctx),
		).rejects.toBeInstanceOf(DatarobotAPIError);
		await expect(
			makeDatarobotRequest('https://evil.example/api/v2/version/', ctx),
		).rejects.toBeInstanceOf(DatarobotAPIError);
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});
});

describe('DataRobot permission handler', () => {
	it('matches HTTP 403', async () => {
		const err = Object.assign(new Error('forbidden'), { status: 403 });
		expect(errorHandlers.PERMISSION_ERROR.match(err)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(err)).toBe(false);
	});
});
