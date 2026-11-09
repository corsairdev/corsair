/**
 * Live OneDesk tests. The reads run when `ONEDESK_API_KEY` is set; the writes
 * additionally need `ONEDESK_ALLOW_WRITES=1`. Both are skipped rather than
 * failed when unset, so CI stays green without credentials.
 *
 * Splitting the two matters: the default `test` command runs this file, so a
 * key present in the environment would otherwise let a test change the account.
 * The one write test creates its own project and leaves it behind, so no
 * existing record is ever touched.
 *
 * A self-hosted or white-label account also needs `ONEDESK_HOST`; the plugin
 * defaults to https://app.onedesk.com.
 *
 * Run with:
 *   ONEDESK_API_KEY=... [ONEDESK_HOST=...] \
 *     pnpm --filter @corsair-dev/onedesk test:live
 * and add `ONEDESK_ALLOW_WRITES=1` to include the write test.
 */

import { makeOnedeskRequest } from './client';
import { OnedeskEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.ONEDESK_API_KEY ?? '';
const LIVE_HOST = process.env.ONEDESK_HOST;

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

/**
 * Writes are opt-in twice over: a key **and** `ONEDESK_ALLOW_WRITES=1`. A key
 * alone must never change an account, because the default `test` command runs
 * this file whenever the key happens to be in the environment.
 */
const ALLOW_WRITES = process.env.ONEDESK_ALLOW_WRITES === '1';
const describeWrites = ALLOW_WRITES ? describeLive : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'ONEDESK_API_KEY is not set: the live OneDesk suite is skipped.',
	);
} else if (!LIVE_HOST) {
	console.warn(
		'ONEDESK_HOST is not set: the live OneDesk suite calls https://app.onedesk.com.',
	);
}

const options = { host: LIVE_HOST };

describeLive('OneDesk live API', () => {
	it('reads the organization item types', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'GET', path: '/organization/itemTypes' },
			options,
		);
		const out = OnedeskEndpointOutputSchemas.organizationItemTypes.parse(raw);

		expect(out.code).toBe('SUCCESS');
		expect(Array.isArray(out.data)).toBe(true);
	});

	it('reads the organization user types', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'GET', path: '/organization/userTypes' },
			options,
		);
		const out = OnedeskEndpointOutputSchemas.organizationUserTypes.parse(raw);

		expect(out.code).toBe('SUCCESS');
	});

	it('reads the organization lifecycle statuses', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'GET', path: '/organization/lifecycleStatus' },
			options,
		);
		const out =
			OnedeskEndpointOutputSchemas.organizationLifecycleStatus.parse(raw);

		expect(out.code).toBe('SUCCESS');
		expect(Array.isArray(out.data)).toBe(true);
	});

	it('reads the organization profile', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'GET', path: '/organization/profileAndPolicy' },
			options,
		);
		expect(
			OnedeskEndpointOutputSchemas.organizationProfile.parse(raw).code,
		).toBe('SUCCESS');
	});

	it('filters users, which is a POST read', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'POST', path: '/users/filter', body: { limit: 5 } },
			options,
		);
		const shaped = { ...(raw as object), nextOffset: null };
		const out = OnedeskEndpointOutputSchemas.usersFilter.parse(shaped);

		expect(out.code).toBe('SUCCESS');
		expect(Array.isArray(out.data)).toBe(true);
	});

	it('filters projects', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'POST', path: '/projects/filter', body: { limit: 5 } },
			options,
		);
		const shaped = { ...(raw as object), nextOffset: null };
		expect(OnedeskEndpointOutputSchemas.projectsFilter.parse(shaped).code).toBe(
			'SUCCESS',
		);
	});

	it('filters items, whose itemType must be an array', async () => {
		// A bare string is a 400: the API rejects it before reading anything.
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: '/items/filter',
				body: { itemType: ['Problem'], limit: 5 },
			},
			options,
		);
		const shaped = { ...(raw as object), nextOffset: null };
		const out = OnedeskEndpointOutputSchemas.itemsFilter.parse(shaped);

		expect(out.code).toBe('SUCCESS');
		expect(Array.isArray(out.data)).toBe(true);
	});

	it('rejects a bare-string itemType', async () => {
		await expect(
			makeOnedeskRequest(
				LIVE_KEY,
				{
					method: 'POST',
					path: '/items/filter',
					body: { itemType: 'Problem', limit: 5 },
				},
				options,
			),
		).rejects.toThrow(/HTTP 400/);
	});

	it('filters items with details', async () => {
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: '/items/filter/details',
				body: { itemType: ['Problem'], limit: 5 },
			},
			options,
		);
		const shaped = { ...(raw as object), nextOffset: null };
		expect(
			OnedeskEndpointOutputSchemas.itemsFilterDetails.parse(shaped).code,
		).toBe('SUCCESS');
	});

	it('rejects a key that does not exist', async () => {
		await expect(
			makeOnedeskRequest(
				'definitely-not-a-key',
				{ method: 'GET', path: '/organization/itemTypes' },
				options,
			),
		).rejects.toThrow(/rejected the API key|HTTP 401/);
	});
});

describeWrites('OneDesk live API: writes (opt-in)', () => {
	it('creates a disposable project, renames it, and reports the bare code', async () => {
		// A project this test created itself, so no existing record is touched.
		const created = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: '/projects/',
				body: { name: `Corsair live test ${Date.now()}` },
			},
			options,
		);
		const projectId = (created as { data?: string }).data;

		expect(typeof projectId).toBe('string');
		if (!projectId) return;

		// An update answers a bare code string, not an object; the plugin turns
		// it into { code }.
		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: `/projects/externalId/${projectId}`,
				body: { name: `Corsair live test renamed ${Date.now()}` },
			},
			options,
		);

		expect(typeof raw).toBe('string');
		expect(raw).toBe('SUCCESS');

		// The public API has no delete for a project, so archiving is the
		// closest to cleanup: it takes the record out of the active lists.
		const archived = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: `/projects/externalId/${projectId}`,
				body: { archived: true },
			},
			options,
		);
		expect(archived).toBe('SUCCESS');
	});
});
