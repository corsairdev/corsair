import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { VercelEnvVariableSchema } from '../schema/database';
import {
	createEnvVariable,
	deleteEnvVariable,
	getEnvVariable,
	getEnvVariables,
	updateEnvVariable,
} from './envs';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const upsert = jest.fn();
const remove = jest.fn();
const ctx = {
	key: 'test-token',
	options: {},
	db: { envs: { upsertByEntityId: upsert, deleteByEntityId: remove } },
} as unknown as VercelContext;

const SECRET = 'super-secret-value';

const env = {
	id: 'env_1',
	key: 'DATABASE_URL',
	type: 'encrypted',
	value: 'eyJ2IjoiZW5jcnlwdGVkIn0',
	target: ['production', 'preview'],
	configurationId: null,
	createdAt: 1,
	updatedAt: 2,
	createdBy: 'u1',
	updatedBy: null,
	decrypted: false,
	lastEditedByDisplayName: 'someone',
};

/** Everything the local store received, as one string. */
const stored = () => JSON.stringify(upsert.mock.calls);
const logged = (call = 0) => JSON.stringify(logEvent.mock.calls[call]?.[2]);

beforeEach(() => {
	jest.clearAllMocks();
});

describe('envs', () => {
	it('getEnvVariables sends filters, keeps new fields and stores metadata without values', async () => {
		request.mockResolvedValueOnce({
			envs: [
				env,
				{
					id: 'env_2',
					key: 'TOKEN',
					type: 'sensitive',
					value: '',
					target: 'production',
					createdAt: null,
					legacyValue: 'old',
				},
			],
			hiddenProductionEnvCount: 0,
		});

		const result = await getEnvVariables(ctx, {
			idOrName: 'my site',
			gitBranch: 'feature-1',
			customEnvironmentSlug: 'staging',
			teamId: 'team_1',
		});

		expect(request).toHaveBeenCalledWith('/v10/projects/my%20site/env', ctx, {
			teamId: 'team_1',
			query: { gitBranch: 'feature-1', customEnvironmentSlug: 'staging' },
		});
		expect(result.envs?.[0]?.lastEditedByDisplayName).toBe('someone');
		expect(result.envs?.[1]?.target).toBe('production');
		expect(result.hiddenProductionEnvCount).toBe(0);
		expect(upsert).toHaveBeenCalledTimes(2);
		expect(upsert).toHaveBeenCalledWith(
			'env_1',
			expect.objectContaining({
				key: 'DATABASE_URL',
				target: ['production', 'preview'],
			}),
		);
		// A single target is wrapped and a null timestamp dropped, so the
		// store's schema accepts the row.
		expect(upsert).toHaveBeenCalledWith(
			'env_2',
			expect.objectContaining({ target: ['production'] }),
		);
		expect(upsert.mock.calls[1]?.[1]).not.toHaveProperty('createdAt');
		for (const [, record] of upsert.mock.calls) {
			expect(record).not.toHaveProperty('value');
			expect(record).not.toHaveProperty('legacyValue');
			// Core's upsert parses each row with the entity schema.
			expect(() => VercelEnvVariableSchema.parse(record)).not.toThrow();
		}
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.envs.getEnvVariables',
			expect.objectContaining({ idOrName: 'my site' }),
			'completed',
		);
	});

	it('getEnvVariables accepts a response with pagination instead of the hidden count', async () => {
		request.mockResolvedValueOnce({
			envs: [],
			pagination: { count: 0, next: null, prev: null },
		});
		const result = await getEnvVariables(ctx, { idOrName: 'prj_1' });
		expect(result.pagination?.next).toBeNull();
		expect(request).toHaveBeenCalledWith('/v10/projects/prj_1/env', ctx, {
			teamId: undefined,
			query: {},
		});
	});

	it('getEnvVariable returns the decrypted value but stores only metadata', async () => {
		request.mockResolvedValueOnce({ ...env, value: SECRET, decrypted: true });
		const result = await getEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v1/projects/prj_1/env/env_1', ctx, {
			teamId: 'team_1',
		});
		expect(result.value).toBe(SECRET);
		expect(result.decrypted).toBe(true);
		expect(stored()).not.toContain(SECRET);
		expect(logged()).not.toContain(SECRET);
	});

	it('getEnvVariable accepts a response without an id (Vercel marks it optional) and stores nothing', async () => {
		request.mockResolvedValueOnce({ key: 'X', type: 'plain' });
		const result = await getEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
		});
		expect(result.key).toBe('X');
		expect(upsert).not.toHaveBeenCalled();
	});

	it('getEnvVariables keeps list entries without an id', async () => {
		request.mockResolvedValueOnce({
			envs: [{ key: 'X', type: 'plain', securityIssues: [] }],
		});
		const result = await getEnvVariables(ctx, { idOrName: 'prj_1' });
		expect(result.envs?.[0]?.key).toBe('X');
	});

	it('updateEnvVariable can clear target, custom environments and the Git branch', async () => {
		request.mockResolvedValueOnce({ ...env });
		await updateEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
			target: [],
			customEnvironmentIds: [],
			gitBranch: null,
		});
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/prj_1/env/env_1',
			ctx,
			expect.objectContaining({
				method: 'PATCH',
				body: { target: [], customEnvironmentIds: [], gitBranch: null },
			}),
		);
	});

	it('createEnvVariable posts one variable and keeps its value out of the log and store', async () => {
		request.mockResolvedValueOnce({
			created: { ...env, value: SECRET },
			failed: [],
		});
		const result = await createEnvVariable(ctx, {
			idOrName: 'prj_1',
			key: 'DATABASE_URL',
			value: SECRET,
			type: 'encrypted',
			target: ['production'],
			comment: 'db',
		});
		expect(request).toHaveBeenCalledWith('/v10/projects/prj_1/env', ctx, {
			method: 'POST',
			teamId: undefined,
			query: {},
			body: {
				key: 'DATABASE_URL',
				value: SECRET,
				type: 'encrypted',
				target: ['production'],
				comment: 'db',
			},
		});
		expect(result.failed).toEqual([]);
		expect(logged()).toContain('DATABASE_URL');
		expect(logged()).not.toContain(SECRET);
		expect(upsert).toHaveBeenCalledWith('env_1', expect.any(Object));
		expect(stored()).not.toContain(SECRET);
	});

	it('createEnvVariable posts several variables with upsert and reports failures', async () => {
		request.mockResolvedValueOnce({
			created: [{ ...env, value: SECRET }],
			failed: [
				{
					error: {
						code: 'ENV_ALREADY_EXISTS',
						message: 'exists',
						envVarKey: 'API_KEY',
						target: 'preview',
						somethingNew: true,
					},
				},
			],
		});
		const result = await createEnvVariable(ctx, {
			idOrName: 'prj_1',
			teamId: 'team_1',
			upsert: true,
			variables: [
				{
					key: 'DATABASE_URL',
					value: SECRET,
					type: 'encrypted',
					target: ['production'],
				},
				{
					key: 'API_KEY',
					value: 'another-secret',
					type: 'sensitive',
					customEnvironmentIds: ['env_custom'],
				},
			],
		});
		expect(request).toHaveBeenCalledWith('/v10/projects/prj_1/env', ctx, {
			method: 'POST',
			teamId: 'team_1',
			query: { upsert: 'true' },
			body: [
				{
					key: 'DATABASE_URL',
					value: SECRET,
					type: 'encrypted',
					target: ['production'],
				},
				{
					key: 'API_KEY',
					value: 'another-secret',
					type: 'sensitive',
					customEnvironmentIds: ['env_custom'],
				},
			],
		});
		expect(result.failed?.[0]?.error.code).toBe('ENV_ALREADY_EXISTS');
		expect(logged()).toContain('API_KEY');
		expect(logged()).not.toContain(SECRET);
		expect(logged()).not.toContain('another-secret');
		expect(stored()).not.toContain(SECRET);
	});

	it.each([
		['no type', { key: 'A', value: 'v', target: ['production'] }],
		[
			'no target or custom environment',
			{ key: 'A', value: 'v', type: 'plain' },
		],
		[
			'a removed type',
			{ key: 'A', value: 'v', type: 'secret', target: ['preview'] },
		],
		[
			'both forms at once',
			{
				key: 'A',
				variables: [
					{ key: 'B', value: 'v', type: 'plain', target: ['preview'] },
				],
			},
		],
		[
			'a variable without a target',
			{ variables: [{ key: 'B', value: 'v', type: 'plain' }] },
		],
	])(
		'createEnvVariable rejects %s before calling Vercel',
		async (_label, fields) => {
			await expect(
				createEnvVariable(ctx, {
					idOrName: 'prj_1',
					...fields,
				} as Parameters<typeof createEnvVariable>[1]),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('updateEnvVariable patches only the given fields and logs no value', async () => {
		request.mockResolvedValueOnce({ ...env, value: SECRET, type: 'plain' });
		const result = await updateEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
			value: SECRET,
			target: ['production'],
		});
		expect(request).toHaveBeenCalledWith('/v9/projects/prj_1/env/env_1', ctx, {
			method: 'PATCH',
			teamId: undefined,
			body: { value: SECRET, target: ['production'] },
		});
		expect(result.id).toBe('env_1');
		expect(logged()).toContain('env_1');
		expect(logged()).not.toContain(SECRET);
		expect(stored()).not.toContain(SECRET);
	});

	it('updateEnvVariable rejects a call with nothing to change', async () => {
		await expect(
			updateEnvVariable(ctx, { idOrName: 'prj_1', id: 'env_1' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('deleteEnvVariable removes the variable, drops the local row and returns no value', async () => {
		request.mockResolvedValueOnce({ ...env, value: SECRET, vsmValue: 'x' });
		const result = await deleteEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
			customEnvironmentId: 'env_custom',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v9/projects/prj_1/env/env_1', ctx, {
			method: 'DELETE',
			teamId: 'team_1',
			query: { customEnvironmentId: 'env_custom' },
		});
		expect(remove).toHaveBeenCalledWith('env_1');
		expect(result).toMatchObject({
			deleted: true,
			idOrName: 'prj_1',
			id: 'env_1',
		});
		expect(result.removed[0]?.key).toBe('DATABASE_URL');
		expect(JSON.stringify(result)).not.toContain(SECRET);
		expect(result.removed[0]).not.toHaveProperty('vsmValue');
	});

	it('deleteEnvVariable accepts Vercel’s list form of the removed variable', async () => {
		request.mockResolvedValueOnce([{ ...env }, { ...env, id: 'env_9' }]);
		const result = await deleteEnvVariable(ctx, {
			idOrName: 'prj_1',
			id: 'env_1',
		});
		expect(result.removed.map((e) => e.id)).toEqual(['env_1', 'env_9']);
		expect(request).toHaveBeenCalledWith('/v9/projects/prj_1/env/env_1', ctx, {
			method: 'DELETE',
			teamId: undefined,
			query: {},
		});
	});
});
