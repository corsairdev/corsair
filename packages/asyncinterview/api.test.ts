import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ASYNCINTERVIEW_API_BASE } from './client';
import { DeleteJobInputSchema } from './endpoints/types';
import { asyncinterview } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

import { request } from 'corsair/http';

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const LIVE_JOB = {
	id: 1651,
	title: 'Quick Start',
	date: '2026-08-19',
	time: '00:26:04',
	datetime: '2026-08-19T00:26:04+00:00',
};

const LIVE_INTERVIEW = {
	id: 2141,
	title: 'Example Interview',
	url: 'https://app.asyncinterview.ai/i/VYFudF',
	job_id: 1651,
	job: 'Quick Start',
	date: '2026-08-19',
	time: '00:26:04',
	datetime: '2026-08-19T00:26:04+00:00',
	questions: [
		{
			id: 11217,
			stage_id: 2141,
			title: 'Introduction',
			created_at: '2026-08-19T00:26:04.000000Z',
			updated_at: '2026-08-19T00:26:04.000000Z',
			order: 1,
		},
	],
	contacts: [] as unknown[],
};

function makeStore() {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

function makeCtx() {
	const db = {
		jobs: makeStore(),
		interviews: makeStore(),
	};
	const plugin = asyncinterview({ key: 'test-key' });
	const ctx = {
		key: 'test-key',
		plugin,
		db,
	} as unknown as Parameters<
		NonNullable<typeof plugin.endpoints>['jobs']['list']
	>[0];
	return { plugin, ctx, db };
}

describe('AsyncInterview endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists jobs from GET /jobs with Bearer auth', async () => {
		const { plugin, ctx, db } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce([LIVE_JOB]);

		const result = await plugin.endpoints!.jobs.list(ctx, {});

		expect(result).toEqual([LIVE_JOB]);
		expect(db.jobs.upsertByEntityId).toHaveBeenCalledWith('1651', LIVE_JOB);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: ASYNCINTERVIEW_API_BASE,
				TOKEN: 'test-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/jobs',
			}),
		);
	});

	it('lists interviews from GET /interviews, not /jobs/{id}/responses', async () => {
		const { plugin, ctx, db } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce([LIVE_INTERVIEW]);

		const result = await plugin.endpoints!.jobs.listResponses(ctx, {
			job_id: 1651,
		});

		expect(result).toEqual([LIVE_INTERVIEW]);
		expect(db.interviews.upsertByEntityId).toHaveBeenCalledWith(
			'2141',
			LIVE_INTERVIEW,
		);
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/interviews',
				query: { job_id: '1651' },
			}),
		);
	});

	it('lists all interviews when job_id is omitted', async () => {
		const { plugin, ctx } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce([LIVE_INTERVIEW]);

		await plugin.endpoints!.jobs.listResponses(ctx, {});

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/interviews',
				query: undefined,
			}),
		);
	});

	it('updates a job with PUT /jobs/{job_id}', async () => {
		const { plugin, ctx, db } = makeCtx();
		const updated = { ...LIVE_JOB, title: 'Updated Job' };
		(request as jest.Mock).mockResolvedValueOnce(updated);

		const result = await plugin.endpoints!.jobs.update(ctx, {
			job_id: '1651',
			title: 'Updated Job',
			is_public: false,
			sub_title: 'tag',
			description: 'role',
		});

		expect(result.title).toBe('Updated Job');
		expect(db.jobs.upsertByEntityId).toHaveBeenCalledWith('1651', updated);
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				url: '/jobs/{job_id}',
				path: { job_id: '1651' },
				body: {
					title: 'Updated Job',
					is_public: false,
					sub_title: 'tag',
					description: 'role',
				},
			}),
		);
	});

	it('accepts an empty PUT body as a job id fallback', async () => {
		const { plugin, ctx, db } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce(undefined);

		const result = await plugin.endpoints!.jobs.update(ctx, { job_id: 1651 });

		expect(result.id).toBe(1651);
		expect(db.jobs.upsertByEntityId).toHaveBeenCalledWith('1651', result);
	});

	it('rejects a malformed non-empty PUT payload', async () => {
		const { plugin, ctx, db } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce({ title: 'no id' });

		await expect(
			plugin.endpoints!.jobs.update(ctx, { job_id: 1651, title: 'x' }),
		).rejects.toThrow();
		expect(db.jobs.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('deletes a job with DELETE /jobs/{job_id}', async () => {
		const { plugin, ctx, db } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce({
			message: 'Job Deleted Successfully!',
		});

		const result = await plugin.endpoints!.jobs.delete(ctx, { job_id: 1651 });

		expect(result).toEqual({ job_id: 1651 });
		expect(db.jobs.deleteByEntityId).toHaveBeenCalledWith('1651');
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/jobs/{job_id}',
				path: { job_id: '1651' },
			}),
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('prefers options.key over stored-key lookup', async () => {
		const plugin = asyncinterview({ key: 'options-key' });
		const get_api_key = jest.fn(async () => 'stored-key');
		await expect(
			plugin.keyBuilder!(
				{ authType: 'api_key', keys: { get_api_key } } as never,
				'endpoint',
			),
		).resolves.toBe('options-key');
		expect(get_api_key).not.toHaveBeenCalled();
	});

	it('returns the stored api key', async () => {
		const plugin = asyncinterview({});
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = asyncinterview({});
		await expect(
			plugin.keyBuilder!(
				{ authType: 'api_key', keys: undefined } as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when stored-key lookup fails', async () => {
		const plugin = asyncinterview({});
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => {
							throw new Error(
								'Account not found for tenant "default" and integration "asyncinterview". Make sure to create the account first.',
							);
						},
					},
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('does not treat decryption failures as missing auth', async () => {
		const plugin = asyncinterview({});
		const err = await Promise.resolve(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => {
							throw new Error('Invalid encrypted DEK format');
						},
					},
				} as never,
				'endpoint',
			),
		).then(
			() => {
				throw new Error('expected throw');
			},
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(Error);
		expect(err).not.toBeInstanceOf(AuthMissingError);
		expect((err as Error).message).toBe('Invalid encrypted DEK format');
	});

	it('throws AuthMissingError when the key manager is missing', async () => {
		const plugin = asyncinterview({});
		await expect(
			plugin.keyBuilder!({ authType: 'api_key' } as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('rejects a non-numeric job_id', () => {
		expect(() => DeleteJobInputSchema.parse({ job_id: 'abc' })).toThrow();
		expect(() =>
			DeleteJobInputSchema.parse({ job_id: '9007199254740993' }),
		).toThrow();
		expect(DeleteJobInputSchema.parse({ job_id: '1651' }).job_id).toBe('1651');
	});

	it('rejects a job list payload that has no id', async () => {
		const { plugin, ctx } = makeCtx();
		(request as jest.Mock).mockResolvedValueOnce([{ title: 'no id' }]);

		await expect(plugin.endpoints!.jobs.list(ctx, {})).rejects.toThrow();
	});
});
