import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { googlecontacts } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const PERSON = {
	resourceName: 'people/c1',
	etag: 'etag-1',
	names: [
		{ displayName: 'Ada Lovelace', givenName: 'Ada', familyName: 'Lovelace' },
	],
	emailAddresses: [
		{ value: 'secondary@example.com' },
		{ value: 'ada@example.com', metadata: { primary: true } },
	],
	phoneNumbers: [{ value: '+15551234567', metadata: { primary: true } }],
	organizations: [{ name: 'Analytical Engines', title: 'Mathematician' }],
	photos: [{ url: 'https://example.com/ada.jpg' }],
};

describe('Google Contacts plugin', () => {
	const plugin = googlecontacts() as any;
	const upsertContact = jest.fn();
	const deleteContact = jest.fn();
	const findContact = jest.fn();
	const upsertGroup = jest.fn();
	const deleteGroup = jest.fn();
	const findGroup = jest.fn();
	const ctx = {
		key: 'test-token',
		db: {
			contacts: {
				upsertByEntityId: upsertContact,
				deleteByEntityId: deleteContact,
				findByEntityId: findContact,
			},
			contactGroups: {
				upsertByEntityId: upsertGroup,
				deleteByEntityId: deleteGroup,
				findByEntityId: findGroup,
			},
		},
	} as any;

	beforeEach(() => {
		mockRequest.mockReset();
		(logEventFromContext as jest.Mock).mockClear();
		upsertContact.mockReset().mockResolvedValue({ id: 'entity-1' });
		deleteContact.mockReset().mockResolvedValue(undefined);
		findContact.mockReset().mockResolvedValue(null);
		upsertGroup.mockReset().mockResolvedValue({ id: 'entity-2' });
		deleteGroup.mockReset().mockResolvedValue(undefined);
		findGroup.mockReset().mockResolvedValue(null);
	});

	function lastCall() {
		return mockRequest.mock.calls[0]?.[1] as any;
	}

	function lastBase() {
		return (mockRequest.mock.calls[0]?.[0] as any).BASE;
	}

	describe('contacts.list', () => {
		it('GETs connections with comma-joined personFields', async () => {
			mockRequest.mockResolvedValueOnce({ connections: [PERSON] });

			const result = await plugin.endpoints.contacts.list(ctx, {
				personFields: ['names', 'emailAddresses'],
				pageSize: 50,
			});

			expect(lastBase()).toBe('https://people.googleapis.com/v1');
			expect(lastCall().url).toBe('/people/me/connections');
			expect(lastCall().method).toBe('GET');
			expect(lastCall().query.personFields).toBe('names,emailAddresses');
			expect(lastCall().query.pageSize).toBe(50);
			expect(result.connections).toHaveLength(1);
		});

		it('falls back to default personFields when none are given', async () => {
			mockRequest.mockResolvedValueOnce({ connections: [] });

			await plugin.endpoints.contacts.list(ctx, {});

			expect(lastCall().query.personFields).toBe(
				'names,emailAddresses,phoneNumbers',
			);
		});

		it('passes sync tokens through for incremental reads', async () => {
			mockRequest.mockResolvedValueOnce({
				connections: [],
				nextSyncToken: 'st',
			});

			const result = await plugin.endpoints.contacts.list(ctx, {
				requestSyncToken: true,
				syncToken: 'previous',
			});

			expect(lastCall().query.requestSyncToken).toBe(true);
			expect(lastCall().query.syncToken).toBe('previous');
			expect(result.nextSyncToken).toBe('st');
		});

		it('stores the primary email and phone, not merely the first', async () => {
			mockRequest.mockResolvedValueOnce({ connections: [PERSON] });

			await plugin.endpoints.contacts.list(ctx, {
				personFields: [
					'names',
					'emailAddresses',
					'phoneNumbers',
					'organizations',
				],
			});

			expect(upsertContact).toHaveBeenCalledWith(
				'people/c1',
				expect.objectContaining({
					primaryEmail: 'ada@example.com',
					primaryPhone: '+15551234567',
					displayName: 'Ada Lovelace',
					organization: 'Analytical Engines',
					jobTitle: 'Mathematician',
				}),
			);
		});

		it('leaves fields the caller never asked for out of the written row', async () => {
			mockRequest.mockResolvedValueOnce({ connections: [PERSON] });

			await plugin.endpoints.contacts.list(ctx, { personFields: ['names'] });

			const row = upsertContact.mock.calls[0][1];
			expect(row.displayName).toBe('Ada Lovelace');
			expect(row).not.toHaveProperty('primaryEmail');
			expect(row).not.toHaveProperty('organization');
		});
	});

	describe('contacts.get', () => {
		it('GETs the resource name verbatim', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			const result = await plugin.endpoints.contacts.get(ctx, {
				resourceName: 'people/me',
			});

			expect(lastCall().url).toBe('/people/me');
			expect(result.resourceName).toBe('people/c1');
			expect(upsertContact).toHaveBeenCalledTimes(1);
		});
	});

	describe('contacts.search', () => {
		it('GETs searchContacts and persists matched people', async () => {
			mockRequest.mockResolvedValueOnce({ results: [{ person: PERSON }] });

			const result = await plugin.endpoints.contacts.search(ctx, {
				query: 'ada',
				pageSize: 10,
			});

			expect(lastCall().url).toBe('/people:searchContacts');
			expect(lastCall().query.query).toBe('ada');
			expect(result.results).toHaveLength(1);
			expect(upsertContact).toHaveBeenCalledTimes(1);
		});

		it('tolerates a result row with no person', async () => {
			mockRequest.mockResolvedValueOnce({ results: [{}] });

			await plugin.endpoints.contacts.search(ctx, { query: 'nobody' });

			expect(upsertContact).not.toHaveBeenCalled();
		});
	});

	describe('contacts.create', () => {
		it('POSTs the writable person fields', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.contacts.create(ctx, {
				person: { names: [{ givenName: 'Ada' }] },
			});

			expect(lastCall().url).toBe('/people:createContact');
			expect(lastCall().method).toBe('POST');
			expect(lastCall().body).toEqual({ names: [{ givenName: 'Ada' }] });
		});
	});

	describe('contacts.update', () => {
		it('PATCHes with the etag in the body and the mask in the query', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.contacts.update(ctx, {
				resourceName: 'people/c1',
				etag: 'etag-1',
				person: { emailAddresses: [{ value: 'new@example.com' }] },
				updatePersonFields: ['emailAddresses'],
			});

			expect(lastCall().url).toBe('/people/c1:updateContact');
			expect(lastCall().method).toBe('PATCH');
			expect(lastCall().body.etag).toBe('etag-1');
			expect(lastCall().query.updatePersonFields).toBe('emailAddresses');
		});
	});

	describe('contacts.delete', () => {
		it('DELETEs and evicts the cached row', async () => {
			mockRequest.mockResolvedValueOnce(undefined);

			await plugin.endpoints.contacts.delete(ctx, {
				resourceName: 'people/c1',
			});

			expect(lastCall().url).toBe('/people/c1:deleteContact');
			expect(lastCall().method).toBe('DELETE');
			expect(deleteContact).toHaveBeenCalledWith('people/c1');
		});
	});

	describe('contact photos', () => {
		it('unwraps the person from an updateContactPhoto response', async () => {
			mockRequest.mockResolvedValueOnce({ person: PERSON });

			const result = await plugin.endpoints.contacts.updatePhoto(ctx, {
				resourceName: 'people/c1',
				photoBytes: 'aGk=',
			});

			expect(lastCall().url).toBe('/people/c1:updateContactPhoto');
			expect(lastCall().body.photoBytes).toBe('aGk=');
			expect(result.resourceName).toBe('people/c1');
		});

		it('unwraps the person from a deleteContactPhoto response', async () => {
			mockRequest.mockResolvedValueOnce({ person: PERSON });

			const result = await plugin.endpoints.contacts.deletePhoto(ctx, {
				resourceName: 'people/c1',
			});

			expect(lastCall().url).toBe('/people/c1:deleteContactPhoto');
			expect(lastCall().method).toBe('DELETE');
			expect(result.resourceName).toBe('people/c1');
		});
	});

	describe('otherContacts', () => {
		it('GETs otherContacts with only the fields Google serves for them', async () => {
			mockRequest.mockResolvedValueOnce({ otherContacts: [PERSON] });

			await plugin.endpoints.otherContacts.list(ctx, {});

			expect(lastCall().url).toBe('/otherContacts');
			expect(lastCall().query.readMask).toBe(
				'names,emailAddresses,phoneNumbers',
			);
		});

		it('passes sync tokens through, so tombstones can be evicted', async () => {
			mockRequest.mockResolvedValueOnce({
				otherContacts: [
					{ resourceName: 'otherContacts/gone', metadata: { deleted: true } },
				],
				nextSyncToken: 'st',
			});

			const result = await plugin.endpoints.otherContacts.list(ctx, {
				requestSyncToken: true,
				syncToken: 'previous',
			});

			expect(lastCall().query.requestSyncToken).toBe(true);
			expect(lastCall().query.syncToken).toBe('previous');
			expect(result.nextSyncToken).toBe('st');
			expect(deleteContact).toHaveBeenCalledWith('otherContacts/gone');
		});

		it('GETs otherContacts:search', async () => {
			mockRequest.mockResolvedValueOnce({ results: [{ person: PERSON }] });

			const result = await plugin.endpoints.otherContacts.search(ctx, {
				query: 'ada',
			});

			expect(lastCall().url).toBe('/otherContacts:search');
			expect(result.results).toHaveLength(1);
		});

		it('POSTs the copy with the three fields Google permits', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.otherContacts.copyToContacts(ctx, {
				resourceName: 'otherContacts/c9',
			});

			expect(lastCall().url).toBe(
				'/otherContacts/c9:copyOtherContactToMyContactsGroup',
			);
			expect(lastCall().body.copyMask).toBe(
				'names,emailAddresses,phoneNumbers',
			);
		});
	});

	describe('contactGroups', () => {
		const GROUP = {
			resourceName: 'contactGroups/g1',
			etag: 'g-etag',
			name: 'Friends',
			memberCount: 3,
		};

		it('GETs the group list and persists each group', async () => {
			mockRequest.mockResolvedValueOnce({ contactGroups: [GROUP] });

			const result = await plugin.endpoints.contactGroups.list(ctx, {});

			expect(lastCall().url).toBe('/contactGroups');
			expect(result.contactGroups).toHaveLength(1);
			expect(upsertGroup).toHaveBeenCalledWith(
				'contactGroups/g1',
				expect.objectContaining({ name: 'Friends', memberCount: 3 }),
			);
		});

		it('GETs a single group', async () => {
			mockRequest.mockResolvedValueOnce(GROUP);

			await plugin.endpoints.contactGroups.get(ctx, {
				resourceName: 'contactGroups/g1',
			});

			expect(lastCall().url).toBe('/contactGroups/g1');
		});

		it('POSTs a new group wrapped in contactGroup', async () => {
			mockRequest.mockResolvedValueOnce(GROUP);

			await plugin.endpoints.contactGroups.create(ctx, { name: 'Friends' });

			expect(lastCall().method).toBe('POST');
			expect(lastCall().body).toEqual({ contactGroup: { name: 'Friends' } });
		});

		it('PUTs a rename carrying the etag', async () => {
			mockRequest.mockResolvedValueOnce(GROUP);

			await plugin.endpoints.contactGroups.update(ctx, {
				resourceName: 'contactGroups/g1',
				etag: 'g-etag',
				name: 'Close Friends',
			});

			expect(lastCall().method).toBe('PUT');
			expect(lastCall().body.contactGroup.etag).toBe('g-etag');
		});

		it('DELETEs a group and evicts the cached row', async () => {
			mockRequest
				.mockResolvedValueOnce({ resourceName: 'contactGroups/g1' })
				.mockResolvedValueOnce(undefined);

			await plugin.endpoints.contactGroups.delete(ctx, {
				resourceName: 'contactGroups/g1',
				deleteContacts: true,
			});

			const call = mockRequest.mock.calls[1]?.[1] as any;
			expect(call.method).toBe('DELETE');
			expect(call.query.deleteContacts).toBe(true);
			expect(deleteGroup).toHaveBeenCalledWith('contactGroups/g1');
		});

		it('POSTs membership changes', async () => {
			mockRequest.mockResolvedValueOnce({ notFoundResourceNames: [] });

			const result = await plugin.endpoints.contactGroups.modifyMembers(ctx, {
				resourceName: 'contactGroups/g1',
				resourceNamesToAdd: ['people/c1'],
			});

			expect(lastCall().url).toBe('/contactGroups/g1/members:modify');
			expect(lastCall().body.resourceNamesToAdd).toEqual(['people/c1']);
			expect(result.notFoundResourceNames).toEqual([]);
		});
	});

	describe('sync persistence', () => {
		it('keeps unrequested fields from the row already stored', async () => {
			findContact.mockResolvedValue({
				data: {
					resourceName: 'people/c1',
					displayName: 'Ada Lovelace',
					primaryEmail: 'ada@example.com',
					organization: 'Analytical Engines',
					createdAt: new Date('2020-01-01'),
				},
			});
			mockRequest.mockResolvedValueOnce({
				results: [
					{
						person: {
							resourceName: 'people/c1',
							names: [{ displayName: 'Ada L.' }],
						},
					},
				],
			});

			await plugin.endpoints.contacts.search(ctx, {
				query: 'ada',
				readMask: ['names'],
			});

			const row = upsertContact.mock.calls[0][1];
			expect(row.displayName).toBe('Ada L.');
			expect(row.organization).toBe('Analytical Engines');
			expect(row.createdAt).toEqual(new Date('2020-01-01'));
		});

		it('clears a field the caller asked for and Google returned empty', async () => {
			findContact.mockResolvedValue({
				data: {
					resourceName: 'people/c1',
					displayName: 'Ada Lovelace',
					primaryEmail: 'ada@example.com',
					organization: 'Analytical Engines',
					createdAt: new Date('2020-01-01'),
				},
			});
			mockRequest.mockResolvedValueOnce({
				connections: [
					{
						resourceName: 'people/c1',
						names: [{ displayName: 'Ada Lovelace' }],
					},
				],
			});

			await plugin.endpoints.contacts.list(ctx, {
				personFields: ['names', 'emailAddresses'],
			});

			const row = upsertContact.mock.calls[0][1];
			expect(row.primaryEmail).toBeUndefined();
			expect(row.organization).toBe('Analytical Engines');
		});

		it('removes tombstoned contact groups', async () => {
			mockRequest.mockResolvedValueOnce({
				contactGroups: [
					{ resourceName: 'contactGroups/gone', metadata: { deleted: true } },
				],
			});

			await plugin.endpoints.contactGroups.list(ctx, { syncToken: 'prev' });

			expect(deleteGroup).toHaveBeenCalledWith('contactGroups/gone');
			expect(upsertGroup).not.toHaveBeenCalled();
		});

		it('removes tombstoned people instead of storing blank rows', async () => {
			mockRequest.mockResolvedValueOnce({
				connections: [
					{ resourceName: 'people/gone', metadata: { deleted: true } },
				],
			});

			await plugin.endpoints.contacts.list(ctx, { syncToken: 'prev' });

			expect(deleteContact).toHaveBeenCalledWith('people/gone');
			expect(upsertContact).not.toHaveBeenCalled();
		});

		it('evicts the source row after copying an other contact', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.otherContacts.copyToContacts(ctx, {
				resourceName: 'otherContacts/c9',
			});

			expect(deleteContact).toHaveBeenCalledWith('otherContacts/c9');
			expect(upsertContact).toHaveBeenCalledWith(
				'people/c1',
				expect.anything(),
			);
		});

		it('rejects a photo response that carries no person', async () => {
			mockRequest.mockResolvedValueOnce({});

			await expect(
				plugin.endpoints.contacts.deletePhoto(ctx, {
					resourceName: 'people/c1',
				}),
			).rejects.toThrow('returned no person');
		});
	});

	describe('review fixes', () => {
		it.each([
			['contacts.get', 'contacts', 'get', { resourceName: 'people/c1/../me' }],
			[
				'contacts.delete',
				'contacts',
				'delete',
				{ resourceName: 'people/c1?x=1' },
			],
			[
				'contactGroups.get',
				'contactGroups',
				'get',
				{ resourceName: 'people/c1' },
			],
			[
				'otherContacts.copyToContacts',
				'otherContacts',
				'copyToContacts',
				{ resourceName: 'contactGroups/abc' },
			],
		])(
			'%s refuses a resource name outside its collection',
			async (_name, group, op, input) => {
				await expect(plugin.endpoints[group][op](ctx, input)).rejects.toThrow(
					'Invalid',
				);
				expect(mockRequest).not.toHaveBeenCalled();
			},
		);

		it('keeps contact details out of the event log', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.contacts.create(ctx, {
				person: {
					names: [{ givenName: 'Ada' }],
					emailAddresses: [{ value: 'ada@example.com' }],
				},
			});

			const payload = (logEventFromContext as jest.Mock).mock.calls[0]?.[2];
			expect(payload).toEqual({ resourceName: 'people/c1' });
			expect(JSON.stringify(payload)).not.toContain('example.com');
		});

		it('keeps search queries out of the event log', async () => {
			mockRequest.mockResolvedValueOnce({ results: [] });

			await plugin.endpoints.contacts.search(ctx, { query: 'ada@example.com' });

			const payload = (logEventFromContext as jest.Mock).mock.calls[0]?.[2];
			expect(JSON.stringify(payload)).not.toContain('ada@example.com');
		});

		it('drops the submitted contact from a failed write error', async () => {
			mockRequest.mockRejectedValueOnce(
				new ApiError(
					{
						method: 'POST',
						url: '/people:createContact',
						body: { emailAddresses: [{ value: 'ada@example.com' }] },
					},
					{
						url: 'https://people.googleapis.com/v1/people:createContact',
						ok: false,
						status: 400,
						statusText: 'Bad Request',
						body: { error: { code: 400 } },
					},
					'Bad Request',
				),
			);

			const error = await plugin.endpoints.contacts
				.create(ctx, {
					person: { emailAddresses: [{ value: 'ada@example.com' }] },
				})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect(error.status).toBe(400);
			expect(error.request.body).toBeUndefined();
		});

		it('asks for photos when a photo changes and skips the letter avatar', async () => {
			mockRequest.mockResolvedValueOnce({
				person: {
					...PERSON,
					photos: [{ url: 'https://example.com/letter.png', default: true }],
				},
			});

			await plugin.endpoints.contacts.deletePhoto(ctx, {
				resourceName: 'people/c1',
			});

			expect(lastCall().query.personFields).toBe(
				'names,emailAddresses,phoneNumbers,photos',
			);
			const row = upsertContact.mock.calls[0]?.[1];
			expect(row).toHaveProperty('photoUrl', undefined);
		});

		it('reads the copied contact back with the default mask', async () => {
			mockRequest.mockResolvedValueOnce({
				...PERSON,
				resourceName: 'people/c9',
			});

			await plugin.endpoints.otherContacts.copyToContacts(ctx, {
				resourceName: 'otherContacts/c5',
			});

			expect(lastCall().body.readMask).toBe(
				'names,emailAddresses,phoneNumbers',
			);
		});

		it('keeps stored group fields that the groupFields mask left out', async () => {
			findGroup.mockResolvedValueOnce({
				data: {
					resourceName: 'contactGroups/abc',
					groupType: 'USER_CONTACT_GROUP',
					memberCount: 4,
					name: 'Old',
				},
			});
			mockRequest.mockResolvedValueOnce({
				resourceName: 'contactGroups/abc',
				name: 'New',
				formattedName: 'New',
			});

			await plugin.endpoints.contactGroups.get(ctx, {
				resourceName: 'contactGroups/abc',
				groupFields: ['name'],
			});

			const row = upsertGroup.mock.calls[0]?.[1];
			expect(row).toMatchObject({
				name: 'New',
				groupType: 'USER_CONTACT_GROUP',
				memberCount: 4,
			});
		});

		it('parses inputs before any request', async () => {
			await expect(
				plugin.endpoints.contacts.list(ctx, { personFields: [] }),
			).rejects.toThrow();
			await expect(
				plugin.endpoints.contacts.create(ctx, {
					person: { birthdays: [{ text: 'x' }] },
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('drops saved member rows when a group is deleted with its contacts', async () => {
			mockRequest
				.mockResolvedValueOnce({
					resourceName: 'contactGroups/abc',
					memberResourceNames: ['people/c1', 'people/c2'],
				})
				.mockResolvedValueOnce({});

			await plugin.endpoints.contactGroups.delete(ctx, {
				resourceName: 'contactGroups/abc',
				deleteContacts: true,
			});

			expect((mockRequest.mock.calls[0]?.[1] as any).method).toBe('GET');
			expect((mockRequest.mock.calls[1]?.[1] as any).method).toBe('DELETE');
			expect(deleteContact).toHaveBeenCalledWith('people/c1');
			expect(deleteContact).toHaveBeenCalledWith('people/c2');
			expect(deleteGroup).toHaveBeenCalledWith('contactGroups/abc');
		});

		it('declares no extra OAuth account fields', () => {
			expect(plugin.authConfig.oauth_2.account).toEqual([]);
		});

		it('drops the search term from a failed search error', async () => {
			mockRequest.mockRejectedValueOnce(
				new ApiError(
					{
						method: 'GET',
						url: '/people:searchContacts',
						query: { query: 'ada@example.com', readMask: 'names' },
					},
					{
						url: 'https://people.googleapis.com/v1/people:searchContacts?query=ada%40example.com&readMask=names',
						ok: false,
						status: 400,
						statusText: 'Bad Request',
						body: { error: { code: 400 } },
					},
					'Bad Request',
				),
			);

			const error = await plugin.endpoints.contacts
				.search(ctx, { query: 'ada@example.com' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect(JSON.stringify(error)).not.toContain('ada');
			expect(error.url).toContain('readMask=names');
		});

		it('keeps address keys it does not model on an update', async () => {
			mockRequest.mockResolvedValueOnce(PERSON);

			await plugin.endpoints.contacts.update(ctx, {
				resourceName: 'people/c1',
				etag: 'e',
				person: {
					addresses: [{ streetAddress: '1 Main St', poBox: 'PO 7' }],
				},
				updatePersonFields: ['addresses'],
			});

			expect(lastCall().body.addresses[0]).toEqual({
				streetAddress: '1 Main St',
				poBox: 'PO 7',
			});
		});

		it('does not stack its own 429 retries on top of core', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new Error('429'),
			);
			expect(result.maxRetries).toBe(0);
		});

		it('takes the token only from the stored OAuth connection', async () => {
			await expect(
				plugin.keyBuilder({ authType: 'api_key' }),
			).rejects.toThrow();
		});
	});

	describe('oauth config', () => {
		it('requests contacts plus the other-contacts read scope', () => {
			expect(plugin.oauthConfig.scopes).toEqual([
				'https://www.googleapis.com/auth/contacts',
				'https://www.googleapis.com/auth/contacts.other.readonly',
			]);
		});

		it('declares every endpoint in endpointMeta', () => {
			const paths = Object.entries(plugin.endpoints).flatMap(([group, ops]) =>
				Object.keys(ops as object).map((op) => `${group}.${op}`),
			);
			for (const path of paths) {
				expect(plugin.endpointMeta[path]).toBeDefined();
			}
			expect(paths).toHaveLength(17);
		});
	});
});
