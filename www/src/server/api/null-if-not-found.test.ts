import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TRPCError } from '@trpc/server';

import { nullIfNotFound } from './null-if-not-found';

describe('nullIfNotFound', () => {
	it('passes the value through', async () => {
		assert.equal(await nullIfNotFound(Promise.resolve('gmail')), 'gmail');
	});

	it('turns a tRPC NOT_FOUND into null so the page can 404', async () => {
		const missing = Promise.reject(
			new TRPCError({ code: 'NOT_FOUND', message: 'Integration not found' }),
		);
		assert.equal(await nullIfNotFound(missing), null);
	});

	it('still throws every other error', async () => {
		await assert.rejects(
			nullIfNotFound(
				Promise.reject(new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })),
			),
			TRPCError,
		);
		await assert.rejects(
			nullIfNotFound(Promise.reject(new Error('db down'))),
			/db down/,
		);
	});
});
