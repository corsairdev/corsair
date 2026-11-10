import { createCorsair } from 'corsair/core';
import { missive, missiveEndpointSchemas } from './index';

// Payloads below are copied from the examples on
// https://missiveapp.com/docs/developers/rest-api/endpoints, not derived from
// the plugin's schemas, so a schema that disagrees with the reference fails.

const corsair = createCorsair({
	plugins: [missive({ key: 'missive_pat-test-token' })],
});
// Corsair's database/API result is a union; the tests call the HTTP API only.
const api = (
	corsair.missive as unknown as {
		api: Record<
			string,
			// unknown: handlers are looked up by name at runtime in this test.
			Record<string, (input: unknown) => Promise<unknown>>
		>;
	}
).api;

function mockResponse(response: Response) {
	return jest.spyOn(global, 'fetch').mockImplementation(async () => response);
}

describe('Missive request inputs', () => {
	const contact = {
		contact_book: '551b8675-11e9-49c3-aac0-01fb8510d862',
		first_name: 'Philippe',
		infos: [{ kind: 'email', label: 'home', value: 'p@missiveapp.com' }],
		memberships: [{ title: 'CEO', group: { kind: 'organization', name: 'M' } }],
	};

	it('requires contact_book on contacts.create and rejects unknown keys', () => {
		const schema = missiveEndpointSchemas['contacts.create'].input;
		expect(schema.safeParse({ body: [contact] }).success).toBe(true);
		const { contact_book: _book, ...withoutBook } = contact;
		expect(schema.safeParse({ body: [withoutBook] }).success).toBe(false);
		expect(
			schema.safeParse({ body: [{ ...contact, frist_name: 'typo' }] }).success,
		).toBe(false);
	});

	it('requires the contact id on contacts.update', () => {
		const schema = missiveEndpointSchemas['contacts.update'].input;
		expect(
			schema.safeParse({ ids: ['c1'], body: [{ last_name: 'Lehoux' }] })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({
				ids: ['c1'],
				body: [{ id: 'c1', last_name: 'Lehoux' }],
			}).success,
		).toBe(true);
	});

	it('keeps saved-response inputs strict and requires the id on update', () => {
		const create = missiveEndpointSchemas['responses.create'].input;
		expect(
			create.safeParse({
				body: [
					{
						title: 'Welcome',
						organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
						body: '<p>Hi</p>',
						attachments: [
							{ id: 'logo-img', filename: 'logo.png', base64_data: 'aGk=' },
						],
					},
				],
			}).success,
		).toBe(true);
		expect(
			create.safeParse({
				body: [{ titel: 'typo', organization: 'o1' }],
			}).success,
		).toBe(false);
		const update = missiveEndpointSchemas['responses.update'].input;
		expect(
			update.safeParse({ ids: ['r1'], body: [{ title: 'Updated' }] }).success,
		).toBe(false);
		expect(
			update.safeParse({ ids: ['r1'], body: [{ id: 'r1', title: 'Updated' }] })
				.success,
		).toBe(true);
	});

	it('accepts a subtask located by references instead of a conversation id', () => {
		const schema = missiveEndpointSchemas['tasks.create'].input;
		expect(
			schema.safeParse({
				body: {
					title: 'Follow up',
					subtask: true,
					references: ['<some-reference-123>'],
				},
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ body: { title: 'Follow up', subtask: true } }).success,
		).toBe(false);
	});
});
