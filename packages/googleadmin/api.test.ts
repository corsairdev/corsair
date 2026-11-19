/**
 * Live tests against the Directory API. CI has no token, so they skip.
 *
 * Environment:
 * - GOOGLE_ADMIN_ACCESS_TOKEN (required): an OAuth access token for a super
 *   administrator of a Google Workspace account, with the scopes the plugin
 *   asks for. Without it every test here skips.
 * - GOOGLE_ADMIN_DOMAIN (optional): narrows the user list to one domain and
 *   is the domain the throwaway group is created in. Without it the reads ask
 *   for `my_customer` and the group goes in the account's primary domain.
 * - GOOGLE_ADMIN_LIVE_WRITES=1 (optional): also runs the write tests. They
 *   only create and then delete a throwaway group (with one alias and one
 *   membership) and a throwaway organizational unit, all named
 *   `corsair-live-test-<random>`. They never create, change or delete a user:
 *   a new user can take a paid Workspace licence. Before creating anything
 *   they check the name is free and stop if it is taken, and cleanup runs in
 *   `finally`, deleting only what this run created.
 *
 * Run from packages/googleadmin:
 *   GOOGLE_ADMIN_ACCESS_TOKEN=... GOOGLE_ADMIN_LIVE_WRITES=1 pnpm test:live
 *
 * The Directory API allows 2,400 queries per minute per user by default; the
 * whole suite makes about 30 calls.
 */
import { ApiError } from 'corsair/http';
import { GoogleAdminEndpointOutputSchemas } from './endpoints/types';
import type { GoogleAdminContext } from './index';
import { googleadmin } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_ADMIN_ACCESS_TOKEN?.trim();
const DOMAIN = process.env.GOOGLE_ADMIN_DOMAIN?.trim();
const WRITES = process.env.GOOGLE_ADMIN_LIVE_WRITES?.trim() === '1';
const describeLive = TOKEN ? describe : describe.skip;
const describeWrites = TOKEN && WRITES ? describe : describe.skip;

if (!TOKEN) {
	console.warn(
		'[googleadmin] skipping live tests: GOOGLE_ADMIN_ACCESS_TOKEN is not set',
	);
} else if (!WRITES) {
	console.warn(
		'[googleadmin] skipping live write tests: set GOOGLE_ADMIN_LIVE_WRITES=1 to run them',
	);
}

const api = googleadmin().endpoints!;

// unknown: the endpoints read only `key` from the context, which is the one
// thing this suite supplies; there is no database or key manager here.
const ctx = { key: TOKEN ?? '' } as unknown as GoogleAdminContext;

const CUSTOMER = 'my_customer';

function isNotFound(
	error: unknown, // unknown: a caught value can be anything at runtime.
): boolean {
	return error instanceof ApiError && error.status === 404;
}

/** True when the call succeeds, false on a 404; anything else is rethrown. */
async function exists(lookup: () => Promise<unknown>): Promise<boolean> {
	// unknown: the lookup's result is not read, only whether it succeeded.
	try {
		await lookup();
		return true;
	} catch (error) {
		if (isNotFound(error)) return false;
		throw error;
	}
}

/**
 * Retries a call that can 404 for a few seconds after the resource it targets
 * was created, while Google propagates the create.
 */
async function eventually<T>(run: () => Promise<T>): Promise<T> {
	for (let attempt = 1; ; attempt++) {
		try {
			return await run();
		} catch (error) {
			if (!isNotFound(error) || attempt >= 6) throw error;
			await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
		}
	}
}

/** Runs every cleanup step, then fails with the first error, if any. */
async function cleanUp(steps: Array<() => Promise<void>>): Promise<void> {
	let first: unknown; // unknown: whatever the first failed step threw.
	for (const step of steps) {
		try {
			await step();
		} catch (error) {
			// A 404 means it is already gone, which is what cleanup wants.
			if (!isNotFound(error) && first === undefined) first = error;
		}
	}
	if (first !== undefined) throw first;
}

function throwawayName(): string {
	return `corsair-live-test-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

describeLive('googleadmin live API: reads', () => {
	jest.setTimeout(60_000);

	it('customers.get and domains.list describe the account', async () => {
		const customer = await api.customers.get(ctx, { customerKey: CUSTOMER });
		expect(typeof customer.id).toBe('string');

		const { domains } = await api.domains.list(ctx, { customer: CUSTOMER });
		expect(Array.isArray(domains)).toBe(true);
		const primary = domains?.find((domain) => domain.isPrimary);
		expect(typeof primary?.domainName).toBe('string');

		const one = await api.domains.get(ctx, {
			customer: CUSTOMER,
			domainName: primary!.domainName!,
		});
		expect(one.domainName).toBe(primary!.domainName);

		// An account can have no domain aliases; the call must still parse.
		const aliases = await api.domains.aliases.list(ctx, { customer: CUSTOMER });
		expect(Array.isArray(aliases.domainAliases ?? [])).toBe(true);
	});

	it('users.list, users.get and users.aliases.list agree on a user', async () => {
		const page = await api.users.list(ctx, {
			...(DOMAIN ? { domain: DOMAIN } : { customer: CUSTOMER }),
			maxResults: 10,
			projection: 'basic',
		});

		// `users` is absent on an empty page, which is still a valid answer.
		const users = page.users ?? [];
		expect(Array.isArray(users)).toBe(true);
		for (const user of users) {
			expect(typeof user.id).toBe('string');
			expect(typeof user.primaryEmail).toBe('string');
		}
		expect(page.nextPageToken ?? undefined).not.toBe('');
		expect(
			GoogleAdminEndpointOutputSchemas.usersList.safeParse(page).success,
		).toBe(true);

		const first = users[0];
		if (!first) return;
		const user = await api.users.get(ctx, { userKey: first.id });
		expect(user.id).toBe(first.id);
		const aliases = await api.users.aliases.list(ctx, { userKey: first.id });
		expect(Array.isArray(aliases.aliases ?? [])).toBe(true);
	});

	it('groups.list pages and members.list reads the first group', async () => {
		const page = await api.groups.list(ctx, {
			...(DOMAIN ? { domain: DOMAIN } : { customer: CUSTOMER }),
			maxResults: 5,
		});
		const groups = page.groups ?? [];
		expect(Array.isArray(groups)).toBe(true);

		const first = groups[0];
		if (!first?.id) return;
		const members = await api.members.list(ctx, {
			groupKey: first.id,
			maxResults: 5,
		});
		expect(Array.isArray(members.members ?? [])).toBe(true);
		for (const member of members.members ?? []) {
			expect(typeof member.role).toBe('string');
			expect(typeof member.type).toBe('string');
		}
		const aliases = await api.groups.aliases.list(ctx, { groupKey: first.id });
		expect(Array.isArray(aliases.aliases ?? [])).toBe(true);
	});

	it('orgUnits.list returns every unit', async () => {
		const units = await api.orgUnits.list(ctx, {
			customerId: CUSTOMER,
			type: 'all',
		});
		expect(Array.isArray(units.organizationUnits ?? [])).toBe(true);
		for (const unit of units.organizationUnits ?? []) {
			expect(typeof unit.orgUnitPath).toBe('string');
		}
	});
});

describeWrites('googleadmin live API: throwaway writes', () => {
	jest.setTimeout(180_000);

	async function groupDomain(): Promise<string> {
		if (DOMAIN) return DOMAIN;
		const { domains } = await api.domains.list(ctx, { customer: CUSTOMER });
		const primary = domains?.find((domain) => domain.isPrimary)?.domainName;
		if (!primary) throw new Error('the account has no primary domain');
		return primary;
	}

	it('creates, updates and deletes a throwaway group with an alias and a member', async () => {
		const domain = await groupDomain();
		const name = throwawayName();
		const email = `${name}@${domain}`;
		const alias = `${name}-alias@${domain}`;

		// Refuse to touch anything that already exists under either address.
		for (const address of [email, alias]) {
			expect(
				await exists(() => api.groups.get(ctx, { groupKey: address })),
			).toBe(false);
			expect(await exists(() => api.users.get(ctx, { userKey: address }))).toBe(
				false,
			);
		}

		// The member is an existing user, added to the new group only; the user
		// itself is never changed.
		const users = await api.users.list(ctx, {
			...(DOMAIN ? { domain: DOMAIN } : { customer: CUSTOMER }),
			maxResults: 1,
		});
		const memberEmail = users.users?.[0]?.primaryEmail;

		let groupId: string | undefined;
		let aliasAdded = false;
		let memberAdded = false;
		try {
			const created = await api.groups.insert(ctx, {
				email,
				name,
				description: 'Corsair live test, deleted by the same run',
			});
			groupId = created.id ?? undefined;
			expect(created.email).toBe(email);
			expect(typeof groupId).toBe('string');
			const key = groupId!;

			const updated = await eventually(() =>
				api.groups.update(ctx, {
					groupKey: key,
					description: 'Corsair live test, updated',
				}),
			);
			expect(updated.description).toBe('Corsair live test, updated');

			const addedAlias = await eventually(() =>
				api.groups.aliases.insert(ctx, { groupKey: key, alias }),
			);
			aliasAdded = true;
			expect(addedAlias.alias).toBe(alias);

			if (memberEmail) {
				const member = await eventually(() =>
					api.members.insert(ctx, {
						groupKey: key,
						email: memberEmail,
						role: 'MEMBER',
					}),
				);
				memberAdded = true;
				expect(member.role).toBe('MEMBER');
				expect(member.type).toBe('USER');

				const has = await api.members.hasMember(ctx, {
					groupKey: key,
					memberKey: memberEmail,
				});
				expect(has.isMember).toBe(true);

				// A delivery change goes through the PUT and keeps the role.
				const changed = await api.members.update(ctx, {
					groupKey: key,
					memberKey: memberEmail,
					delivery_settings: 'DIGEST',
				});
				expect(changed.role).toBe('MEMBER');
				const reread = await api.members.get(ctx, {
					groupKey: key,
					memberKey: memberEmail,
				});
				expect(reread.delivery_settings).toBe('DIGEST');
			}
		} finally {
			await cleanUp([
				async () => {
					if (groupId && memberEmail && memberAdded) {
						await api.members.delete(ctx, {
							groupKey: groupId,
							memberKey: memberEmail,
						});
					}
				},
				async () => {
					if (groupId && aliasAdded) {
						await api.groups.aliases.delete(ctx, { groupKey: groupId, alias });
					}
				},
				async () => {
					// If the insert failed after Google created the group (a lost or
					// unparsable response), groupId is unset. The address is unique to
					// this run and was checked free before the insert, so whatever sits
					// there now came from this run: delete by address. A 404 is fine.
					await api.groups.delete(ctx, { groupKey: groupId ?? email });
				},
			]);
		}

		expect(
			await exists(() => api.groups.get(ctx, { groupKey: groupId! })),
		).toBe(false);
	});

	it('creates, updates and deletes a throwaway organizational unit', async () => {
		const name = throwawayName();

		// Refuse to touch a unit that already exists at this path.
		expect(
			await exists(() =>
				api.orgUnits.get(ctx, { customerId: CUSTOMER, orgUnitPath: name }),
			),
		).toBe(false);

		try {
			const unit = await api.orgUnits.insert(ctx, {
				customerId: CUSTOMER,
				name,
				parentOrgUnitPath: '/',
				description: 'Corsair live test, deleted by the same run',
			});
			expect(unit.orgUnitPath).toBe(`/${name}`);

			const updated = await eventually(() =>
				api.orgUnits.update(ctx, {
					customerId: CUSTOMER,
					orgUnitPath: name,
					description: 'Corsair live test, updated',
				}),
			);
			expect(updated.description).toBe('Corsair live test, updated');

			const read = await api.orgUnits.get(ctx, {
				customerId: CUSTOMER,
				orgUnitPath: name,
			});
			expect(read.name).toBe(name);
		} finally {
			await cleanUp([
				async () => {
					// Same reasoning: the path is unique to this run and was checked
					// free first, so delete it even when the insert's reply was lost.
					// A 404 means nothing was created.
					await api.orgUnits.delete(ctx, {
						customerId: CUSTOMER,
						orgUnitPath: name,
					});
				},
			]);
		}
	});
});
