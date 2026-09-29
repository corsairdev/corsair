import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGmailRequest } from '../client';
import { gmail } from '../index';
import { UsersEndpoints } from './index';
import { GmailEndpointOutputSchemas } from './types';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('../client', () => {
	const original = jest.requireActual('../client');
	return {
		...original,
		makeAuthenticatedGmailRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeAuthenticatedGmailRequest);
const mockLog = jest.mocked(logEventFromContext);

const PROFILE = {
	emailAddress: 'user@example.com',
	messagesTotal: 42,
	threadsTotal: 7,
	historyId: '12345',
};

function createContext() {
	return { key: 'test-token', db: {} } as never;
}

function flattenEndpointPaths(
	// Endpoint trees are nested records of functions, so values stay unknown here
	tree: Record<string, unknown>,
	prefix = '',
): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		return typeof value === 'function'
			? [path]
			: flattenEndpointPaths(value as Record<string, unknown>, path);
	});
}

describe('Gmail users.getProfile', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('requests the profile of the authenticated user by default', async () => {
		mockRequest.mockResolvedValue(PROFILE);
		const ctx = createContext();

		const result = await UsersEndpoints.getProfile(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('/users/me/profile', ctx, {
			method: 'GET',
		});
		expect(result).toEqual(PROFILE);
		expect(() =>
			GmailEndpointOutputSchemas.usersGetProfile.parse(result),
		).not.toThrow();
	});

	it('requests the profile of an explicit userId', async () => {
		mockRequest.mockResolvedValue(PROFILE);
		const ctx = createContext();

		await UsersEndpoints.getProfile(ctx, { userId: 'someone@example.com' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/users/someone%40example.com/profile',
			ctx,
			{ method: 'GET' },
		);
	});

	it('encodes a userId so it stays one path segment', async () => {
		mockRequest.mockResolvedValue(PROFILE);
		const ctx = createContext();

		await UsersEndpoints.getProfile(ctx, { userId: '../me/messages?x={a}' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/users/..%2Fme%2Fmessages%3Fx%3D%7Ba%7D/profile',
			ctx,
			{ method: 'GET' },
		);
	});

	it('logs a completed event', async () => {
		mockRequest.mockResolvedValue(PROFILE);
		const ctx = createContext();

		await UsersEndpoints.getProfile(ctx, { userId: 'me' });

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'gmail.users.getProfile',
			{ userId: 'me' },
			'completed',
		);
	});

	it('propagates request failures without logging', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));

		await expect(
			UsersEndpoints.getProfile(createContext(), {}),
		).rejects.toThrow('boom');
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('Gmail plugin registration', () => {
	const plugin = gmail({});
	const endpointPaths = flattenEndpointPaths(
		plugin.endpoints as Record<string, unknown>,
	).sort();

	it('registers users.getProfile as a runtime endpoint', () => {
		expect(endpointPaths).toContain('users.getProfile');
	});

	it('declares a schema entry for every runtime endpoint', () => {
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			endpointPaths,
		);
	});

	it('declares a metadata entry for every runtime endpoint', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			endpointPaths,
		);
	});

	it('marks users.getProfile as a read endpoint', () => {
		const meta = plugin.endpointMeta as
			| Record<string, { riskLevel?: string }>
			| undefined;
		expect(meta?.['users.getProfile']?.riskLevel).toBe('read');
	});
});
