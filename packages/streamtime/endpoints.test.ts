import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeStreamtimeRequest } from './client';
import { Organisation, Roles, Users } from './endpoints';
import { streamtime } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeStreamtimeRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockContext = {
	key: 'test-api-key',
	provider: 'streamtime',
	authType: 'api_key',
} as any;

describe('Streamtime endpoints', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('retrieves organisation details', async () => {
		const mockResponse = {
			name: 'Acme Ltd',
			domain: 'acme',
			currency: {
				id: 'USD',
				name: 'US Dollar',
				symbol: '$',
			},
			address: '123 High St, Cityville, 12345, Country',
			country: {
				id: 'NZ',
				name: 'New Zealand',
			},
		};
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Organisation.get(mockContext, {});
		expect(makeStreamtimeRequest).toHaveBeenCalledWith(
			'organisation',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('retrieves a role by ID', async () => {
		const mockResponse = {
			id: 1234,
			name: 'Senior Designer',
			active: true,
		};
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Roles.get(mockContext, { role_id: 1234 });
		expect(makeStreamtimeRequest).toHaveBeenCalledWith(
			'roles/1234',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('lists all roles', async () => {
		const mockResponse = [
			{
				id: 1234,
				name: 'Senior Designer',
				active: true,
			},
			{
				id: 5678,
				name: 'Creative Director',
				active: false,
			},
		];
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Roles.list(mockContext, {});
		expect(makeStreamtimeRequest).toHaveBeenCalledWith(
			'roles',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('lists saved segments for a user', async () => {
		const mockResponse = [
			{
				id: 42,
				userId: 123,
				savedSegmentType: {
					id: 1,
					name: 'Grouped Logged Time',
				},
				name: 'My Logged Time Segment',
				value: '{"statusIds":[1]}',
			},
		];
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Users.listSavedSegments(mockContext, { user_id: 123 });
		expect(makeStreamtimeRequest).toHaveBeenCalledWith(
			'users/123/saved_segments',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('rejects invalid inputs on endpoints', async () => {
		await expect(
			Roles.get(mockContext, { role_id: 'not-a-number' as any }),
		).rejects.toThrow();

		await expect(
			Users.listSavedSegments(mockContext, { user_id: 'not-a-number' as any }),
		).rejects.toThrow();

		expect(makeStreamtimeRequest).not.toHaveBeenCalled();
	});

	it('rejects non-positive role and user ids', async () => {
		await expect(Roles.get(mockContext, { role_id: 0 })).rejects.toThrow();
		await expect(Roles.get(mockContext, { role_id: -1 })).rejects.toThrow();
		await expect(
			Users.listSavedSegments(mockContext, { user_id: 0 }),
		).rejects.toThrow();

		expect(makeStreamtimeRequest).not.toHaveBeenCalled();
	});

	it('rejects organisation payloads that miss required fields', async () => {
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue({ name: 'Acme' });

		await expect(Organisation.get(mockContext, {})).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('rejects a wrapped roles list payload', async () => {
		(makeStreamtimeRequest as jest.Mock).mockResolvedValue({
			data: [{ id: 1, name: 'Designer', active: true }],
		});

		await expect(Roles.list(mockContext, {})).rejects.toThrow();
	});
});

describe('Streamtime keyBuilder', () => {
	type KeyBuilder = (
		ctx: unknown,
		source: 'endpoint' | 'webhook',
	) => Promise<string>;
	const keyBuilderOf = (plugin: { keyBuilder?: unknown }) =>
		plugin.keyBuilder as KeyBuilder;
	const keyContext = (key?: string) =>
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as any;

	it('returns the configured key', async () => {
		const plugin = streamtime({ key: 'inline-key' });
		await expect(keyBuilderOf(plugin)(keyContext(), 'endpoint')).resolves.toBe(
			'inline-key',
		);
	});

	it('returns the stored api key', async () => {
		const plugin = streamtime();
		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const plugin = streamtime();
		await expect(
			keyBuilderOf(plugin)(keyContext(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
