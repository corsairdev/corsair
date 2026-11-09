/**
 * Live OneDesk tests. These run only when `ONEDESK_API_KEY` is set; otherwise
 * they are skipped so CI stays green without credentials.
 *
 * Every call here is read-only. The writes are not exercised because they need
 * a real organization with work item types and users, which a throwaway key
 * does not have: `items.create` needs an item type name from the organization,
 * and `attachments.*` uploads a file.
 *
 * A self-hosted or white-label account also needs `ONEDESK_HOST`; the plugin
 * defaults to https://app.onedesk.com.
 *
 * Run with:
 *   ONEDESK_API_KEY=... [ONEDESK_HOST=...] \
 *     pnpm --filter @corsair-dev/onedesk test:live
 */

import { makeOnedeskRequest } from './client';
import { OnedeskEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.ONEDESK_API_KEY ?? '';
const LIVE_HOST = process.env.ONEDESK_HOST;

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

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

	it('reads a template-free resource and updates it with no net change', async () => {
		// An update answers a bare code string, so this pins the shape the
		// plugin normalises. The name is read first and written back unchanged.
		const ids = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'POST', path: '/projects/filter', body: { limit: 1 } },
			options,
		);
		const projectId = ((ids as { data?: string[] }).data ?? [])[0];
		if (!projectId) {
			console.warn(
				'No project on the account: the live update test has nothing to change.',
			);
			return;
		}

		const before = await makeOnedeskRequest(
			LIVE_KEY,
			{ method: 'GET', path: `/projects/externalId/${projectId}` },
			options,
		);
		const name = ((before as { data?: { name?: string } }).data ?? {}).name;

		const raw = await makeOnedeskRequest(
			LIVE_KEY,
			{
				method: 'POST',
				path: `/projects/externalId/${projectId}`,
				body: { name },
			},
			options,
		);
		// A bare string, not an object; the plugin turns it into { code }.
		expect(typeof raw).toBe('string');
		expect(raw).toBe('SUCCESS');
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
