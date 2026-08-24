import { AuthMissingError } from 'corsair/core';
import { auditPayload, listAuditPayload } from './endpoints/logging';
import {
	AC_PAGE_SIZE_MAX,
	buildPaginationQuery,
	compactBody,
	compactQuery,
} from './endpoints/shared';
import {
	ActiveCampaignEndpointInputSchemas,
	ActiveCampaignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, NON_IDEMPOTENT_OPERATIONS } from './error-handlers';
import { activecampaignEndpointMeta } from './index';

const META = activecampaignEndpointMeta as Record<
	string,
	{ riskLevel: string; description: string }
>;

const OPERATION_COUNT = 304;
const READ_COUNT = 145;
const MUTATING_COUNT = 159;
const DESTRUCTIVE_COUNT = 46;

/** 'fieldValues.setForContact' -> 'fieldValuesSetForContact' */
function toOperationKey(path: string): string {
	return path.replace(/\.(.)/g, (_match, c: string) => c.toUpperCase());
}

describe('endpoint registry', () => {
	it('registers every operation exactly once', () => {
		expect(Object.keys(META)).toHaveLength(OPERATION_COUNT);
	});

	/**
	 * The retry-safety check translates registry paths into operation keys, so
	 * that mapping has to hold for every path or the check silently skips the
	 * operations whose names do not line up.
	 */
	it('maps every registry path onto a declared schema key', () => {
		const paths = Object.keys(META);
		expect(paths).toHaveLength(OPERATION_COUNT);
		for (const path of paths) {
			expect(ActiveCampaignEndpointInputSchemas).toHaveProperty(
				toOperationKey(path),
			);
		}
	});

	/**
	 * Coverage sweep: an operation cannot enter the registry without both
	 * schemas, and a schema cannot exist without a registered operation.
	 */
	it('declares an input and output schema for every operation', () => {
		const inputs = Object.keys(ActiveCampaignEndpointInputSchemas).sort();
		const outputs = Object.keys(ActiveCampaignEndpointOutputSchemas).sort();
		expect(inputs).toEqual(outputs);
		expect(inputs).toHaveLength(OPERATION_COUNT);
	});

	it('gives every operation a meaningful description', () => {
		const entries = Object.entries(META);
		expect(entries).toHaveLength(OPERATION_COUNT);
		for (const [, meta] of entries) {
			expect(meta.description.length).toBeGreaterThan(10);
		}
	});

	it('assigns every operation a known risk level', () => {
		const levels = Object.values(META).map((m) => m.riskLevel);
		expect(levels).toHaveLength(OPERATION_COUNT);
		for (const level of levels) {
			expect(['read', 'write', 'destructive']).toContain(level);
		}
	});

	/**
	 * Non-vacuous: the match count is asserted before the loop, so the loop
	 * below cannot pass by matching nothing.
	 */
	it('marks every destructive operation destructive', () => {
		const destructive = Object.entries(META).filter(
			([path]) =>
				path.toLowerCase().includes('delete') ||
				path.toLowerCase().includes('remove'),
		);
		expect(destructive).toHaveLength(DESTRUCTIVE_COUNT);
		for (const [, meta] of destructive) {
			expect(meta.riskLevel).toBe('destructive');
		}
	});

	it('splits reads from state-changing operations', () => {
		const byLevel = Object.values(META).reduce<Record<string, number>>(
			(acc, m) => {
				acc[m.riskLevel] = (acc[m.riskLevel] ?? 0) + 1;
				return acc;
			},
			{},
		);
		expect(byLevel.read).toBe(READ_COUNT);
		expect((byLevel.write ?? 0) + (byLevel.destructive ?? 0)).toBe(
			MUTATING_COUNT,
		);
		expect(byLevel.destructive).toBe(DESTRUCTIVE_COUNT);
	});
});

describe('non-idempotent operation set', () => {
	const mutatingKeys = Object.entries(META)
		.filter(([, m]) => m.riskLevel !== 'read')
		.map(([path]) => toOperationKey(path))
		.sort();

	/**
	 * Corsair replays the whole endpoint call on retry and ActiveCampaign has
	 * no idempotency key, so the set must equal the state-changing operations
	 * exactly - a missing entry risks a duplicated write, and a stale entry is
	 * dead code that hides a real gap.
	 */
	it('equals the set of state-changing operations exactly', () => {
		expect(mutatingKeys).toHaveLength(MUTATING_COUNT);
		expect([...NON_IDEMPOTENT_OPERATIONS].sort()).toEqual(mutatingKeys);
	});

	it('contains no read operation', () => {
		const readKeys = Object.entries(META)
			.filter(([, m]) => m.riskLevel === 'read')
			.map(([path]) => toOperationKey(path));
		expect(readKeys).toHaveLength(READ_COUNT);
		for (const key of readKeys) {
			expect(NON_IDEMPOTENT_OPERATIONS.has(key)).toBe(false);
		}
	});
});

describe('error handlers', () => {
	const writeCtx = { operation: 'tagsCreate' } as never;
	const readCtx = { operation: 'tagsList' } as never;

	it('does not retry a write on a network error', async () => {
		const result = await errorHandlers.NETWORK_ERROR.handler(
			new Error('fetch failed'),
			writeCtx,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('retries a read on a network error', async () => {
		const result = await errorHandlers.NETWORK_ERROR.handler(
			new Error('fetch failed'),
			readCtx,
		);
		expect(result.maxRetries).toBe(3);
	});

	/** A 429 rejected the request rather than applying it, so a write is safe. */
	it('retries a rate-limit error even for a write', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('429 too many requests'),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('matches a 429 by message', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
	});

	it('never retries a configuration fault', async () => {
		const err = Object.assign(new Error('no account'), {
			code: 'MISSING_ACCOUNT',
		});
		expect(errorHandlers.CONFIGURATION_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.CONFIGURATION_ERROR.handler(
			err,
			writeCtx,
		);
		expect(result.maxRetries).toBe(0);
	});

	/**
	 * Handler order is load-bearing: the first match wins, so a configuration
	 * fault must be reachable before the catch-all.
	 */
	it('orders the configuration handler before the default', () => {
		const order = Object.keys(errorHandlers);
		expect(order.indexOf('CONFIGURATION_ERROR')).toBeGreaterThanOrEqual(0);
		expect(order.indexOf('CONFIGURATION_ERROR')).toBeLessThan(
			order.indexOf('DEFAULT'),
		);
	});

	/**
	 * The shared account resolver raises AuthMissingError rather than an
	 * ActiveCampaignAPIError with a code, so without this branch a missing
	 * account slug would fall through to the catch-all handler and be reported
	 * as an unhandled error.
	 */
	it('does not treat a DNS failure as not-found', () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(new Error('no such host'))).toBe(
			false,
		);
		expect(
			errorHandlers.NETWORK_ERROR.match(new Error('getaddrinfo ENOTFOUND')),
		).toBe(true);
	});

	it('treats a missing credential as a configuration fault', async () => {
		const err = new AuthMissingError('activecampaign', 'account');
		expect(errorHandlers.CONFIGURATION_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.CONFIGURATION_ERROR.handler(
			err,
			writeCtx,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('does not treat an ordinary error as a configuration fault', () => {
		expect(errorHandlers.CONFIGURATION_ERROR.match(new Error('boom'))).toBe(
			false,
		);
	});
});

describe('request body and query compaction', () => {
	/**
	 * ActiveCampaign treats an absent field and an explicit null differently:
	 * omitting leaves a value alone, null clears it.
	 */
	it('strips undefined but keeps null', () => {
		expect(compactBody({ a: 1, b: undefined, c: null })).toEqual({
			a: 1,
			c: null,
		});
	});

	it('strips undefined query values', () => {
		expect(compactQuery({ a: 'x', b: undefined })).toEqual({ a: 'x' });
	});

	it('clamps the page size to the documented maximum', () => {
		expect(buildPaginationQuery({ limit: 5000 }).limit).toBe(AC_PAGE_SIZE_MAX);
		expect(buildPaginationQuery({ limit: 20 }).limit).toBe(20);
	});

	it('omits pagination entirely when unspecified', () => {
		expect(buildPaginationQuery({})).toEqual({});
	});
});

describe('audit payloads', () => {
	it('records allowed identifiers by value', () => {
		expect(auditPayload({ id: '42', limit: 10 }, ['id', 'limit'])).toEqual({
			id: '42',
			limit: 10,
		});
	});

	/**
	 * The one place caller-supplied text could reach durable storage.
	 */
	it('records personal data as field names only', () => {
		const payload = auditPayload(
			{
				id: '42',
				email: 'someone@example.com',
				firstName: 'Ada',
				phone: '+15550100',
			},
			['id'],
		);
		expect(payload).toEqual({
			id: '42',
			fields: ['email', 'firstName', 'phone'],
		});
		const serialised = JSON.stringify(payload);
		expect(serialised).not.toContain('someone@example.com');
		expect(serialised).not.toContain('Ada');
		expect(serialised).not.toContain('+15550100');
	});

	it('drops undefined keys rather than listing them', () => {
		expect(auditPayload({ id: '1', email: undefined }, ['id'])).toEqual({
			id: '1',
		});
	});

	it('records a returned count for list operations', () => {
		expect(listAuditPayload({ limit: 5 }, ['limit'], 3)).toEqual({
			limit: 5,
			returnedCount: 3,
		});
	});
});
