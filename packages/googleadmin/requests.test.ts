jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import {
	BASE,
	currentFetch,
	emptyResponse,
	endpoints,
	googleError,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	queryOf,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const user = {
	id: '1029837465',
	primaryEmail: 'ada@example.com',
	name: { givenName: 'Ada', familyName: 'Lovelace' },
};

const group = {
	id: '03xcyz',
	email: 'eng@example.com',
	name: 'Engineering',
};

const member = {
	id: '103021',
	email: 'ada@example.com',
	role: 'MEMBER',
	type: 'USER',
};

const orgUnit = {
	orgUnitId: 'id:03ph8a2z',
	orgUnitPath: '/engineering',
	name: 'engineering',
};

const domain = { domainName: 'example.com', isPrimary: true };

const alias = { alias: 'ada.l@example.com', primaryEmail: 'ada@example.com' };

const photo = { photoData: 'aGVsbG8=', mimeType: 'image/png' };

describe('users', () => {
	it('sends the OAuth token as a bearer and no other auth header', async () => {
		mockFetch(jsonResponse({ users: [user] }));

		await endpoints.users.list(makeCtx(), { customer: 'my_customer' });

		expect(sentHeader('authorization')).toBe('Bearer test-token');
		expect(sentHeader('x-api-key')).toBeNull();
	});

	it('lists users with the customer and every filter as query parameters', async () => {
		mockFetch(jsonResponse({ users: [user], nextPageToken: 'tok' }));

		const result = await endpoints.users.list(makeCtx(), {
			customer: 'my_customer',
			query: 'email:ada*',
			maxResults: 50,
			pageToken: 'prev',
			orderBy: 'email',
			sortOrder: 'DESCENDING',
			projection: 'full',
			showDeleted: 'true',
			viewType: 'domain_public',
		});

		expect(lastCall().url).toContain(`${BASE}/users?`);
		expect(lastCall().init.method).toBe('GET');
		const query = queryOf(lastCall().url);
		expect(query.get('customer')).toBe('my_customer');
		expect(query.get('query')).toBe('email:ada*');
		expect(query.get('maxResults')).toBe('50');
		expect(query.get('pageToken')).toBe('prev');
		expect(query.get('orderBy')).toBe('email');
		expect(query.get('sortOrder')).toBe('DESCENDING');
		expect(query.get('projection')).toBe('full');
		expect(query.get('showDeleted')).toBe('true');
		expect(query.get('viewType')).toBe('domain_public');
		expect(result.nextPageToken).toBe('tok');
	});

	it('omits every unset filter rather than sending an empty value', async () => {
		mockFetch(jsonResponse({ users: [] }));

		await endpoints.users.list(makeCtx(), { domain: 'example.com' });

		expect(lastCall().url).toBe(`${BASE}/users?domain=example.com`);
	});

	it('reads a user by an encoded email and sends the projection', async () => {
		mockFetch(jsonResponse(user));

		const result = await endpoints.users.get(makeCtx(), {
			userKey: 'ada@example.com',
			projection: 'custom',
			customFieldMask: 'employee,location',
		});

		expect(lastCall().url).toContain(`${BASE}/users/ada%40example.com?`);
		expect(lastCall().init.method).toBe('GET');
		expect(queryOf(lastCall().url).get('customFieldMask')).toBe(
			'employee,location',
		);
		expect(result.primaryEmail).toBe('ada@example.com');
	});

	it('creates a user with the whole resource as the body', async () => {
		mockFetch(jsonResponse(user, { status: 200 }));

		await endpoints.users.insert(makeCtx(), {
			primaryEmail: 'ada@example.com',
			name: { givenName: 'Ada', familyName: 'Lovelace' },
			password: 'correct-horse-battery',
			orgUnitPath: '/engineering',
			changePasswordAtNextLogin: true,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/users`);
		expect(sentBody()).toEqual({
			primaryEmail: 'ada@example.com',
			name: { givenName: 'Ada', familyName: 'Lovelace' },
			password: 'correct-horse-battery',
			orgUnitPath: '/engineering',
			changePasswordAtNextLogin: true,
		});
	});

	it('accepts a crypt SHA-512 hash longer than the plain-password limit', async () => {
		// $6$ + 16-character salt + $ + 86-character digest = 106 characters.
		const hash = `$6$${'s'.repeat(16)}$${'h'.repeat(86)}`;
		expect(hash).toHaveLength(106);
		mockFetch(jsonResponse(user));
		mockFetch(jsonResponse(user));

		await endpoints.users.insert(makeCtx(), {
			primaryEmail: 'ada@example.com',
			name: { givenName: 'Ada', familyName: 'Lovelace' },
			password: hash,
			hashFunction: 'crypt',
		});
		await endpoints.users.update(makeCtx(), {
			userKey: 'ada@example.com',
			password: hash,
			hashFunction: 'crypt',
		});

		const calls = currentFetch().mock.calls;
		expect(JSON.parse(calls[0]![1].body).password).toBe(hash);
		expect(JSON.parse(calls[1]![1].body).password).toBe(hash);
	});

	it('refuses a plain password over 100 characters on insert and update', async () => {
		await expect(
			endpoints.users.insert(makeCtx(), {
				primaryEmail: 'ada@example.com',
				name: { givenName: 'Ada', familyName: 'Lovelace' },
				password: 'p'.repeat(101),
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		await expect(
			endpoints.users.update(makeCtx(), {
				userKey: 'ada@example.com',
				password: 'p'.repeat(101),
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('changes only the given name when update sends a partial name', async () => {
		mockFetch(
			jsonResponse({
				...user,
				name: { givenName: 'Liz', familyName: 'Lovelace' },
			}),
		);

		await endpoints.users.update(makeCtx(), {
			userKey: 'ada@example.com',
			name: { givenName: 'Liz' },
		});

		expect(sentBody()).toEqual({ name: { givenName: 'Liz' } });
	});

	it('keeps the password out of the ApiError a failed create throws', async () => {
		mockFetch(
			googleError(403, 'PERMISSION_DENIED', 'forbidden', 'Not Authorized'),
		);

		const error = await endpoints.users
			.insert(makeCtx(), {
				primaryEmail: 'ada@example.com',
				name: { givenName: 'Ada', familyName: 'Lovelace' },
				password: 'correct-horse-battery',
			})
			.catch((caught: Error) => caught);

		// Still core's ApiError with its status, so the handlers and the OAuth
		// refresh keep working.
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
		expect(JSON.stringify((error as ApiError).request)).not.toContain(
			'correct-horse-battery',
		);
		expect((error as ApiError).request.body).toBe('[REDACTED]');
	});

	it('keeps member emails out of the ApiError body and path', async () => {
		mockFetch(googleError(404, 'NOT_FOUND', 'notFound', 'Resource Not Found'));

		const error = (await endpoints.members
			.insert(makeCtx(), {
				groupKey: 'team@example.com',
				email: 'ada@example.com',
				role: 'MEMBER',
			})
			// `unknown` is necessary because a rejected promise carries no type; the cast below narrows it.
			.catch((caught: unknown) => caught)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		const retained = JSON.stringify({ request: error.request, url: error.url });
		expect(retained).not.toContain('ada@example.com');
		expect(retained).not.toContain('team%40example.com');
		expect(retained).not.toContain('team@example.com');
		expect(error.url).toContain('/members');
	});

	it('refuses a user list with neither customer nor domain', async () => {
		await expect(
			endpoints.users.list(makeCtx(), { maxResults: 10 }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('updates a user with a PUT and the key only in the path', async () => {
		mockFetch(jsonResponse(user));

		await endpoints.users.update(makeCtx(), {
			userKey: 'ada@example.com',
			suspended: true,
			orgUnitPath: '/contractors',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com`);
		expect(sentBody()).toEqual({
			suspended: true,
			orgUnitPath: '/contractors',
		});
	});

	it('deletes a user with a DELETE and an empty body', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.delete(makeCtx(), { userKey: 'ada@example.com' });

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com`);
		expect(lastCall().init.body).toBeUndefined();
	});

	it('undeletes a user by ID with the orgUnitPath in the body', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.undelete(makeCtx(), {
			userKey: '1029837465',
			orgUnitPath: '/engineering',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/users/1029837465/undelete`);
		expect(sentBody()).toEqual({ orgUnitPath: '/engineering' });
	});

	it('undeletes with an empty object when no unit is named', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.undelete(makeCtx(), { userKey: '1029837465' });

		expect(sentBody()).toEqual({});
	});

	it('makes a user an admin with the status in the body', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.makeAdmin(makeCtx(), {
			userKey: 'ada@example.com',
			status: true,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com/makeAdmin`);
		expect(sentBody()).toEqual({ status: true });
	});

	it('signs a user out with no request body', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.signOut(makeCtx(), { userKey: 'ada@example.com' });

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com/signOut`);
		expect(lastCall().init.body).toBeUndefined();
	});

	it("lists a user's aliases", async () => {
		mockFetch(jsonResponse({ aliases: [alias] }));

		const result = await endpoints.users.aliases.list(makeCtx(), {
			userKey: 'ada@example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com/aliases`);
		expect(result.aliases).toHaveLength(1);
	});

	it('adds an alias with the alias in the body', async () => {
		mockFetch(jsonResponse(alias));

		const result = await endpoints.users.aliases.insert(makeCtx(), {
			userKey: 'ada@example.com',
			alias: 'ada.l@example.com',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/users/ada%40example.com/aliases`);
		expect(sentBody()).toEqual({ alias: 'ada.l@example.com' });
		expect(result.alias).toBe('ada.l@example.com');
	});

	it('removes an alias with both keys encoded into the path', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.aliases.delete(makeCtx(), {
			userKey: 'ada@example.com',
			alias: 'ada.l@example.com',
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(
			`${BASE}/users/ada%40example.com/aliases/ada.l%40example.com`,
		);
	});

	it('reads a user photo', async () => {
		mockFetch(jsonResponse(photo));

		const result = await endpoints.users.photos.get(makeCtx(), {
			userKey: 'ada@example.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/users/ada%40example.com/photos/thumbnail`,
		);
		expect(result.photoData).toBe('aGVsbG8=');
	});

	it('replaces a user photo with a PUT', async () => {
		mockFetch(jsonResponse(photo));

		await endpoints.users.photos.update(makeCtx(), {
			userKey: 'ada@example.com',
			photoData: 'aGVsbG8=',
			mimeType: 'image/png',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({
			photoData: 'aGVsbG8=',
			mimeType: 'image/png',
		});
	});

	it('removes a user photo', async () => {
		mockFetch(emptyResponse());

		await endpoints.users.photos.delete(makeCtx(), {
			userKey: 'ada@example.com',
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(
			`${BASE}/users/ada%40example.com/photos/thumbnail`,
		);
	});
});

describe('groups', () => {
	it('refuses a group list with no customer, domain or userKey', async () => {
		await expect(endpoints.groups.list(makeCtx(), {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('lists the groups of one user without a customer', async () => {
		mockFetch(jsonResponse({ groups: [group] }));

		await endpoints.groups.list(makeCtx(), { userKey: 'ada@example.com' });

		expect(queryOf(lastCall().url).get('userKey')).toBe('ada@example.com');
	});

	it('lists groups with the domain and paging parameters', async () => {
		mockFetch(jsonResponse({ groups: [group] }));

		const result = await endpoints.groups.list(makeCtx(), {
			domain: 'example.com',
			maxResults: 200,
			orderBy: 'email',
			sortOrder: 'ASCENDING',
		});

		expect(lastCall().init.method).toBe('GET');
		const query = queryOf(lastCall().url);
		expect(query.get('domain')).toBe('example.com');
		expect(query.get('maxResults')).toBe('200');
		expect(query.get('orderBy')).toBe('email');
		expect(result.groups?.[0]?.email).toBe('eng@example.com');
	});

	it('lists the groups a user belongs to with userKey', async () => {
		mockFetch(jsonResponse({ groups: [] }));

		await endpoints.groups.list(makeCtx(), { userKey: 'ada@example.com' });

		expect(queryOf(lastCall().url).get('userKey')).toBe('ada@example.com');
	});

	it('reads a group by key', async () => {
		mockFetch(jsonResponse(group));

		const result = await endpoints.groups.get(makeCtx(), {
			groupKey: 'eng@example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/groups/eng%40example.com`);
		expect(result.name).toBe('Engineering');
	});

	it('creates a group with only the fields that were sent', async () => {
		mockFetch(jsonResponse(group));

		await endpoints.groups.insert(makeCtx(), {
			email: 'eng@example.com',
			name: 'Engineering',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/groups`);
		expect(sentBody()).toEqual({
			email: 'eng@example.com',
			name: 'Engineering',
		});
	});

	it('updates a group with a PATCH so an omitted name is preserved', async () => {
		mockFetch(jsonResponse(group));

		await endpoints.groups.update(makeCtx(), {
			groupKey: 'eng@example.com',
			description: 'Platform team',
		});

		// The PUT would be a replace, and the docs put patch semantics on PATCH.
		expect(lastCall().init.method).toBe('PATCH');
		expect(lastCall().url).toBe(`${BASE}/groups/eng%40example.com`);
		expect(sentBody()).toEqual({ description: 'Platform team' });
	});

	it('deletes a group', async () => {
		mockFetch(emptyResponse());

		await endpoints.groups.delete(makeCtx(), { groupKey: 'eng@example.com' });

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(`${BASE}/groups/eng%40example.com`);
	});

	it("lists a group's aliases", async () => {
		mockFetch(jsonResponse({ aliases: [] }));

		await endpoints.groups.aliases.list(makeCtx(), {
			groupKey: 'eng@example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/groups/eng%40example.com/aliases`);
	});

	it('adds a group alias', async () => {
		mockFetch(jsonResponse(alias));

		await endpoints.groups.aliases.insert(makeCtx(), {
			groupKey: 'eng@example.com',
			alias: 'engineering@example.com',
		});

		expect(sentBody()).toEqual({ alias: 'engineering@example.com' });
	});

	it('removes a group alias', async () => {
		mockFetch(emptyResponse());

		await endpoints.groups.aliases.delete(makeCtx(), {
			groupKey: 'eng@example.com',
			alias: 'engineering@example.com',
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(
			`${BASE}/groups/eng%40example.com/aliases/engineering%40example.com`,
		);
	});
});

describe('members', () => {
	it('lists members with the derived-membership and role filters', async () => {
		mockFetch(jsonResponse({ members: [member] }));

		const result = await endpoints.members.list(makeCtx(), {
			groupKey: 'eng@example.com',
			includeDerivedMembership: true,
			roles: 'OWNER,MANAGER',
			maxResults: 200,
			pageToken: 'tok',
		});

		const query = queryOf(lastCall().url);
		expect(query.get('includeDerivedMembership')).toBe('true');
		expect(query.get('roles')).toBe('OWNER,MANAGER');
		expect(query.get('maxResults')).toBe('200');
		expect(query.get('pageToken')).toBe('tok');
		expect(result.members?.[0]?.role).toBe('MEMBER');
	});

	it('reads one membership', async () => {
		mockFetch(jsonResponse(member));

		const result = await endpoints.members.get(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/groups/eng%40example.com/members/ada%40example.com`,
		);
		expect(result.id).toBe('103021');
	});

	it('asks hasMember and keeps the answer', async () => {
		mockFetch(jsonResponse({ isMember: true }));

		const result = await endpoints.members.hasMember(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/groups/eng%40example.com/hasMember/ada%40example.com`,
		);
		expect(result.isMember).toBe(true);
	});

	it('adds a member with the role and delivery preference', async () => {
		mockFetch(jsonResponse(member));

		await endpoints.members.insert(makeCtx(), {
			groupKey: 'eng@example.com',
			email: 'nina@example.com',
			role: 'MEMBER',
			delivery_settings: 'DAILY',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			email: 'nina@example.com',
			role: 'MEMBER',
			delivery_settings: 'DAILY',
		});
	});

	it('updates a membership with a PATCH so the delivery preference survives', async () => {
		mockFetch(jsonResponse({ ...member, role: 'OWNER' }));

		await endpoints.members.update(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
			role: 'OWNER',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(lastCall().url).toBe(
			`${BASE}/groups/eng%40example.com/members/ada%40example.com`,
		);
		expect(sentBody()).toEqual({ role: 'OWNER' });
	});

	it('changes the delivery preference with a PUT, keeping the current role', async () => {
		// members.patch does not take delivery_settings, so the plugin reads the
		// role and sends it back with the new preference on the PUT.
		mockFetch(jsonResponse({ ...member, role: 'MANAGER' }));
		mockFetch(
			jsonResponse({ ...member, role: 'MANAGER', delivery_settings: 'NONE' }),
		);

		const result = await endpoints.members.update(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
			delivery_settings: 'NONE',
		});

		const calls = currentFetch().mock.calls;
		expect(calls).toHaveLength(2);
		const url = `${BASE}/groups/eng%40example.com/members/ada%40example.com`;
		expect(String(calls[0]![0])).toBe(url);
		expect(calls[0]![1].method).toBe('GET');
		expect(String(calls[1]![0])).toBe(url);
		expect(calls[1]![1].method).toBe('PUT');
		expect(JSON.parse(calls[1]![1].body)).toEqual({
			role: 'MANAGER',
			delivery_settings: 'NONE',
		});
		expect(result.delivery_settings).toBe('NONE');
	});

	it('sends role and delivery preference in one PUT when both are given', async () => {
		mockFetch(
			jsonResponse({ ...member, role: 'OWNER', delivery_settings: 'DIGEST' }),
		);

		await endpoints.members.update(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
			role: 'OWNER',
			delivery_settings: 'DIGEST',
		});

		expect(currentFetch().mock.calls).toHaveLength(1);
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ role: 'OWNER', delivery_settings: 'DIGEST' });
	});

	it('removes a member', async () => {
		mockFetch(emptyResponse());

		await endpoints.members.delete(makeCtx(), {
			groupKey: 'eng@example.com',
			memberKey: 'ada@example.com',
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(
			`${BASE}/groups/eng%40example.com/members/ada%40example.com`,
		);
	});
});

describe('organizational units', () => {
	it('lists organizational units under a customer', async () => {
		mockFetch(jsonResponse({ organizationUnits: [orgUnit] }));

		const result = await endpoints.orgUnits.list(makeCtx(), {
			customerId: 'my_customer',
			type: 'allIncludingParent',
		});

		expect(lastCall().url).toContain(`${BASE}/customer/my_customer/orgunits?`);
		expect(queryOf(lastCall().url).get('type')).toBe('allIncludingParent');
		expect(result.organizationUnits?.[0]?.name).toBe('engineering');
	});

	it('reads a unit by its path and keeps the slashes unencoded', async () => {
		mockFetch(jsonResponse(orgUnit));

		await endpoints.orgUnits.get(makeCtx(), {
			customerId: 'my_customer',
			orgUnitPath: '/engineering/apps',
		});

		expect(lastCall().url).toBe(
			`${BASE}/customer/my_customer/orgunits/engineering/apps`,
		);
	});

	it('strips a leading slash before the path expansion', async () => {
		mockFetch(jsonResponse(orgUnit));

		await endpoints.orgUnits.get(makeCtx(), {
			customerId: 'my_customer',
			orgUnitPath: 'engineering',
		});

		expect(lastCall().url).toBe(
			`${BASE}/customer/my_customer/orgunits/engineering`,
		);
	});

	it('creates a unit under a parent path', async () => {
		mockFetch(jsonResponse(orgUnit));

		await endpoints.orgUnits.insert(makeCtx(), {
			customerId: 'my_customer',
			name: 'apps',
			parentOrgUnitPath: '/engineering',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(`${BASE}/customer/my_customer/orgunits`);
		expect(sentBody()).toEqual({
			name: 'apps',
			parentOrgUnitPath: '/engineering',
		});
	});

	it('updates a unit with a PATCH to its path', async () => {
		mockFetch(jsonResponse(orgUnit));

		await endpoints.orgUnits.update(makeCtx(), {
			customerId: 'my_customer',
			orgUnitPath: 'engineering/apps',
			description: 'Client apps',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(lastCall().url).toBe(
			`${BASE}/customer/my_customer/orgunits/engineering/apps`,
		);
		expect(sentBody()).toEqual({ description: 'Client apps' });
	});

	it('deletes a unit by its path', async () => {
		mockFetch(emptyResponse());

		await endpoints.orgUnits.delete(makeCtx(), {
			customerId: 'my_customer',
			orgUnitPath: 'engineering/apps',
		});

		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().url).toBe(
			`${BASE}/customer/my_customer/orgunits/engineering/apps`,
		);
	});
});

describe('domains and the customer', () => {
	it('lists domains without paging, which the API does not take', async () => {
		mockFetch(jsonResponse({ domains: [domain] }));

		const result = await endpoints.domains.list(makeCtx(), {
			customer: 'my_customer',
		});

		expect(lastCall().url).toBe(`${BASE}/customer/my_customer/domains`);
		expect(result.domains?.[0]?.isPrimary).toBe(true);
	});

	it('reads one domain by name', async () => {
		mockFetch(jsonResponse(domain));

		await endpoints.domains.get(makeCtx(), {
			customer: 'my_customer',
			domainName: 'example.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/customer/my_customer/domains/example.com`,
		);
	});

	it('lists domain aliases for one parent domain', async () => {
		mockFetch(jsonResponse({ domainAliases: [] }));

		await endpoints.domains.aliases.list(makeCtx(), {
			customer: 'my_customer',
			parentDomainName: 'example.com',
		});

		expect(lastCall().url).toContain(
			`${BASE}/customer/my_customer/domainaliases?`,
		);
		expect(queryOf(lastCall().url).get('parentDomainName')).toBe('example.com');
	});

	it('reads the customer record', async () => {
		mockFetch(jsonResponse({ id: 'C012345', customerDomain: 'example.com' }));

		const result = await endpoints.customers.get(makeCtx(), {
			customerKey: 'my_customer',
		});

		expect(lastCall().url).toBe(`${BASE}/customers/my_customer`);
		expect(result.customerDomain).toBe('example.com');
	});
});
