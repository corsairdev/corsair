/**
 * Live tests against Lusha. They run when LUSHA_API_KEY is set (CI has none,
 * so they skip). Only free, read-only calls are made: account usage and a job
 * poll for a nonexistent id. Every search and enrich call charges credits, so
 * none belongs in a smoke suite.
 */

import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { getAccountUsage } from './endpoints/account';
import { getContactsEnrichJob } from './endpoints/jobs';
import { LushaEndpointOutputSchemas as Outputs } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.LUSHA_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;

if (!KEY.success) {
	// A skipped run must not be mistakable for a green one.
	console.warn(
		'lusha api.test.ts: LUSHA_API_KEY is not set, so the live suite is skipped.',
	);
}

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof getAccountUsage
>[0];

describeLive('lusha live API', () => {
	it('account.getAccountUsage returns the credit balance', async () => {
		const result = Outputs.accountGetAccountUsage.parse(
			await getAccountUsage(ctx, {}),
		);
		// Free plan or paid: some credit accounting always exists.
		expect(result.credits?.total).toBeDefined();
	});

	it('jobs.getContactsEnrichJob reports 404 for a job id that does not exist', async () => {
		// Free to call. 404 means the job does not exist, expired, or belongs
		// to another account - not distinguished, per the docs.
		await expect(
			getContactsEnrichJob(ctx, { jobId: 'wf_doesnotexist123' }),
		).rejects.toBeInstanceOf(ApiError);
		await expect(
			getContactsEnrichJob(ctx, { jobId: 'wf_doesnotexist123' }),
		).rejects.toMatchObject({ status: 404 });
	});
});
