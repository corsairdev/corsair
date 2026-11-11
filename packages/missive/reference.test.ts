import { createCorsair } from 'corsair/core';
import { missive, missiveEndpointMeta, missiveEndpointSchemas } from './index';
import { MISSIVE_OPERATIONS } from './operations';
import { MissiveSchema } from './schema';

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

describe('Missive documented response shapes', () => {
	it('parses the List contacts example, whose custom info has no label', () => {
		const example = {
			contacts: [
				{
					id: 'b40713e2-e790-4c67-9eb3-22e83bd1bdf9',
					first_name: 'Alex',
					last_name: 'Alstorm',
					starred: false,
					contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
					deleted: false,
					modified_at: 1556200643,
					infos: [
						{
							kind: 'phone_number',
							label: 'work',
							value: '+1 (418) 717-1066',
						},
						{
							kind: 'custom',
							custom_label: 'Favorite food',
							value: 'Pizza',
						},
					],
					memberships: [
						{
							title: 'Project manager',
							group: {
								id: '522f8e19-0261-4f8b-b8b1-8d8bb4055569',
								kind: 'organization',
								name: 'Pagac Inc',
							},
						},
					],
				},
			],
		};
		for (const key of [
			'contacts.list',
			'contacts.create',
			'contacts.update',
			'contacts.get',
		] as const) {
			expect(
				missiveEndpointSchemas[key].output.safeParse(example).success,
			).toBe(true);
		}
	});

	it('keeps a contact whose info kind or label Missive adds later', () => {
		const result = missiveEndpointSchemas['contacts.list'].output.safeParse({
			contacts: [
				{
					id: 'c1',
					infos: [
						{ kind: 'linkedin', label: 'work', value: 'in/someone' },
						{ kind: 'email', label: 'school', value: 'a@b.co' },
					],
					memberships: [{ group: { kind: 'department', name: 'Ops' } }],
				},
			],
		});
		expect(result.success).toBe(true);
	});

	it('parses conversations whose shared_labels are objects', () => {
		// "shared_labels: Array of shared label objects on the conversation";
		// the Get a Message example shows [{ id, name }].
		const example = {
			conversations: [
				{
					id: '47a57b76-df42-4d8k-927x-80dbe5d87191',
					subject: null,
					team: {
						id: '2f618f9e-d3d4-4a01-b7d5-57124ab366b8',
						name: 'Hobbits',
						organization: '93e5e5d5-11a2-4c9b-80b8-94f3c08068cf',
					},
					shared_labels: [
						{ id: '146ff5c4-d5la-3b63-b994-76711fn790lq', name: 'Elfs' },
					],
					shared_label_names: 'Elfs',
				},
			],
		};
		for (const key of [
			'conversations.list',
			'conversations.get',
			'conversations.update',
			'conversations.merge',
		] as const) {
			expect(
				missiveEndpointSchemas[key].output.safeParse(example).success,
			).toBe(true);
		}
	});

	it('does not reject a list page for an enum value Missive adds later', () => {
		expect(
			missiveEndpointSchemas['tasks.list'].output.safeParse({
				tasks: [{ id: 't1', state: 'blocked', type: 'milestone' }],
			}).success,
		).toBe(true);
		expect(
			missiveEndpointSchemas['sharedLabels.list'].output.safeParse({
				shared_labels: [{ id: 'l1', visibility: 'team' }],
			}).success,
		).toBe(true);
		expect(
			missiveEndpointSchemas['teams.list'].output.safeParse({
				teams: [
					{
						id: 'team1',
						team_mention_behavior: 'nobody',
						user_reply_behavior: 'ask',
						received_reply_behavior: 'hide',
						team_sidebar_behavior: 'show_nothing',
					},
				],
			}).success,
		).toBe(true);
	});

	it('does not reject a list page for a null optional field', () => {
		expect(
			missiveEndpointSchemas['users.list'].output.safeParse({
				users: [{ id: 'u1', name: 'No Avatar', avatar_url: null }],
			}).success,
		).toBe(true);
		expect(
			missiveEndpointSchemas['conversations.listMessages'].output.safeParse({
				messages: [
					{
						id: 'm1',
						preview: null,
						to_fields: null,
						in_reply_to: null,
						attachments: null,
					},
				],
			}).success,
		).toBe(true);
	});
});

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

describe('Missive writes that answer without a JSON body', () => {
	it.each([
		['drafts', 'delete', { id: 'd1' }],
		['posts', 'delete', { id: 'p1' }],
		['hooks', 'delete', { id: 'h1' }],
		['responses', 'delete', { ids: ['r1', 'r2'] }],
	] as const)(
		'%s.%s resolves when the delete answers 200 with a body',
		async (group, name, input) => {
			for (const response of [
				new Response('', {
					status: 200,
					headers: { 'content-type': 'text/html' },
				}),
				new Response('{}', {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			]) {
				const fetchSpy = mockResponse(response);
				try {
					await expect(api[group]?.[name]?.(input)).resolves.toBeUndefined();
					expect(fetchSpy).toHaveBeenCalledTimes(1);
				} finally {
					fetchSpy.mockRestore();
				}
			}
		},
	);

	it('drafts.create resolves when a sent draft answers with an empty text body', async () => {
		const fetchSpy = mockResponse(
			new Response('', {
				status: 201,
				headers: { 'content-type': 'text/plain' },
			}),
		);
		try {
			await expect(
				api.drafts?.create?.({
					body: {
						send: true,
						subject: 'Hello',
						body: 'World!',
						to_fields: [{ address: 'paul@acme.com' }],
						from_field: { address: 'philippe@missiveapp.com' },
					},
				}),
			).resolves.toBeUndefined();
			// One request only: a thrown parse error would invite a retry that
			// sends the email a second time.
			expect(fetchSpy).toHaveBeenCalledTimes(1);
		} finally {
			fetchSpy.mockRestore();
		}
	});
});

describe('Missive risk levels', () => {
	it('keeps sends and posts a write and says they reach real people', () => {
		// Same level as gmail messages.send and resend emails.send: a send
		// loses no stored data, so the warning lives in the description.
		expect(missiveEndpointMeta['drafts.create'].riskLevel).toBe('write');
		expect(missiveEndpointMeta['drafts.create'].description).toMatch(
			/real recipients.*cannot be recalled/,
		);
		expect(missiveEndpointMeta['posts.create'].riskLevel).toBe('write');
		expect(missiveEndpointMeta['posts.create'].description).toMatch(
			/every teammate with access sees the post/,
		);
		expect(missiveEndpointMeta['messages.create'].riskLevel).toBe('write');
	});

	it('marks every delete and the merge destructive', () => {
		for (const operation of MISSIVE_OPERATIONS) {
			if (operation.method === 'DELETE' || operation.key.endsWith('.merge')) {
				expect(missiveEndpointMeta[operation.key].riskLevel).toBe(
					'destructive',
				);
			}
			if (operation.method === 'GET') {
				expect(missiveEndpointMeta[operation.key].riskLevel).toBe('read');
			}
		}
	});

	it('publishes the same risk level and description as the catalog', () => {
		for (const operation of MISSIVE_OPERATIONS) {
			const meta = missiveEndpointMeta[operation.key];
			expect(meta.riskLevel).toBe(operation.riskLevel);
			expect(meta.description).toBe(operation.description);
		}
	});
});

describe('Missive local data', () => {
	it('declares no entities, since no endpoint writes local rows', () => {
		expect(Object.keys(MissiveSchema.entities)).toEqual([]);
	});
});
